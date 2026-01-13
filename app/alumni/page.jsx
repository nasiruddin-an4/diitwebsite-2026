"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Briefcase,
    MapPin,
    Linkedin,
    Mail,
    ChevronLeft,
    ChevronRight,
    Users,
    Globe,
    Building2,
    GraduationCap,
    Sparkles,
    Filter,
    X
} from 'lucide-react';
import { alumniData } from './alumniData';

const ITEMS_PER_PAGE = 8;

const AlumniPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const departments = ['All', 'CSE', 'BBA', 'MBA', 'THM'];

    // Stats for Hero Section
    const stats = [
        { label: "Active Alumni", value: "2,500+", icon: Users },
        { label: "Global Companies", value: "300+", icon: Building2 },
        { label: "Countries Reach", value: "25+", icon: Globe },
    ];

    // Handle Scroll for sticky filter bar effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Filter Logic
    const filteredAlumni = alumniData.filter(alumnus => {
        const matchesSearch =
            alumnus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alumnus.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alumnus.designation.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept = selectedDept === 'All' || alumnus.department === selectedDept;

        return matchesSearch && matchesDept;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredAlumni.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = filteredAlumni.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset page when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedDept]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 500, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Modern Hero Section */}
            <div className="relative bg-[#0b0f19] pt-32 pb-32 px-4 overflow-hidden">
                {/* Advanced Background Gradients */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-linear-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-[100px] animate-pulse-slow" />
                    <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-linear-to-tr from-cyan-500/10 to-emerald-500/10 rounded-full blur-[80px]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="max-w-4xl"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md border border-slate-700/50 shadow-lg glow-cyan">
                                <Sparkles className="w-3.5 h-3.5" /> Alumni Network
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight">
                                Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 animate-gradient-x">Dreams</span> <br />
                                Across the Globe
                            </h1>

                            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
                                Discover the success stories of DIIT graduates who are leading innovation and shaping industries worldwide.
                            </p>
                        </motion.div>

                        {/* Interactive Stats Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-4xl"
                        >
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 mb-4 mx-auto group-hover:scale-110 transition-transform">
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Filter & Content Section */}
            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20 pb-20">
                {/* Floating Filter Bar */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 p-4 mb-12 border border-white/50 sticky top-16 z-40 transition-all duration-300 ${isScrolled ? 'shadow-2xl translate-y-2' : ''}`}
                >
                    <div className="flex flex-col lg:flex-row gap-4 justify-between">

                        {/* Search Input & Mobile Toggle (Order 1 on mobile, 2 on desktop) */}
                        <div className="flex gap-3 w-full lg:w-96 order-1 lg:order-2">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search alumni..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 font-medium placeholder:text-slate-400 group-hover:bg-white"
                                />
                            </div>

                            <button
                                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                                className={`lg:hidden p-3 rounded-xl border transition-colors flex items-center justify-center ${isMobileFilterOpen
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                                    }`}
                            >
                                {isMobileFilterOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Department Tabs (Order 2 on mobile, 1 on desktop) */}
                        <div className={`
                            ${isMobileFilterOpen ? 'flex' : 'hidden'} 
                            lg:flex flex-col lg:flex-row flex-wrap gap-1.5 justify-center lg:justify-start w-full lg:w-auto bg-slate-100/50 p-1.5 rounded-xl order-2 lg:order-1 transition-all
                        `}>
                            {departments.map(dept => (
                                <button
                                    key={dept}
                                    onClick={() => {
                                        setSelectedDept(dept);
                                        setIsMobileFilterOpen(false);
                                    }}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 relative overflow-hidden text-center ${selectedDept === dept
                                        ? 'text-white shadow-lg shadow-blue-500/25'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-white'
                                        }`}
                                >
                                    {selectedDept === dept && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-blue-600 rounded-lg"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{dept}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Results Count & Sort (Optional placeholder) */}
                <div className="flex items-center justify-between px-2 mb-6">
                    <p className="text-slate-500 text-sm font-medium">
                        Showing results for <span className="text-slate-900 font-bold">"All Alumni"</span>
                    </p>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{filteredAlumni.length} Found</span>
                </div>

                {/* Modern Alumni Grid */}
                {paginatedItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {paginatedItems.map((alumnus, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    key={alumnus.id}
                                    className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 border border-slate-100 flex flex-col h-full"
                                >
                                    {/* Image Section with Overlay */}
                                    <div className="relative h-64 overflow-hidden bg-slate-100">
                                        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60 z-10 transition-opacity duration-300 group-hover:opacity-40" />
                                        <img
                                            src={alumnus.image}
                                            alt={alumnus.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                        />

                                        {/* Floating Badge */}
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg">
                                                <GraduationCap className="w-3 h-3" /> {alumnus.batch}
                                            </span>
                                        </div>

                                        {/* Hover Socials */}
                                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 -translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                                            <a href={alumnus.linkedin} className="w-9 h-9 rounded-full bg-white text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shadow-lg">
                                                <Linkedin className="w-4 h-4" />
                                            </a>
                                            <a href={`mailto:${alumnus.email}`} className="w-9 h-9 rounded-full bg-white text-slate-700 flex items-center justify-center hover:bg-slate-800 hover:text-white transition-colors shadow-lg">
                                                <Mail className="w-4 h-4" />
                                            </a>
                                        </div>

                                        {/* Name & Dept positioned on Image */}
                                        <div className="absolute bottom-0 left-0 right-0 p-5 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="flex items-center gap-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 transform translate-y-4 group-hover:translate-y-0">
                                                <span className="px-2 py-0.5 rounded bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider">
                                                    {alumnus.department}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-0.5 leading-tight group-hover:text-blue-200 transition-colors">
                                                {alumnus.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Content Body */}
                                    <div className="p-5 flex-1 flex flex-col bg-white relative z-10 transition-colors group-hover:bg-blue-50/10">
                                        <div className="mb-4">
                                            <p className="text-blue-600 font-semibold text-sm mb-1">{alumnus.designation}</p>
                                            <p className="text-slate-500 text-sm font-medium">{alumnus.company}</p>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2 text-slate-400 text-xs font-medium">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span>{alumnus.location}</span>
                                        </div>
                                    </div>

                                    {/* Bottom highlight bar */}
                                    <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                                <Search className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">No alumni found</h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                We couldn't find any alumni matching your current filters. Try searching for something else.
                            </p>
                        </div>
                    </div>
                )}

                {/* Modern Pagination controls */}
                {totalPages > 1 && (
                    <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-slate-500 text-sm font-medium">Page {currentPage} of {totalPages}</p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:hover:bg-white transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1
                                            ? 'bg-slate-900 text-white shadow-lg'
                                            : 'text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 rounded-xl border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:hover:bg-white transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlumniPage;
