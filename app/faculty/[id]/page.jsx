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
    MapPin,
    Briefcase,
    FileText,
    ExternalLink,
    Quote,
    Users,
    Star,
    Globe,
    ChevronRight,
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10"
                >
                    <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-6" />
                    <h2 className="text-xl font-bold text-white">Loading faculty...</h2>
                </motion.div>
            </div>
        );
    }

    if (error || !member) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10"
                >
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-10 h-10 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Faculty Member Not Found</h2>
                    <p className="text-slate-400 mb-6">{error || "The profile you're looking for doesn't exist or has been moved."}</p>
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

    // Stats data
    const stats = [
        { icon: BookOpen, label: "Publications", value: "15+", color: "from-blue-500 to-cyan-400" },
        { icon: Users, label: "Students Mentored", value: "200+", color: "from-purple-500 to-pink-400" },
        { icon: Award, label: "Awards", value: "5", color: "from-amber-500 to-orange-400" },
        { icon: Calendar, label: "Years Experience", value: "10+", color: "from-emerald-500 to-teal-400" }
    ];

    // Research interests
    const researchInterests = [
        "Artificial Intelligence & Machine Learning",
        "Data Science & Analytics",
        "Software Engineering",
        "Cloud Computing",
        "Educational Technology"
    ];

    // Courses taught
    const courses = [
        { code: "CSE-301", name: "Data Structures", semester: "Fall 2024" },
        { code: "CSE-405", name: "Machine Learning", semester: "Spring 2025" },
        { code: "CSE-201", name: "Object Oriented Programming", semester: "Fall 2024" }
    ];

    return (
        <div className="min-h-screen bg-slate-950 relative">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjMzM0MTU1IiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvZz48L3N2Zz4=')] opacity-20" />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-brandColor/30 to-cyan-500/20 rounded-full blur-3xl"
                />
                <motion.div 
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -90, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-600/20 to-pink-500/10 rounded-full blur-3xl"
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
                        <Link href="/faculty" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all group mb-8">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to Faculty</span>
                        </Link>
                    </motion.div>

                    {/* Header Content */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col md:flex-row items-start gap-6"
                    >
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-brandColor to-cyan-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brandColor/20">
                                    {member.department}
                                </span>
                                <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-slate-300 text-xs font-bold uppercase tracking-wider border border-white/10">
                                    {member.designation}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                {member.name}
                            </h1>
                            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                                Dedicated educator and researcher at DIIT, committed to fostering innovation and excellence in students.
                            </p>
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
                            <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-black/20">
                                {/* Profile Image */}
                                <div className="relative aspect-[4/5] group">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                                    
                                    {/* Floating Badge */}
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                                            <p className="text-white font-semibold text-lg">{member.name}</p>
                                            <p className="text-cyan-400 text-sm font-medium">{member.designation}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="p-6 space-y-3">
                                    <a href={`mailto:${member.email}`} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all group">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Email</p>
                                            <p className="text-white font-medium truncate">{member.email}</p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                                    </a>

                                    {member.phone && (
                                        <a href={`tel:${member.phone}`} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                                <Phone className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Phone</p>
                                                <p className="text-white font-medium">{member.phone}</p>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                                        </a>
                                    )}

                                    <a href="#" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 transition-all group">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Office</p>
                                            <p className="text-white font-medium">Building A, Room 405</p>
                                        </div>
                                    </a>
                                </div>

                                {/* Social Links */}
                                <div className="px-6 pb-6">
                                    <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10">
                                        {member.linkedin && (
                                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/10 hover:border-transparent hover:scale-110">
                                                <Linkedin className="w-4 h-4" />
                                            </a>
                                        )}
                                        {member.facebook && (
                                            <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/10 hover:border-transparent hover:scale-110">
                                                <Facebook className="w-4 h-4" />
                                            </a>
                                        )}
                                        {member.twitter && (
                                            <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-slate-700 hover:to-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/10 hover:border-transparent hover:scale-110">
                                                <Twitter className="w-4 h-4" />
                                            </a>
                                        )}
                                        {(!member.linkedin && !member.facebook && !member.twitter) && (
                                            <p className="text-slate-500 text-sm">Social media links not available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT COLUMN - Details */}
                        <div className="space-y-8">
                            
                            {/* Stats Grid */}
                            <motion.div variants={itemVariants}>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {stats.map((stat, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all group"
                                        >
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                                <stat.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                                            <p className="text-sm text-slate-400">{stat.label}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* About Section */}
                            <motion.div variants={itemVariants}>
                                <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 overflow-hidden relative">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-brandColor/20 to-cyan-500/10 rounded-full blur-3xl" />
                                    
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brandColor to-cyan-500 flex items-center justify-center shadow-lg shadow-brandColor/20">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">About</h2>
                                    </div>

                                    <div className="space-y-4 text-slate-300 leading-relaxed relative z-10">
                                        <p>
                                            {member.name} is a distinguished {member.designation} in the Department of {member.department} at Daffodil Institute of IT (DIIT). With a passion for teaching and research, they have been instrumental in shaping the academic landscape of the institution.
                                        </p>
                                        <p>
                                            Their dedication to student success, combined with extensive industry experience, makes them a valuable mentor for aspiring professionals. They actively contribute to curriculum development and maintain strong industry connections to ensure students receive practical, relevant education.
                                        </p>
                                    </div>

                                    {/* Quote */}
                                    <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-brandColor/10 to-cyan-500/10 border border-brandColor/20 relative">
                                        <Quote className="w-8 h-8 text-brandColor/30 absolute top-3 left-3" />
                                        <p className="text-slate-300 italic pl-10 text-lg">
                                            "Education is not the filling of a pail, but the lighting of a fire."
                                        </p>
                                        <p className="text-cyan-400 text-sm mt-2 pl-10 font-medium">— Teaching Philosophy</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Education & Achievements Grid */}
                            <motion.div variants={itemVariants}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Education */}
                                    {member.education && (
                                        <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-all group">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                                                    <GraduationCap className="w-5 h-5 text-white" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white">Education</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-white whitespace-pre-wrap text-sm leading-relaxed">{member.education}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Achievements */}
                                    {member.achievements && (
                                        <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-amber-500/30 transition-all group">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                                                    <Award className="w-5 h-5 text-white" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white">Achievements</h3>
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-white whitespace-pre-wrap text-sm leading-relaxed">{member.achievements}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* About Section */}
                            {member.about && (
                                <motion.div variants={itemVariants}>
                                    <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-white">About</h2>
                                        </div>
                                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{member.about}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Years Experience */}
                            {member.yearsExperience && (
                                <motion.div variants={itemVariants}>
                                    <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                                <Calendar className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-white">Experience</h2>
                                        </div>
                                        <p className="text-white text-lg font-semibold">{member.yearsExperience} years</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Publications */}
                            {member.publications && (
                                <motion.div variants={itemVariants}>
                                    <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                                <FileText className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-white">Publications</h2>
                                        </div>
                                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{member.publications}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Awards */}
                            {member.awards && (
                                <motion.div variants={itemVariants}>
                                    <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                                                <Award className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-white">Awards & Recognition</h2>
                                        </div>
                                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{member.awards}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Research Interests */}
                            {member.researchInterests && (
                                <motion.div variants={itemVariants}>
                                    <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                                <Star className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-white">Research Interests</h2>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            {member.researchInterests.split(',').map((interest, index) => (
                                                <motion.span
                                                    key={index}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="px-4 py-2 rounded-full bg-gradient-to-r from-brandColor/20 to-cyan-500/20 text-cyan-300 text-sm font-medium border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-default"
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
                                    <div className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                                <BookOpen className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-white">Courses Taught</h2>
                                        </div>

                                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{member.courses}</p>
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
