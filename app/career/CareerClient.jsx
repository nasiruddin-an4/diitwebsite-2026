"use client";

import { motion } from "framer-motion";
import { Briefcase, Rocket, Mail, ArrowLeft, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CareerClient() {
    return (
        <div className="bg-[#000d1a] min-h-screen font-sans flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
            </div>

            <div className="relative z-10 max-w-7xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Icon Section */}
                    <div className="mb-2 relative inline-block">
                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                        <div className="relative w-24 h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                            <Briefcase className="w-12 h-12 text-blue-400" />
                        </div>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-2 -right-2 bg-blue-600 p-2 rounded-xl border border-white/20 shadow-lg"
                        >
                            <Sparkles className="w-4 h-4 text-white" />
                        </motion.div>
                    </div>

                    {/* Text Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                Careers Page Coming Soon
                            </span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
                            We're crafting an exceptional portal to help you find your next big challenge at DIIT. Stay tuned for exciting opportunities!
                        </p>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/5"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Home
                        </Link>
                        <a
                            href="mailto:hr@diit.edu.bd"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-lg border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95"
                        >
                            <Mail className="w-5 h-5" />
                            Send us CV
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

