"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Monitor,
  Briefcase,
  Globe,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Clock,
  Calendar,
  FileText,
  DollarSign,
  Code,
  Cpu,
  Database,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Quote,
  Phone,
  Loader2,
} from "lucide-react";
import Image from "next/image";

const DynamicProgramPage = () => {
  const params = useParams();
  const { id } = params;
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [facultyIndex, setFacultyIndex] = useState(0); // Initialize with 0
  const [alumniIndex, setAlumniIndex] = useState(0); // Initialize with 0
  const [departmentFaculty, setDepartmentFaculty] = useState([]);
  const [departmentCareers, setDepartmentCareers] = useState([]);
  const [departmentFaqs, setDepartmentFaqs] = useState([]);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        // 1. Try fetching from API
        let found = null;
        try {
          const response = await fetch("/api/admin/data/ProgramsData");
          if (response.ok) {
            const result = await response.json();
            let programs = result.data?.programsData || result.data;

            // Handle if programs is an object (convert to array or lookup)
            if (
              programs &&
              typeof programs === "object" &&
              !Array.isArray(programs)
            ) {
              // If it's the structure like { cse: {...}, bba: {...} }
              // Try direct lookup
              if (programs[id]) {
                found = programs[id];
              } else {
                // Convert to array and search
                programs = Object.values(programs);
              }
            }

            if (!found && Array.isArray(programs)) {
              found = programs.find(
                (p) =>
                  String(p.id) === String(id) ||
                  p.shortName?.toLowerCase() === String(id).toLowerCase() ||
                  p.active_path === String(id), // Support custom paths if added
              );
            }
          }
        } catch (err) {
          console.warn("API fetch failed, falling back to local data");
        }

        if (found) {
          setProgram(found);
          // Fetch department-specific data based on category
          fetchDepartmentData(
            found.category || found.department || "engineering",
          );
        } else {
          setProgram(null);
        }
      } catch (error) {
        console.error("Error processing program data:", error);
        setProgram(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  const fetchDepartmentData = async (category) => {
    try {
      // Try to fetch department-specific data from the faculty page
      const facultyResponse = await fetch(`/api/admin/data/FacultyData`);
      if (facultyResponse.ok) {
        const facultyResult = await facultyResponse.json();
        const facultyData = facultyResult.data?.facultyData || [];
        const filtered = facultyData.filter(
          (f) => f.department?.toLowerCase() === category.toLowerCase(),
        );
        setDepartmentFaculty(filtered);
      }

      // Fetch career data by department
      const careerResponse = await fetch(`/api/admin/data/CareerData`);
      if (careerResponse.ok) {
        const careerResult = await careerResponse.json();
        const careerData = careerResult.data?.careerData || [];
        const filtered = careerData.filter(
          (c) => c.department?.toLowerCase() === category.toLowerCase(),
        );
        setDepartmentCareers(filtered);
      }

      // Fetch FAQ data by department
      const faqResponse = await fetch(`/api/admin/data/FaqData`);
      if (faqResponse.ok) {
        const faqResult = await faqResponse.json();
        const faqData = faqResult.data?.faqData || [];
        const filtered = faqData.filter(
          (f) => f.department?.toLowerCase() === category.toLowerCase(),
        );
        setDepartmentFaqs(filtered);
      }
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  if (!program) {
    return notFound();
  }

  // Create a safe program object with defaults for optional fields
  const safeProgram = {
    ...program,
    overview: program.overview || [],
    eligibility: program.eligibility || [],
    curriculum: program.curriculum || [],
    // Combine program-specific careers with department careers (avoid duplicates)
    careers: [
      ...(program.careers || []),
      ...departmentCareers.filter(
        (dc) =>
          !program.careers?.some(
            (pc) => pc.title === dc.title && pc.company === dc.company,
          ),
      ),
    ],
    // Use department-specific faculty and faqs
    faculty: departmentFaculty.length > 0 ? departmentFaculty : [],
    faqs: departmentFaqs.length > 0 ? departmentFaqs : [],
    stats: program.stats || [],
    facilities: program.facilities || [],
    headName: program.headName || "Program Head",
    headRole: program.headRole || "Head of Department",
    headMessage: program.headMessage || "Welcome to our program",
    headImage:
      program.headImage ||
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
    heroImage:
      program.heroImage ||
      program.image ||
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
    department: program.department || "Department",
  };

  // Key facts to display in sidebar
  const keyFacts = [
    {
      icon: GraduationCap,
      label: "Degree",
      value: safeProgram.degree || "N/A",
    },
    { icon: Clock, label: "Duration", value: safeProgram.duration || "N/A" },
    {
      icon: Calendar,
      label: "Semesters",
      value: safeProgram.semesters || "N/A",
    },
    { icon: Code, label: "Credits", value: safeProgram.credits || "N/A" },
  ];

  // Alumni data from program (only show if data exists)
  const alumniList = safeProgram.alumni || safeProgram.alumniStories || [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Section */}
      <div className="relative bg-[#001229] pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-500/30 backdrop-blur-sm">
              <Monitor className="w-3.5 h-3.5" /> {safeProgram.department}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              {safeProgram.title.replace(
                "Bachelor of Business Administration",
                "Bachelor of\nBusiness Admin",
              )}
            </h1>
            <p className="text-lg text-slate-300 max-w-xl leading-relaxed mb-8">
              {safeProgram.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/admission/online"
                className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all transform hover:-translate-y-1"
              >
                Apply Now
              </Link>
              <Link
                href="/admissionEligibility"
                className="px-8 py-3.5 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Admission Query
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video lg:aspect-[4/3]">
              <img
                src={safeProgram.heroImage}
                alt={safeProgram.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001229] via-transparent to-transparent opacity-60" />
            </div>

            {/* <div className="absolute -bottom-10 left-10 right-10 bg-white rounded-2xl shadow-xl p-6 hidden md:grid grid-cols-4 gap-4 items-center border border-slate-100 divide-x divide-slate-100">
                            {safeProgram.stats.map((stat, idx) => (
                                <div key={idx} className="text-center px-2">
                                    <h4 className="text-2xl font-bold text-slate-900">{stat.value}</h4>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div> */}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-20">
          {/* Message from Head */}
          <section className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Quote className="w-32 h-32 text-slate-900" />
            </div>
            <div className="flex flex-col sm:flex-row gap-6 relative z-10">
              <div className="shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                  <Image
                    src={safeProgram.headImage}
                    alt={safeProgram.headName}
                    width={240}
                    height={240}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Message from the Head
                </h3>
                <p className="text-slate-600 italic mb-4">
                  "{safeProgram.headMessage}"
                </p>
                <div>
                  <p className="font-bold text-slate-900">
                    {safeProgram.headName}
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    {safeProgram.headRole}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Program Overview & Eligibility */}
          <section className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>{" "}
                Program Overview
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                {safeProgram.overview.map((para, i) => (
                  <p key={i} className="mb-4 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Eligibility Card */}
            <div className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" /> Eligibility
                Criteria
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {safeProgram.eligibility.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white p-4 rounded-xl border border-blue-100"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                    <span className="text-sm text-slate-700 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Curriculum Table */}
          <section id="curriculum">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>{" "}
              Curriculum Highlights
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 font-bold text-slate-900 w-1/4">
                        Semester
                      </th>
                      <th className="p-4 font-bold text-slate-900">
                        Key Subjects
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {safeProgram.curriculum.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="p-4 font-bold text-blue-600 whitespace-nowrap align-top">
                          {item.semester}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {item.subjects.map((sub, sIdx) => (
                              <span
                                key={sIdx}
                                className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded border border-slate-200"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Facilities Showcase - Only show if facilities exist */}
          {safeProgram.facilities.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>{" "}
                Existing Facilities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {safeProgram.facilities.map((facility, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-2xl overflow-hidden aspect-video shadow-md cursor-pointer"
                  >
                    <img
                      src={facility.image}
                      alt={facility.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex items-end">
                      <h4 className="text-white font-bold text-lg">
                        {facility.name}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Career Opportunities - Only show if careers exist */}
          {safeProgram.careers.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>{" "}
                Career Opportunities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {safeProgram.careers.map((career, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                          {career.area}
                        </h4>
                        {career.description && (
                          <p className="text-slate-500 text-sm mb-3">
                            {career.description}
                          </p>
                        )}
                        {career.skills && (
                          <div className="flex flex-wrap gap-2">
                            {career.skills.split(",").map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQs - Only show if FAQs exist */}
          {safeProgram.faqs.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span> FAQs
              </h2>
              <div className="space-y-3">
                {safeProgram.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      {faq.question}
                      {openFaq === idx ? (
                        <ChevronUp className="w-5 h-5 text-blue-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <AnimatePresence>
                      {openFaq === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            {/* Key Facts Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold text-slate-900 mb-4 text-lg">
                Quick Facts
              </h3>
              <div className="space-y-4">
                {keyFacts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center">
                        <fact.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-600">
                        {fact.label}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources/Downloads - Only show if resources exist */}
            {safeProgram.resources && safeProgram.resources.length > 0 && (
              <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="font-bold text-lg mb-4 relative z-10">
                  Student Resources
                </h3>
                <div className="space-y-3 relative z-10">
                  {safeProgram.resources.map((item, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        window.open(item.url, "_blank", "noopener,noreferrer")
                      }
                      className="w-full flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <div className="text-left">
                          <p className="text-sm font-bold group-hover:text-blue-300 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            PDF • {item.size || "Click to view"}
                          </p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Alumni Carousel Snippet - Only show if alumni data exists */}
            {alumniList.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Alumni Stories</h3>
                  {alumniList.length > 1 && (
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          setAlumniIndex((prev) =>
                            prev === 0 ? alumniList.length - 1 : prev - 1,
                          )
                        }
                        className="p-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        <ChevronDown className="w-4 h-4 rotate-90" />
                      </button>
                      <button
                        onClick={() =>
                          setAlumniIndex(
                            (prev) => (prev + 1) % alumniList.length,
                          )
                        }
                        className="p-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={alumniIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 border-2 border-blue-100 p-1">
                        <img
                          src={alumniList[alumniIndex].image}
                          alt="Alumnus"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <p className="text-sm text-slate-600 italic mb-3">
                        "{alumniList[alumniIndex].quote}"
                      </p>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {alumniList[alumniIndex].name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {alumniList[alumniIndex].role}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 text-center">
                  <Link
                    href="/alumni"
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    View All Alumni
                  </Link>
                </div>
              </div>
            )}

            {/* Admission CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-center text-white shadow-xl shadow-blue-900/20">
              <h3 className="font-bold text-xl mb-2">Ready to Apply?</h3>
              <p className="text-blue-100 text-sm mb-6">
                Take the first step towards a rewarding career.
              </p>
              <Link
                href="/admission/online"
                className="block w-full py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Apply Now
              </Link>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-blue-200">
                <Phone className="w-3 h-3" />
                <span>Helpline: +880 1847-140188</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicProgramPage;
