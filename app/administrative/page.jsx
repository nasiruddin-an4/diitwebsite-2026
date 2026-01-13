"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    Crown,
    Star,
    Users,
    Linkedin,
    Facebook,
    Globe,
    User
} from 'lucide-react';

const AdministrativePage = () => {

    const governingBody = [
        {
            name: "Dr. Md. Sabur Khan",
            designation: "Founder DIIT & Hon’ble Chairman, Daffodil Family",
            image: "https://i.postimg.cc/y8p7nmBF/12-1-1-0-jpg.png",
            email: "chairman@daffodil.family",
            phone: "+880 1711 000000",
            linkedin: "#",
            facebook: "#"
        },
        {
            name: "Professor Al Amin",
            designation: "Hon’ble Chairman, Governing Body (DIIT)",
            image: "https://i.postimg.cc/L8QmvtRL/Al-Amin-Sir-Fhj-MVKK.png",
            email: "chairman.gb@diit.edu.bd",
            linkedin: "#"
        },
        {
            name: "Dr. Mohammad Nuruzzaman",
            designation: "Hon’ble CEO, Daffodil Family",
            image: "https://i.postimg.cc/Mp3zt7xM/CEO-Sir-Update-jpg.png",
            email: "ceo@daffodil.family",
            linkedin: "#"
        },
        {
            name: "Professor Dr. Mostafa Kamal",
            designation: "Hon’ble Adviser, DIIT",
            image: "https://i.postimg.cc/sgH3KYy1/Professor-Dr-Mostafa-Kamal-jpg.png",
            email: "adviser@diit.edu.bd",
            linkedin: "#"
        },
        {
            name: "Prof. Dr. Mohammed Shakhawat Hossain",
            designation: "Principal",
            image: "https://i.postimg.cc/QddXp4L1/principal-jpg.png",
            email: "principal@diit.edu.bd",
            phone: "+880 1234 567890",
            linkedin: "#",
            facebook: "#"
        }
    ];

    const administrationStaff = [
        { name: "Mahbubur Rahman", designation: "Assistant Director", image: "https://i.postimg.cc/mkWLCT4w/Mahbubur-Rahman.jpg", email: "mahbubur@diit.edu.bd", phone: "+880 1XXXXX" },
        { name: "K.M. Maniruzzaman (Soyeb)", designation: "Assistant Director, Documents", image: "https://i.postimg.cc/Df1yF4Qj/K-M-Maniruzzaman-(Soyeb).png", email: "soyeb@diit.edu.bd", phone: "+880 1XXXXX" },
        { name: "Iva Rani Das", designation: "Assistant Director, Documents", image: "https://i.postimg.cc/7hrH0q4s/Iva-Rani-Das.jpg", email: "iva@diit.edu.bd", phone: "+880 1XXXXX" },
        { name: "Md. Ruqunuzzaman", designation: "Senior Officer, IT", image: "https://i.postimg.cc/vT7QvCHH/Md-Ruqunuzzaman.png", email: "ruqunuzzaman@diit.edu.bd", phone: "+880 1XXXXX" },
        { name: "Md. Zakir Hossain Molla", designation: "Senior Officer, Accounts", image: "https://placehold.co/400x500/1e293b/cbd5e1?text=Zakir+Hossain", email: "zakir@diit.edu.bd", phone: "+880 1XXXXX" },
        { name: "Parveen Akter", designation: "Senior Officer (Librarian)", image: "https://i.postimg.cc/VLRf0yVB/Parveen-Akter.png", email: "parveen@diit.edu.bd", phone: "+880 1XXXXX" },
        { name: "Mokarram Hosen", designation: "Senior Officer, Counselor", image: "https://i.postimg.cc/pXxVdVqm/Mokarram-Hosen.png", email: "mokarram@diit.edu.bd", phone: "+880 1XXXXX" },
        { name: "Md. Abul Kalam (Shamim)", designation: "Officer, Administration", image: "https://i.postimg.cc/fTZWbWBR/Md-Abul-Kalam-(Shamim).png", email: "kalam@diit.edu.bd", phone: "+880 1XXXXX" },
        { name: "Md. Rasel", designation: "Officer, Accounts", image: "https://i.postimg.cc/MKxZGZd6/Md-Rasel.jpg", email: "rasel@diit.edu.bd", phone: "+880 1XXXXX" },
        { name: "Md. Ruhul Amin", designation: "Officer, Counselor", image: "https://i.postimg.cc/sDyf2fwD/Md-Ruhul-Amin.jpg", email: "ruhul@diit.edu.bd", phone: "+880 1XXXXX" },
        { name: "Mehajabine Ratry", designation: "Officer, Counselor", image: "https://i.postimg.cc/DyFfzfB8/Mehajabine-Ratry.png", email: "ratry@diit.edu.bd", phone: "+880 1XXXXX" },
        { name: "Md. Anwarul Islam", designation: "Assistant Officer", image: "https://i.postimg.cc/gc3kdLq0/Md-Anwarul-Islam.png", email: "anwarul@diit.edu.bd", phone: "+880 1XXXXX" },
        { name: "Md. Sk. Omor", designation: "Assistant Officer (Creative & Promotion)", image: "https://i.postimg.cc/8kLPDfBs/Md-Sk-Omor.png", email: "omor@diit.edu.bd", phone: "+880 1XXXXX" },
        { name: "Tahmid Ahmed Fardin", designation: "Assistant Officer (Creative & Promotion)", image: "https://i.postimg.cc/dQGtvZms/Tahmid-Ahmed-Fardin.png", email: "tahmid@diit.edu.bd", phone: "+880 1XXXXX" },
        { name: "Md. Shah Alam", designation: "Senior office Assistant", image: "https://i.postimg.cc/gjbz8GdW/Md-Shah-Alam.jpg", email: "alam@diit.edu.bd", phone: "+880 1XXXXX" },
        { name: "Md: Abu jafor", designation: "Lab Assistant", image: "https://i.postimg.cc/9XyFVwtj/Md-Abu-jafor.png", email: "jafor@diit.edu.bd", phone: "+880 1XXXXX" }
    ];

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

            {/* Governing Body Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 px-4"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div variants={itemVariants} className="text-center mb-16">
                    </motion.div>

                    {/* Chairman Section - Featured */}
                    {governingBody.length > 0 && (
                        <div className="mb-16">
                            <motion.div
                                variants={itemVariants}
                                className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-10 items-center md:items-start relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -z-10 transition-all group-hover:bg-blue-100/80" />

                                {/* Chairman Image */}
                                <div className="w-full md:w-80 shrink-0">
                                    <div className="block relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                                        <img
                                            src={governingBody[0].image}
                                            alt={governingBody[0].name}
                                            className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
                                    </div>
                                </div>

                                {/* Chairman Info */}
                                <div className="flex-1 text-center md:text-left py-4">
                                    <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200">
                                        Leadership
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                                        {governingBody[0].name}
                                    </h2>
                                    <p className="text-xl text-slate-500 font-medium mb-6">{governingBody[0].designation}</p>

                                    <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-8 mx-auto md:mx-0" />

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                        {governingBody[0].email && (
                                            <a href={`mailto:${governingBody[0].email}`} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all text-slate-600 hover:text-blue-600 font-medium group/btn">
                                                <Mail className="w-4 h-4 text-slate-400 group-hover/btn:text-blue-600 transition-colors" />
                                                <span className="hidden sm:inline">{governingBody[0].email}</span>
                                                <span className="sm:hidden">Email</span>
                                            </a>
                                        )}
                                        {governingBody[0].linkedin && (
                                            <a href={governingBody[0].linkedin} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600/10 text-blue-700 font-bold hover:bg-blue-600 hover:text-white transition-all">
                                                <Linkedin className="w-4 h-4" /> LinkedIn Profile
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Rest of the Governing Body */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {governingBody.slice(1).map((member, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group bg-transparent"
                            >
                                {/* Image Card */}
                                <div className="block relative mb-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 group-hover:shadow-xl group-hover:ring-blue-600/20 transition-all duration-300 aspect-[3/4]">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                    />
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

            {/* Academic Administration Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 px-4 pb-24 bg-white/50 py-20"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div variants={itemVariants} className="mb-16 text-center">
                        <span className="px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-3 inline-block">Our Team</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Academic Administration</h2>
                        <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Meet the dedicated support staff who ensure smooth operations and student success at DIIT.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {administrationStaff.map((staff, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group bg-transparent"
                            >
                                {/* Image Card */}
                                <div className="block relative mb-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 group-hover:shadow-xl group-hover:ring-blue-600/20 transition-all duration-300 aspect-[3/4]">
                                    {staff.image && !staff.image.includes('placeholder') ? (
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
        </div>
    );
};

export default AdministrativePage;
