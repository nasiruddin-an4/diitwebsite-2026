"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, FileText, Download, TrendingUp, Sparkles } from 'lucide-react';

const FeesPage = () => {
    const [activeTab, setActiveTab] = useState('CSE');

    const programs = [
        { id: 'CSE', label: 'CSE' },
        { id: 'BBA', label: 'BBA' },
        { id: 'BTHM', label: 'BTHM' },
        { id: 'MBA', label: 'MBA' },
        { id: 'MTHM', label: 'MTHM' },
    ];

    const feeData = {
        CSE: [
            {
                type: 'undergrad',
                title: "Computer Science & Engineering (CSE)",
                headers: ["GPA (HSC)", "Admission Fees", "Before Mid-Term", "Before Internal-Final", "Total Sem Fees", "Tuition Fees", "Grand Total"],
                rows: [
                    ["5.00 (Golden)", "15,000", "5,000", "5,000", "10,000", "N/A", "95,000"],
                    ["5.00", "15,000", "8,000", "8,000", "16,000", "1,500 * 48", "215,000"],
                    ["4.00 - 4.99", "15,000", "8,000", "8,000", "16,000", "2,500 * 48", "263,000"],
                    ["2.50 - 3.99", "15,000", "8,000", "8,000", "16,000", "2,900 * 48", "282,000"]
                ]
            },
            {
                type: 'undergrad',
                title: "CSE for Diploma Students",
                headers: ["Diploma GPA", "Admission Fees", "Before Mid-Term", "Before Internal-Final", "Total Sem Fees", "Tuition Fees", "Grand Total"],
                rows: [
                    ["4.00", "10,000", "4,375", "4,375", "8,750", "N/A", "80,000"],
                    ["3.50 - 3.99", "10,000", "7,500", "7,500", "15,000", "N/A", "130,000"],
                    ["3.00 - 3.49", "10,000", "7,500", "7,500", "15,000", "400 * 48", "149,200"],
                    ["2.50 - 2.99", "10,000", "7,500", "7,500", "15,000", "800 * 48", "168,400"]
                ]
            }
        ],
        BBA: [
            {
                type: 'undergrad',
                title: "Business Administration (BBA)",
                headers: ["GPA (HSC)", "Admission Fees", "Before Mid-Term", "Before Internal-Final", "Total Sem Fees", "Tuition Fees", "Grand Total"],
                rows: [
                    ["5.00 (Golden)", "15,000", "4,000", "4,000", "8,000", "N/A", "79,000"],
                    ["5.00", "15,000", "7,450", "7,450", "14,900", "1,050 * 48", "184,600"],
                    ["4.00 - 4.99", "15,000", "7,600", "7,600", "15,200", "1,700 * 48", "218,200"],
                    ["2.50 - 3.99", "15,000", "7,600", "7,600", "15,200", "1,900 * 48", "227,800"]
                ]
            }
        ],
        BTHM: [
            {
                type: 'undergrad',
                title: "Bachelor of Tourism & Hospitality Management (BTHM)",
                headers: ["GPA (HSC)", "Admission Fees", "Before Mid-Term", "Before Internal-Final", "Total Sem Fees", "Tuition Fees (Per Credit)", "Grand Total"],
                rows: [
                    ["5.00 (Golden)", "15,000", "4,000", "4,000", "8,000", "N/A", "79,000"],
                    ["5.00", "15,000", "7,500", "7,500", "15,000", "1,000 * 48", "183,000"],
                    ["4.00 - 4.99", "15,000", "7,500", "7,500", "15,000", "1,700 * 48", "216,600"],
                    ["2.50 - 3.99", "15,000", "7,500", "7,500", "15,000", "1,900 * 48", "226,200"]
                ]
            }
        ],
        MBA: [
            {
                type: 'postgrad',
                title: "Cost Structure of MBA Program",
                headers: ["Particulars", "Amount (BDT)"],
                rows: [
                    ["Admission Fees", "10,000"],
                    ["Development Fees", "4,000"],
                    ["Semester Fees (12,000 * 2)", "24,000"],
                    ["Tuition Fees (2,500 * 12)", "30,000"],
                    ["Total", "68,000"]
                ]
            }
        ],
        MTHM: [
            {
                type: 'postgrad',
                title: "Cost Structure of MTHM Program",
                headers: ["Particulars", "Amount (BDT)"],
                rows: [
                    ["Admission Fees", "10,000"],
                    ["Development Fees", "4,000"],
                    ["Semester Fees (12,000 * 2)", "24,000"],
                    ["Tuition Fees (2,500 * 12)", "30,000"],
                    ["Total", "68,000"]
                ]
            }
        ]
    };

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
