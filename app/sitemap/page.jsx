import React from 'react';
import Link from 'next/link';
import { ChevronRight, Map, Info, BookOpen, GraduationCap, Users, Phone } from 'lucide-react';

export const metadata = {
    title: 'Sitemap | DIIT',
    description: 'Sitemap for Daffodil Institute of IT (DIIT)',
};

const sitemapData = [
    {
        category: "About DIIT",
        icon: Info,
        links: [
            { label: "About Us", href: "/about" },
            { label: "Vision & Mission", href: "/about#mission" },
            { label: "Administration", href: "/administrative/members" },
            { label: "Notice Board", href: "/notices" },
        ]
    },
    {
        category: "Academics",
        icon: BookOpen,
        links: [
            { label: "Academic Programs", href: "/programs" },
            { label: "Academic Calendar", href: "/academics/calendar" },
            { label: "Faculty Members", href: "/faculty" },
            { label: "Library", href: "/campus/library" },
        ]
    },
    {
        category: "Admissions",
        icon: GraduationCap,
        links: [
            { label: "Admission Eligibility", href: "/admissionEligibility" },
            { label: "How to Apply", href: "/admission/online" },
            { label: "Tuition Fees", href: "/admission/fees" },
            { label: "Scholarships & Fin. Aid", href: "/admission/scholarships" },
        ]
    },
    {
        category: "Student Life",
        icon: Users,
        links: [
            { label: "Campus Activities", href: "/campus-activities" },
            { label: "News & Events", href: "/news" },
            { label: "Gallery", href: "/campus/gallery" },
            { label: "Clubs", href: "/campus-activities/clubs" },
        ]
    },
    {
        category: "Connect",
        icon: Phone,
        links: [
            { label: "Contact Us", href: "/contact" },
            { label: "Career Services", href: "/career/placement" },
            { label: "Alumni", href: "/alumni" },
            { label: "Feedback", href: "/contact#feedback" },
        ]
    },
    {
        category: "Legal & Info",
        icon: Map,
        links: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Sitemap", href: "/sitemap" },
        ]
    }
];

export default function SitemapPage() {
    return (
        <div className="bg-neutral-50 min-h-screen font-sans pb-20">
            {/* Header */}
            <div className="bg-[#001229] py-20 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Sitemap</h1>
                <p className="text-blue-200">Navigate through our platform</p>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sitemapData.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                                <section.icon className="w-6 h-6 text-blue-600" />
                                <h2 className="text-lg font-bold text-gray-800">{section.category}</h2>
                            </div>
                            <ul className="p-6 space-y-3">
                                {section.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <Link
                                            href={link.href}
                                            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
                                        >
                                            <ChevronRight className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
