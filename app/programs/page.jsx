"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Monitor,
    Briefcase,
    Globe,
    Users,
    Award,
    CheckCircle,
    ArrowRight,
    GraduationCap,
    Lightbulb
} from 'lucide-react';

const ProgramsOverview = () => {

    const undergraduatePrograms = [
        {
            id: 'cse',
            title: "B.Sc. in Computer Science & Engineering (CSE)",
            code: "CSE",
            description: "A comprehensive 4-year program designed to mold future tech leaders with a strong foundation in algorithms, software development, and AI.",
            icon: Monitor,
            link: "/programs/cse",
            color: "blue",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 'bba',
            title: "Bachelor of Business Administration (BBA)",
            code: "BBA",
            description: "Develop strategic leadership skills and business acumen to thrive in the global corporate landscape.",
            icon: Briefcase,
            link: "/programs/bba",
            color: "emerald",
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop"
        },
        {
            id: 'bthm',
            title: "BBA in Tourism & Hospitality Management (BTHM)",
            code: "BTHM",
            description: "Prepare for a dynamic career in the booming tourism and hospitality industry with practical training.",
            icon: Globe,
            link: "/programs/bthm",
            color: "orange",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    const postgraduatePrograms = [
        {
            id: 'mba',
            title: "Master of Business Administration (MBA)",
            code: "MBA",
            description: "Accelerate your career with advanced business knowledge and networking opportunities for working professionals.",
            icon: Briefcase,
            link: "/programs/mba",
            color: "purple",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 'mthm',
            title: "MBA in Tourism & Hospitality Management (MTHM)",
            code: "MTHM",
            description: "Specialized master's program for leadership roles in the global hospitality and tourism sector.",
            icon: Globe,
            link: "/programs/mthm",
            color: "rose",
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    const features = [
        { title: "NU Affiliated", desc: "Recognized degrees from National University", icon: Award },
        { title: "Industry Focused", desc: "Curriculum designed with industry experts", icon: Briefcase },
        { title: "Expert Faculty", desc: "Learn from experienced academicians", icon: Users },
        { title: "Career Support", desc: "Placement assistance and internships", icon: GraduationCap }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-brandColor/20 selection:text-brandColor">

            {/* Hero Section */}
            <div className="relative bg-[#001229] pt-32 pb-24 px-4 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brandColor/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-cyan-300 text-sm font-bold uppercase tracking-wider mb-6 border border-white/10 backdrop-blur-sm">
                            National University Affiliated
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                            Academic Programs <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-brandColor">
                                at DIIT
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
                            Empowering students with industry-relevant education, practical skills,
                            and the ethical foundation needed to succeed in a global career.
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
                    >
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl text-left hover:bg-white/10 transition-colors">
                                <feature.icon className="w-8 h-8 text-cyan-400 mb-3" />
                                <h3 className="text-white font-bold text-base mb-1">{feature.title}</h3>
                                <p className="text-slate-400 text-xs">{feature.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-20 space-y-24">

                {/* Undergraduate Programs */}
                <section>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-10 w-1.5 bg-brandColor rounded-full" />
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Undergraduate Programs</h2>
                            <p className="text-slate-500 mt-1">Build a strong foundation for your future career</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {undergraduatePrograms.map((program, index) => (
                            <Link href={program.link} key={index} className="group">
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 h-full flex flex-col"
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <div className={`absolute inset-0 bg-${program.color}-900/20 group-hover:bg-transparent transition-colors z-10`} />
                                        <img
                                            src={program.image}
                                            alt={program.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                                {program.code}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className={`w-12 h-12 rounded-xl bg-${program.color}-50 text-${program.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <program.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brandColor transition-colors">
                                            {program.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                                            {program.description}
                                        </p>
                                        <div className="flex items-center text-brandColor font-bold text-sm group/btn">
                                            View Details
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Postgraduate Programs */}
                <section>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-10 w-1.5 bg-purple-600 rounded-full" />
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Postgraduate Programs</h2>
                            <p className="text-slate-500 mt-1">Advance your expertise and leadership potential</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {postgraduatePrograms.map((program, index) => (
                            <Link href={program.link} key={index} className="group">
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row h-full"
                                >
                                    <div className="md:w-2/5 h-48 md:h-auto overflow-hidden relative">
                                        <div className="absolute inset-0 bg-purple-900/20 group-hover:bg-transparent transition-colors z-10" />
                                        <img
                                            src={program.image}
                                            alt={program.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="p-8 md:w-3/5 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-10 h-10 rounded-lg bg-${program.color}-50 text-${program.color}-600 flex items-center justify-center`}>
                                                <program.icon className="w-5 h-5" />
                                            </div>
                                            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                                                {program.code}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                                            {program.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                            {program.description}
                                        </p>
                                        <div className="flex items-center text-purple-600 font-bold text-sm group/btn">
                                            Program Details
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Why Study at DIIT */}
                <section className="bg-slate-900 rounded-3xl p-8 md:p-16 relative overflow-hidden text-center md:text-left">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brandColor/20 rounded-full blur-[100px]" />

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Study at DIIT?</h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                We go beyond textbooks. At DIIT, you'll find a community dedicated to your growth,
                                state-of-the-art facilities, and a direct pathway to your dream career.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    "Skilled Faculty Members",
                                    "Industry Exposure",
                                    "Affordable Tuition Fees",
                                    "Lifetime Career Support"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                        <CheckCircle className="w-5 h-5 text-brandColor shrink-0" />
                                        <span className="text-white font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                <img
                                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
                                    alt="Campus Life"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <p className="text-white font-medium italic">"Education is not just about learning facts, but training the mind to think."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="text-center max-w-3xl mx-auto pb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to Start Your Journey?</h2>
                    <p className="text-slate-600 mb-8">
                        Admissions represent the first step toward a bright future.
                        Join us and be part of a legacy of excellence.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/admissions/apply"
                            className="w-full sm:w-auto px-8 py-4 bg-brandColor text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 hover:shadow-brandColor/30 transition-all transform hover:-translate-y-1"
                        >
                            Apply Now
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
                        >
                            Admission Query
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default ProgramsOverview;
