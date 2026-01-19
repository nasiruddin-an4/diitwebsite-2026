"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import Swal from "sweetalert2";

export default function AboutClient({ data }) {
    const {
        hero = {},
        intro = {},
        mission = {},
        vision = {},
        values = []
    } = data || {};

    // ... existing variants ...
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    // Helper for icons
    const getIcon = (iconName) => {
        // Retrieve icon from LucideIcons object dynamically
        // Default to CheckCircle (or any safe default) if not found
        const IconComponent = LucideIcons[iconName] || LucideIcons.CheckCircle;
        return IconComponent;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: "Message Sent!",
            text: "Thank you for reaching out. We will get back to you shortly.",
            icon: "success",
            confirmButtonColor: "#4f46e5",
            timer: 3000
        });
        e.target.reset();
    };

    return (
        <div className="bg-neutral-50 min-h-screen font-sans">
            {/* 1. Hero Section */}
            <section className="relative h-[65vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    {hero.bgImage && (
                        <img
                            src={hero.bgImage}
                            alt="DIIT Campus"
                            className="w-full h-full object-cover opacity-30"
                        />
                    )}
                    <div className="absolute inset-0 bg-linear-to-b from-slate-900/50 to-slate-900" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {hero.badge && (
                            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-semibold mb-6 border border-indigo-500/30 backdrop-blur-sm">
                                {hero.badge}
                            </span>
                        )}
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                            {hero.title}
                        </h1>
                        <p className="text-xl text-slate-300 max-w-6xl mx-auto font-light leading-relaxed whitespace-pre-wrap">
                            {hero.subtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. Main Introduction */}
            <section className="py-20 px-4 md:px-0 bg-white">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-10">
                        <motion.div
                            className="lg:w-1/2"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="relative">
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-100 rounded-full opacity-50 blur-xl" />
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-pink-100 rounded-full opacity-50 blur-xl" />
                                {intro.image && (
                                    <img
                                        src={intro.image}
                                        alt="Intro Image"
                                        className="relative rounded-2xl shadow-xl z-10 w-full"
                                    />
                                )}
                                {intro.cardTitle && (
                                    <div className="absolute bottom-8 right-8 z-20 bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-xs hidden md:block">
                                        <p className="text-indigo-600 font-bold text-lg mb-1">{intro.cardTitle}</p>
                                        <p className="text-gray-500 text-sm">{intro.cardDesc}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            className="lg:w-1/2"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                {intro.title}
                            </h2>
                            <div className="prose prose-lg text-gray-600 whitespace-pre-wrap">
                                <p>
                                    {intro.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                {(intro.stats || []).map((stat, idx) => (
                                    <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">{stat.label}</p>
                                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Mission & Vision */}
            <section className="py-20 px-4 md:px-8 bg-slate-50 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Purpose</h2>
                        <p className="text-gray-600 text-lg">
                            Driving the nation forward through education, skill development, and visionary leadership.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Mission Card */}
                        <motion.div
                            {...fadeInUp}
                            className="bg-white rounded-2xl p-8 md:p-12 shadow-xl shadow-indigo-100/50 border border-indigo-50 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="absolute top-0 right-0 bg-indigo-600 w-24 h-24 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                            <LucideIcons.Target className="w-10 h-10 text-white absolute top-6 right-6 z-10" />

                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-colors duration-300">
                                <LucideIcons.Target className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{mission.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                                {mission.description}
                            </p>
                        </motion.div>

                        {/* Vision Card */}
                        <motion.div
                            {...fadeInUp}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-8 md:p-12 shadow-xl shadow-pink-100/50 border border-pink-50 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="absolute top-0 right-0 bg-pink-600 w-24 h-24 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                            <LucideIcons.Eye className="w-10 h-10 text-white absolute top-6 right-6 z-10" />

                            <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-pink-600 transition-colors duration-300">
                                <LucideIcons.Eye className="w-8 h-8 text-pink-600 group-hover:text-white transition-colors duration-300" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{vision.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                                {vision.description}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. Values / Pillars */}
            {values.length > 0 && (
                <section className="py-20 px-4 md:px-8 bg-blue-900 text-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            {values.map((item, idx) => {
                                const Icon = getIcon(item.icon);
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-6"
                                    >
                                        <Icon className="w-12 h-12 mx-auto mb-4 text-indigo-300" />
                                        <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                                        <p className="text-indigo-200">{item.desc}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* 5. Contact / Message Form */}
            <section className="py-20 px-4 md:px-8 bg-slate-50 border-t border-slate-200">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-100 p-8 md:p-12">
                    <div className="text-center mb-10">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                            <LucideIcons.MessageSquare className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                        <p className="text-gray-500">
                            Have questions or feedback? We'd love to hear from you.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                                <input required type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                <input required type="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="your@email.com" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                            <textarea
                                required
                                onInput={(e) => {
                                    e.target.style.height = "auto";
                                    e.target.style.height = e.target.scrollHeight + "px";
                                }}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none overflow-hidden min-h-[120px]"
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                            <LucideIcons.Send className="w-5 h-5" /> Send Message
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
