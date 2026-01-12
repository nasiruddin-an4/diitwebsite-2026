"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, Calendar, MapPin,
    BookOpen, Award, CheckCircle2,
    Send, HelpCircle, AlertCircle,
    Camera
} from 'lucide-react';

const OnlineAdmissionForm = () => {

    const SectionHeader = ({ icon: Icon, title }) => (
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 text-brandColor">
            <div className="p-2.5 rounded-xl bg-brandColor text-white shadow-lg shadow-brandColor/20">
                <Icon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
                {title}
            </h2>
        </div>
    );

    const InputGroup = ({ label, icon: Icon, required, children }) => (
        <div className="group">
            <label className="block text-sm font-bold text-slate-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brandColor transition-colors z-10 pointer-events-none">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                {children}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Standard Header */}
            <div className="bg-[#001229] pt-28 pb-32 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-brandColor/20 to-transparent blur-3xl" />

                <div className="max-w-6xl mx-auto relative z-10 text-center">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Online <span className="text-blue-400">Admission</span> Form
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto block">
                            Spring 2026 Session • National University Affiliated
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
                <div className="grid lg:grid-cols-12 gap-8">

                    {/* Left: Main Form */}
                    <div className="lg:col-span-8 space-y-6">
                        <form className="space-y-6"> {/* Removed onSubmit for static behavior */}

                            {/* Section 1: Program */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                                <SectionHeader icon={BookOpen} title="Program Selection" />
                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputGroup label="Select Program" required>
                                        <div className="relative">
                                            <select
                                                name="program"
                                                className="w-full px-5 py-4 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="">Choose a degree path...</option>
                                                <optgroup label="Undergraduate">
                                                    <option value="CSE">B.Sc. in Computer Science & Engineering (CSE)</option>
                                                    <option value="BBA">Bachelor of Business Administration (BBA)</option>
                                                    <option value="BTHM">Bachelor of Tourism & Hospitality Management (BTHM)</option>
                                                </optgroup>
                                                <optgroup label="Postgraduate">
                                                    <option value="MBA">Master of Business Administration (MBA)</option>
                                                    <option value="MTHM">Master of Tourism & Hospitality Management (MTHM)</option>
                                                </optgroup>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                            </div>
                                        </div>
                                    </InputGroup>
                                    <InputGroup label="Session">
                                        <div className="w-full px-5 py-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-600 font-semibold flex items-center justify-between cursor-not-allowed">
                                            <span>Spring 2026</span>
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        </div>
                                    </InputGroup>
                                </div>
                            </div>

                            {/* Section 2: Personal */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                                <SectionHeader icon={User} title="Personal Information" />

                                <div className="grid md:grid-cols-12 gap-8 mb-6">
                                    {/* Photo Upload Area */}
                                    <div className="md:col-span-4">
                                        <div className="h-full min-h-[220px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center hover:border-brandColor hover:bg-blue-50/50 transition-all cursor-pointer group relative">
                                            <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <Camera className="w-8 h-8 text-slate-400 group-hover:text-brandColor" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-600 group-hover:text-brandColor">Upload Photo</span>
                                            <span className="text-xs text-slate-400 mt-2">Max 2MB (JPG/PNG)</span>
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                        </div>
                                    </div>

                                    {/* Personal Fields */}
                                    <div className="md:col-span-8 grid gap-6">
                                        <InputGroup label="Full Name" required icon={User}>
                                            <input
                                                type="text"
                                                name="fullName"
                                                placeholder="As per SSC Transcript"
                                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium"
                                            />
                                        </InputGroup>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputGroup label="Phone Number" required icon={Phone}>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    placeholder="017..."
                                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all text-slate-800 font-medium"
                                                />
                                            </InputGroup>
                                            <InputGroup label="Date of Birth" required icon={Calendar}>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all text-slate-600 font-medium"
                                                />
                                            </InputGroup>
                                        </div>
                                        <InputGroup label="Email Address" required icon={Mail}>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="student@example.com"
                                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all text-slate-800 font-medium"
                                            />
                                        </InputGroup>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Academic */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                                <SectionHeader icon={Award} title="Academic Background" />

                                <div className="space-y-6">
                                    {/* SSC Row */}
                                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="px-3 py-1 rounded-md text-xs font-bold bg-slate-800 text-white uppercase tracking-wider">SSC / O-Level</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="md:col-span-2">
                                                <input
                                                    type="text"
                                                    placeholder="School / Institute Name"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brandColor focus:ring-2 focus:ring-brandColor/10 outline-none text-slate-800 font-medium"
                                                />
                                            </div>
                                            <input
                                                type="text" name="sscGpa" placeholder="GPA (5.00)"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brandColor focus:ring-2 focus:ring-brandColor/10 outline-none text-slate-800 font-medium"
                                            />
                                            <input
                                                type="text" name="sscYear" placeholder="Passing Year"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brandColor focus:ring-2 focus:ring-brandColor/10 outline-none text-slate-800 font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* HSC Row */}
                                    <div className="p-6 rounded-2xl bg-blue-50/30 border border-blue-100">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="px-3 py-1 rounded-md text-xs font-bold bg-brandColor text-white uppercase tracking-wider">HSC / Diploma</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="md:col-span-2">
                                                <input
                                                    type="text"
                                                    placeholder="College / Institute Name"
                                                    className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-brandColor focus:ring-2 focus:ring-brandColor/10 outline-none text-slate-800 font-medium bg-white"
                                                />
                                            </div>
                                            <input
                                                type="text" name="hscGpa" placeholder="GPA (5.00)"
                                                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-brandColor focus:ring-2 focus:ring-brandColor/10 outline-none text-slate-800 font-medium bg-white"
                                            />
                                            <input
                                                type="text" name="hscYear" placeholder="Passing Year"
                                                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-brandColor focus:ring-2 focus:ring-brandColor/10 outline-none text-slate-800 font-medium bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Contact */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                                <SectionHeader icon={MapPin} title="Address & Guardian" />
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <InputGroup label="Present Address" required>
                                            <textarea
                                                name="presentAddress" rows="3"
                                                className="w-full px-5 py-4 rounded-xl border border-slate-300 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all text-slate-800 font-medium resize-none"
                                            ></textarea>
                                        </InputGroup>
                                    </div>
                                    <InputGroup label="Guardian Name" required>
                                        <input
                                            type="text" name="guardianName"
                                            className="w-full px-5 py-4 rounded-xl border border-slate-300 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all text-slate-800 font-medium"
                                        />
                                    </InputGroup>
                                    <InputGroup label="Guardian Phone" required>
                                        <input
                                            type="tel" name="guardianPhone"
                                            className="w-full px-5 py-4 rounded-xl border border-slate-300 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all text-slate-800 font-medium"
                                        />
                                    </InputGroup>
                                </div>
                            </div>

                            {/* Section 5: Payment & Terms */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                                <SectionHeader icon={AlertCircle} title="Payment & Conditions" />

                                {/* Payment Card */}
                                <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden shadow-lg shadow-pink-500/20">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div>
                                            <p className="text-pink-100 font-semibold mb-1 uppercase tracking-wider text-sm">Application Fee</p>
                                            <h3 className="text-4xl md:text-5xl font-bold">BDT 16,000</h3>
                                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                                <div className="bg-white/20 backdrop-blur-md py-2 px-4 rounded-lg">
                                                    <span className="text-sm font-medium opacity-90 block">bKash Merchant</span>
                                                    <span className="font-mono text-xl tracking-wide font-bold">01708484344</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl shadow-xl transform rotate-3">
                                            {/* Text Logo */}
                                            <div className="text-pink-600 font-extrabold text-3xl tracking-tighter">bKash</div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-pink-50 mt-6 font-medium max-w-lg leading-relaxed">
                                        * Please make the payment to the Merchant Number above. Keep your Transaction ID ready if required during the interview process.
                                    </p>
                                </div>

                                {/* Terms List */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        Preliminary Admission Conditions
                                    </h4>
                                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 h-64 overflow-y-auto custom-scrollbar">
                                        <ul className="space-y-4 text-sm text-slate-600 list-disc pl-4 leading-relaxed font-medium">
                                            <li>If National University conducts a centralized admission test, the student <strong className="text-slate-900">must pass</strong> it.</li>
                                            <li>The Institute will provide necessary assistance regarding preparation for the admission test.</li>
                                            <li>
                                                <strong className="text-slate-900">Refund Policy:</strong> For candidates who fail the admission test or do not appear on the merit list, the entire collected amount will be refunded (subject to conditions) within the timeframe determined by National University.
                                            </li>
                                            <li>Students must strictly adhere to all rules and regulations of the Institute.</li>
                                            <li>
                                                <strong className="text-slate-900">Result Coordination:</strong> If HSC results are coordinated/changed and the student subsequently fails to meet National University's criteria, their admission will be cancelled. The authority will not be held responsible.
                                            </li>
                                            <li>If National University imposes any new conditions regarding admission, students must accept them unconditionally.</li>
                                            <li>The decision of the National University authority regarding admission is final.</li>
                                            <li>
                                                If a student fails to secure a place in the National University Merit List, the admission fee will be refunded after deducting the form fee cost.
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Agreement Checkbox */}
                                <div className="flex items-start gap-4 p-5 bg-blue-50/50 rounded-xl border border-blue-100 hover:border-brandColor/30 transition-colors cursor-pointer group">
                                    <div className="pt-1">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="w-5 h-5 rounded border-slate-300 text-brandColor focus:ring-brandColor cursor-pointer"
                                        />
                                    </div>
                                    <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer select-none leading-relaxed group-hover:text-slate-900 transition-colors">
                                        I have read the payment instructions and I agree to the <span className="font-bold text-slate-900">Preliminary Admission Conditions</span> stated above. I understand that my admission is subject to these terms.
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end pt-4">
                                <button
                                    type="button" // visual only
                                    className="px-10 py-4 rounded-xl font-bold text-lg text-white shadow-xl shadow-blue-900/20 flex items-center gap-3 bg-brandColor hover:bg-blue-800 hover:-translate-y-1 transition-all active:scale-95"
                                >
                                    Submit Application
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* Right: Sticky Sidebar (Static Help info) */}
                    <div className="lg:col-span-4 pl-0 lg:pl-4 hidden lg:block">
                        <div className="sticky top-[120px] space-y-6">
                            {/* Need Help Card */}
                            <div className="bg-gradient-to-br from-brandColor to-blue-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                                        <HelpCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-2xl mb-2">Need Help?</h3>
                                    <p className="text-blue-200 text-sm mb-6 leading-relaxed">
                                        Our Admission Office is here to guide you through the process.
                                    </p>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                            <Phone className="w-5 h-5 text-blue-300" />
                                            <span className="font-bold">01713-493187</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                            <Mail className="w-5 h-5 text-blue-300" />
                                            <span className="font-medium">admission@diit.edu.bd</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -ml-16 -mb-16" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OnlineAdmissionForm;
