"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Monitor, Utensils, Library, Video, Coffee, Wifi,
    Shield, Users, Mic2, Lightbulb, Stethoscope,
    Bus, Trophy, ArrowUpRight, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const FacilitiesPage = () => {

    const facilities = [
        {
            icon: Monitor,
            title: "Advanced Computer Labs",
            description: "High-performance workstations for Programming, Networking, and Multimedia design.",
            color: "from-blue-600/90 to-blue-900/90",
            stat: "300+ PCs",
            span: "md:col-span-2",
            image: "/images/facilities/computer-lab.png"
        },
        {
            icon: Utensils,
            title: "THM Practical Kitchen",
            description: "Professional production kitchen and mock service setup for culinary arts mastery.",
            color: "from-orange-600/90 to-red-900/90",
            stat: "Chef Grade",
            span: "md:col-span-1",
            image: "/images/facilities/kitchen.png"
        },
        {
            icon: Library,
            title: "Digital Library",
            description: "10,000+ books, journals, and quiet individual study carrels.",
            color: "from-emerald-600/90 to-teal-900/90",
            stat: "AC Zone",
            span: "md:col-span-1",
            image: "/images/facilities/library.png"
        },
        {
            icon: Mic2,
            title: "Modern Auditorium",
            description: "A centralized venue for seminars, cultural programs, and workshops.",
            color: "from-purple-600/90 to-indigo-900/90",
            stat: "250 Seats",
            span: "md:col-span-2",
            image: "/images/facilities/auditorium.png"
        },
        {
            icon: Lightbulb,
            title: "Innovation Hub",
            description: "Co-working space for student startups and project collaboration.",
            color: "from-yellow-500/90 to-orange-800/90",
            stat: "Startup Zone",
            span: "md:col-span-1",
            image: "/images/facilities/innovation.png"
        },
        {
            icon: Video,
            title: "Smart Classrooms",
            description: "Multimedia projectors and sound systems in every AC class.",
            color: "from-cyan-600/90 to-blue-900/90",
            stat: "Interactive",
            span: "md:col-span-1",
            image: "/images/facilities/classroom.png"
        },
        {
            icon: Stethoscope,
            title: "Medical Corner",
            description: "First-aid support and basic health checkups for students.",
            color: "from-red-400 to-rose-400",
            stat: "First Aid",
            span: "md:col-span-1",
            image: null // Fallback to gradient
        },
        {
            icon: Trophy,
            title: "Indoor Sports Zone",
            description: "Recreation area with Table Tennis, Carrom, and Chess.",
            color: "from-green-500 to-emerald-400",
            stat: "Recreation",
            span: "md:col-span-1",
            image: null
        },
        {
            icon: Bus,
            title: "Transport Service",
            description: "Designated bus routes covering key areas of the city.",
            color: "from-slate-600 to-slate-500",
            stat: "City Wide",
            span: "md:col-span-2",
            image: null
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Extended Hero */}
            <div className="bg-[#001229] pt-32 pb-32 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="absolute left-0 bottom-0 w-full h-full bg-gradient-to-t from-[#001229] via-transparent to-transparent z-10" />

                {/* Abstract Orbs */}
                <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />

                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-cyan-200 text-sm font-medium mb-8 border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                            <Sparkles className="w-4 h-4 text-cyan-400" /> Premium Campus Life
                        </div>
                        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            World-Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">Facilities</span>
                        </h1>
                        <p className="text-slate-300/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Experience a learning environment designed to inspire. From high-tech labs to vibrant social spaces, we provide everything you need to excel.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Bento Grid */}
            <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-30">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-4 gap-6"
                >
                    {facilities.map((fac, idx) => (
                        <motion.div
                            key={idx}
                            variants={item}
                            className={`group relative bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500 overflow-hidden flex flex-col ${fac.span} border border-slate-100`}
                        >
                            {/* Image Section */}
                            <div className={`relative w-full overflow-hidden ${fac.span.includes('col-span-2') ? 'h-64 md:h-80' : 'h-56'}`}>
                                {fac.image ? (
                                    <Image
                                        src={fac.image}
                                        alt={fac.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className={`absolute inset-0 bg-gradient-to-br ${fac.color} opacity-10`} />
                                )}

                                {/* Overlay Gradient for Depth */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />

                                {/* Stat Badge - Top Right */}
                                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
                                    {fac.stat}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="relative p-8 pt-10 flex-1 flex flex-col bg-white">
                                {/* Floating Icon */}
                                <div className={`absolute -top-8 left-8 w-16 h-16 rounded-2xl bg-gradient-to-br ${fac.color} flex items-center justify-center text-white shadow-lg border-4 border-white group-hover:scale-110 transition-transform duration-300`}>
                                    <fac.icon className="w-8 h-8" />
                                </div>

                                <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-brandColor transition-colors leading-tight mt-2">
                                    {fac.title}
                                </h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {fac.description}
                                </p>

                                {/* Decorative Line */}
                                <div className={`mt-auto pt-6 border-b-4 ${fac.color.replace('from-', 'border-').replace('/90', '').split(' ')[0]} w-12 opacity-30 group-hover:w-full group-hover:opacity-100 transition-all duration-500 rounded-full`} />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Additional Feature Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-12 bg-[#001229] rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden text-white mb-20"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mixed-blend-overlay" />
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent blur-3xl" />

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-8 h-8 text-emerald-400" />
                                <span className="text-emerald-400 font-bold tracking-widest uppercase">Safe & Secure Campus</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                Peace of Mind for <br /> Every Student.
                            </h2>
                            <p className="text-blue-100/70 text-lg mb-8 max-w-md">
                                From 24/7 CCTV surveillance to controlled access points and dedicated prayer zones, we prioritize your safety and well-being above all.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 font-medium">
                                    📷 Full CCTV
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 font-medium">
                                    👮‍♂️ Guards
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 font-medium">
                                    🕌 Prayer Rooms
                                </div>
                            </div>
                        </div>
                        <div className="relative h-full min-h-[300px] bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl group cursor-pointer hover:border-slate-600 transition-colors">
                            {/* Placeholder Video/Image Area */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 group-hover:text-slate-400 transition-colors z-10">
                                <div className="w-20 h-20 rounded-full border-2 border-slate-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform bg-slate-900/50 backdrop-blur-sm">
                                    <Video className="w-8 h-8 text-white" />
                                </div>
                                <span className="text-sm font-bold tracking-widest uppercase text-white">Watch Campus Tour</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-slate-900/50 group-hover:opacity-80 transition-opacity" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FacilitiesPage;
