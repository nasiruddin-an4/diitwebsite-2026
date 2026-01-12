"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Calendar,
    ArrowLeft,
    Download,
    Share2,
    Printer,
    FileText,
    Pin,
    Clock
} from 'lucide-react';
import { useParams } from 'next/navigation';

// Mock Data (Shared source of truth would be better in real app)
const noticesData = [
    {
        id: 1,
        title: "Result Publication of Honours 1st Year Final Examination 2024",
        date: "12 Jan, 2026",
        category: "Exam",
        pinned: true,
        file: "result_h1_2024.pdf",
        image: "/noticeImg.jpg",
        description: `The results of the Honours 1st Year Final Examination 2024 have been published. Students can check their results online via the National University website or the DIIT student portal. 
        
        To access your result:
        1. Visit www.nu.ac.bd/results
        2. Enter your Registration Number and Exam Roll.
        3. Submit to view the detailed grade sheet.
        
        Students with FAILED subjects must complete the form fill-up for the improvement examination within 15 days of this notice.`
    },
    {
        id: 2,
        title: "Class Suspension Notice: Saraswati Puja",
        date: "10 Jan, 2026",
        category: "General",
        pinned: false,
        file: null,
        image: "/noticeImg.jpg",
        description: `This is to inform all students and faculty members that all academic and administrative activities of the institute will remain closed on 10th January 2026 on the occasion of Saraswati Puja.
        
        Regular classes will resume from 11th January 2026 as per the usual schedule.
        
        We wish everyone a joyous celebration.`
    },
    {
        id: 3,
        title: "Schedule for Mid-Term Examination - Spring 2026",
        date: "08 Jan, 2026",
        category: "Academic",
        pinned: false,
        file: "schedule_mid_spring26.pdf",
        image: "/noticeImg.jpg",
        description: "The schedule for the upcoming Mid-Term Examination (Spring 2026) has been finalized. Exams will commence from March 15th, 2026. Please find the attached PDF for the detailed routine for each department."
    },
    {
        id: 4,
        title: "Scholarship Application Deadline Extended",
        date: "05 Jan, 2026",
        category: "Admission",
        pinned: true,
        file: "scholarship_notice.pdf",
        image: "/noticeImg.jpg",
        description: "Due to high demand, the deadline for submitting the Merit-Based Scholarship Application for the Session 2025-2026 has been extended until January 20th, 2026."
    },
    {
        id: 5,
        title: "Guest Seminar on 'Future of AI' by Google Engineer",
        date: "02 Jan, 2026",
        category: "Event",
        pinned: false,
        file: null,
        image: "/noticeImg.jpg",
        description: "Join us for an exciting seminar on 'The Future of AI' featuring a guest speaker from Google's Engineering team."
    },
    {
        id: 6,
        title: "Library Maintenance Notice: Closed for 2 Days",
        date: "28 Dec, 2025",
        category: "General",
        pinned: false,
        file: null,
        image: "/noticeImg.jpg",
        description: "The Digital Library will be closed for scheduled maintenance and catalog updates."
    },
    {
        id: 7,
        title: "Form Fill-up Notice for MBA Last Semester",
        date: "25 Dec, 2025",
        category: "Exam",
        pinned: false,
        file: "mba_form_fillup.pdf",
        description: "Details regarding the form fill-up process for MBA final semester students."
    },
    {
        id: 8,
        title: "New Transport Route Added (Route #5 - Uttara)",
        date: "20 Dec, 2025",
        category: "General",
        pinned: false,
        file: "transport_route_5.pdf",
        description: "We are pleased to announce a new bus route covering the Uttara sector."
    }
];

const NoticeDetailsPage = () => {
    const params = useParams();
    const notice = noticesData.find(n => n.id == params.id);

    if (!notice) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Notice Not Found</h2>
                    <Link href="/notices" className="text-brandColor hover:underline">Back to Notices</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* 1. Page Hero Section with Title */}
            <div className="bg-[#001229] pt-6 md:pt-12 pb-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brandColor/20 rounded-full blur-3xl opacity-50" />

                <div className="max-w-4xl mx-auto relative z-10">
                    {/* Breadcrumb / Back */}
                    <Link href="/notices" className="inline-flex items-center gap-2 text-blue-200/60 hover:text-white font-medium mb-6 transition-colors text-sm md:text-base">
                        <ArrowLeft className="w-4 h-4" /> Back to Notice Board
                    </Link>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/20 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                            {notice.category}
                        </span>
                        {notice.pinned && (
                            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/20 text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                <Pin className="w-3 h-3" /> Pinned
                            </span>
                        )}
                        <span className="flex items-center gap-2 text-slate-400 text-xs md:text-sm ml-1">
                            <Clock className="w-3.5 h-3.5" /> {notice.date}
                        </span>
                    </div>

                    {/* Hero Title */}
                    <h1 className="text-2xl md:text-5xl font-bold text-white leading-tight mb-4">
                        {notice.title}
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20 pb-20">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 p-5 md:p-12">

                    {/* 2. Full View Image (No Cropping) */}
                    {notice.image ? (
                        <div className="w-full bg-slate-50 border border-slate-100 rounded-xl overflow-hidden mb-8 md:mb-10 shadow-inner">
                            <img
                                src={notice.image}
                                alt={notice.title}
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    ) : (
                        // Fallback purely decorative
                        <div className="w-full h-48 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl mb-10 flex items-center justify-center border border-slate-100 border-dashed">
                            <div className="flex flex-col items-center text-slate-400">
                                <FileText className="w-12 h-12 mb-2 opacity-50" />
                                <span className="text-sm font-medium">No Image Preview Available</span>
                            </div>
                        </div>
                    )}

                    {/* Content Body */}
                    <div className="prose prose-base md:prose-lg text-slate-600 max-w-none leading-relaxed whitespace-pre-line mb-8 md:mb-12">
                        {notice.description || "No specific details provided for this notice."}
                    </div>

                    {/* Actions Footer */}
                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        {/* Download Logic: Points to file if avail, else image */}
                        <a
                            href={notice.file ? `/files/${notice.file}` : (notice.image || '#')}
                            download
                            className="flex items-center justify-center gap-2 bg-brandColor text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-800 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                        >
                            <Download className="w-5 h-5" />
                            {notice.file ? 'Download PDF Document' : 'Download Notice Image'}
                        </a>

                        <div className="flex items-center justify-center gap-3">
                            <button className="p-3 rounded-full hover:bg-slate-50 text-slate-500 transition-colors border border-transparent hover:border-slate-200" title="Print">
                                <Printer className="w-5 h-5" />
                            </button>
                            <button className="p-3 rounded-full hover:bg-slate-50 text-slate-500 transition-colors border border-transparent hover:border-slate-200" title="Share">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeDetailsPage;
