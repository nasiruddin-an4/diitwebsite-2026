"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Phone,
    Crown,
    Users,
    Linkedin,
    User,
    Loader2,
    Facebook,
    Instagram
} from 'lucide-react';

const AdministrativePage = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await fetch("/api/admin/academics/administrative");
            const result = await res.json();
            if (result.success) {
                setStaff(result.data);
            }
        } catch (error) {
            console.error("Error fetching administrative staff:", error);
        } finally {
            setLoading(false);
        }
    };

    const sortMember = (a, b) => (Number(a.serial) || 9999) - (Number(b.serial) || 9999);

    const administrative = staff.filter(m => m.type === "Administrative" || m.type === "Academic Administration").sort(sortMember);
    const governingBody = staff.filter(m => m.type === "Governing Body").sort(sortMember);
    const chairman = staff.filter(m => m.type === "Chairman").sort(sortMember);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-32">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 relative font-sans text-slate-900">
            {/* Background Decorations - Subtle for Light Mode */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-100/60 to-purple-100/60 rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-100/60 to-orange-100/60 rounded-full blur-3xl opacity-60" />
            </div>

            {/* Hero Section */}
            <div className="relative pt-32 px-4">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-sm border border-slate-200 text-blue-600 text-sm font-bold mb-6">
                            <Crown className="w-4 h-4" />
                            <span>Leadership & Governance</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                            Meet Our{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Administration
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            The visionary leaders and dedicated staff driving excellence at Daffodil Institute of IT.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Section 1: Chairman (Featured) */}
            {chairman.length > 0 && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 px-4 mt-16"
                >
                    <div className="max-w-7xl mx-auto">
                        {chairman.map((member, index) => (
                            <div key={member._id || index} className="mb-16">
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-10 items-center md:items-start relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -z-10 transition-all group-hover:bg-blue-100/80" />

                                    {/* Chairman Image */}
                                    <div className="w-full md:w-80 shrink-0">
                                        <div className="block relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                                            {member.image ? (
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-200">
                                                    <User className="w-20 h-20 text-slate-400" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
                                        </div>
                                    </div>

                                    {/* Chairman Info */}
                                    <div className="flex-1 text-center md:text-left py-4">
                                        <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
                                            Leadership
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                                            {member.name}
                                        </h2>
                                        <p className="text-xl text-slate-500 font-medium mb-6">{member.designation}</p>

                                        <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-8 mx-auto md:mx-0" />

                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                            {member.email && (
                                                <a href={`mailto:${member.email}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all text-slate-600 hover:text-blue-600 font-medium group/btn">
                                                    <Mail className="w-4 h-4 text-slate-400 group-hover/btn:text-blue-600 transition-colors" />
                                                    <span className="hidden sm:inline">{member.email}</span>
                                                    <span className="sm:hidden">Email</span>
                                                </a>
                                            )}
                                            {member.linkedin && (
                                                <a href={member.linkedin} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600/10 text-blue-700 font-bold hover:bg-blue-600 hover:text-white transition-all">
                                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                                </a>
                                            )}
                                            {member.facebook && (
                                                <a href={member.facebook} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600/10 text-blue-700 font-bold hover:bg-blue-600 hover:text-white transition-all">
                                                    <Facebook className="w-4 h-4" /> Facebook
                                                </a>
                                            )}

                                            {member.instagram && (
                                                <a href={member.instagram} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600/10 text-blue-700 font-bold hover:bg-blue-600 hover:text-white transition-all">
                                                    <Instagram className="w-4 h-4" /> Instagram
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Section 2: Governing Body */}
            {governingBody.length > 0 && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 px-4 mb-24"
                >
                    <div className="max-w-7xl mx-auto">
                        <motion.div variants={itemVariants} className="text-center mb-16">
                            <span className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-3 inline-block">Board Members</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Governing Body</h2>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {governingBody.map((member, index) => (
                                <motion.div
                                    key={member._id || index}
                                    variants={itemVariants}
                                    className="group bg-transparent"
                                >
                                    {/* Image Card */}
                                    <div className="block relative mb-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 group-hover:shadow-xl group-hover:ring-blue-600/20 transition-all duration-300 aspect-[3/4]">
                                        {member.image ? (
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-200">
                                                <User className="w-16 h-16 text-slate-400" />
                                            </div>
                                        )}
                                        {/* Social Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                            <div className="flex gap-2 justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                                                {member.email && (
                                                    <a href={`mailto:${member.email}`} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-colors">
                                                        <Mail className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {member.linkedin && (
                                                    <a href={member.linkedin} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-colors">
                                                        <Linkedin className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {member.facebook && (
                                                    <a href={member.facebook} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-colors">
                                                        <Facebook className="w-4 h-4" />
                                                    </a>
                                                )}

                                                {member.instagram && (
                                                    <a href={member.instagram} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-pink-600 transition-colors">
                                                        <Instagram className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <div className="text-center px-2">
                                        <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight group-hover:text-brandColor transition-colors">
                                            {member.name}
                                        </h3>
                                        <p className="text-slate-800/80 text-sm font-semibold tracking-wide mb-3 line-clamp-2 min-h-[1.5rem]">{member.designation}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Section 3: Administrative */}
            {administrative.length > 0 && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 px-4 pb-24 bg-white/50 py-20"
                >
                    <div className="max-w-7xl mx-auto">
                        <motion.div variants={itemVariants} className="mb-16 text-center">
                            <span className="px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-3 inline-block">Management</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Administration</h2>
                            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Meet the dedicated support staff who ensure smooth operations and student success at DIIT.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {administrative.map((staff, index) => (
                                <motion.div
                                    key={staff._id || index}
                                    variants={itemVariants}
                                    className="group bg-transparent"
                                >
                                    {/* Image Card */}
                                    <div className="block relative mb-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 group-hover:shadow-xl group-hover:ring-blue-600/20 transition-all duration-300 aspect-[3/4]">
                                        {staff.image ? (
                                            <img
                                                src={staff.image}
                                                alt={staff.name}
                                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                <User className="w-20 h-20 text-slate-300" />
                                            </div>
                                        )}

                                        {/* Social Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                            <div className="flex gap-2 justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                                                {staff.email && (
                                                    <a
                                                        href={`mailto:${staff.email}`}
                                                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-colors"
                                                        title="Send Email"
                                                    >
                                                        <Mail className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {staff.phone && (
                                                    <a
                                                        href={`tel:${staff.phone}`}
                                                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-green-600 transition-colors"
                                                        title="Call Now"
                                                    >
                                                        <Phone className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {staff.linkedin && (
                                                    <a href={staff.linkedin} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-colors">
                                                        <Linkedin className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {staff.facebook && (
                                                    <a href={staff.facebook} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-colors">
                                                        <Facebook className="w-4 h-4" />
                                                    </a>
                                                )}

                                                {staff.instagram && (
                                                    <a href={staff.instagram} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-pink-600 transition-colors">
                                                        <Instagram className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <div className="text-center px-2">
                                        <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight group-hover:text-brandColor transition-colors">
                                            {staff.name}
                                        </h3>
                                        <p className="text-brandColor/80 text-sm font-semibold tracking-wide mb-3 line-clamp-2 min-h-6">{staff.designation}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AdministrativePage;
