"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Linkedin,
  Mail,
  Phone,
  User,
  Sparkles,
  Facebook,
  Instagram,
  Globe,
  Crown,
  Briefcase,
  Building,
  Loader2
} from 'lucide-react';

const AdministrativeDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/academics/administrative/${params.id}`);
        const result = await res.json();
        if (result.success) {
          setMember(result.data);
        } else {
          setError(result.message || "Failed to fetch member details");
        }
      } catch (err) {
        console.error("Error fetching member:", err);
        setError("Failed to load member details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMember();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-100 rounded-full animate-spin border-t-brandColor" />
          <Crown className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brandColor animate-pulse" />
        </div>
        <p className="text-slate-500 font-medium animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <User className="w-24 h-24 text-slate-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Member Not Found</h2>
          <p className="text-slate-500 mb-6">{error || "The requested profile could not be found."}</p>
          <Link
            href="/administrative"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brandColor text-white rounded-xl font-semibold hover:bg-brandColor/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Administration
          </Link>
        </div>
      </div>
    );
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "Chairman":
        return "from-slate-900 to-brandColor";
      case "Governing Body":
        return "from-brandColor to-blue-600";
      case "Administrative":
      case "Academic Administration":
        return "from-blue-900 to-brandColor";
      default:
        return "from-brandColor to-green-600";
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "Chairman":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "Governing Body":
        return "bg-blue-900 text-gray-100 border-blue-200";
      case "Administrative":
      case "Academic Administration":
        return "bg-blue-900 text-gray-100 border-blue-200";
      default:
        return "bg-brandColor/10 text-brandColor border-brandColor/20";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Section with Background */}
      <div className={`relative bg-gradient-to-br ${getTypeColor(member.type)} pt-28 pb-44 overflow-hidden`}>
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-0 left-[20%] w-[400px] h-[400px] bg-black/10 rounded-full blur-[100px]"
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
        </div>

        {/* Back Button */}
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/administrative"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Administration
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 -mt-36 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">

          {/* Left Column: Sticky Profile Card */}
          <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-32">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-6 shadow-2xl shadow-slate-200/50 relative overflow-hidden border border-slate-100"
            >
              {/* Badge Overlay */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-brandColor/5 to-transparent" />

              <div className="relative">
                {/* Profile Image */}
                <div className="aspect-4/5 rounded-2xl overflow-hidden bg-slate-100 shadow-xl mb-6 ring-4 ring-white relative group">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                      <User className="w-32 h-32 text-slate-200" />
                    </div>
                  )}
                </div>

                {/* Name & Title (Mobile & Tablet visible) */}
                <div className="mb-6 lg:hidden text-center">
                  <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                    {member.name}
                  </h1>
                  <p className="text-lg font-bold text-brandColor">
                    {member.designation}
                  </p>
                </div>

                {/* Social Actions */}
                <div className="flex flex-col gap-3">
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-brandColor hover:text-white transition-all group border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/30 transition-all">
                        <Mail className="w-5 h-5 text-brandColor group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Email Address</p>
                        <p className="text-sm font-bold truncate">{member.email}</p>
                      </div>
                    </a>
                  )}

                  {member.phone && (
                    <a href={`tel:${member.phone}`} className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 hover:bg-green-600 hover:text-white transition-all group border border-green-100">
                      <div className="w-10 h-10 rounded-xl bg-white border border-green-200 flex items-center justify-center group-hover:bg-white/20 group-hover:border-white/30 transition-all">
                        <Phone className="w-5 h-5 text-green-600 group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] uppercase font-bold text-green-400">Contact Number</p>
                        <p className="text-sm font-bold">{member.phone}</p>
                      </div>
                    </a>
                  )}

                  {/* Quick Social Icons Row */}
                  <div className="flex justify-between gap-2 mt-2">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center p-3 rounded-xl bg-[#0077B5]/5 text-[#0077B5] hover:bg-[#0077B5] hover:text-white transition-all border border-[#0077B5]/10">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.facebook && (
                      <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center p-3 rounded-xl bg-[#1877F2]/5 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all border border-[#1877F2]/10">
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {member.instagram && (
                      <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center p-3 rounded-xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all border border-green-100">
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Scrollable Information */}
          <div className="flex-1 space-y-8 pt-4">
            {/* Header: Name & Designation (Desktop only) */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block mb-10"
            >
              <h1 className="text-6xl font-black text-white mb-2 tracking-tight drop-shadow-sm">
                {member.name}
              </h1>
              <div className="flex items-center text-2xl font-semibold text-white/90">
                <p>{member.designation}</p>,
                <span className='ml-2'>{member.type}</span>
              </div>
            </motion.div>

            {/* Content Sections */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-12"
            >
              {/* Message / About DIIT Section */}
              <div className="bg-white rounded-3xl p-10 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-24 bg-brandColor/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-10 flex items-center gap-3 relative z-10">
                  <span className="w-2 h-10 bg-brandColor rounded-full" />
                  Leadership Message
                </h2>

                <div className="relative z-10">
                  <p className="text-xl md:text-2xl text-slate-600 leading-relaxed italic border-l-4 border-green-400 pl-10 py-2">
                    {member.message || (
                      <>
                        <strong className="text-slate-800">DIIT</strong> is committed to delivering quality education
                        and producing skilled graduates who can compete in the global job market. Our dedicated
                        administration works tirelessly to ensure a world-class learning environment for all students.
                      </>
                    )}
                  </p>
                  <div className="mt-12 flex items-center gap-5 py-8 border-t border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-brandColor/5 flex items-center justify-center">
                      <User className="w-6 h-6 text-brandColor" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Official Statement</p>
                      <p className="text-base font-bold text-slate-700">Vision & Mission • DIIT Administration</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section (if available) */}
              {member.bio && (
                <div className="bg-slate-900 rounded-3xl p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute bottom-0 right-0 p-40 bg-green-600/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

                  <h2 className="text-2xl md:text-3xl font-black mb-10 flex items-center gap-3">
                    <span className="w-2 h-10 bg-green-400 rounded-full" />
                    Professional Biography
                  </h2>
                  <p className="text-slate-300 leading-relaxed text-xl relative z-10 font-medium">
                    {member.bio}
                  </p>
                </div>
              )}



            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministrativeDetailPage;
