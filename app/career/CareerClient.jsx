"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    MapPin,
    Clock,
    ChevronRight,
    TrendingUp,
    Users,
    Heart,
    Award,
    ArrowRight,
    Send,
    CheckCircle2
} from "lucide-react";

// Icon mapping
const iconMap = {
    TrendingUp: TrendingUp,
    Users: Users,
    Heart: Heart,
    Award: Award,
};

export default function CareerClient({ data }) {
    const [selectedJob, setSelectedJob] = useState(null);
    const { hero, benefits, jobs } = data;

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 }
    };

    return (
        <div className="bg-neutral-50 min-h-screen font-sans">

            {/* 1. Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-start overflow-hidden bg-slate-900 border-b border-white/10">
                {/* Abstract geometric background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl" />
                    <div className="absolute -left-20 bottom-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-3xl" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-semibold mb-6">
                            <Briefcase className="w-4 h-4" />
                            We are hiring
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            {hero.title}
                        </h1>
                        <p className="text-xl text-slate-300 leading-relaxed mb-8">
                            {hero.subtitle}
                        </p>
                        <a href="#open-positions" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:translate-x-1 inline-flex items-center gap-2 shadow-lg shadow-indigo-500/30">
                            View Open Positions <ArrowRight className="w-5 h-5" />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* 2. Perks & Benefits */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join DIIT?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We value our people. Here are just a few reasons why you'll love working with us.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, idx) => {
                            const Icon = iconMap[benefit.icon] || Award;
                            return (
                                <motion.div
                                    key={benefit.id}
                                    {...fadeInUp}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                                        <Icon className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 3. Open Positions */}
            <section id="open-positions" className="py-24 px-6 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Current Openings</h2>
                            <p className="text-gray-600">Find the role that fits you best.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <motion.div
                                layout
                                key={job.id}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                            >
                                <div
                                    className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                                >
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                                                {job.area}
                                            </span>
                                            <span className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                                                {job.skills}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" /> {job.type}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" /> {job.location}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${selectedJob === job.id ? 'bg-indigo-600 border-indigo-600 text-white rotate-90' : 'border-gray-200 text-gray-400'}`}>
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {selectedJob === job.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-6 pb-8 border-t border-gray-100 bg-gray-50/50">
                                                <div className="pt-6 grid md:grid-cols-2 gap-8">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 mb-3">About the Role</h4>
                                                        <p className="text-gray-600 text-sm leading-relaxed mb-6">{job.description}</p>

                                                        <h4 className="font-bold text-gray-900 mb-3">Requirements</h4>
                                                        <ul className="space-y-2">
                                                            {job.requirements.map((req, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                                    <span>{req}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                                                        <h4 className="font-bold text-gray-900 mb-4">Apply Now</h4>
                                                        <p className="text-sm text-gray-500 mb-6">
                                                            Send your CV and cover letter to <span className="font-semibold text-gray-900">hr@diit.edu.bd</span> mentioning the position in the subject line.
                                                        </p>
                                                        <div className="space-y-3">
                                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Application Deadline</div>
                                                            <div className="font-medium text-gray-900">{job.deadline}</div>
                                                        </div>
                                                        <a
                                                            href={`mailto:hr@diit.edu.bd?subject=Application for ${job.title}`}
                                                            className="mt-6 w-full btn-primary flex items-center justify-center gap-2 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
                                                        >
                                                            <Send className="w-4 h-4" /> Send Application
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. CTA Bottom */}
            <section className="py-24 px-6 bg-indigo-900 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Don't see a suitable role?</h2>
                    <p className="text-indigo-200 text-lg mb-10">
                        We are always looking for talented individuals to join our team. Send us your CV for future consideration.
                    </p>
                    <a
                        href="mailto:hr@diit.edu.bd"
                        className="bg-white text-indigo-900 px-8 py-3.5 rounded-full font-bold hover:bg-indigo-50 transition-colors inline-flex items-center gap-2"
                    >
                        Drop your Resume <Send className="w-4 h-4" />
                    </a>
                </div>
            </section>

        </div>
    );
}
