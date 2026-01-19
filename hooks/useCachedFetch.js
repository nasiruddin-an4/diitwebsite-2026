"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Custom hook for Stale-While-Revalidate data fetching
 * Shows cached data instantly, then updates with fresh data from API
 */
export default function useCachedFetch(cacheKey, apiUrl, options = {}) {
    const {
        maxAge = 5 * 60 * 1000,
        fallback = null,
        transform = (data) => data
    } = options;

    // Use ref to store fallback to avoid dependency issues
    const fallbackRef = useRef(fallback);
    const transformRef = useRef(transform);
    const hasFetchedRef = useRef(false);

    const [data, setData] = useState(fallback);
    const [loading, setLoading] = useState(true);
    const [isStale, setIsStale] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Skip if already fetched for this key
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;

        let isMounted = true;

        // Load from cache first (client-only)
        if (typeof window !== "undefined") {
            try {
                const cached = localStorage.getItem(`cache_${cacheKey}`);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    const age = Date.now() - parsed.timestamp;
                    if (isMounted && parsed.data) {
                        setData(parsed.data);
                        setIsStale(age > maxAge);
                        setLoading(false);
                    }
                }
            } catch (e) {
                // Ignore cache errors
            }
        }

        // Fetch fresh data
        const fetchData = async () => {
            try {
                const res = await fetch(apiUrl);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const result = await res.json();
                const transformedData = transformRef.current(
                    result.success !== undefined ? result.data : result
                );

                if (isMounted) {
                    setData(transformedData);
                    setIsStale(false);
                    setError(null);
                    setLoading(false);
                }

                // Update cache
                if (typeof window !== "undefined") {
                    localStorage.setItem(`cache_${cacheKey}`, JSON.stringify({
                        data: transformedData,
                        timestamp: Date.now()
                    }));
                }
            } catch (err) {
                console.error(`Fetch error for ${apiUrl}:`, err);
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                    // Keep fallback data on error
                    if (!data) {
                        setData(fallbackRef.current);
                    }
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [cacheKey, apiUrl, maxAge]); // Only stable dependencies

    // Refresh function
    const refresh = async () => {
        setLoading(true);
        try {
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const result = await res.json();
            const transformedData = transformRef.current(
                result.success !== undefined ? result.data : result
            );

            setData(transformedData);
            setIsStale(false);
            setError(null);

            if (typeof window !== "undefined") {
                localStorage.setItem(`cache_${cacheKey}`, JSON.stringify({
                    data: transformedData,
                    timestamp: Date.now()
                }));
            }

            return transformedData;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Clear cache function
    const clearCache = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(`cache_${cacheKey}`);
        }
    };

    return {
        data,
        loading,
        isStale,
        error,
        refresh,
        clearCache
    };
}

/**
 * Utility to prefetch and cache data
 */
export async function prefetchAndCache(cacheKey, apiUrl, transform = (d) => d) {
    if (typeof window === "undefined") return;

    try {
        const res = await fetch(apiUrl);
        if (!res.ok) return;

        const result = await res.json();
        const data = transform(result.success !== undefined ? result.data : result);

        localStorage.setItem(`cache_${cacheKey}`, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.warn(`Prefetch error for ${cacheKey}:`, e);
    }
}

/**
 * Clear all app caches
 */
export function clearAllCaches() {
    if (typeof window === "undefined") return;

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("cache_")) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
}
