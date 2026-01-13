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
            link: "/admission/scholarships",
        },
        {
            id: "innovationlabs",
            title: "Innovation labs",
            link: "/campus/facilities",
        },
        {
            id: "alumni",
            title: "Alumni",
            link: "/alumni",
        },
        {
            id: "studentlife",
            title: "Student Life",
            link: "/campus-activities",
        },
        {
            id: "faculty",
            title: "Faculty Members",
            link: "/faculty",
        },
        {
            id: "tuition",
            title: "Tuition Fees",
            link: "/admission/fees",
        },
    ];

    // Split cards into two rows for desktop
    const firstRow = navigationCards.slice(0, 3);
    const secondRow = navigationCards.slice(3, 6);

    // Desktop card render
    const renderDesktopCard = (card) => (
        <Link
            key={card.id}
            href={card.link}
            onMouseEnter={() => setActiveCard(card.id)}
            onMouseLeave={() => setActiveCard(null)}
            className="group block h-[180px] w-full"
        >
            <div
                className={`relative h-full w-full flex flex-col items-center justify-center text-center px-6 transition-all duration-500 ease-out ${activeCard === card.id ? "bg-[#002652]" : "bg-transparent"
                    }`}
            >
                <h3
                    className={`font-bold text-2xl text-white transition-all duration-500 ease-out absolute ${activeCard === card.id
                        ? "top-10"
                        : "top-1/2 -translate-y-1/2"
                        }`}
                >
                    {card.title}
                </h3>
                <div
                    className={`absolute bottom-10 w-9 h-9 rounded-full border border-white/50 flex items-center justify-center transition-all duration-500 ease-out ${activeCard === card.id
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-75"
                        }`}
                >
                    <ChevronRight className="w-4 h-4 text-white" />
                </div>
            </div>
        </Link>
    );

    // Mobile card render - horizontal layout with title left, arrow right
    const renderMobileCard = (card, isLast) => (
        <Link
            key={card.id}
            href={card.link}
            className={`group flex items-center justify-between px-6 py-5 transition-all duration-300 ${!isLast ? "border-b border-white/15" : ""
                }`}
        >
            <h3 className="font-semibold text-base text-white">
                {card.title}
            </h3>
            <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center group-hover:bg-white/10 transition-all duration-300">
                <ChevronRight className="w-5 h-5 text-white" />
            </div>
        </Link>
    );

    return (
        <section className="relative min-h-[520px] md:min-h-[520px] overflow-hidden">
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
                {/* Mobile Layout */}
                <div className="lg:hidden">
                    {/* Mobile Navigation Cards - Vertical List */}
                    <div className="flex flex-col">
                        {navigationCards.map((card, index) =>
                            renderMobileCard(card, index === navigationCards.length - 1)
                        )}
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex flex-row gap-14 items-start">
                    {/* Left Side - Title and Buttons */}
                    <div className="w-[280px] flex-shrink-0 text-white">
                        <h2 className="font-bold text-4xl mb-4 leading-tight">
                            Find Your Way
                        </h2>
                        <p className="text-white/70 text-base mb-8 leading-relaxed">
                            Explore the countless paths and opportunities that DIIT has to offer.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Link
                                href="/about"
                                className="flex items-center justify-center border border-white/60 text-white text-md py-3 rounded-full font-semibold hover:bg-brandColor hover:text-white transition-all duration-500"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/contact"
                                className="flex items-center justify-center border border-white/60 text-white text-md py-3 rounded-full font-semibold hover:bg-brandColor hover:text-white transition-all duration-500"
                            >
                                Contact
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
                                    {renderDesktopCard(card)}
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
                                    {renderDesktopCard(card)}
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
