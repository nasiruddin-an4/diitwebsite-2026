"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Mail, Phone, GraduationCap, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { facultyData as defaultFacultyData } from './facultyData';

const FacultyPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const departments = ['All', 'CSE', 'BBA', 'THM', 'MBA'];

    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/academics/faculty");
            const result = await res.json();

            if (result.success && result.data.length > 0) {
                setFaculty(result.data);
            } else {
                // Use default faculty if API returns empty
                setFaculty(defaultFacultyData);
            }
        } catch (err) {
            console.error("Error fetching faculty:", err);
            // Fallback to default faculty on error
            setFaculty(defaultFacultyData);
        } finally {
            setLoading(false);
        }
    };

    // separate Principal (id 1 in default data or first with appropriate title)
    const principal = faculty.find(m => m.id === 1 || m.designation === "Principal");
    const otherFaculty = faculty.filter(m => m.id !== 1 && m.designation !== "Principal");

    const filteredFaculty = otherFaculty.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.designation.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = selectedDept === 'All' || member.department === selectedDept;

        return matchesSearch && matchesDept;
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Loading State */}
            {loading && (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-slate-600 font-medium">Loading faculty...</p>
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
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-amber-300 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
                            <GraduationCap className="w-4 h-4 text-amber-300" /> Academic Leadership
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Faculty</span>
                        </h1>
                        <p className="text-blue-100/70 text-lg max-w-2xl mx-auto leading-relaxed">
                            Meet the distinguished academicians and industry experts shaping the future of our students.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">

                {/* PRINCIPAL SECTION (Single Row) */}
                {principal && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16"
                    >
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-10 items-center md:items-start relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brandColor/5 rounded-full blur-3xl -z-10 transition-all group-hover:bg-brandColor/10" />

                            {/* Principal Image */}
                            <div className="w-full md:w-80 shrink-0">
                                <Link href={`/faculty/${principal._id || principal.id}`} className="block relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                                    <img
                                        src={principal.image}
                                        alt={principal.name}
                                        className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
                                </Link>
                            </div>

                            {/* Principal Info */}
                            <div className="flex-1 text-center md:text-left py-4">
                                <div className="inline-block px-4 py-1 rounded-full bg-brandColor/10 text-brandColor text-xs font-bold uppercase tracking-wider mb-4 border border-brandColor/20">
                                    Head of Institution
                                </div>
                                <Link href={`/faculty/${principal._id || principal.id}`} className="block group/link">
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 group-hover/link:text-brandColor transition-colors">
                                        {principal.name}
                                    </h2>
                                    <p className="text-xl text-slate-500 font-medium mb-6">{principal.designation}</p>
                                </Link>

                                <p className="text-slate-600 leading-relaxed mb-8 max-w-2xl text-lg">
                                    Leading DIIT with a vision for academic excellence and innovation. Dedicated to fostering a learning environment that empowers students to become global leaders.
                                </p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                    <a href={`mailto:${principal.email}`} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-brandColor/30 hover:shadow-lg transition-all text-slate-600 hover:text-brandColor font-medium group/btn">
                                        <Mail className="w-4 h-4 text-slate-400 group-hover/btn:text-brandColor transition-colors" /> {principal.email}
                                    </a>
                                    <Link href={`/faculty/${principal._id || principal.id}`} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brandColor text-white font-bold hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-all">
                                        View Full Profile <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* FILTERS & SEARCH */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                    <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start">
                        {departments.map(dept => (
                            <button
                                key={dept}
                                onClick={() => setSelectedDept(dept)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${selectedDept === dept
                                        ? 'bg-brandColor text-white border-brandColor shadow-lg shadow-blue-900/20'
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brandColor transition-colors" />
                        <input
                            type="text"
                            placeholder="Find faculty member..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brandColor/20 focus:border-brandColor transition-all text-sm font-medium shadow-sm"
                        />
                    </div>
                </div>

                {/* FACULTY GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                    <AnimatePresence mode="popLayout">
                        {filteredFaculty.map((member) => (
                            <motion.div
                                layout
                                key={member._id || member.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group bg-transparent"
                            >
                                {/* Image Card */}
                                <Link href={`/faculty/${member._id || member.id}`} className="block relative mb-5 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 group-hover:shadow-xl group-hover:ring-brandColor/20 transition-all duration-300 aspect-[3/4]">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Subtle Gradient at bottom matching design language */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ml-auto">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </Link>

                                {/* Content Info */}
                                <div className="text-center px-2">
                                    <Link href={`/faculty/${member._id || member.id}`} className="block">
                                        <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight group-hover:text-brandColor transition-colors">
                                            {member.name}
                                        </h3>
                                    </Link>
                                    <p className="text-sm font-medium text-slate-500 mb-3">{member.designation}</p>

                                    <div className="flex items-center justify-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                            {member.department}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredFaculty.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Search className="w-8 h-8" />
                        </div>
                        <h3 className="text-slate-600 font-bold text-lg">No faculty found</h3>
                        <p className="text-slate-400">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
            </>
            )}
        </div>
    );
};

export default FacultyPage;
