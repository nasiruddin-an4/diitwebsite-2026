"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, FileText, Download, TrendingUp, Sparkles } from 'lucide-react';

const FeesPage = () => {
    const [activeTab, setActiveTab] = useState('CSE');
    const [feeData, setFeeData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const res = await fetch('/api/admin/data/AdmissionData');
                const result = await res.json();
                if (result.success && result.data?.fees) {
                    setFeeData(result.data.fees);
                    // Determine initial active tab if current one is invalid
                    const keys = Object.keys(result.data.fees);
                    if (keys.length > 0 && !keys.includes(activeTab)) {
                        setActiveTab(keys[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to load fees", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFees();
    }, []);

    const programs = Object.keys(feeData).map(key => ({
        id: key,
        label: key
    }));

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandColor"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F4F8] pb-20">
            {/* Header */}
            <div className="bg-[#001229] pt-32 pb-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="absolute right-0 bottom-0 w-2/3 h-full bg-gradient-to-l from-brandColor/20 to-transparent blur-3xl opacity-60" />
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-blue-200 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
                            <Sparkles className="w-4 h-4 text-yellow-400" /> Spring 2026 Admissions Open
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Tuition & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Fees Structure</span>
                        </h1>
                        <p className="text-blue-100/70 text-lg max-w-2xl mx-auto leading-relaxed">
                            Invest in your future with our transparent, affordable, and merit-based fee structures designed to accessible for everyone.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
                {/* Tabs */}
                {programs.length > 0 ? (
                    <div className="flex flex-wrap items-center justify-center p-1.5 rounded-2xl bg-white shadow-xl shadow-slate-200/50 max-w-fit mx-auto mb-10 border border-slate-100">
                        {programs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-6 md:px-10 py-3.5 rounded-xl font-bold text-sm md:text-base transition-all duration-300 z-10 ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-brandColor rounded-xl shadow-lg shadow-brandColor/30 -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-3xl mb-10 shadow-sm border border-slate-200">
                        <p className="text-slate-500">No fee structures available.</p>
                    </div>
                )}

                {/* Content */}
                <div className="space-y-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {feeData[activeTab]?.length > 0 ? (
                                feeData[activeTab].map((table, idx) => (
                                    <div key={idx} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8 hover:shadow-lg transition-shadow duration-300">
                                        <div className="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
                                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-3">
                                                <div className="w-1.5 h-8 bg-brandColor rounded-full" />
                                                {table.title}
                                            </h2>
                                            {table.type === 'postgrad' && (
                                                <div className="p-2 bg-blue-100 rounded-lg text-brandColor">
                                                    <TrendingUp className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50/80 border-b border-slate-200">
                                                        {table.headers.map((header, i) => (
                                                            <th key={i} className={`p-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap ${i === table.headers.length - 1 ? 'text-right pr-8' : ''}`}>
                                                                {header}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {table.rows.map((row, rowIndex) => (
                                                        <tr key={rowIndex} className={`group transition-all hover:bg-blue-50/40 ${row[0] === 'Total' ? 'bg-slate-50 font-bold' : ''}`}>
                                                            {row.map((cell, cellIndex) => (
                                                                <td
                                                                    key={cellIndex}
                                                                    className={`p-5 text-sm whitespace-nowrap ${cellIndex === 0 ? 'text-slate-900 font-bold' :
                                                                        cellIndex === row.length - 1 ? 'text-brandColor font-extrabold text-base text-right pr-8' : 'text-slate-600 font-medium'
                                                                        }`}
                                                                >
                                                                    {cell}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FileText className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Fee Structure Found</h3>
                                    <p className="text-slate-400 max-w-md mx-auto">
                                        We couldn't load the fee details for this program at the moment. Please try contacting our support.
                                    </p>
                                </div>
                            )}

                            {/* Global Note */}
                            {feeData[activeTab]?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white shadow-sm border border-l-4 border-l-amber-500 border-slate-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4 max-w-4xl mx-auto mt-8"
                                >
                                    <div className="p-2 bg-amber-50 rounded-full text-amber-600 shrink-0">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 mb-1">Important Note</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            All National University Fees (Registration, Examinations, etc.) are <strong>not included</strong> in the Grand Total. These fees are to be paid separately as per the National University schedule.
                                        </p>
                                    </div>
                                    <button className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold text-sm transition-colors">
                                        <Download className="w-4 h-4" /> Download PDF
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default FeesPage;
