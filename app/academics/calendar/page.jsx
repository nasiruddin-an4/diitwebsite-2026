"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar as CalendarIcon,
    BookOpen,
    GraduationCap,
    Coffee,
    FileText,
    AlertCircle,
    CalendarDays,
    Star,
    Flag,
    CheckCircle2,
    Loader2
} from 'lucide-react';

const AcademicCalendarPage = () => {
    const [academicYear, setAcademicYear] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCalendarData();
    }, []);

    const fetchCalendarData = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/academics/calendar");
            const result = await res.json();

            if (result.success && result.data.length > 0) {
                setAcademicYear(result.data);
            } else {
                // Use default data if API returns empty
                setAcademicYear(defaultData);
            }
        } catch (err) {
            console.error("Error fetching calendar data:", err);
            // Fallback to default data on error
            setAcademicYear(defaultData);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'academic': return <BookOpen className="w-5 h-5 text-blue-600" />;
            case 'admission': return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
            case 'exam': return <FileText className="w-5 h-5 text-rose-600" />;
            case 'holiday': return <Coffee className="w-5 h-5 text-amber-600" />;
            case 'result': return <GraduationCap className="w-5 h-5 text-purple-600" />;
            default: return <Star className="w-5 h-5 text-indigo-600" />;
        }
    };

    const getColors = (type) => {
        switch (type) {
            case 'academic': return { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', dot: 'bg-blue-500' };
            case 'admission': return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', dot: 'bg-emerald-500' };
            case 'exam': return { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-600', dot: 'bg-rose-500' };
            case 'holiday': return { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', dot: 'bg-amber-500' };
            case 'result': return { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600', dot: 'bg-purple-500' };
            default: return { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600', dot: 'bg-indigo-500' };
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Loading State */}
            {loading && (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-slate-600 font-medium">Loading academic calendar...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                        <p className="text-slate-600 font-medium">Error loading calendar</p>
                        <p className="text-slate-500 text-sm mt-2">Using default calendar data</p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            {!loading && (
            <>
            {/* Hero Section */}
            <div className="bg-[#001229] pt-32 pb-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brandColor/30 to-transparent blur-3xl opacity-60" />

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-emerald-300 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
                            <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Session 2025-2026
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Calendar</span>
                        </h1>
                        <p className="text-blue-100/70 text-lg max-w-2xl mx-auto leading-relaxed">
                            Complete schedule for National University Session 2025-2026. Keep track of your academic journey from admission to final exams.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10">
                {/* Timeline Container */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">

                    <div className="flex items-center justify-between mb-12 border-b border-slate-100 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-brandColor text-white flex flex-col items-center justify-center font-bold shadow-lg shadow-blue-900/20">
                                <span className="text-xs opacity-60 uppercase tracking-widest">Year</span>
                                <span className="text-2xl">2026</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Academic Schedule</h2>
                                <p className="text-slate-500 font-medium">National University Syllabus</p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold border border-blue-100">
                                Updated: Jan 2026
                            </span>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-[27px] md:left-[31px] top-4 bottom-4 w-0.5 bg-slate-100" />

                        {/* Timeline Items */}
                        <div className="space-y-12">
                            {academicYear.map((monthGroup, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="relative pl-24 md:pl-28"
                                >
                                    {/* Month Marker */}
                                    <div className="absolute left-0 top-0 flex flex-col items-center z-10">
                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white border-4 border-slate-50 shadow-md flex items-center justify-center font-bold text-slate-700 text-xs md:text-sm text-center leading-tight z-20">
                                            {monthGroup.month.split(' ')[0].substring(0, 3)}
                                            {monthGroup.month.includes('-') && <span className="block text-[10px] opacity-60">to {monthGroup.month.split(' - ')[1]}</span>}
                                        </div>
                                    </div>

                                    {/* Month Title Inline (Mobile) */}
                                    <h3 className="text-lg font-bold text-slate-400 mb-6 uppercase tracking-wider flex items-center gap-3">
                                        {monthGroup.month} <span className="h-px bg-slate-100 flex-1" />
                                    </h3>

                                    {/* Events Grid */}
                                    <div className="grid gap-4">
                                        {monthGroup.events.map((ev, eIdx) => {
                                            const styles = getColors(ev.type);
                                            return (
                                                <motion.div
                                                    key={eIdx}
                                                    whileHover={{ scale: 1.01, x: 5 }}
                                                    className={`relative bg-white p-5 rounded-2xl border ${styles.border} shadow-sm hover:shadow-md transition-all group overflow-hidden`}
                                                >
                                                    {/* Left Color Bar */}
                                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${styles.dot}`} />

                                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                        {/* Date */}
                                                        <div className={`w-14 h-14 rounded-xl ${styles.bg} flex flex-col items-center justify-center shrink-0`}>
                                                            <span className={`text-xl font-bold ${styles.text}`}>{ev.date.replace(/[^0-9]/g, '') || '01'}</span>
                                                            <span className={`text-[10px] font-bold uppercase opacity-70 ${styles.text}`}>
                                                                {ev.date.replace(/[0-9]/g, '').trim() || 'Date'}
                                                            </span>
                                                        </div>

                                                        {/* Details */}
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className={`p-1.5 rounded-full ${styles.bg} ${styles.text}`}>
                                                                    {getIcon(ev.type)}
                                                                </span>
                                                                <h4 className="font-bold text-slate-800 text-lg">{ev.title}</h4>
                                                            </div>
                                                            <p className="text-slate-500 text-sm pl-9">{ev.desc}</p>
                                                        </div>

                                                        {/* Tag */}
                                                        <div className="pl-9 md:pl-0">
                                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles.bg} ${styles.text}`}>
                                                                {ev.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-16 bg-slate-50 rounded-2xl p-6 md:p-8 flex items-start gap-4 border border-slate-100">
                        <div className="bg-amber-100 p-2 rounded-full text-amber-600 shrink-0">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 mb-1">Important Notice</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                The academic calendar is formulated based on the National University directives. Dates involved in the admission procedure, examinations, and result publication may vary slightly due to unavoidable circumstances or NU official notices. Students are advised to keep in touch with the
                                <a href="/notices" className="text-brandColor font-bold hover:underline mx-1">Notice Board</a>
                                regularly.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
            </>
            )}
        </div>
    );
};

export default AcademicCalendarPage;
