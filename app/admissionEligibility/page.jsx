"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    GraduationCap,
    MapPin,
    Wifi,
    Award,
    Users,
    BookOpen,
    Briefcase,
    CalendarCheck,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const AdmissionEligibilityPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="relative bg-[#001229] text-white overflow-hidden py-20 px-4 mb-16">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brandColor/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />

                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-sm font-medium tracking-wider mb-4">
                            ADMISSIONS OPEN 2026
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Admission <span className="text-blue-400">Eligibility</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                            Affiliated with National University. Join DIIT to pursue professional degrees in BBA, CSE, and THM.
                        </p>
                    </motion.div>

                    {/* Programs Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl"
                    >
                        <div className="text-right border-r border-white/20 pr-4">
                            <span className="block text-xs text-slate-400 uppercase tracking-widest">Programs</span>
                            <span className="block font-bold text-xl">Undergraduate</span>
                        </div>
                        <div className="text-3xl md:text-5xl font-extrabold tracking-tight text-white flex gap-3">
                            <span>BBA</span>
                            <span className="text-blue-500">.</span>
                            <span>CSE</span>
                            <span className="text-blue-500">.</span>
                            <span>THM</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Eligibility Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {/* Card 1: HSC / Equivalent */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-brandColor/20 transition-all duration-300 relative group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <BookOpen className="w-32 h-32" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-50 rounded-xl text-brandColor">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">HSC & Equivalent</h3>
                            </div>

                            <div className="space-y-8">
                                {/* SSC Requirements */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <CalendarCheck className="w-4 h-4 text-blue-500" />
                                        <h4 className="font-bold text-slate-800">SSC (2021 / 2022 / 2023)</h4>
                                    </div>
                                    <ul className="space-y-3 pl-2 border-l-2 border-slate-100">
                                        <li className="pl-4 text-slate-600 text-[15px]">
                                            <span className="font-semibold text-slate-900">Business/Arts:</span> Minimum GPA 2.00
                                        </li>
                                        <li className="pl-4 text-slate-600 text-[15px]">
                                            <span className="font-semibold text-slate-900">Science:</span> Minimum GPA 2.50
                                        </li>
                                    </ul>
                                </div>

                                {/* HSC Requirements */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <CalendarCheck className="w-4 h-4 text-blue-500" />
                                        <h4 className="font-bold text-slate-800">HSC / Diploma in Commerce (2023 - 2025)</h4>
                                    </div>
                                    <ul className="space-y-3 pl-2 border-l-2 border-slate-100">
                                        <li className="pl-4 text-slate-600 text-[15px]">
                                            <span className="font-semibold text-slate-900">Business/Arts:</span> Minimum GPA 2.00
                                        </li>
                                        <li className="pl-4 text-slate-600 text-[15px]">
                                            <span className="font-semibold text-slate-900">Science:</span> Minimum GPA 2.50
                                        </li>
                                    </ul>
                                </div>

                                {/* Combined Requirement Box */}
                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                    <h5 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wider">Required Combined GPA</h5>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="block text-xs text-slate-500 mb-1">Business/Arts</span>
                                            <span className="text-2xl font-bold text-brandColor">4.50</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-slate-500 mb-1">Science</span>
                                            <span className="text-2xl font-bold text-brandColor">4.75</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Diploma Holders */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-brandColor/20 transition-all duration-300 relative group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <GraduationCap className="w-32 h-32" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Diploma Holders</h3>
                            </div>

                            <div className="space-y-8 flex-1">
                                {/* SSC Requirements */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <CalendarCheck className="w-4 h-4 text-indigo-500" />
                                        <h4 className="font-bold text-slate-800">SSC (2019 / 2020 / 2021)</h4>
                                    </div>
                                    <ul className="space-y-3 pl-2 border-l-2 border-slate-100">
                                        <li className="pl-4 text-slate-600 text-[15px]">
                                            Minimum GPA <span className="font-bold text-slate-900">2.50</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Diploma Requirements */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <CalendarCheck className="w-4 h-4 text-indigo-500" />
                                        <h4 className="font-bold text-slate-800">Diploma (2023 / 2024 / 2025)</h4>
                                    </div>
                                    <ul className="space-y-3 pl-2 border-l-2 border-slate-100">
                                        <li className="pl-4 text-slate-600 text-[15px]">
                                            Minimum GPA <span className="font-bold text-slate-900">2.00</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Combined Requirement Box */}
                                <div className="bg-indigo-50/50 rounded-xl p-6 border border-indigo-100 mt-auto text-center">
                                    <h5 className="font-bold text-slate-900 mb-1">Required Combined GPA</h5>
                                    <div className="text-4xl font-extrabold text-indigo-600">4.75</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Facilities Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900">Why Choose DIIT?</h2>
                        <p className="text-slate-500 mt-2">World-class facilities for a superior learning environment</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Users, label: "Experienced Faculty", desc: "Learn from industry experts and renowned academics." },
                            { icon: Wifi, label: "Free Internet & Wi-Fi", desc: "High-speed connectivity across the entire campus." },
                            { icon: BookOpen, label: "Up to 50% Scholarship", desc: "Merit-based financial aid for deserving students." },
                            { icon: Briefcase, label: "Hostel Facilities", desc: "Safe and secure accommodation for students." },
                            { icon: CheckCircle2, label: "Online Class Facility", desc: "Seamless hybrid learning experience." },
                            { icon: Award, label: "Career Guidance", desc: "Dedicated support for internships and job placements." },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-brandColor group-hover:text-white transition-colors mb-4">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.label}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA / Address Banner */}
                <div className="relative rounded-3xl overflow-hidden bg-brandColor text-white">
                    <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
                    <div className="relative z-10 px-6 py-12 md:py-16 text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                            <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Daffodil Institute of IT (DIIT)</h2>
                        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
                            Daffodil Plaza, 4/2 Sobhanbag, Mirpur Road, Dhanmondi, Dhaka - 1207
                        </p>
                        <Link
                            href="/admissions/contact"
                            className="inline-flex items-center gap-2 bg-white text-brandColor px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors"
                        >
                            Contact Us <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmissionEligibilityPage;
