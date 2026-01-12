"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Award,
    HeartHandshake,
    Zap,
    Scale,
    GraduationCap,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const ScholarshipsPage = () => {

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="bg-[#001229] pt-32 pb-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brandColor/30 to-transparent blur-3xl opacity-60" />

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-blue-200 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
                            <Award className="w-4 h-4 text-brandColor" /> Financial Aid & Support
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Scholarships & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Waivers</span>
                        </h1>
                        <p className="text-blue-100/70 text-lg max-w-2xl mx-auto leading-relaxed">
                            We believe financial barriers should never stand in the way of potential. Explore our comprehensive scholarship programs designed to reward excellence and support those in need.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid md:grid-cols-2 gap-6 mb-12"
                >
                    {/* Merit Based */}
                    <motion.div variants={item} className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 group hover:border-brandColor/20 transition-all duration-300">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap className="w-8 h-8 text-brandColor" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Merit-Based Scholarships</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            We award academic excellence. Students with outstanding results in their HSC or equivalent examinations are eligible for significant tuition waivers.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <span className="font-bold text-slate-800">Golden GPA 5.00</span>
                                <div className="h-px flex-1 bg-slate-200"></div>
                                <span className="font-bold text-brandColor">100% Waiver*</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <span className="font-bold text-slate-800">GPA 5.00</span>
                                <div className="h-px flex-1 bg-slate-200"></div>
                                <span className="font-bold text-brandColor">50% Waiver*</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <span className="font-bold text-slate-800">GPA 4.80 - 4.99</span>
                                <div className="h-px flex-1 bg-slate-200"></div>
                                <span className="font-bold text-brandColor">25% Waiver*</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-4">* Conditions apply based on semester performance.</p>
                    </motion.div>

                    {/* Need Based */}
                    <motion.div variants={item} className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 group hover:border-emerald-500/20 transition-all duration-300">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <HeartHandshake className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Need-Based Waivers</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Financial constraints shouldn't stop you from achieving your dreams. We offer support for students facing financial hardship.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Full or partial waivers for financially disadvantaged students.",
                                "Support for students who lose a guardian during their study.",
                                "Flexible payment plans for semester fees.",
                                "Work-study opportunities within the campus."
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="mt-1 bg-emerald-100 p-1 rounded-full">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    </div>
                                    <span className="text-slate-700 font-medium">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Special Discounts */}
                    <motion.div variants={item} className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 group hover:border-purple-500/20 transition-all duration-300">
                        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-8 h-8 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Special Categories</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            We honor diversity and contribution to the nation by offering special waivers for specific groups of students.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Freedom Fighters", val: "Quota" },
                                { label: "Siblings/Spouse", val: "20% Off" },
                                { label: "Tribal Students", val: "Special" },
                                { label: "Disabled", val: "Priority" },
                                { label: "Female Students", val: "10% Off" },
                                { label: "Corporate", val: "Partner" },
                            ].map((tag, i) => (
                                <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                    <h4 className="font-bold text-slate-800 text-sm">{tag.label}</h4>
                                    <span className="text-xs text-purple-600 font-bold uppercase tracking-wider">{tag.val}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* NU Rules Compliance */}
                    <motion.div variants={item} className="bg-[#001229] rounded-3xl p-8 shadow-xl border border-slate-700 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors" />

                        <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 relative z-10 border border-slate-700">
                            <Scale className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4 relative z-10">NU Rules Compliance</h2>
                        <p className="text-slate-400 mb-6 leading-relaxed relative z-10">
                            All our scholarship and admission policies are strictly aligned with National University (NU) regulations.
                        </p>
                        <div className="space-y-4 relative z-10">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <h4 className="text-white font-bold mb-1">Standardized Metrics</h4>
                                <p className="text-sm text-slate-400">Scholarship criteria are based on standard NU grading scales.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <h4 className="text-white font-bold mb-1">Quota Management</h4>
                                <p className="text-sm text-slate-400">Freedom fighter and other quotas are applied as per government rules.</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-brandColor rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
                >
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
                        <p className="text-blue-100 mb-8 text-lg">
                            Check your eligibility for these scholarships and start your journey with us today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/admission/online" className="w-full sm:w-auto px-8 py-4 bg-white text-brandColor rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                                Apply Online <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/admission/fees" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/20 text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                                View Fee Structure
                            </Link>
                        </div>
                    </div>

                    {/* Background Decor */}
                    <div className="absolute left-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-20 -mb-20" />
                    <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl -mr-20 -mt-20" />
                </motion.div>
            </div>
        </div>
    );
};

export default ScholarshipsPage;
