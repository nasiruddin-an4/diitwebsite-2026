"use client";

import React, { useState, useEffect } from "react";
import {
    ArrowRight,
    Quote,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import HomePageData from "@/public/Data/HomePage.json";

const CredibilitySection = ({ data }) => {
    const [currentBenefitIndex, setCurrentBenefitIndex] = useState(0);
    const partners = data?.internationalPartners || HomePageData.internationalPartners || [];
    const collaborationBenefits = data?.collaborationBenefits || HomePageData.collaborationBenefits || [];

    // Derive types dynamically from partners
    const uniqueTypes = [...new Set(partners.map(p => p.type).filter(Boolean))];
    const collaborationTypes = uniqueTypes.length > 0
        ? uniqueTypes.map(type => ({ title: type }))
        : (data?.collaborationTypes || HomePageData.collaborationTypes || []);

    useEffect(() => {
        if (collaborationBenefits.length === 0) return;
        const interval = setInterval(() => {
            setCurrentBenefitIndex((prev) => (prev + 1) % collaborationBenefits.length);
        }, 3500);

        return () => clearInterval(interval);
    }, [collaborationBenefits]);

    return (
        <section className="py-20 bg-[#002652] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-0">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-20">
                    <h2 className="font-bold text-4xl md:text-5xl text-white border-b-2 border-yellow-400 pb-2">
                        National & International <span className="text-yellow-400">MoUs</span>
                    </h2>

                    <Link
                        href="/mou"
                        className="group inline-flex items-center gap-2 border border-white/70 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-white hover:text-[#002652] transition-all duration-300"
                    >
                        Explore MoUs
                        <ArrowRight
                            size={18}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                {/* Collaboration + Carousel */}
                <div className="flex flex-col lg:flex-row items-start gap-16 mb-20 mt-12">
                    {/* Collaboration Types */}
                    <div className="w-full lg:w-[25%] shrink-0 pt-2">
                        <h2 className="text-white mb-5 text-2xl font-bold">Types of Collaboration</h2>
                        <ul className="space-y-2.5">
                            {collaborationTypes.map((collab, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-slate-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                                    <span className="text-md font-medium leading-relaxed">{collab.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Swiper Carousel */}
                    <div className="w-full lg:w-[75%] min-w-0">
                        <div className="relative">
                            <Swiper
                                modules={[Navigation, Autoplay]}
                                spaceBetween={24}
                                slidesPerView={1}
                                navigation={{
                                    nextEl: ".swiper-next",
                                    prevEl: ".swiper-prev",
                                }}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true
                                }}
                                breakpoints={{
                                    320: { slidesPerView: 1.3, spaceBetween: 15 },
                                    480: { slidesPerView: 2, spaceBetween: 20 },
                                    768: { slidesPerView: 3, spaceBetween: 20 },
                                    1024: { slidesPerView: 4, spaceBetween: 24 },
                                }}
                                className="pb-24"
                            >
                                {partners.map((partner) => (
                                    <SwiperSlide key={partner.id} className="h-auto">
                                        <Link
                                            href={partner.website || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block h-full group"
                                        >
                                            <div className="flex flex-col h-full rounded-2xl transition-all duration-300">
                                                {/* Logo Box - White */}
                                                <div className="bg-white rounded-lg mb-4 p-6 flex items-center justify-center h-28 w-full shadow-sm">
                                                    <img
                                                        src={partner.logo}
                                                        alt={partner.name}
                                                        className="max-h-20 w-auto object-contain"
                                                    />
                                                </div>

                                                {/* Text Content - Transparent/Dark */}
                                                <div className="px-1">
                                                    <h4 className="font-bold text-white text-base mb-1 group-hover:text-yellow-400 transition-colors">{partner.name}</h4>
                                                    <p className="text-[14px] font-semibold text-slate-400 mb-2 tracking-wide">{partner.type}</p>
                                                    <p className="text-xs text-slate-400/90 leading-relaxed line-clamp-5">{partner.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Custom Navigation Buttons */}
                            <div className="absolute right-0 flex gap-3 z-10 mt-6">
                                <button className="swiper-prev bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-sm">
                                    <ChevronLeft size={16} />
                                </button>
                                <button className="swiper-next bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-sm">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="max-w-4xl mx-auto text-center border-t border-white/10 pt-4">
                    <div className="relative flex justify-center h-24 overflow-hidden items-center">
                        {collaborationBenefits.map((benefit, idx) => (
                            <div
                                key={idx}
                                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${idx === currentBenefitIndex
                                        ? "opacity-100 translate-y-0 scale-100 blur-0"
                                        : "opacity-0 translate-y-8 scale-95 blur-sm"
                                    }`}
                            >
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-center px-4">
                                    <Quote
                                        className={`w-8 h-8 md:w-10 md:h-10 text-slate-400 opacity-60 transition-transform duration-700 ${idx === currentBenefitIndex ? "rotate-180" : "-rotate-0"
                                            }`}
                                    />
                                    <h2 className="text-white font-semibold text-2xl md:text-3xl leading-tight text-center">
                                        {benefit}
                                    </h2>
                                    <Quote className="w-8 h-8 md:w-10 md:h-10 text-slate-400 opacity-60 hidden md:block" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-4">
                        {collaborationBenefits.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentBenefitIndex(idx)}
                                className={`transition-all duration-500 rounded-full cursor-pointer ${idx === currentBenefitIndex
                                    ? "w-8 h-1.5 bg-white"
                                    : "w-1.5 h-1.5 bg-slate-500 hover:bg-slate-400"
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CredibilitySection;
