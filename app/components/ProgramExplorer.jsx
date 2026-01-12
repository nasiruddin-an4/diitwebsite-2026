"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import homePageData from "@/public/Data/HomePage.json";

const ProgramExplorer = () => {
    const [activeCategory, setActiveCategory] = useState("all");
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        const loadedPrograms = homePageData.programsData || [];
        setPrograms(loadedPrograms);
    }, []);

    const filteredPrograms =
        activeCategory === "all"
            ? programs
            : programs.filter((program) => program?.category === activeCategory);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-0">
                {/* Section Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-16">
                    <div>
                        <h2 className="font-bold text-4xl lg:text-5xl text-blue-900 mb-3">
                            Discover Your Perfect Program
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Explore programs across multiple faculties and disciplines.
                        </p>
                    </div>

                    <Link
                        href="/programs"
                        className="group inline-flex items-center gap-2 border border-blue-900 px-6 py-3 rounded-lg font-medium text-blue-900 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-800 hover:to-black hover:text-white hover:shadow-lg"
                    >
                        View All Programs
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                            <path d="5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Programs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPrograms.length > 0 ? (
                        filteredPrograms.map((program) => (
                            <Link
                                key={program?.id}
                                href={`/programs/${program?.id}`}
                                className="group p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 bg-white block"
                            >
                                {/* Image Section */}
                                <div className="h-52 overflow-hidden relative rounded-xl">
                                    <Image
                                        src={program?.image}
                                        alt={program?.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                {/* Content Section */}
                                <div className="mt-6 px-2 py-2">
                                    <h3 className="font-bold text-2xl text-blue-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                                        {program?.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium mb-4 uppercase tracking-wider">
                                        {program?.degree}
                                    </p>

                                    <p className="text-base text-gray-600 mb-6 line-clamp-3">
                                        {program?.description}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <span
                                            className="group/link flex items-center gap-2 text-blue-900 font-bold text-md hover:text-blue-600 transition-all duration-300"
                                        >
                                            Learn More
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
                                            >
                                                <path d="M7 17L17 7" />
                                                <path d="M7 7h10v10" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-3 py-10">
                            Loading programs...
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProgramExplorer;
