"use client";

import React, { useState, useEffect, useRef } from "react";
import StatsData from "@/public/Data/HomePage.json";

const StatsCounter = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [animatedStats, setAnimatedStats] = useState({});
    const sectionRef = useRef(null);

    const statsData = StatsData.statsCounter;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef?.current) {
            observer?.observe(sectionRef?.current);
        }

        return () => observer?.disconnect();
    }, []);

    useEffect(() => {
        if (isVisible) {
            const animateStats = () => {
                statsData?.forEach((stat) => {
                    let current = 0;
                    const increment = stat?.value / 60; // 60 frames for smooth animation
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
                });
            };

            const timeout = setTimeout(animateStats, 200);
            return () => clearTimeout(timeout);
        }
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
