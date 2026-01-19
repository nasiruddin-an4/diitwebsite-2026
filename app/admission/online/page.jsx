"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, Calendar, MapPin,
    BookOpen, Award, CheckCircle2,
    Send, HelpCircle, AlertCircle,
    Camera, Loader2, X
} from 'lucide-react';
import Swal from 'sweetalert2';
import { uploadFile } from '@/lib/upload-utils';

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


const OnlineAdmissionForm = () => {
    const [photoUrl, setPhotoUrl] = useState("");
    const [paymentScreenshot, setPaymentScreenshot] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isPaymentUploading, setIsPaymentUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        program: "",
        fullName: "",
        phone: "",
        dob: "",
        email: "",
        sscInstitute: "",
        sscGpa: "",
        sscYear: "",
        hscInstitute: "",
        hscGpa: "",
        hscYear: "",
        presentAddress: "",
        guardianName: "",
        guardianPhone: "",
        transactionId: "",
        session: "Session 2025-26",
        agreeToTerms: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            Swal.fire({ icon: 'error', title: 'Invalid File', text: 'Please upload an image file.' });
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            Swal.fire({ icon: 'error', title: 'File Too Large', text: 'Photo must be less than 2MB.' });
            return;
        }

        setIsUploading(true);
        try {
            const result = await uploadFile(file, "admissions");
            if (result.success) {
                setPhotoUrl(result.url);
                Swal.fire({ icon: 'success', title: 'Photo Uploaded', text: 'Your photo has been uploaded successfully.', toast: true, position: 'top-end', timer: 3000 });
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error("Admission photo upload error:", error);
            Swal.fire({ icon: 'error', title: 'Upload Failed', text: error.message || 'Could not upload photo' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleScreenshotUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            Swal.fire({ icon: 'error', title: 'File Too Large', text: 'Screenshot must be less than 2MB.' });
            return;
        }

        setIsPaymentUploading(true);
        try {
            const result = await uploadFile(file, "payments");
            if (result.success) {
                setPaymentScreenshot(result.url);
                Swal.fire({ icon: 'success', title: 'Screenshot Uploaded', text: 'Payment verification image saved.', toast: true, position: 'top-end', timer: 3000 });
            }
        } catch (error) {
            console.error("Payment upload error:", error);
            Swal.fire({ icon: 'error', title: 'Upload Failed', text: 'Could not upload payment screenshot' });
        } finally {
            setIsPaymentUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!photoUrl) {
            Swal.fire({ icon: 'warning', title: 'Photo Required', text: 'Please upload your photo before submitting.' });
            return;
        }

        if (!formData.agreeToTerms) {
            Swal.fire({ icon: 'warning', title: 'Agreement Required', text: 'You must agree to the admission conditions.' });
            return;
        }

        // Check required fields (manually since we use custom input groups)
        const requiredFields = [
            'program', 'fullName', 'phone', 'dob', 'email',
            'sscInstitute', 'sscGpa', 'sscYear',
            'hscInstitute', 'hscGpa', 'hscYear',
            'presentAddress', 'guardianName', 'guardianPhone',
            'transactionId', 'session'
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                Swal.fire({ icon: 'warning', title: 'Missing Info', text: `Please fill in all required fields.` });
                return;
            }
        }

        if (!paymentScreenshot) {
            Swal.fire({ icon: 'warning', title: 'Payment Required', text: 'Please upload a screenshot of your payment.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admission/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    photoUrl,
                    paymentScreenshot
                })
            });

            const result = await res.json();

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Application Submitted!',
                    text: 'Your application has been received. We will contact you soon.',
                    confirmButtonColor: '#002652'
                }).then(() => {
                    window.location.reload(); // Reset form
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: result.message || 'Something went wrong.'
                });
            }
        } catch (error) {
            console.error("Submission error:", error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Could not connect to the server.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Standard Header */}
            <div className="bg-[#001229] pt-28 pb-32 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="absolute right-0 top-0 w-1/2 h-full bg-linear-to-l from-brandColor/20 to-transparent blur-3xl" />

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
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Section 1: Program */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                                <SectionHeader icon={BookOpen} title="Program Selection" />
                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputGroup label="Select Program" required>
                                        <div className="relative">
                                            <select
                                                name="program"
                                                value={formData.program}
                                                onChange={handleInputChange}
                                                required
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
                                    <InputGroup label="Session" required>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="session"
                                                value={formData.session}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., Spring 2026"
                                                className="w-full px-5 py-4 rounded-xl border border-slate-300 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all font-semibold text-slate-700"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <Calendar className="w-5 h-5 text-slate-400 group-focus-within:text-brandColor" />
                                            </div>
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
                                        <div className={`h-full min-h-[220px] bg-slate-50 rounded-2xl border-2 border-dashed ${photoUrl ? 'border-brandColor' : 'border-slate-300'} flex flex-col items-center justify-center p-6 text-center hover:border-brandColor hover:bg-blue-50/50 transition-all cursor-pointer group relative overflow-hidden`}>
                                            {isUploading ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 className="w-10 h-10 text-brandColor animate-spin" />
                                                    <span className="text-sm font-bold text-brandColor">Uploading...</span>
                                                </div>
                                            ) : photoUrl ? (
                                                <div className="relative w-full h-full group/image">
                                                    <img src={photoUrl} alt="Applicant" className="w-full h-full object-contain rounded-xl" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                                        <Camera className="w-10 h-10 mb-2" />
                                                        <span className="text-xs font-bold uppercase tracking-wider">Change Photo</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPhotoUrl("");
                                                        }}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors z-20"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                        <Camera className="w-8 h-8 text-slate-400 group-hover:text-brandColor" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-600 group-hover:text-brandColor">Upload Photo</span>
                                                    <span className="text-xs text-slate-400 mt-2">Max 2MB (JPG/PNG)</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                accept="image/*"
                                                onChange={handlePhotoUpload}
                                                disabled={isUploading}
                                            />
                                        </div>
                                    </div>


                                    {/* Personal Fields */}
                                    <div className="md:col-span-8 grid gap-6">
                                        <InputGroup label="Full Name" required icon={User}>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="As per SSC Transcript"
                                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium"
                                            />
                                        </InputGroup>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputGroup label="Phone Number" required icon={Phone}>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="017..."
                                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all text-slate-800 font-medium"
                                                />
                                            </InputGroup>
                                            <InputGroup label="Date of Birth" required icon={Calendar}>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    value={formData.dob}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all text-slate-600 font-medium"
                                                />
                                            </InputGroup>
                                        </div>
                                        <InputGroup label="Email Address" required icon={Mail}>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
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
                                                    name="sscInstitute"
                                                    value={formData.sscInstitute}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="School / Institute Name"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brandColor focus:ring-2 focus:ring-brandColor/10 outline-none text-slate-800 font-medium"
                                                />
                                            </div>
                                            <input
                                                type="text" name="sscGpa" placeholder="GPA (5.00)"
                                                value={formData.sscGpa}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brandColor focus:ring-2 focus:ring-brandColor/10 outline-none text-slate-800 font-medium"
                                            />
                                            <input
                                                type="text" name="sscYear" placeholder="Passing Year"
                                                value={formData.sscYear}
                                                onChange={handleInputChange}
                                                required
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
                                                    name="hscInstitute"
                                                    value={formData.hscInstitute}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="College / Institute Name"
                                                    className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-brandColor focus:ring-2 focus:ring-brandColor/10 outline-none text-slate-800 font-medium bg-white"
                                                />
                                            </div>
                                            <input
                                                type="text" name="hscGpa" placeholder="GPA (5.00)"
                                                value={formData.hscGpa}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-brandColor focus:ring-2 focus:ring-brandColor/10 outline-none text-slate-800 font-medium bg-white"
                                            />
                                            <input
                                                type="text" name="hscYear" placeholder="Passing Year"
                                                value={formData.hscYear}
                                                onChange={handleInputChange}
                                                required
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
                                                name="presentAddress"
                                                value={formData.presentAddress}
                                                onChange={handleInputChange}
                                                required
                                                rows="3"
                                                className="w-full px-5 py-4 rounded-xl border border-slate-300 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all text-slate-800 font-medium resize-none"
                                            ></textarea>
                                        </InputGroup>
                                    </div>
                                    <InputGroup label="Guardian Name" required>
                                        <input
                                            type="text"
                                            name="guardianName"
                                            value={formData.guardianName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-4 rounded-xl border border-slate-300 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all text-slate-800 font-medium"
                                        />
                                    </InputGroup>
                                    <InputGroup label="Guardian Phone" required>
                                        <input
                                            type="tel"
                                            name="guardianPhone"
                                            value={formData.guardianPhone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-5 py-4 rounded-xl border border-slate-300 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all text-slate-800 font-medium"
                                        />
                                    </InputGroup>
                                </div>
                            </div>

                            {/* Section 5: Payment & Terms */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                                <SectionHeader icon={AlertCircle} title="Payment & Conditions" />

                                {/* Payment Card */}
                                <div className="bg-linear-to-r from-pink-600 to-rose-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden shadow-lg shadow-pink-500/20">
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

                                {/* Payment Verification Fields */}
                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <InputGroup label="Transaction ID" icon={CheckCircle2} required>
                                        <input
                                            type="text"
                                            name="transactionId"
                                            value={formData.transactionId}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Enter bKash TrxID"
                                            className="w-full px-5 py-4 pl-12 rounded-xl border border-slate-300 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 outline-none transition-all font-mono"
                                        />
                                    </InputGroup>

                                    <InputGroup label="Payment Screenshot" icon={Camera} required>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleScreenshotUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                            />
                                            <div className={`w-full px-5 py-4 pl-12 rounded-xl border-2 border-dashed transition-all flex items-center justify-between ${paymentScreenshot ? 'bg-green-50 border-green-300' : 'bg-slate-50 border-slate-300'}`}>
                                                <span className={`text-sm font-medium ${paymentScreenshot ? 'text-green-700' : 'text-slate-500'}`}>
                                                    {isPaymentUploading ? 'Uploading...' : paymentScreenshot ? 'Screenshot Uploaded!' : 'Upload Screenshot'}
                                                </span>
                                                {paymentScreenshot && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                                {!paymentScreenshot && !isPaymentUploading && <div className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600 font-bold uppercase">Browse</div>}
                                            </div>
                                        </div>
                                    </InputGroup>
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
                                            name="agreeToTerms"
                                            checked={formData.agreeToTerms}
                                            onChange={handleInputChange}
                                            required
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
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-10 py-4 rounded-xl font-bold text-lg text-white shadow-xl shadow-blue-900/20 flex items-center gap-3 bg-brandColor hover:bg-blue-800 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Application'}
                                    {!isSubmitting && <Send className="w-5 h-5" />}
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* Right: Sticky Sidebar (Static Help info) */}
                    <div className="lg:col-span-4 pl-0 lg:pl-4 hidden lg:block">
                        <div className="sticky top-[120px] space-y-6">
                            {/* Need Help Card */}
                            <div className="bg-linear-to-br from-brandColor to-blue-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
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
                                            <span className="font-bold">+880 1713-493287</span>
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
