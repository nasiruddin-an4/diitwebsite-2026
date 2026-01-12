"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const FindYourWay = () => {
    const [activeCard, setActiveCard] = useState(null);

    const navigationCards = [
        {
            id: "scholarships",
            title: "Scholarships",
            link: "/scholarships",
        },
        {
            id: "innovationlabs",
            title: "Innovation labs",
            link: "/innovationlabs",
        },
        {
            id: "research",
            title: "Research",
            link: "/research",
        },
        {
            id: "studentlife",
            title: "Student Life",
            link: "/campus",
        },
        {
            id: "faculty",
            title: "Faculty Members",
            link: "/faculty",
        },
        {
            id: "tuition",
            title: "Tuition Fees",
            link: "/tuition",
        },
    ];

    // Split cards into two rows
    const firstRow = navigationCards.slice(0, 3);
    const secondRow = navigationCards.slice(3, 6);

    const renderCard = (card) => (
        <Link
            key={card.id}
            href={card.link}
            onMouseEnter={() => setActiveCard(card.id)}
            onMouseLeave={() => setActiveCard(null)}
            className="group block h-[140px] md:h-[180px] w-full"
        >
            {/* Fixed size card container */}
            <div
                className={`relative h-full w-full flex flex-col items-center justify-center text-center px-4 md:px-6 transition-all duration-500 ease-out ${activeCard === card.id
                    ? "bg-[#002652]"
                    : "bg-transparent"
                    }`}
            >
                {/* Title - fixed position */}
                <h3
                    className={`font-bold text-sm md:text-2xl text-white transition-all duration-500 ease-out absolute ${activeCard === card.id
                        ? "top-8 md:top-10"
                        : "top-1/2 -translate-y-1/2"
                        }`}
                >
                    {card.title}
                </h3>

                {/* Arrow Icon - fixed position at bottom */}
                <div
                    className={`absolute bottom-8 md:bottom-10 w-9 h-9 rounded-full border border-white/50 flex items-center justify-center transition-all duration-500 ease-out ${activeCard === card.id
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-75"
                        }`}
                >
                    <ChevronRight className="w-4 h-4 text-white" />
                </div>
            </div>
        </Link>
    );

    return (
        <section className="relative min-h-[480px] md:min-h-[520px] overflow-hidden">
            {/* Background Image with Blue Overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                    alt="Campus Interior"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a4b8c]/95 via-[#1a4b8c]/90 to-[#002652]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-16">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
                    {/* Left Side - Title and Buttons */}
                    <div className="lg:w-[280px] flex-shrink-0 text-white">
                        <h2 className="font-bold text-3xl md:text-4xl mb-4 leading-tight">
                            Find Your Way
                        </h2>
                        <p className="text-white/70 text-sm md:text-base mb-8 leading-relaxed">
                            Explore the countless paths and opportunities that DIIT has to offer.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Link
                                href="/programs"
                                className="flex items-center justify-center border border-white/60 text-white text-md py-3 rounded-full font-semibold hover:bg-brandColor hover:text-white transition-all duration-500"
                            >
                                Undergraduate Programs
                            </Link>
                            <Link
                                href="/graduatePrograms"
                                className="flex items-center justify-center border border-white/60 text-white text-md py-3 rounded-full font-semibold hover:bg-brandColor hover:text-white transition-all duration-500"
                            >
                                Graduate Programs
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Navigation Cards Grid with Row Border */}
                    <div className="flex-1 w-full">
                        {/* First Row */}
                        <div className="grid grid-cols-3 border-b border-white/10">
                            {firstRow.map((card, index) => (
                                <div
                                    key={card.id}
                                    className={
                                        index < firstRow.length - 1
                                            ? "border-r border-white/10"
                                            : ""
                                    }
                                >
                                    {renderCard(card)}
                                </div>
                            ))}
                        </div>

                        {/* Second Row */}
                        <div className="grid grid-cols-3">
                            {secondRow.map((card, index) => (
                                <div
                                    key={card.id}
                                    className={
                                        index < secondRow.length - 1
                                            ? "border-r border-white/10"
                                            : ""
                                    }
                                >
                                    {renderCard(card)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Gradient to blend with MoUs section (#002652) */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#002652] to-transparent pointer-events-none" />
        </section>
    );
};

export default FindYourWay;
