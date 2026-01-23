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
  MapPin,
  Building2,
  GraduationCap,
  Calendar,
  User,
  Sparkles,
  Facebook,
  Twitter,
  Globe,
  Quote,
  Award,
  Briefcase
} from 'lucide-react';

const AlumniDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [alumnus, setAlumnus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlumnus = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/alumni/${params.id}`);
        const result = await res.json();
        if (result.success) {
          setAlumnus(result.data);
        } else {
          setError(result.message || "Failed to fetch alumni details");
        }
      } catch (err) {
        console.error("Error fetching alumni:", err);
        setError("Failed to load alumni details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAlumnus();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 rounded-full animate-spin border-t-brandColor" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brandColor animate-pulse" />
        </div>
        <p className="text-slate-500 font-medium animate-pulse tracking-wide">Loading Profile...</p>
      </div>
    );
  }

  if (error || !alumnus) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Alumni Not Found</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">{error || "The requested profile could not be found."}</p>
          <Link
            href="/alumni"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Alumni
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Immersive Hero Section */}
      <div className="relative h-[320px] md:h-[500px] bg-slate-900 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-br from-blue-900 via-slate-900 to-slate-900" />
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-brandColor/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
          />
          <motion.div
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
            transition={{ duration: 15, repeat: Infinity, delay: 2 }}
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>

        {/* Back Navigation */}
        <div className="absolute top-24 md:top-28 left-0 right-0 z-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/alumni"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors group px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Alumni Network</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 -mt-40 md:-mt-64 pb-20">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">

          {/* Left Column: Profile Card */}
          <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-32">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-4 md:p-6 shadow-xl shadow-slate-200/50 md:shadow-slate-300/50 relative overflow-hidden ring-1 ring-slate-100"
            >
              {/* Decorative Top Gradient */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-r from-brandColor to-green-600 opacity-10" />

              <div className="relative">
                {/* Profile Image */}
                <div className="aspect-4/5 rounded-2xl overflow-hidden bg-slate-100 shadow-xl mb-6 ring-4 ring-white relative group">
                  {alumnus.image ? (
                    <img
                      src={alumnus.image}
                      alt={alumnus.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                      <User className="w-24 h-24" />
                    </div>
                  )}
                  {/* Batch Badge */}
                  <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
                    <div className="bg-white/95 backdrop-blur-xl p-2.5 md:p-3 rounded-xl border border-white/20 shadow-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Batch</p>
                          <p className="text-sm font-bold text-slate-800">{alumnus.batch}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name & Basic Info (Mobile Only) */}
                <div className="mb-8 lg:hidden">
                  <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight leading-tight">
                    {alumnus.name}
                  </h1>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-base font-medium text-blue-600">
                      <Briefcase className="w-5 h-5 shrink-0 mt-0.5" />
                      {alumnus.designation}
                    </div>
                    {alumnus.company && (
                      <div className="flex items-center gap-2 text-base font-medium text-slate-500">
                        <Building2 className="w-5 h-5 shrink-0" />
                        {alumnus.company}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions & Social Links (Mobile Only) */}
                <div className="lg:hidden">
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {alumnus.email && (
                      <a href={`mailto:${alumnus.email}`} className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all group border border-slate-100">
                        <Mail className="w-5 h-5 text-slate-400 group-hover:text-white" />
                        <span className="text-xs font-semibold">Email</span>
                      </a>
                    )}
                    {alumnus.linkedin && (
                      <a href={alumnus.linkedin} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl bg-[#0077b5]/5 hover:bg-[#0077b5] hover:text-white transition-all group border border-[#0077b5]/10">
                        <Linkedin className="w-5 h-5 text-[#0077b5] group-hover:text-white" />
                        <span className="text-xs font-semibold">LinkedIn</span>
                      </a>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-4 py-4 border-t border-slate-100">
                    {alumnus.facebook && (
                      <a href={alumnus.facebook} className="p-3 rounded-full bg-slate-50 text-slate-500 hover:bg-[#1877F2] hover:text-white transition-all">
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {alumnus.twitter && (
                      <a href={alumnus.twitter} className="p-3 rounded-full bg-slate-50 text-slate-500 hover:bg-black hover:text-white transition-all">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    <div className="w-px h-8 bg-slate-200 mx-2" />
                    {alumnus.phone && (
                      <a href={`tel:${alumnus.phone}`} className="p-3 rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all">
                        <Phone className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Details */}
          <div className="flex-1 min-w-0 pt-0 lg:pt-12">
            {/* Name & Basic Info (Desktop Only) */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block mb-8"
            >
              <h1 className="text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                {alumnus.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90 mb-8">
                <div className="flex items-center gap-2 text-xl font-medium">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  {alumnus.designation}
                </div>
                {alumnus.company && (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                    <div className="flex items-center gap-2 text-xl font-medium text-blue-200">
                      <Building2 className="w-5 h-5" />
                      {alumnus.company}
                    </div>
                  </>
                )}
              </div>

              {/* Desktop Quick Actions & Socials (Moved here) */}
              <div className="flex flex-wrap items-center gap-4">
                {alumnus.email && (
                  <a href={`mailto:${alumnus.email}`} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-blue-900 border border-white/10 transition-all backdrop-blur-md">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-semibold">Email</span>
                  </a>
                )}
                {alumnus.linkedin && (
                  <a href={alumnus.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0077b5]/20 hover:bg-[#0077b5] text-white hover:text-white border border-white/10 transition-all backdrop-blur-md">
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm font-semibold">LinkedIn</span>
                  </a>
                )}
                {alumnus.facebook && (
                  <a href={alumnus.facebook} className="p-2.5 rounded-full bg-white/10 hover:bg-[#1877F2] text-white transition-all border border-white/10">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {alumnus.twitter && (
                  <a href={alumnus.twitter} className="p-2.5 rounded-full bg-white/10 hover:bg-black text-white transition-all border border-white/10">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {alumnus.phone && (
                  <a href={`tel:${alumnus.phone}`} className="p-2.5 rounded-full bg-white/10 hover:bg-green-600 text-white transition-all border border-white/10">
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Location Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-brandColor flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Current Location</p>
                      <p className="text-base font-semibold text-slate-800">{alumnus.location || "Not Specified"}</p>
                    </div>
                  </div>
                </div>

                {/* Department Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Department</p>
                      <p className="text-base font-semibold text-slate-800">{alumnus.department}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alumni Network Section */}
              <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    Alumni Network & Thoughts
                  </h3>
                  <p className="text-slate-300 leading-relaxed max-w-2xl mb-6 italic">
                    "{alumnus.message || alumnus.bio || "DIIT has been a significant chapter of my life. It is where I developed confidence, leadership skills, and a strong professional foundation. The guidance of our respected faculty members and the supportive academic environment played a vital role in shaping my career. DIIT is not just an institution—it is a place where dreams take shape and individuals grow. I am proud to be a part of the DIIT family."}"
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium border border-white/10">Global Network</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium border border-white/10">Mentorship</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium border border-white/10">Professional Development</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDetailPage;
