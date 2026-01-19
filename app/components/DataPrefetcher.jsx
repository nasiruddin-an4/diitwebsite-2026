"use client";

import { useEffect } from "react";
import { prefetchAndCache } from "@/hooks/useCachedFetch";

/**
 * DataPrefetcher - Pre-loads critical data into localStorage cache
 * Place this component in your root layout for app-wide data preloading
 */
export default function DataPrefetcher() {
    useEffect(() => {
        // Prefetch critical data that's used across multiple pages
        const prefetchCriticalData = async () => {
            // Run prefetches in parallel for faster loading
            await Promise.allSettled([
                prefetchAndCache("site_info", "/api/site-info"),
                prefetchAndCache("navigation", "/api/admin/navigation"),
                // Add more endpoints as needed
            ]);
        };

        // Run prefetch after a short delay to not block initial render
        const timer = setTimeout(prefetchCriticalData, 100);

        return () => clearTimeout(timer);
    }, []);

    // This component doesn't render anything
    return null;
}
