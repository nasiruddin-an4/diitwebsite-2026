"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import useCachedFetch from "@/hooks/useCachedFetch";

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function FacilitiesClient() {
    const { data: facilities, loading } = useCachedFetch(
        "campus_facilities",
        "/api/admin/data/CampusData",
        {
            fallback: [],
            transform: (data) => {
                if (Array.isArray(data)) return data;
                if (data?.facilities && Array.isArray(data.facilities)) return data.facilities;
                return [];
            }
        }
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Loading Facilities...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop"
                        alt="Campus Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-slate-900/50 via-slate-900 to-slate-900" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-400/10 border border-blue-400/20 rounded-full">
                            Explore Our Campus
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                            World-Class <span className="text-blue-500">Facilities</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                            DIIT provides a modern learning environment equipped with state-of-the-art infrastructure designed to foster innovation and academic excellence.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Facilities Grid */}
            <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {Array.isArray(facilities) && facilities.map((facility, idx) => {
                        const spanClass = facility.span || "md:col-span-1";

                        return (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                className={`${spanClass} group bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500`}
                            >
                                {facility.image ? (
                                    <div className="relative h-72 overflow-hidden">
                                        <img
                                            src={facility.image}
                                            alt={facility.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {facility.stat && (
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 border border-white shadow-sm uppercase tracking-wider">
                                                {facility.stat}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="relative h-72 bg-slate-100 flex items-center justify-center">
                                        <Zap className="w-12 h-12 text-slate-200" />
                                    </div>
                                )}

                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {facility.title}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed text-sm flex-1">
                                        {facility.description}
                                    </p>

                                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">DIIT Campus</span>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-45">
                                            <Zap className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </section>

            {/* Bottom CTA */}
            <section className="max-w-4xl mx-auto px-4 mt-24">
                <motion.div
                    {...fadeInUp}
                    className="bg-linear-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-12 text-center text-white shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Want to see it yourself?</h2>
                        <p className="text-slate-400 mb-10 max-w-lg mx-auto">
                            We welcome prospective students and guardians to visit our campus and experience the vibrant learning atmosphere firsthand.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="/contact" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/25">
                                Schedule a Campus Visit
                            </a>
                            <a href="/admission/online" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/10 backdrop-blur-sm transition-all">
                                Apply Now
                            </a>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
