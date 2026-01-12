"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Mail,
    Phone,
    MapPin,
    ArrowLeft,
    Linkedin,
    Facebook,
    Twitter,
    BookOpen,
    Award,
    GraduationCap
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { facultyData } from '../facultyData';
import { motion } from 'framer-motion';

const FacultyDetailsPage = () => {
    const params = useParams();
    const member = facultyData.find(f => f.id == params.id);

    if (!member) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Faculty Member Not Found</h2>
                    <Link href="/faculty" className="text-brandColor hover:underline">Back to Faculty List</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Top Header Background */}
            <div className="bg-[#001229] h-80 w-full absolute top-0 left-0 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-brandColor/30 to-transparent blur-3xl opacity-60" />
            </div>

            <div className="pt-32 px-4 max-w-7xl mx-auto relative z-10">
                <Link href="/faculty" className="inline-flex items-center gap-2 text-blue-200/60 hover:text-white font-medium mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Faculty List
                </Link>

                <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">

                    {/* LEFT SIDE: Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
                    >
                        <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-100 mb-6 relative group">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
                        </div>

                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-slate-800 mb-1">{member.name}</h1>
                            <p className="text-brandColor font-medium text-lg">{member.designation}</p>
                            <div className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold uppercase tracking-wider">
                                {member.department}
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-slate-100">
                            <a href={`mailto:${member.email}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                                    <p className="text-sm font-medium text-slate-700 truncate">{member.email}</p>
                                </div>
                            </a>

                            {member.phone && (
                                <a href={`tel:${member.phone}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Phone</p>
                                        <p className="text-sm font-medium text-slate-700">{member.phone}</p>
                                    </div>
                                </a>
                            )}
                        </div>

                        <div className="mt-8 flex justify-center gap-2">
                            <a href="#" className="p-2 text-slate-400 hover:text-[#0077b5] hover:bg-blue-50 rounded-lg transition-all">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 text-slate-400 hover:text-[#1877f2] hover:bg-blue-50 rounded-lg transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </motion.div>


                    {/* RIGHT SIDE: Biography & Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-8"
                    >
                        {/* Biography */}
                        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <GraduationCap className="w-32 h-32" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <div className="w-1 h-6 bg-brandColor rounded-full" /> About Faculty
                            </h2>
                            <div className="prose prose-lg text-slate-600 leading-relaxed max-w-none">
                                <p>
                                    {member.name} is a dedicated academician serving as {member.designation} in the Department of {member.department} at Daffodil Institute of IT (DIIT).
                                    With a passion for teaching and research, they have been instrumental in guiding students towards academic excellence.
                                </p>
                                <p>
                                    Their research interests include emerging technologies, sustainable development, and educational leadership. They are actively involved in various academic committees and student welfare activities on campus.
                                </p>
                            </div>
                        </div>

                        {/* Education & Achievements Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg mb-4">Education</h3>
                                <ul className="space-y-4">
                                    <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-slate-200 before:rounded-full">
                                        <p className="font-bold text-slate-700 text-sm">Masters in Comp. Science</p>
                                        <p className="text-xs text-slate-500">Dhaka University, 2018</p>
                                    </li>
                                    <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-slate-200 before:rounded-full">
                                        <p className="font-bold text-slate-700 text-sm">B.Sc. in Engineering</p>
                                        <p className="text-xs text-slate-500">BUET, 2016</p>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                                    <Award className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg mb-4">Achievements</h3>
                                <ul className="space-y-4">
                                    <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-amber-200 before:rounded-full">
                                        <p className="font-bold text-slate-700 text-sm">Best Researcher Award</p>
                                        <p className="text-xs text-slate-500">DIIT Annual Summit, 2024</p>
                                    </li>
                                    <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-amber-200 before:rounded-full">
                                        <p className="font-bold text-slate-700 text-sm">Published 5+ Intl. Papers</p>
                                        <p className="text-xs text-slate-500">IEEE & Springer Journals</p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDetailsPage;
