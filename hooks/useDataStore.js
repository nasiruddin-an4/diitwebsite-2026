"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

/**
 * Global Data Store — loads all critical data once on app mount,
 * caches it in-memory + localStorage, and serves it instantly to all components.
 *
 * Architecture:
 *   1. On mount → read from localStorage (instant, stale-while-revalidate)
 *   2. Fire all API fetches in parallel
 *   3. Merge fresh data into store + persist to localStorage
 *   4. All consumers re-render with fresh data (no duplicate fetches)
 */

const CACHE_PREFIX = "gds_"; // Global Data Store prefix
const DEFAULT_MAX_AGE = 10 * 60 * 1000; // 10 minutes

// ─── Dataset Definitions ────────────────────────────────────────────────
// Each entry defines a key, API endpoint, optional transform, and cache TTL
const DATASETS = [
    {
        key: "hero_slides",
        url: "/api/admin/hero",
        transform: (res) => (res.success && res.data?.length > 0) ? res.data : null,
        maxAge: 5 * 60 * 1000,
    },
    {
        key: "navigation_data",
        url: "/api/admin/data/NavigationData",
        transform: (res) => res.data || res,
        maxAge: 15 * 60 * 1000,
    },
    {
        key: "programs_data",
        url: "/api/admin/data/ProgramsData",
        transform: (res) => {
            const d = res.data?.programsData || res.data || [];
            return Array.isArray(d) ? d : Object.values(d);
        },
        maxAge: 10 * 60 * 1000,
    },
    {
        key: "site_info",
        url: "/api/site-info",
        transform: (res) => res.data || res,
        maxAge: 15 * 60 * 1000,
    },
    {
        key: "campus_facilities",
        url: "/api/admin/data/CampusData",
        transform: (res) => {
            const d = res.data || res;
            if (Array.isArray(d)) return d;
            if (d?.facilities && Array.isArray(d.facilities)) return d.facilities;
            return d;
        },
        maxAge: 10 * 60 * 1000,
    },
    {
        key: "faculty",
        url: "/api/admin/academics/faculty",
        transform: (res) => (res.success ? res.data : res.data || []),
        maxAge: 10 * 60 * 1000,
    },
    {
        key: "cta_settings",
        url: "/api/cta",
        transform: (res) => res.data || res,
        maxAge: 15 * 60 * 1000,
    },
    {
        key: "videos",
        url: "/api/admin/videos",
        transform: (res) => {
            if (!res.success) return [];
            return [...(res.data || [])].sort((a, b) => {
                const orderA = a.sortOrder !== undefined ? a.sortOrder : 9999;
                const orderB = b.sortOrder !== undefined ? b.sortOrder : 9999;
                return orderA - orderB;
            });
        },
        maxAge: 10 * 60 * 1000,
    },
    {
        key: "news_events",
        url: "/api/admin/news-events",
        transform: (res) => res.success ? res.data : (res.data || []),
        maxAge: 5 * 60 * 1000,
    },
    {
        key: "testimonials",
        url: "/api/admin/testimonials",
        transform: (res) => res.success ? res.data : (res.data || []),
        maxAge: 10 * 60 * 1000,
    },
    {
        key: "admission_data",
        url: "/api/admin/data/AdmissionData",
        transform: (res) => res.data || res,
        maxAge: 15 * 60 * 1000,
    },
    {
        key: "career_data",
        url: "/api/admin/data/CareerData",
        transform: (res) => res.data || res,
        maxAge: 15 * 60 * 1000,
    },
    {
        key: "faq_data",
        url: "/api/admin/data/FaqData",
        transform: (res) => res.data || res,
        maxAge: 15 * 60 * 1000,
    },
    {
        key: "alumni",
        url: "/api/admin/alumni",
        transform: (res) => res.success ? res.data : (res.data || []),
        maxAge: 10 * 60 * 1000,
    },
    {
        key: "academic_calendar",
        url: "/api/admin/academics/calendar",
        transform: (res) => res.success ? res.data : (res.data || []),
        maxAge: 15 * 60 * 1000,
    },
    {
        key: "administrative",
        url: "/api/admin/academics/administrative",
        transform: (res) => res.success ? res.data : (res.data || []),
        maxAge: 15 * 60 * 1000,
    },
    {
        key: "homepage_stats",
        url: "/api/admin/homepage",
        transform: (res) => (res.success && res.data?.statsCounter) ? res.data.statsCounter : [],
        maxAge: 15 * 60 * 1000,
    },
];

