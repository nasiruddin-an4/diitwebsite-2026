"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Megaphone,
    Search,
    Filter,
    Calendar,
    ChevronRight,
    ChevronLeft,
    Pin,
    Loader2,
    AlertCircle,
    GraduationCap
} from 'lucide-react';
import Link from 'next/link';

const momentDate = (dateStr) => {
    if (!dateStr) return { day: '??', month: '???' };
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
        return {
            day: d.getDate(),
            month: d.toLocaleString('default', { month: 'short' })
        };
    }
    const parts = dateStr.split(' ');
    if (parts.length >= 2) {
        return {
            day: parts[0],
            month: parts[1].replace(',', '')
        };
    }
    return { day: '??', month: '???' };
};


const NoticesPage = () => {
    const categories = ['All', 'Academic', 'Exam', 'Admission', 'Event', 'General'];
    const departments = ['All', 'BBA', 'CSE', 'BTHM', 'MBA', 'MTHM'];
    const [filter, setFilter] = useState('All');
    const [departmentFilter, setDepartmentFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const isFirstRun = useRef(true);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/academics/notices");
            const result = await res.json();

            if (result.success && result.data.length > 0) {
                setNotices(result.data);
            } else {
                setNotices([]);
            }
        } catch (err) {
            console.error("Error fetching notices:", err);
            setNotices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, departmentFilter, searchQuery]);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        const feedElement = document.getElementById('notices-feed');
        if (feedElement) {
            const headerOffset = 150;
            const elementPosition = feedElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, [currentPage]);

    const filteredNotices = notices.filter(notice => {
        const matchesCategory = filter === 'All' || notice.category === filter;

        // Department filter logic:
        // - If departmentFilter is 'All', show all notices
        // - If notice has no department or department is 'All', show to everyone
        // - Otherwise, must match the specific department
        let matchesDepartment = false;
        if (departmentFilter === 'All') {
            matchesDepartment = true;
        } else {
            matchesDepartment = notice.department === departmentFilter;
        }

        const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesDepartment && matchesSearch;
    });

    const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
    const paginatedNotices = filteredNotices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'Exam': return 'bg-red-100 text-red-700 border-red-200';
            case 'Academic': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Admission': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Event': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getDepartmentColor = (dept) => {
        switch (dept) {
            case 'BBA': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'CSE': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
            case 'BTHM': return 'bg-pink-100 text-pink-700 border-pink-200';
            case 'MBA': return 'bg-violet-100 text-violet-700 border-violet-200';
            case 'MTHM': return 'bg-teal-100 text-teal-700 border-teal-200';
            default: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Loading notices...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="bg-[#001229] pt-32 pb-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brandColor/30 to-transparent blur-3xl opacity-60" />

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-amber-300 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
                            <Megaphone className="w-4 h-4 text-amber-300" /> Latest Updates
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Notice <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Board</span>
                        </h1>
                        <p className="text-blue-100/70 text-lg max-w-2xl mx-auto leading-relaxed">
                            Stay informed with the latest official announcements, exam schedules, and academic updates from the DIIT administration.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">

                <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">

                    {/* LEFT COLUMN: Main Feed */}
                    <div className="space-y-6" id="notices-feed">

                        {/* Mobile Header: Search + Filter Toggle (Visible only on mobile) */}
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 mb-2 md:hidden">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search notices..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl focus:outline-none text-sm text-slate-700 font-medium placeholder:text-slate-400"
                                />
                            </div>
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className={`p-2.5 rounded-xl border transition-all ${showMobileFilters ? 'bg-brandColor text-white border-brandColor' : 'bg-slate-50 text-slate-500 border-slate-200 active:bg-slate-100'}`}
                            >
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Filter Drawer (Collapsible) */}
                        <AnimatePresence>
                            {showMobileFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden md:hidden"
                                >
                                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-lg mb-6 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filters</h4>
                                            <button onClick={() => setShowMobileFilters(false)} className="text-xs text-brandColor font-bold">Close</button>
                                        </div>
                                        {/* Department Filter */}
                                        <div>
                                            <h5 className="text-xs font-semibold text-slate-500 mb-2">Department</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {departments.map((dept) => (
                                                    <button
                                                        key={dept}
                                                        onClick={() => { setDepartmentFilter(dept); setShowMobileFilters(false); }}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${departmentFilter === dept
                                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-900/20'
                                                            : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'
                                                            }`}
                                                    >
                                                        {dept === 'All' ? 'All Depts' : dept}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Category Filter */}
                                        <div>
                                            <h5 className="text-xs font-semibold text-slate-500 mb-2">Category</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.map((cat) => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => { setFilter(cat); setShowMobileFilters(false); }}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${filter === cat
                                                            ? 'bg-brandColor text-white border-brandColor shadow-md shadow-blue-900/20'
                                                            : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'
                                                            }`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="popLayout">
                            {filteredNotices.length > 0 ? (
                                paginatedNotices.map((notice) => (
                                    <Link href={`/notices/${notice._id}`} key={notice._id} className="block">
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className={`group bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex gap-5 items-start ${notice.pinned ? 'border-l-4 border-l-amber-400' : ''}`}
                                        >
                                            {/* Date Box or Thumbnail */}
                                            {notice.image ? (
                                                <div className="hidden sm:block w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative">
                                                    <img src={notice.image} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                            ) : (
                                                <div className="hidden sm:flex flex-col items-center justify-center w-24 h-24 bg-slate-50 rounded-xl border border-slate-100 shrink-0 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                                    <span className="text-2xl font-bold text-slate-700 group-hover:text-blue-600">
                                                        {momentDate(notice.date).day}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                                        {momentDate(notice.date).month}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0 py-1">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {notice.pinned && <Pin className="w-4 h-4 text-amber-500 fill-amber-500 rotate-45" />}
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(notice.category)}`}>
                                                            {notice.category}
                                                        </span>
                                                        {notice.department && notice.department !== 'All' && (
                                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getDepartmentColor(notice.department)}`}>
                                                                {notice.department}
                                                            </span>
                                                        )}
                                                        <span className="sm:hidden text-xs text-slate-400 font-medium">{notice.date}</span>
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-brandColor transition-colors leading-snug line-clamp-2">
                                                    {notice.title}
                                                </h3>

                                                <p className="text-slate-500/80 text-sm line-clamp-2 mb-3">
                                                    Click to view full details...
                                                </p>

                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-bold text-brandColor flex items-center gap-1 group-hover:underline decoration-2 underline-offset-4">
                                                        Read Details <ChevronRight className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <Search className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-slate-600 font-bold text-lg">No notices found</h3>
                                    <p className="text-slate-400">Try adjusting your search or filter</p>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-slate-100">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-brandColor hover:border-brandColor/30 transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Previous
                                </button>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-lg">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-brandColor hover:border-brandColor/30 transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200 disabled:cursor-not-allowed"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Sticky Sidebar (Desktop Only) */}
                    <div className="space-y-6 md:sticky md:top-24 h-fit hidden md:block">

                        {/* Search Widget (Desktop) */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Search className="w-5 h-5 text-brandColor" /> Search Notices
                            </h3>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Keywords..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brandColor/20 focus:border-brandColor transition-all text-sm font-medium"
                                />
                            </div>
                        </div>
                        {/* Filter Departments Widget */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-indigo-500" /> Filter by Department
                            </h3>
                            <div className="space-y-2">
                                {departments.map((dept) => (
                                    <button
                                        key={dept}
                                        onClick={() => setDepartmentFilter(dept)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex justify-between items-center transition-all ${departmentFilter === dept
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                            }`}
                                    >
                                        {dept === 'All' ? 'All Departments' : dept}
                                        {departmentFilter === dept && <ChevronRight className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Filter Categories Widget */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Filter className="w-5 h-5 text-brandColor" /> Filter by Category
                            </h3>
                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex justify-between items-center transition-all ${filter === cat
                                            ? 'bg-brandColor text-white shadow-md shadow-blue-900/20'
                                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                            }`}
                                    >
                                        {cat}
                                        {filter === cat && <ChevronRight className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticesPage;
