"use client";

import { motion } from "framer-motion";
import { Target, Eye, Award, BookOpen, Calendar, CheckCircle } from "lucide-react";

export default function AboutClient() {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <div className="bg-neutral-50 min-h-screen font-sans">
            {/* 1. Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="DIIT Campus"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-semibold mb-6 border border-indigo-500/30 backdrop-blur-sm">
                            Since 2000
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                            Daffodil Institute of <br />
                            <span className="text-indigo-400">Information Technology</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                            Pioneering quality in computer-based education and professional skills development under the National University of Bangladesh.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. Main Introduction */}
            <section className="py-20 px-4 md:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
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
                                <img
                                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                    alt="DIIT Students"
                                    className="relative rounded-2xl shadow-xl z-10 w-full"
                                />
                                <div className="absolute bottom-8 right-8 z-20 bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-xs hidden md:block">
                                    <p className="text-indigo-600 font-bold text-lg mb-1">Top Position</p>
                                    <p className="text-gray-500 text-sm">Consistently ranking highest in results under National University.</p>
                                </div>
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
                                A Legacy of <span className="text-indigo-600">Excellence & Innovation</span>
                            </h2>
                            <div className="prose prose-lg text-gray-600">
                                <p className="mb-4">
                                    Daffodil Institute of IT (DIIT) runs professional BBA, CSE, BTHM and MBA programs under the National University Bangladesh. In 2000, DIIT became affiliated to the National University for conducting the BSc (Professional) in Computer Science and BBA programs.
                                </p>
                                <p className="mb-4">
                                    DIIT is an innovative, non-profit private institute, pioneering quality in computer-based education, offering a unique combination of both academic and professional skills in a modern congenial environment.
                                </p>
                                <p>
                                    With students from different social backgrounds from Dhaka and all over the country, DIIT holds the top position of all institutions under the National University in BBA, CSE, BTHM & MBA programs.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                {[
                                    { label: "Founded", value: "2000" },
                                    { label: "Programs", value: "BBA, CSE, MBA" },
                                    { label: "Affiliation", value: "National University" },
                                    { label: "Status", value: "Non-Profit" },
                                ].map((stat, idx) => (
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
                            <Target className="w-10 h-10 text-white absolute top-6 right-6 z-10" />

                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-colors duration-300">
                                <Target className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                The mission of DIIT is to provide quality education with international standards to develop the economy of the country and turn our population from a burden to a strength.
                            </p>
                        </motion.div>

                        {/* Vision Card */}
                        <motion.div
                            {...fadeInUp}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-8 md:p-12 shadow-xl shadow-pink-100/50 border border-pink-50 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="absolute top-0 right-0 bg-pink-600 w-24 h-24 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                            <Eye className="w-10 h-10 text-white absolute top-6 right-6 z-10" />

                            <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-pink-600 transition-colors duration-300">
                                <Eye className="w-8 h-8 text-pink-600 group-hover:text-white transition-colors duration-300" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                DIIT aspires to enhance its already outstanding reputation for skills and professionalism through a collaborative and proactive approach. DIIT works with faculty & employees as a team to maintain its position at the forefront of the higher education sector.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 4. Values / Pillars (Optional but enhances design) */}
            <section className="py-20 px-4 md:px-8 bg-indigo-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {[
                            { icon: Award, title: "Quality Education", desc: "Adhering to international standards." },
                            { icon: BookOpen, title: "Skill Development", desc: "Combining academic and professional skills." },
                            { icon: CheckCircle, title: "Student Success", desc: "Turning potential into national strength." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-6"
                            >
                                <item.icon className="w-12 h-12 mx-auto mb-4 text-indigo-300" />
                                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                                <p className="text-indigo-200">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
