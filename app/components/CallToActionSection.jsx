"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Download, Phone, Calendar, Sparkles } from "lucide-react";

const CallToActionSection = () => {
    return (
        <section className="relative py-24 lg:py-32 overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-0">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 border border-white/10 bg-brandColor backdrop-blur-xl rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl shadow-black/20 overflow-hidden">

                    {/* Decorative shine effect */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-200 mb-6 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-semibold tracking-wide uppercase">Admissions Open 2026</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">Shape the Future?</span>
                        </h2>

                        {/* <p className="text-blue-100/80 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed font-light">
                            Join a community of innovators and leaders. Your journey towards excellence starts here at DIIT.
                        </p> */}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href="/admission/online"
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#002652] rounded-full font-bold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
                            >
                                Apply Now
                                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href="/prospectus"
                                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                            >
                                <Download className="w-5 h-5 group-hover:animate-bounce" />
                                Prospectus
                            </Link>
                        </div>
                    </div>

                    {/* Right Content - Abstract Stats/Cards */}
                    <div className="relative w-full lg:w-auto mt-8 lg:mt-0 perspective-1000">
                        {/* Levitating Card Effect */}
                        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-[500px]">
                            {/* Card 1 */}
                            <div className="bg-[#002652]/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl md:-translate-y-8 shadow-xl">
                                <div className="p-3 bg-blue-500/20 w-fit rounded-lg mb-4">
                                    <Calendar className="w-6 h-6 text-blue-400" />
                                </div>
                                <h4 className="text-white font-bold text-lg mb-1">25th January</h4>
                                <p className="text-blue-200/70 text-sm">Application Deadline</p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-[#002652]/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl md:translate-y-8 shadow-xl">
                                <div className="p-3 bg-purple-500/20 w-fit rounded-lg mb-4">
                                    <Phone className="w-6 h-6 text-purple-400" />
                                </div>
                                <h4 className="text-white font-bold text-lg mb-1">Start Today</h4>
                                <p className="text-blue-200/70 text-sm">Call: +880 1234-567890</p>
                            </div>
                        </div>

                        {/* Decorative Circle behind cards */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-[80px] opacity-40 pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToActionSection;
