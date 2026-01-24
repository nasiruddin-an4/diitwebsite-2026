"use client";

import React, { useState, useEffect, useRef } from "react";

const StatsCounter = ({ data }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [animatedStats, setAnimatedStats] = useState({});
    const [statsData, setStatsData] = useState(data || []);
    const sectionRef = useRef(null);

    // Fetch stats from database if not provided
    useEffect(() => {
        if (!data || data.length === 0) {
            const fetchStats = async () => {
                try {
                    const res = await fetch("/api/admin/homepage");
                    const result = await res.json();
                    if (result.success && result.data?.statsCounter) {
                        setStatsData(result.data.statsCounter);
                    }
                } catch (error) {
                    console.error("Failed to fetch stats:", error);
                }
            };
            fetchStats();
        } else {
            setStatsData(data);
        }
    }, [data]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef?.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let timers = [];
        let timeoutId;

        if (isVisible && statsData?.length > 0) {
            const animateStats = () => {
                const newTimers = statsData.map((stat) => {
                    let current = 0;
                    const steps = 60;
                    const increment = stat?.value / steps;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= stat?.value) {
                            current = stat?.value;
                            clearInterval(timer);
                        }
                        setAnimatedStats((prev) => ({
                            ...prev,
                            [stat?.id]: Math.floor(current),
                        }));
                    }, 30);

                    return timer;
                });
                timers = newTimers;
            };

            timeoutId = setTimeout(animateStats, 50);
        }

        return () => {
            clearTimeout(timeoutId);
            timers.forEach(clearInterval);
        };
    }, [isVisible, statsData]);

    return (
        <section ref={sectionRef} className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-0">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="font-bold text-4xl lg:text-5xl text-blue-900 mb-4">
                        Excellence in Numbers
                    </h2>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Our commitment to quality education and student success is reflected
                        in these real-time metrics that showcase our institutional
                        excellence and impact.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center justify-center relative">
                    {statsData?.map((stat, index) => (
                        <div
                            key={stat?.id}
                            className={`group relative transition-all duration-300 hover:-translate-y-2 text-center transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                                } ${
                                // Add right border for first 3 items on desktop
                                index < statsData.length - 1 ? "lg:border-r border-gray-300" : ""
                                }`}
                            style={{ transitionDelay: `${index * 100}ms`, transitionProperty: 'all' }}
                        >
                            {/* Stats Content */}
                            <div className="z-10 text-center py-5">
                                <div className="flex justify-center items-baseline space-x-1 mb-2">
                                    <span className="font-bold text-4xl lg:text-5xl text-blue-900">
                                        {animatedStats?.[stat?.id]?.toLocaleString() || 0}
                                        <span className="font-medium">{stat?.suffix}</span>
                                    </span>
                                </div>
                                <h3 className="text-xl mb-3 text-slate-800">{stat?.label}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsCounter;
