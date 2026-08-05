"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { useStoreData } from "@/hooks/useDataStore";

// Sanitize rich text HTML — replace &nbsp; with regular spaces so text wraps at word boundaries, not characters
const cleanHtml = (html) => {
  if (!html) return "";
  return typeof html === "string" ? html.replace(/&nbsp;/g, " ") : html;
};

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
  const facultyScrollRef = useRef(null);

  // Read from global data store (pre-loaded)
  const allPrograms = useStoreData("programs_data", []);
  const allFaculty = useStoreData("faculty", []);
  const careerDataRaw = useStoreData("career_data", {});
  const faqDataRaw = useStoreData("faq_data", {});

  useEffect(() => {
    const scrollContainer = facultyScrollRef.current;
    if (!scrollContainer) return;

    const interval = setInterval(() => {
      if (!scrollContainer) return;

      const cardWidth = scrollContainer.children[0]?.offsetWidth || 0;
      if (cardWidth === 0) return;

      const gap = 24;
      const scrollAmount = cardWidth + gap;
      const maxScroll =
        scrollContainer.scrollWidth - scrollContainer.clientWidth;

      if (scrollContainer.scrollLeft >= maxScroll - 10) {
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [departmentFaculty]);

  const processDepartmentData = React.useCallback((category) => {
    // Map program category/shortName to department codes
    const deptMapping = {
      engineering: "CSE",
      cse: "CSE",
      computer: "CSE",
      business: "BBA",
      bba: "BBA",
      thm: "THM",
      bthm: "THM",
      tourism: "THM",
      hospitality: "THM",
      mba: "MBA",
      mthm: "MTHM",
    };

    const categoryStr = String(category || "engineering");
    const categoryLower = categoryStr.toLowerCase();
    const mappedDept = deptMapping[categoryLower] || categoryStr.toUpperCase();

    // Faculty
    if (allFaculty && allFaculty.length > 0) {
      const filtered = allFaculty.filter(
        (f) => f.department?.toUpperCase() === mappedDept.toUpperCase(),
      );
      setDepartmentFaculty(filtered);
    }

    // Careers
    const careerData = careerDataRaw?.careerData || [];
    if (careerData.length > 0) {
      const filtered = careerData.filter(
        (c) => c.department?.toLowerCase() === categoryLower,
      );
      setDepartmentCareers(filtered);
    }

    // FAQs
    const faqData = faqDataRaw?.faqData || faqDataRaw?.faqs || [];
    if (faqData.length > 0) {
      const filtered = faqData.filter(
        (f) => f.department?.toLowerCase() === categoryLower,
      );
      setDepartmentFaqs(filtered);
    }
  }, [allFaculty, careerDataRaw, faqDataRaw]);

  // Find the program from pre-loaded data
  useEffect(() => {
    if (!allPrograms || allPrograms.length === 0) return;

    let found = null;
    const programs = allPrograms;

    if (Array.isArray(programs)) {
      found = programs.find(
        (p) =>
          String(p.id) === String(id) ||
          p.shortName?.toLowerCase() === String(id).toLowerCase() ||
          p.active_path === String(id) ||
          p.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === String(id).toLowerCase(),
      );
    } else if (typeof programs === "object") {
      if (programs[id]) {
        found = programs[id];
      } else {
        const arr = Object.values(programs);
        found = arr.find(
          (p) =>
            String(p.id) === String(id) ||
            p.shortName?.toLowerCase() === String(id).toLowerCase() ||
            p.active_path === String(id) ||
            p.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === String(id).toLowerCase(),
        );
      }
    }

    if (found) {
      setProgram(found);
      // Process department data from pre-loaded store
      // Prioritize shortName/id because they are more specific than a broad category (e.g. BTHM vs Business)
      const specificId = found.shortName || found.id || found.category || found.department || "engineering";
      processDepartmentData(specificId);
    } else {
      setProgram(null);
    }
    setLoading(false);
  }, [id, allPrograms, processDepartmentData]);

  // processDepartmentData removed from here

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
    overview: program.overview || "",
    eligibility: program.eligibility || "",
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

        <div className="container mx-auto px-4 md:px-2 lg:px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
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
            <div
              className="rich-text-content rich-text-content--light text-lg max-w-xl leading-relaxed mb-8"
              dangerouslySetInnerHTML={{
                __html: cleanHtml(
                  safeProgram.description ||
                    "<p>Program description not available.</p>",
                ),
              }}
            />
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

      <div className="container mx-auto px-4 md:px-2 lg:px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-3 gap-10">
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
                <div
                  className="rich-text-content rich-text-content--compact italic mb-4"
                  dangerouslySetInnerHTML={{
                    __html: cleanHtml(
                      safeProgram.headMessage || "Welcome to our program",
                    ),
                  }}
                />
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
              <div className="rich-text-content bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                {typeof safeProgram.overview === "string" ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: cleanHtml(safeProgram.overview),
                    }}
                  />
                ) : Array.isArray(safeProgram.overview) &&
                  safeProgram.overview.length > 0 ? (
                  safeProgram.overview.map((para, i) => (
                    <p key={i} className="mb-4 last:mb-0">
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="text-slate-400 italic">
                    No overview available.
                  </p>
                )}
              </div>
            </div>

            {/* Eligibility Card */}
            <div className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" /> Eligibility
                Criteria
              </h3>
              <div>
                {typeof safeProgram.eligibility === "string" ? (
                  <div
                    className="rich-text-content rich-text-eligibility"
                    dangerouslySetInnerHTML={{
                      __html: cleanHtml(safeProgram.eligibility),
                    }}
                  />
                ) : Array.isArray(safeProgram.eligibility) &&
                  safeProgram.eligibility.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {safeProgram.eligibility.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-white p-4 rounded-xl border border-blue-100"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span className="text-sm text-slate-700 font-medium">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-sm">
                    No eligibility criteria specified.
                  </p>
                )}
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
              <div className="w-full">
                <table className="w-full text-left border-collapse flex flex-col md:table">
                  <thead className="hidden md:table-header-group">
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 font-bold text-slate-900 w-1/4">
                        Semester
                      </th>
                      <th className="p-4 font-bold text-slate-900">
                        Key Subjects
                      </th>
                    </tr>
                  </thead>
                  <tbody className="flex flex-col md:table-row-group divide-y divide-slate-100">
                    {safeProgram.curriculum.map((item, idx) => (
                      <tr
                        key={idx}
                        className="flex flex-col md:table-row hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="p-4 md:p-4 font-bold text-blue-700 md:text-blue-600 bg-slate-50/80 md:bg-transparent md:whitespace-nowrap align-middle border-b border-slate-100 md:border-none">
                          {item.semester}
                        </td>
                        <td className="p-4 md:p-4 align-middle">
                          <div className="flex flex-wrap gap-2">
                            {item.subjects.map((sub, sIdx) => (
                              <span
                                key={sIdx}
                                className="inline-block px-3 py-1.5 md:px-2.5 md:py-1 bg-white md:bg-slate-100 text-slate-700 md:text-slate-600 text-[13px] md:text-xs font-semibold md:font-bold rounded-md border border-slate-200 shadow-sm md:shadow-none"
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
                    className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md hover:border-blue-100 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors mb-2">
                          {career.area}
                        </h4>
                        {career.description && (
                          <div
                            className="rich-text-content rich-text-content--compact text-slate-500 text-sm mb-3 line-clamp-4"
                            dangerouslySetInnerHTML={{
                              __html: cleanHtml(career.description),
                            }}
                          />
                        )}
                        {/* {career.skills && (
                          <div className="flex flex-wrap gap-2">
                            {career.skills.split(",").map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="inline-block px-2.5 py-1 bg-blue-50 text-gray-800 text-xs font-semibold rounded-full border border-blue-100"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Faculty Members Section - Only show if faculty exist */}
          {safeProgram.faculty.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span> Our
                Faculty
              </h2>
              <div
                ref={facultyScrollRef}
                className="flex overflow-x-auto gap-10 md:gap-5 ml-6 md:ml-0 pb-6 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {safeProgram.faculty.map((member, idx) => (
                  <Link
                    key={member._id || idx}
                    href={`/faculty/${member.slug}`}
                    className="min-w-full sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-start group overflow-hidden transition-all duration-300"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 rounded-t-md transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                          <Users className="w-16 h-16 text-slate-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-2">
                      <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {member.designation}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/faculty"
                  className="inline-flex items-center gap-2 text-blue-900 font-bold hover:underline"
                >
                  View All Faculty <ArrowRight className="w-4 h-4" />
                </Link>
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
              <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden">
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
              <div className="bg-white rounded-xl p-6 border border-slate-100 relative overflow-hidden">
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
                        {alumniList[alumniIndex].quote}
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
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-center text-white">
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

      {/* Rich Text Content Styles — override Tailwind reset */}
      <style jsx global>{`
        .program-rich-content {
          color: #475569;
          line-height: 1.8;
          font-size: 1rem;
          word-break: normal;
          overflow-wrap: break-word;
          white-space: normal;
        }
        .program-rich-content p {
          margin-bottom: 1.25rem;
          word-break: normal;
        }
        .program-rich-content p:last-child {
          margin-bottom: 0;
        }
        .program-rich-content h1 {
          font-size: 1.875rem;
          font-weight: 800;
          color: #0f172a;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .program-rich-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.35;
        }
        .program-rich-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        .program-rich-content strong,
        .program-rich-content b {
          font-weight: 700;
          color: #1e293b;
        }
        .program-rich-content em,
        .program-rich-content i {
          font-style: italic;
        }
        .program-rich-content u {
          text-decoration: underline;
          text-decoration-color: #94a3b8;
          text-underline-offset: 3px;
        }
        .program-rich-content a {
          color: #2563eb;
          font-weight: 600;
          text-decoration: underline;
          text-decoration-color: #93c5fd;
          text-underline-offset: 3px;
          transition: color 0.15s ease;
        }
        .program-rich-content a:hover {
          color: #1d4ed8;
        }
        .program-rich-content ul {
          list-style-type: disc;
          padding-left: 1.75rem;
          margin-top: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .program-rich-content ol {
          list-style-type: decimal;
          padding-left: 1.75rem;
          margin-top: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .program-rich-content li {
          margin-bottom: 0.375rem;
          padding-left: 0.25rem;
        }
        .program-rich-content li::marker {
          color: #3b82f6;
        }
        .program-rich-content blockquote {
          border-left: 4px solid #3b82f6;
          padding: 1rem 1.25rem;
          margin: 1.25rem 0;
          background: #f8fafc;
          border-radius: 0 0.75rem 0.75rem 0;
          color: #334155;
          font-style: italic;
        }

        /* Light variant for hero dark bg */
        .program-rich-content--light {
          color: #cbd5e1;
        }
        .program-rich-content--light strong,
        .program-rich-content--light b {
          color: #f1f5f9;
        }
        .program-rich-content--light a {
          color: #93c5fd;
        }

        /* Compact variant */
        .program-rich-content--compact {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: #475569;
        }
        .program-rich-content--compact p {
          margin-bottom: 0.75rem;
        }

        /* Eligibility styled list */
        .program-rich-eligibility ul {
          list-style: none;
          padding-left: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 0.75rem;
        }
        .program-rich-eligibility li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          background: white;
          padding: 1rem 1.25rem;
          border-radius: 0.75rem;
          border: 1px solid #dbeafe;
          font-size: 0.875rem;
          font-weight: 500;
          color: #334155;
          margin-bottom: 0;
        }
        .program-rich-eligibility li::before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          min-width: 8px;
          background: #3b82f6;
          border-radius: 50%;
          margin-top: 6px;
        }
        .program-rich-eligibility li::marker {
          content: none;
        }
      `}</style>
    </div>
  );
};

export default DynamicProgramPage;
