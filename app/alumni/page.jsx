"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    MapPin,
    Linkedin,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    Users,
    Sparkles
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

const AlumniPage = () => {
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [isScrolled, setIsScrolled] = useState(false);
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);

    const departments = ['All', 'BBA', 'MBA', 'CSE', 'BTHM', 'Others'];

    // Handle mounting to prevent hydration errors
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch Alumni Data
    useEffect(() => {
        if (!mounted) return;
        const fetchAlumni = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/alumni');
                const result = await res.json();
                if (result.success) {
                    setAlumni(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch alumni:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlumni();
    }, [mounted]);

    // Handle Scroll for sticky effect
    useEffect(() => {
        if (!mounted) return;
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        // Set initial state
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [mounted]);

    // Filter Logic
    const filteredAlumni = alumni.filter(alumnus => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            alumnus.name.toLowerCase().includes(searchLower) ||
            alumnus.company.toLowerCase().includes(searchLower) ||
            alumnus.designation.toLowerCase().includes(searchLower) ||
            alumnus.location.toLowerCase().includes(searchLower);

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
            window.scrollTo({ top: 450, behavior: 'smooth' });
        }
    };

    // Before mounting, render a consistent shell to prevent hydration mismatch
    if (!mounted || loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-100 rounded-full animate-spin border-t-brandColor" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brandColor animate-pulse" />
                </div>
                <p className="text-slate-500 font-medium animate-pulse">Establishing Network...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-brandColor/10 selection:text-brandColor overflow-x-hidden">
            {/* --- Hero Section --- */}
            <div className="relative bg-[#020617] pt-32 pb-44 px-4 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)]" />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px]"
                    />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-xl">
                            <Sparkles className="w-3.5 h-3.5" /> DIIT Excellence
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">Impact</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                            Meet the professionals who are shaping the future and leading industries across the globe.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-20 pb-32">
                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`bg-white border border-slate-100 rounded-[2rem] p-3 mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] sticky top-20 z-40 transition-all duration-500 ${isScrolled ? 'mx-4 lg:mx-0 shadow-[0_25px_60px_rgba(0,0,0,0.08)]' : ''}`}
                >
                    <div className="flex flex-col lg:flex-row items-center gap-3">
                        <div className="relative w-full lg:w-[400px] group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brandColor transition-colors" />
                            <input
                                type="text"
                                placeholder="Search alumni..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-brandColor transition-all text-slate-800 font-semibold placeholder:text-slate-400"
                            />
                        </div>
                        <div className="w-px h-8 bg-slate-100 hidden lg:block mx-1" />
                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                            {departments.map((dept) => (
                                <button
                                    key={dept}
                                    onClick={() => setSelectedDept(dept)}
                                    className={`px-6 py-3.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap relative ${selectedDept === dept ? 'text-white' : 'text-slate-500 hover:text-brandColor hover:bg-slate-50'}`}
                                >
                                    {selectedDept === dept && (
                                        <motion.div
                                            layoutId="activeFilter"
                                            className="absolute inset-0 bg-brandColor rounded-xl shadow-[0_8px_20px_rgba(0,38,82,0.2)]"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{dept}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Alumni Cards Grid */}
                {paginatedItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {paginatedItems.map((alumnus, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.6, delay: index * 0.05, ease: [0.215, 0.61, 0.355, 1] }}
                                    key={alumnus._id || alumnus.id}
                                    className="group flex flex-col h-full bg-transparent"
                                >
                                    {/* Image Section */}
                                    <div className="relative aspect-[1/1.1] overflow-hidden mb-4 bg-slate-100 rounded-sm">
                                        <img
                                            src={alumnus.image}
                                            alt={alumnus.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-black text-brandColor uppercase tracking-widest shadow-sm">
                                                {alumnus.batch} Batch
                                            </span>
                                        </div>
                                        {/* Tooltip-style Social Actions */}
                                        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            {alumnus.linkedin && (
                                                <a href={alumnus.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white text-brandColor flex items-center justify-center shadow-xl hover:bg-brandColor hover:text-white transition-colors">
                                                    <Linkedin className="w-5 h-5" />
                                                </a>
                                            )}
                                            {alumnus.email && (
                                                <a href={`mailto:${alumnus.email}`} className="w-10 h-10 bg-white text-brandColor flex items-center justify-center shadow-xl hover:bg-brandColor hover:text-white transition-colors">
                                                    <Mail className="w-5 h-5" />
                                                </a>
                                            )}
                                            {alumnus.phone && (
                                                <a href={`tel:${alumnus.phone}`} className="w-10 h-10 bg-white text-brandColor flex items-center justify-center shadow-xl hover:bg-brandColor hover:text-white transition-colors">
                                                    <Phone className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex flex-col text-left">
                                        <h3 className="text-[20px] font-bold text-[#020617] leading-tight mb-1.5 group-hover:text-brandColor transition-colors">
                                            {alumnus.name}
                                        </h3>
                                        <div className="space-y-1">
                                            <p className="text-[15px] font-medium text-slate-500 leading-snug">
                                                {alumnus.designation}
                                            </p>
                                            {alumnus.company && (
                                                <p className="text-[14px] font-medium text-slate-400">
                                                    {alumnus.company}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-40 border-2 border-dashed border-slate-100 rounded-[3rem]">
                        <Users className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">No matching alumni found</h3>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8 bg-white/50 backdrop-blur-sm p-6 rounded-[2rem] border border-white">
                        <span className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-slate-400 uppercase shadow-xs border border-slate-50">
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="w-12 h-12 rounded-2xl bg-white shadow-sm text-slate-600 flex items-center justify-center hover:bg-brandColor hover:text-white disabled:opacity-20 transition-all cursor-pointer">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} onClick={() => handlePageChange(i + 1)} className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-brandColor text-white shadow-lg' : 'text-slate-400 bg-white hover:bg-slate-50'}`}>
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-12 h-12 rounded-2xl bg-white shadow-sm text-slate-600 flex items-center justify-center hover:bg-brandColor hover:text-white disabled:opacity-20 transition-all cursor-pointer">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlumniPage;
