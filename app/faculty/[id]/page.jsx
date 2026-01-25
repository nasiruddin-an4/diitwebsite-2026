"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Mail,
    Phone,
    ArrowLeft,
    Linkedin,
    Facebook,
    Twitter,
    BookOpen,
    Award,
    GraduationCap,
    User,
    Calendar,
    FileText,
    ExternalLink,
    Star,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

const FacultyDetailsPage = () => {
    const params = useParams();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/admin/academics/faculty");
                const result = await res.json();

                if (result.success && result.data) {
                    // Find the faculty by _id or id (handle both MongoDB ObjectId and string id)
                    const foundMember = result.data.find(f =>
                        String(f._id) === String(params.id) ||
                        String(f.id) === String(params.id)
                    );
                    if (foundMember) {
                        setMember(foundMember);
                    } else {
                        setError("Faculty member not found");
                    }
                } else {
                    setError("Failed to load faculty");
                }
            } catch (err) {
                console.error("Error fetching faculty:", err);
                setError("Failed to load faculty details");
            } finally {
                setLoading(false);
            }
        };

        fetchFaculty();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center bg-white p-12 rounded-3xl border border-gray-200 shadow-xl"
                >
                    <Loader2 className="w-10 h-10 text-brandColor animate-spin mx-auto mb-6" />
                    <h2 className="text-xl font-bold text-gray-800">Loading faculty...</h2>
                </motion.div>
            </div>
        );
    }

    if (error || !member) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center bg-white p-12 rounded-3xl border border-gray-200 shadow-xl"
                >
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Faculty Member Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "The profile you're looking for doesn't exist or has been moved."}</p>
                    <Link href="/faculty" className="inline-flex items-center gap-2 px-6 py-3 bg-brandColor text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/30">
                        <ArrowLeft className="w-4 h-4" /> Back to Faculty List
                    </Link>
                </motion.div>
            </div>
        );
    }

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

    // Build dynamic stats from actual member data
    const dynamicStats = [];
    if (member.publications) {
        dynamicStats.push({ icon: BookOpen, label: "Publications", value: member.publications, color: "from-blue-500 to-cyan-400" });
    }
    if (member.yearsExperience) {
        dynamicStats.push({ icon: Calendar, label: "Years Experience", value: member.yearsExperience + "+", color: "from-blue-500 to-cyan-400" });
    }
    if (member.awards) {
        dynamicStats.push({ icon: Award, label: "Awards", value: member.awards, color: "from-blue-500 to-cyan-400" });
    }

    return (
        <div className="min-h-screen bg-gray-100 relative">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-40 -right-40 w-96 h-96 bg-brandColor/5 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"
                />
            </div>

            {/* Hero Header with Gradient */}
            <div className="relative pt-8 pb-40 px-4">
                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href="/faculty" className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-brandColor transition-all group mb-8">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to Faculty</span>
                        </Link>
                    </motion.div>

                    {/* Header Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col items-center text-center gap-6"
                    >
                        <div className="w-full max-w-4xl">
                            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-brandColor to-cyan-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brandColor/20">
                                    {member.department}
                                </span>
                                <span className="px-4 py-1.5 rounded-full bg-white text-gray-600 text-xs font-bold uppercase tracking-wider border border-gray-200 shadow-sm">
                                    {member.designation}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                                {member.name}
                            </h1>
                            {member.about && (
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed line-clamp-3">
                                    {member.about}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 px-4 pb-20 -mt-24"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">

                        {/* LEFT COLUMN - Profile Card */}
                        <motion.div variants={itemVariants} className="sticky lg:top-24 self-start">
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                {/* Profile Image */}
                                <div className="relative aspect-[4/5] group">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />

                                    {/* Floating Badge */}
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                                            <p className="text-white font-semibold text-lg">{member.name}</p>
                                            <p className="text-white/80 text-sm font-medium">{member.designation}, {member.department}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="p-6 space-y-3">
                                    <a href={`mailto:${member.email}`} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-brandColor/30 transition-all group">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Email</p>
                                            <p className="text-gray-900 font-medium truncate">{member.email}</p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-brandColor transition-colors shrink-0" />
                                    </a>

                                    {member.phone && (
                                        <a href={`tel:${member.phone}`} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-blue-500/30 transition-all group">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                <Phone className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Phone</p>
                                                <p className="text-gray-900 font-medium">{member.phone}</p>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors shrink-0" />
                                        </a>
                                    )}
                                </div>

                                {/* Social Links */}
                                <div className="px-6 pb-6">
                                    <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
                                        {member.linkedin && (
                                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 flex items-center justify-center text-gray-500 hover:text-white transition-all border border-gray-200 hover:border-transparent hover:scale-110">
                                                <Linkedin className="w-4 h-4" />
                                            </a>
                                        )}
                                        {member.facebook && (
                                            <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 flex items-center justify-center text-gray-500 hover:text-white transition-all border border-gray-200 hover:border-transparent hover:scale-110">
                                                <Facebook className="w-4 h-4" />
                                            </a>
                                        )}
                                        {member.twitter && (
                                            <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gradient-to-br hover:from-slate-700 hover:to-slate-800 flex items-center justify-center text-gray-500 hover:text-white transition-all border border-gray-200 hover:border-transparent hover:scale-110">
                                                <Twitter className="w-4 h-4" />
                                            </a>
                                        )}
                                        {(!member.linkedin && !member.facebook && !member.twitter) && (
                                            <p className="text-gray-400 text-sm">Social media links not available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT COLUMN - Details */}
                        <div className="space-y-8">

                            {/* Stats Grid - Only show if there are stats */}
                            {dynamicStats.length > 0 && (
                                <motion.div variants={itemVariants}>
                                    <div className={`grid grid-cols-2 ${dynamicStats.length >= 4 ? 'md:grid-cols-4' : dynamicStats.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                                        {dynamicStats.map((stat, index) => (
                                            <motion.div
                                                key={index}
                                                whileHover={{ scale: 1.05, y: -5 }}
                                                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-brandColor/30 transition-all group"
                                            >
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                                    <stat.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                                <p className="text-sm text-gray-500">{stat.label}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Education & Achievements Grid */}
                            <motion.div variants={itemVariants}>
                                <div className="grid md:grid-cols-1 gap-6">
                                    {/* Education */}
                                    {member.education && (
                                        <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-purple-500/30 transition-all group">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <GraduationCap className="w-5 h-5 text-white" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900">Education</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">{member.education}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Achievements */}
                                    {/* {member.achievements && (
                                        <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-amber-500/30 transition-all group">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center group-hover:scale-110 transition-transform">
                                                    <Award className="w-5 h-5 text-white" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900">Achievements</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">{member.achievements}</p>
                                            </div>
                                        </div>
                                    )} */}
                                </div>
                            </motion.div>

                            {/* About Section */}
                            {member.about && (
                                <motion.div variants={itemVariants}>
                                    <div className="bg-white rounded-xl p-8 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">About</h2>
                                        </div>
                                        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{member.about}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Years Experience */}
                            {member.yearsExperience && (
                                <motion.div variants={itemVariants}>
                                    <div className="bg-white rounded-xl p-8 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">Experience</h2>
                                        </div>
                                        <p className="text-gray-800 text-lg font-semibold">{member.yearsExperience} years</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Publications */}
                            {member.publications && (
                                <motion.div variants={itemVariants}>
                                    <div className="bg-white rounded-xl p-8 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">Publications</h2>
                                        </div>
                                        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{member.publications}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Awards */}
                            {member.awards && (
                                <motion.div variants={itemVariants}>
                                    <div className="bg-white rounded-xl p-8 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                                <Award className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">Awards & Recognition</h2>
                                        </div>
                                        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{member.awards}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Research Interests */}
                            {member.researchInterests && (
                                <motion.div variants={itemVariants}>
                                    <div className="bg-white rounded-xl p-8 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                                <Star className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">Research Interests</h2>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            {member.researchInterests.split(',').map((interest, index) => (
                                                <motion.span
                                                    key={index}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="px-4 py-2 rounded-full bg-brandColor/10 text-brandColor text-sm font-medium border border-brandColor/10 hover:border-brandColor/30 transition-all cursor-default"
                                                >
                                                    {interest.trim()}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Courses Section */}
                            {member.courses && (
                                <motion.div variants={itemVariants}>
                                    <div className="bg-white rounded-xl p-8 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                                <BookOpen className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">Courses Taught</h2>
                                        </div>

                                        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{member.courses}</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FacultyDetailsPage;
