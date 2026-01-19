"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  LayoutDashboard, Home, FileText, BookOpen, Award, MessageSquare, Users,
  LogOut, Save, Menu, Check, X, Loader2, GraduationCap, Monitor, Banknote, Gift, Building2, ChevronDown, ChevronRight, ArrowLeftToLine
} from "lucide-react";

import OverviewSection from "./components/OverviewSection";
import HeroSection from "./components/HeroSection";
import GeneralPagesSection from "./components/GeneralPagesSection";
import StatsSection from "./components/StatsSection";
import ProgramsSection from "./components/ProgramsSection";
import NewsSection from "./components/NewsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PartnersSection from "./components/PartnersSection";
import AdmissionEligibilitySection from "./components/AdmissionEligibilitySection";
import OnlineAdmissionSection from "./components/OnlineAdmissionSection";
import TuitionFeesSection from "./components/TuitionFeesSection";
import ScholarshipsSection from "./components/ScholarshipsSection";
import FacilitiesSection from "./components/FacilitiesSection";
import AcademicCalendarSection from "./components/AcademicCalendarSection";
import NoticesSection from "./components/NoticesSection";
import FacultySection from "./components/FacultySection";
import AdministrativeSection from "./components/AdministrativeSection";
import AlumniSection from "./components/AlumniSection";
import CampusActivitiesSection from "./components/CampusActivitiesSection";
import SiteInfoSection from "./components/SiteInfoSection";
import CallToActionSection from "./components/CallToActionSection";
import Image from "next/image";

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "site-info", label: "Site Information", icon: FileText },
  { id: "hero", label: "Hero Slides", icon: Home },
  {
    id: "general",
    label: "General Pages",
    icon: FileText,
    children: [
      { id: "about", label: "About Us" },
      { id: "contact", label: "Contact Us" },
      { id: "faq", label: "FAQ" },
    ]
  },
  {
    id: "academics",
    label: "Academics",
    icon: BookOpen,
    children: [
      { id: "academic-calendar", label: "Academic Calendar" },
      { id: "diit-notices", label: "DIIT Notices" },
      { id: "faculty-members", label: "Faculty Members" },
      { id: "administrative", label: "Administrative" },
      { id: "alumni", label: "Alumni" },
    ]
  },
  { id: "eligibility", label: "Admission Eligibility", icon: GraduationCap },
  { id: "online", label: "Online Admission", icon: Monitor },
  { id: "stats", label: "Statistics", icon: Award },
  { id: "fees", label: "Tuition Fees", icon: Banknote },
  { id: "scholarships", label: "Scholarships", icon: Gift },
  { id: "facilities", label: "Facilities", icon: Building2 },
  { id: "partners", label: "MoU Partners", icon: Users },
  { id: "programs", label: "Programs", icon: BookOpen },
  { id: "news", label: "News & Events", icon: FileText },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "campus-activities", label: "Campus Activities", icon: Building2 },
  { id: "cta-settings", label: "CTA Settings", icon: Monitor },

];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState({ name: "Admin User", email: "admin@diit.edu.bd", image: null });

  // Default empty state
  const defaultData = {
    heroSlides: [],
    programsData: [],
    newsEvents: [],
    testimonials: { students: [] },
    internationalPartners: [],
    statsCounter: []
  };

  const [data, setData] = useState(defaultData); // Initialize with defaults
  const [message, setMessage] = useState({ type: "", text: "" });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/check");
      const result = await res.json();
      if (!result.authenticated) router.push("/admin");
    } catch { router.push("/admin"); }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch hero slides
      const heroRes = await fetch("/api/admin/hero");
      const heroResult = await heroRes.json();

      // Fetch homepage data
      const homeRes = await fetch("/api/admin/homepage");
      const homeResult = await homeRes.json();

      // Fetch programs data
      const programsRes = await fetch("/api/admin/data/ProgramsData");
      const programsResult = await programsRes.json();

      // Fetch partners data
      const partnersRes = await fetch("/api/admin/partners");
      const partnersResult = await partnersRes.json();

      const newHeroSlides = heroResult.success ? heroResult.data : [];
      const homeData = homeResult.success ? homeResult.data : {};
      const programsData = programsResult.success ? programsResult.data?.programsData || programsResult.data || [] : [];
      const partnersData = partnersResult.success ? partnersResult.data : { partners: [], benefits: [] };

      // Fetch testimonials data
      const testimonialsRes = await fetch("/api/admin/testimonials");
      const testimonialsResult = await testimonialsRes.json();
      const testimonialsData = testimonialsResult.success ? testimonialsResult.data : [];

      // Fetch News & Events
      const newsRes = await fetch("/api/admin/news-events");
      const newsResult = await newsRes.json();
      const newsData = newsResult.success ? newsResult.data : [];

      setData({
        ...defaultData,
        ...homeData,
        heroSlides: newHeroSlides,
        programsData: programsData,
        internationalPartners: partnersData.partners || [],
        collaborationBenefits: partnersData.benefits || [],
        testimonials: testimonialsData || [],
        newsEvents: newsData || []
      });

      if (!heroResult.success || !homeResult.success || !programsResult.success) {
        setMessage({ type: "error", text: "Some data failed to load. Using defaults." });
      }

    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load data" });
      setData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    setSaving(true);
    try {
      const heroRes = await fetch("/api/admin/hero/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.heroSlides),
      });
      const heroJson = await heroRes.json().catch(() => ({}));

      const bodyContent = { ...data };
      delete bodyContent.heroSlides; // Don't send hero slides to homepage endpoint
      delete bodyContent.programsData; // Don't send programs to homepage endpoint
      delete bodyContent.internationalPartners; // Managed via dedicated API
      delete bodyContent.collaborationBenefits; // Managed via dedicated API
      delete bodyContent.testimonials; // Managed via dedicated API
      delete bodyContent.newsEvents; // Managed via dedicated API

      const homeRes = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyContent),
      });
      const homeJson = await homeRes.json().catch(() => ({}));

      // Save programs data separately
      const programsRes = await fetch("/api/admin/data/ProgramsData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programsData: data.programsData || [] }),
      });
      const programsJson = await programsRes.json().catch(() => ({}));

      const results = {
        hero: { ok: heroRes.ok, status: heroRes.status, message: heroJson.message },
        home: { ok: homeRes.ok, status: homeRes.status, message: homeJson.message },
        programs: { ok: programsRes.ok, status: programsRes.status, message: programsJson.message }
      };

      console.log("Save results:", results);

      if (results.hero.ok && results.home.ok && results.programs.ok) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "All changes saved successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        const failedDetails = Object.entries(results)
          .filter(([_, res]) => !res.ok)
          .map(([name, res]) => `${name}: ${res.message || res.status}`)
          .join(", ");
        throw new Error(`Save failed: ${failedDetails}`);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message || "Failed to save changes",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  const updateField = (section, index, field, value) => {
    const newData = { ...data };
    if (index !== null && field !== null) {
      // Update specific field in array
      newData[section][index][field] = value;
    } else if (index === null && field === null) {
      // Replace entire array (used for add/delete operations)
      newData[section] = value;
    } else if (index !== null) {
      // Update entire object at index
      newData[section][index] = value;
    } else {
      // Update single field
      newData[section][field] = value;
    }
    setData(newData);
  };

  const addItem = (section, template) => {
    setData({ ...data, [section]: [...data[section], { ...template, id: Date.now() }] });
  };

  const deleteItem = (section, index) => {
    const newData = { ...data };
    newData[section].splice(index, 1);
    setData(newData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden font-sans text-slate-900">
      {/* Fixed Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 border-r border-slate-800 shrink-0 transition-all duration-300 ease-in-out flex flex-col z-20 shadow-xl`}
      >
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-white text-base tracking-tight whitespace-nowrap">DIIT Admin</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider">DASHBOARD</span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.children) {
                    setExpandedMenu(expandedMenu === item.id ? null : item.id);
                  } else {
                    setActiveSection(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeSection === item.id || (item.children && expandedMenu === item.id)
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  } ${activeSection === item.id && !item.children ? "bg-blue-600 shadow-md shadow-blue-900/20" : ""}`}
              >
                {activeSection === item.id && !item.children && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                )}

                <item.icon className={`w-4 h-4 shrink-0 relative z-10 ${activeSection === item.id ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`} />

                {sidebarOpen && (
                  <span className={`relative z-10 font-medium text-sm flex-1 text-left ${activeSection === item.id ? "font-semibold" : ""}`}>
                    {item.label}
                  </span>
                )}

                {sidebarOpen && item.children && (
                  expandedMenu === item.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {item.children && expandedMenu === item.id && sidebarOpen && (
                <div className="mt-1 ml-4 space-y-1 border-l-2 border-slate-700 pl-2">
                  {item.children.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setActiveSection(subItem.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-sm ${activeSection === subItem.id
                        ? "bg-blue-600/10 text-blue-400 font-medium"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                        }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative">
        {/* Sticky Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
            >
              <ArrowLeftToLine className={`w-5 h-5 cursor-pointer transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`} />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            <h1 className="text-lg font-bold text-slate-800 capitalize tracking-tight flex items-center gap-2">
              {activeSection.replace(/([A-Z])/g, ' $1').trim()}
            </h1>
          </div>

          {/* Right side content */}
          <div className="flex gap-4 items-center justify-between">
            <div>
              {/* View Website Button */}
              <button
                onClick={() => window.open("/", "_blank")}
                className="mr-4 flex items-center gap-2 px-3 py-2 text-blue-700 rounded-md border border-blue-200 hover:bg-blue-50 cursor-pointer transition-colors text-sm font-medium"
              >
                <Home className="w-4 h-4" />
                {sidebarOpen && <span>View Website</span>}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <AnimatePresence>
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm backdrop-blur-md ${message.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                  >
                    {message.type === "success" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Admin Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-all group"
                >
                  {adminInfo.image ? (
                    <Image
                      src={adminInfo.image}
                      alt={adminInfo.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-600"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm border-2 border-blue-600">
                      {adminInfo.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-slate-900">{adminInfo.name}</p>
                    <p className="text-xs text-slate-500">{adminInfo.email}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50"
                    >
                      {/* Profile Info */}
                      <div className="p-4 border-b border-slate-100 bg-linear-to-br from-slate-50 to-slate-100">
                        <div className="flex items-center gap-3">
                          {adminInfo.image ? (
                            <Image
                              src={adminInfo.image}
                              alt={adminInfo.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-blue-600"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold border-2 border-blue-600">
                              {adminInfo.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">{adminInfo.name}</p>
                            <p className="text-xs text-slate-600">{adminInfo.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            // Add settings functionality later
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-sm font-medium"
                        >
                          <Users className="w-4 h-4 text-slate-500" />
                          Profile Settings
                        </button>
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            // Add activity log functionality later
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-sm font-medium"
                        >
                          <Monitor className="w-4 h-4 text-slate-500" />
                          Activity Log
                        </button>
                      </div>

                      {/* Logout Button */}
                      <div className="p-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-sm group"
                        >
                          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar scroll-smooth">
          <div className="w-full space-y-6 pb-10">
            {activeSection === "overview" && <OverviewSection data={data} />}
            {activeSection === "site-info" && <SiteInfoSection />}
            {activeSection === "hero" && <HeroSection data={data} updateField={updateField} addItem={addItem} deleteItem={deleteItem} onSave={saveData} saving={saving} />}
            {activeSection === "stats" && <StatsSection data={data} updateField={updateField} onSave={saveData} saving={saving} />}
            {activeSection === "academic-calendar" && <AcademicCalendarSection />}
            {activeSection === "diit-notices" && <NoticesSection />}
            {activeSection === "faculty-members" && <FacultySection />}
            {activeSection === "administrative" && <AdministrativeSection />}
            {activeSection === "alumni" && <AlumniSection />}
            {activeSection === "eligibility" && <AdmissionEligibilitySection />}
            {activeSection === "online" && <OnlineAdmissionSection />}
            {activeSection === "fees" && <TuitionFeesSection />}
            {activeSection === "scholarships" && <ScholarshipsSection />}
            {activeSection === "facilities" && <FacilitiesSection />}
            {activeSection === "programs" && <ProgramsSection data={data} updateField={updateField} addItem={addItem} deleteItem={deleteItem} onSave={saveData} saving={saving} />}
            {activeSection === "news" && <NewsSection data={data} updateField={updateField} addItem={addItem} deleteItem={deleteItem} onSave={saveData} saving={saving} />}
            {activeSection === "testimonials" && <TestimonialsSection data={data} updateField={updateField} onSave={saveData} saving={saving} />}
            {activeSection === "partners" && <PartnersSection data={data} updateField={updateField} addItem={addItem} deleteItem={deleteItem} onSave={saveData} saving={saving} />}
            {activeSection === "campus-activities" && <CampusActivitiesSection />}
            {activeSection === "cta-settings" && <CallToActionSection />}
            {["about", "contact", "faq"].includes(activeSection) && <GeneralPagesSection pageType={activeSection} />}
          </div>
        </div>
      </main>
    </div>
  );
}