// ─── Cache Helpers ──────────────────────────────────────────────────────
function readCache(key) {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed; // { data, timestamp }
    } catch {
        return null;
    }
}

function writeCache(key, data) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({
            data,
            timestamp: Date.now(),
        }));
    } catch (e) {
        // localStorage might be full — clean old entries
        cleanOldCaches();
    }
}

function cleanOldCaches() {
    if (typeof window === "undefined") return;
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(CACHE_PREFIX) || key?.startsWith("cache_")) {
            try {
                const parsed = JSON.parse(localStorage.getItem(key));
                if (Date.now() - parsed.timestamp > 30 * 60 * 1000) {
                    keysToRemove.push(key);
                }
            } catch {
                keysToRemove.push(key);
            }
        }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
}

// ─── Context ────────────────────────────────────────────────────────────
const DataStoreContext = createContext(null);

export function DataStoreProvider({ children }) {
    const [store, setStore] = useState({});
    const [ready, setReady] = useState(false);
    const fetchedRef = useRef(false);

    // Phase 1: Hydrate from localStorage (instant)
    useEffect(() => {
        if (typeof window === "undefined") return;

        const cached = {};
        for (const ds of DATASETS) {
            const entry = readCache(ds.key);
            if (entry?.data != null) {
                cached[ds.key] = entry.data;
            }
        }
        if (Object.keys(cached).length > 0) {
            setStore(cached);
        }
        setReady(true);
    }, []);

    // Phase 2: Fetch all datasets in parallel (background refresh)
    useEffect(() => {
        if (!ready || fetchedRef.current) return;
        fetchedRef.current = true;

        const fetchAll = async () => {
            // Use allSettled so one failure doesn't block others
            const results = await Promise.allSettled(
                DATASETS.map(async (ds) => {
                    // Skip if cache is still fresh
                    const cached = readCache(ds.key);
                    if (cached && (Date.now() - cached.timestamp) < (ds.maxAge || DEFAULT_MAX_AGE)) {
                        return { key: ds.key, data: cached.data, fresh: false };
                    }

                    try {
                        const res = await fetch(ds.url);
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        const json = await res.json();
                        const data = ds.transform ? ds.transform(json) : json;
                        return { key: ds.key, data, fresh: true };
                    } catch (err) {
                        console.warn(`[DataStore] Failed to fetch ${ds.key}:`, err.message);
                        return { key: ds.key, data: cached?.data ?? null, fresh: false };
                    }
                })
            );

            const updates = {};
            for (const result of results) {
                if (result.status === "fulfilled" && result.value.data != null) {
                    const { key, data, fresh } = result.value;
                    updates[key] = data;
                    if (fresh) {
                        writeCache(key, data);
                    }
                }
            }

            if (Object.keys(updates).length > 0) {
                setStore((prev) => ({ ...prev, ...updates }));
            }
        };

        // Small delay to not block initial render paint
        const timer = setTimeout(fetchAll, 50);
        return () => clearTimeout(timer);
    }, [ready]);

    // Refresh a single dataset by key
    const refreshDataset = useCallback(async (key) => {
        const ds = DATASETS.find((d) => d.key === key);
        if (!ds) return null;

        try {
            const res = await fetch(ds.url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const data = ds.transform ? ds.transform(json) : json;

            setStore((prev) => ({ ...prev, [key]: data }));
            writeCache(key, data);
            return data;
        } catch (err) {
            console.error(`[DataStore] Refresh failed for ${key}:`, err);
            return null;
        }
    }, []);

    // Get data by key with optional fallback
    const getData = useCallback((key, fallback = null) => {
        return store[key] ?? fallback;
    }, [store]);

    return (
        <DataStoreContext.Provider value={{ store, ready, getData, refreshDataset }}>
            {children}
        </DataStoreContext.Provider>
    );
}

/**
 * Hook: useDataStore
 * Access the global data store from any component.
 *
 * Usage:
 *   const { getData, ready } = useDataStore();
 *   const programs = getData("programs_data", []);
 */
export function useDataStore() {
    const ctx = useContext(DataStoreContext);
    if (!ctx) {
        throw new Error("useDataStore must be used within <DataStoreProvider>");
    }
    return ctx;
}

/**
 * Hook: useStoreData
 * Convenience hook — returns a single dataset by key.
 *
 * Usage:
 *   const faculty = useStoreData("faculty", []);
 */
export function useStoreData(key, fallback = null) {
    const { getData } = useDataStore();
    return getData(key, fallback);
}
