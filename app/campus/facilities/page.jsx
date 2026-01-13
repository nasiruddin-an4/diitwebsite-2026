"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Monitor, Utensils, Library, Video, Coffee, Wifi,
    Shield, Users, Mic2, Lightbulb, Stethoscope,
    Bus, Trophy, ArrowUpRight, Sparkles, MapPin
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const FacilitiesPage = () => {

    const facilities = [
        {
            icon: Monitor,
            title: "Advanced Computer Labs",
            description: "State-of-the-art workstations equipped for high-end programming, networking simulations, and multimedia design.",
            color: "from-blue-600 to-indigo-600",
            stat: "300+ PCs",
            span: "md:col-span-2",
            image: "/images/facilities/computer-lab.png"
        },
        {
            icon: Utensils,
            title: "THM Culinary Kitchen",
            description: "A professional-grade production kitchen offering a real-world culinary environment for hospitality students.",
            color: "from-orange-500 to-red-600",
            stat: "Chef Grade",
            span: "md:col-span-1",
            image: "/images/facilities/kitchen.png"
        },
        {
            icon: Library,
            title: "Digital Library",
            description: "Access to over 10,000 physical texts and widespread digital resources in a serene study environment.",
            color: "from-emerald-500 to-teal-700",
            stat: "Quiet Zone",
            span: "md:col-span-1",
            image: "/images/facilities/library.png"
        },
        {
            icon: Mic2,
            title: "Modern Auditorium",
            description: "Our centralized hub for seminars, cultural festivities, and large-scale academic workshops.",
            color: "from-violet-600 to-purple-800",
            stat: "250+ Seats",
            span: "md:col-span-2",
            image: "/images/facilities/auditorium.png"
        },
        {
            icon: Lightbulb,
            title: "Innovation Hub",
            description: "A dedicated co-working space designed to foster student startups and collaborative projects.",
            color: "from-amber-400 to-orange-600",
            stat: "Startup Zone",
            span: "md:col-span-1",
            image: "/images/facilities/innovation.png"
        },
        {
            icon: Video,
            title: "Smart Classrooms",
            description: "Air-conditioned classrooms governed by multimedia projectors and advanced sound systems.",
            color: "from-cyan-500 to-blue-700",
            stat: "Interactive",
            span: "md:col-span-1",
            image: "/images/facilities/classroom.png"
        },
        {
            icon: Stethoscope,
            title: "Medical Corner",
            description: "On-campus health support ensuring immediate first-aid and routine checkups for all students.",
            color: "from-rose-400 to-pink-600",
            stat: "Health First",
            span: "md:col-span-1",
            image: null // Fallback to gradient
        },
        {
            icon: Trophy,
            title: "Indoor Sports Zone",
            description: "A vibrant recreation area featuring Table Tennis, Carrom, and Chess to unwind.",
            color: "from-lime-500 to-green-600",
            stat: "Recreation",
            span: "md:col-span-1",
            image: null
        },
        {
            icon: Bus,
            title: "Transport Service",
            description: "Safe and reliable bus routes covering key areas of the city for hassle-free commuting.",
            color: "from-slate-600 to-slate-800",
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
        hidden: { y: 30, opacity: 0, scale: 0.95 },
        show: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 50, damping: 20 }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900 pb-20">
            {/* Enhanced Hero Section */}
            <div className="relative bg-[#001229] h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm font-semibold tracking-wide mb-6 backdrop-blur-sm">
                            <Sparkles className="w-3 h-3 inline mr-2 text-blue-400" /> World-Class Campus
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                            Designed to <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">Inspire</span>
                        </h1>
                        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                            Explore a campus built for the future. We provide the tools, spaces, and technology you need to transform your potential into expertise.
                        </p>
                    </motion.div>
                </div>

                {/* Fade into content */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-slate-50 to-transparent z-20" />
            </div>

            {/* Main Content - Bento Grid */}
            <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-30">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr"
                >
                    {facilities.map((fac, idx) => (
                        <motion.div
                            key={idx}
                            variants={item}
                            whileHover={{ y: -5 }}
                            className={`group relative bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden flex flex-col ${fac.span} ring-1 ring-slate-100 transition-all duration-300`}
                        >
                            {/* Image / Gradient Header */}
                            <div className="relative h-64 overflow-hidden">
                                {fac.image ? (
                                    <Image
                                        src={fac.image}
                                        alt={fac.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className={`w-full h-full bg-linear-to-br ${fac.color} opacity-90`} />
                                )}

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />

                                {/* Badge */}
                                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                    {fac.stat}
                                </div>

                                {/* Icon Overlay - Positioned bottom left */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                                    <div className={`p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg`}>
                                        <fac.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md">
                                        {fac.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="p-6 pt-5 bg-white flex-1 flex flex-col">
                                <p className="text-slate-600 leading-relaxed text-sm flex-1">
                                    {fac.description}
                                </p>

                                <div className="mt-5 flex items-center justify-between text-brandColor font-semibold text-sm group-hover:translate-x-1 transition-transform cursor-pointer">
                                    <span>Learn more</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Safety Section - Full Width Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mt-16 mb-24 rounded-[2.5rem] bg-[#001229] relative overflow-hidden text-white shadow-2xl shadow-blue-900/20"
                >
                    {/* Artistic Background */}
                    <div className="absolute top-0 right-0 w-2/3 h-full bg-linear-to-l from-blue-900/40 to-transparent" />
                    <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />

                    <div className="grid md:grid-cols-2 gap-12 p-10 md:p-16 relative z-10 items-center">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <Shield className="w-6 h-6 text-emerald-400" />
                                <span className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Campus Security</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                A Sanctuary for <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-white">Your Growth.</span>
                            </h2>

                            <p className="text-slate-300 text-lg leading-relaxed max-w-md">
                                We prioritize a safe, inclusive, and supportive environment. With round-the-clock surveillance and dedicated personnel, your peace of mind is guaranteed.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "24/7 CCTV Monitoring", icon: Video },
                                    { label: "Secure Access Points", icon: Shield },
                                    { label: "Professional Guards", icon: Users },
                                    { label: "Prayer Zones", icon: MapPin }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <item.icon className="w-5 h-5 text-blue-300" />
                                        <span className="text-sm font-medium text-slate-200">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual Side */}
                        <div className="relative h-[400px] w-full bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 group cursor-pointer shadow-2xl">
                            <div className="absolute inset-0 bg-linear-to-br from-indigo-900 to-slate-950" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                    <div className="relative w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                                        <Video className="w-10 h-10 text-white fill-white/20" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-8 text-center bg-linear-to-t from-slate-900 to-transparent">
                                <p className="text-white font-medium tracking-wide uppercase text-sm">Virtual Campus Tour</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

        </div>
    );
};

export default FacilitiesPage;
