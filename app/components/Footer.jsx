"use client";

import React from "react";
import Link from "next/link";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    MapPin,
    Phone,
    Mail,
    ChevronRight,
    ExternalLink
} from "lucide-react";
import Image from "next/image";

const quickLinks = [
    { label: "About DIIT", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Faculty Members", href: "/faculty" },
    { label: "Academic Calendar", href: "/academics/calendar" },
    { label: "Contact Us", href: "/contact" },
];

const admissionLinks = [
    { label: "Admission Overview", href: "/admissionEligibility" },
    { label: "How to Apply", href: "/admission/online" },
    { label: "Tuition Fees", href: "/admission/fees" },
    { label: "Scholarships", href: "/admission/scholarships" },
    { label: "Brochure", href: "/brochure" },
];

const campusLinks = [
    { label: "Campus Overview", href: "/campus" },
    { label: "Facilities", href: "/campus/facilities" },
    { label: "Labs", href: "/campus/labs" },
    { label: "Library", href: "/campus/library" },
    { label: "Student Life", href: "/campus/student-life" },
];

export default function Footer() {
    return (
        <footer className="bg-[#001229] border-t border-white/5 font-sans relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Main Footer Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-0 py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

                    {/* Column 1: Institution Info (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        <div>
                            <Link href="/" className="inline-block">
                                <Image src="/diitWhiteLogo.png" alt="DIIT Logo" width={100} height={100} />
                            </Link>
                            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-sm">
                                Daffodil Institute of IT (DIIT) is a premier institution dedicated to fostering innovation,
                                excellence, and leadership in technology and engineering education.
                            </p>
                        </div>

                        {/* Affiliation Badge */}
                        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-colors">
                            <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                <span className="text-xl">🎓</span>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">Affiliated With</p>
                                <p className="text-sm font-bold text-white">National University</p>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {[
                                { icon: Facebook, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Linkedin, href: "#" },
                                { icon: Instagram, href: "#" },
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links (2 cols) */}
                    <div className="lg:col-span-2 lg:ml-auto">
                        <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-200 flex items-center group"
                                    >
                                        <ChevronRight className="w-3 h-3 mr-2 text-gray-600 group-hover:text-blue-400 transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Admissions (3 cols) */}
                    <div className="lg:col-span-3 lg:ml-8">
                        <h3 className="text-white font-bold text-lg mb-6">Admissions</h3>
                        <ul className="space-y-3">
                            {admissionLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-200 flex items-center group"
                                    >
                                        <ChevronRight className="w-3 h-3 mr-2 text-gray-600 group-hover:text-blue-400 transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact Info (3 cols) */}
                    <div className="lg:col-span-3">
                        <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 group">
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                    <MapPin className="w-5 h-5 text-blue-400" />
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    House #54, Road #4/A, <br />
                                    Dhanmondi, Dhaka-1209
                                </p>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                    <Phone className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <a href="tel:+88029116774" className="text-gray-400 text-sm hover:text-white transition-colors block">
                                        +880 2-9116774
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                    <Mail className="w-5 h-5 text-blue-400" />
                                </div>
                                <a href="mailto:info@diit.edu.bd" className="text-gray-400 text-sm hover:text-white transition-colors">
                                    info@diit.edu.bd
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative z-10 border-t border-white/5 bg-[#000f24]">
                <div className="max-w-7xl mx-auto px-6 md:px-0 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600 text-sm text-center md:text-left">
                            © {new Date().getFullYear()} Dhaka International Institute of Technology. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                            <Link href="/privacy" className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/sitemap" className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                                Sitemap
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
