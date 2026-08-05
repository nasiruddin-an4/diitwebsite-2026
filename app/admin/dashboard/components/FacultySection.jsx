"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Save,
  X,
  Loader2,
  AlertCircle,
  Check,
  Edit2,
  Mail,
  Phone,
  Building2,
  Upload,
  Eye,
  Tag,
  BookOpen,
  Award,
  FlaskConical,
  GraduationCap,
} from "lucide-react";

// Dynamically import ReactQuill (SSR-incompatible)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const departmentOptions = [
  { value: "CSE", label: "CSE" },
  { value: "BBA", label: "BBA" },
  { value: "THM", label: "THM" },
  { value: "MBA", label: "MBA" },
  { value: "MTHM", label: "MTHM" },
];

const designationOptions = [
  { value: "Principal", label: "Principal" },
  { value: "Associate Professor", label: "Associate Professor" },
  { value: "Assistant Professor", label: "Assistant Professor" },
  { value: "Senior Lecturer", label: "Senior Lecturer" },
  { value: "Lecturer", label: "Lecturer" },
  { value: "Teaching Assistant", label: "Teaching Assistant" },
];

// Define Quill modules OUTSIDE the component to prevent infinite re-renders
const quillModules = {
  toolbar: [
    [{ header: [3, 4, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

export default function FacultySection() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [filterDept, setFilterDept] = useState("All");

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/academics/faculty");
      const result = await res.json();

      if (result.success) {
        setFaculty(result.data);
      } else {
        setMessage({ type: "error", text: "Failed to load faculty" });
      }
    } catch (error) {
      console.error("Error fetching faculty:", error);
      setMessage({ type: "error", text: "Error loading faculty" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      name: "",
      designation: "Lecturer",
      department: "CSE",
      email: "",
      phone: "",
      image: "",
      education: "",
      publications: "",
      awards: "",
      yearsExperience: "",
      about: "",
      achievements: "",
      researchInterests: "",
      courses: "",
      facebook: "",
      linkedin: "",
      twitter: "",
      serial: "",
    });
    setEditingId(null);
    setIsAdding(true);
  };

  const handleEdit = (member) => {
    setFormData({ ...member, serial: member.serial === 999 ? "" : member.serial });
    setEditingId(member._id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setFormData(null);
    setEditingId(null);
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setSaving(true); // Reuse saving state or add uploading state
        const res = await fetch("/api/upload", {
          method: "POST",
          body: (() => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", "faculty");
            return formData;
          })(),
        });
        const result = await res.json();
        if (result.success) {
          setFormData({ ...formData, image: result.url });
          setMessage({ type: "success", text: "Image uploaded successfully" });
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error("Upload error:", error);
        setMessage({ type: "error", text: "Failed to upload image" });
      } finally {
        setSaving(false);
      }
    }
  };


  const handleSave = async () => {
    if (!formData.name || !formData.designation || !formData.department) {
      setMessage({ type: "error", text: "Name, designation, and department are required" });
      return;
    }

    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payloadData = {
        ...formData,
        serial: (formData.serial && formData.serial !== "") ? parseInt(formData.serial) : 999
      };
      const payload = editingId ? { ...payloadData, _id: editingId } : payloadData;

      const res = await fetch("/api/admin/academics/faculty", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        setMessage({
          type: "success",
          text: editingId ? "Faculty member updated successfully" : "Faculty member created successfully",
        });
        fetchFaculty();
        handleCancel();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: result.message || "Failed to save faculty member" });
      }
    } catch (error) {
      console.error("Error saving faculty:", error);
      setMessage({ type: "error", text: "Error saving faculty member" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this faculty member?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/admin/academics/faculty?id=${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        setMessage({ type: "success", text: "Faculty member deleted successfully" });
        fetchFaculty();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to delete faculty member" });
      }
    } catch (error) {
      console.error("Error deleting faculty:", error);
      setMessage({ type: "error", text: "Error deleting faculty member" });
    }
  };

  const filteredFaculty = filterDept === "All"
    ? faculty
    : faculty.filter(f => f.department === filterDept);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Faculty Members</h2>
          <p className="text-slate-600 text-sm mt-1">Manage all faculty members and staff</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Faculty
        </button>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center gap-2 p-4 rounded-lg ${message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
              }`}
          >
            {message.type === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["All", ...departmentOptions.map(d => d.value)].map(dept => (
          <button
            key={dept}
            onClick={() => setFilterDept(dept)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterDept === dept
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isAdding && formData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">
                  {editingId ? "Edit Faculty Member" : "Add New Faculty Member"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Prof. Dr. John Doe"
                    />
                  </div>

                  {/* Serial Number */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Serial Number (for ordering)
                    </label>
                    <input
                      type="number"
                      value={formData.serial || ""}
                      onChange={(e) => handleFieldChange("serial", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 1, 2, 3"
                    />
                  </div>
                </div>

                {/* Designation and Department */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Designation
                    </label>
                    <select
                      value={formData.designation}
                      onChange={(e) => handleFieldChange("designation", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {designationOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => handleFieldChange("department", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {departmentOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@diit.edu.bd"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={formData.phone || ""}
                      onChange={(e) => handleFieldChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+880 1234 567890"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                      <Upload className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-600">Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {formData.image ? (
                    <div className="mt-3">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="max-h-40 rounded-lg border border-slate-200"
                      />
                    </div>
                  ) : null}
                </div>

                {/* Education — Rich Text Editor */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    Education / Qualifications
                  </label>
                  <div className="border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[120px] [&_.ql-editor]:text-sm [&_.ql-editor]:leading-relaxed">
                    <ReactQuill
                      theme="snow"
                      value={formData.education || ""}
                      onChange={(value) => handleFieldChange("education", value)}
                      placeholder="e.g., B.Sc in CSE, M.Tech in Software Engineering, PhD in AI"
                      modules={quillModules}
                    />
                  </div>
                </div>

                {/* About — Rich Text Editor */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Edit2 className="w-4 h-4 text-violet-500" />
                    About
                  </label>
                  <div className="border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[120px] [&_.ql-editor]:text-sm [&_.ql-editor]:leading-relaxed">
                    <ReactQuill
                      theme="snow"
                      value={formData.about || ""}
                      onChange={(value) => handleFieldChange("about", value)}
                      placeholder="Brief biography and professional background..."
                      modules={quillModules}
                    />
                  </div>
                </div>

                {/* Numeric Stats — 3-column grid */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Numeric Stats
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Years Experience */}
                    <div className="relative bg-blue-50/60 border border-blue-200 rounded-lg p-3 text-center">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-blue-500 mb-2">
                        Years of Experience
                      </span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 text-xs font-bold select-none">#</span>
                        <input
                          type="number"
                          min="0"
                          value={formData.yearsExperience || ""}
                          onChange={(e) => handleFieldChange("yearsExperience", e.target.value)}
                          className="w-full pl-7 pr-3 py-2.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-center text-lg font-bold text-blue-900 placeholder:text-blue-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Publications */}
                    <div className="relative bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 text-center">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-500 mb-2">
                        Publications
                      </span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300 text-xs font-bold select-none">#</span>
                        <input
                          type="number"
                          min="0"
                          value={formData.publications || ""}
                          onChange={(e) => handleFieldChange("publications", e.target.value)}
                          className="w-full pl-7 pr-3 py-2.5 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-center text-lg font-bold text-emerald-900 placeholder:text-emerald-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Awards */}
                    <div className="relative bg-amber-50/60 border border-amber-200 rounded-lg p-3 text-center">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-amber-500 mb-2">
                        Awards & Recognition
                      </span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-300 text-xs font-bold select-none">#</span>
                        <input
                          type="number"
                          min="0"
                          value={formData.awards || ""}
                          onChange={(e) => handleFieldChange("awards", e.target.value)}
                          className="w-full pl-7 pr-3 py-2.5 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-center text-lg font-bold text-amber-900 placeholder:text-amber-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Enter numbers only. These values are displayed on the faculty profile page.
                  </p>
                </div>

                {/* Achievements — Rich Text Editor */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    Achievements
                  </label>
                  <div className="border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[140px] [&_.ql-editor]:text-sm [&_.ql-editor]:leading-relaxed">
                    <ReactQuill
                      theme="snow"
                      value={formData.achievements || ""}
                      onChange={(value) => handleFieldChange("achievements", value)}
                      placeholder="Describe key achievements and milestones..."
                      modules={quillModules}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Use the toolbar to format text. Supports headings, bold, italic, lists, and links.
                  </p>
                </div>

                {/* Research Interests — Tag Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <FlaskConical className="w-4 h-4 text-indigo-500" />
                    Research Interests
                  </label>
                  <div className="border border-slate-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all bg-white">
                    {/* Existing tags */}
                    <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
                      {(formData.researchInterests || "")
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => {
                                const tags = (formData.researchInterests || "")
                                  .split(",")
                                  .map((t) => t.trim())
                                  .filter(Boolean);
                                tags.splice(idx, 1);
                                handleFieldChange("researchInterests", tags.join(", "));
                              }}
                              className="p-0.5 rounded-full hover:bg-indigo-200 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                    </div>
                    {/* Add new tag */}
                    <input
                      type="text"
                      className="w-full px-0 py-1 border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 bg-transparent"
                      placeholder="Type an interest and press Enter (e.g., Machine Learning)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          const val = e.target.value.trim();
                          if (val) {
                            const existing = (formData.researchInterests || "")
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean);
                            if (!existing.includes(val)) {
                              handleFieldChange(
                                "researchInterests",
                                [...existing, val].join(", "),
                              );
                            }
                            e.target.value = "";
                          }
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Press Enter or comma to add. Click × to remove.
                  </p>
                </div>

                {/* Courses Taught — Tag Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                    Courses Taught
                  </label>
                  <div className="border border-slate-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all bg-white">
                    {/* Existing tags */}
                    <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
                      {(formData.courses || "")
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => {
                                const tags = (formData.courses || "")
                                  .split(",")
                                  .map((t) => t.trim())
                                  .filter(Boolean);
                                tags.splice(idx, 1);
                                handleFieldChange("courses", tags.join(", "));
                              }}
                              className="p-0.5 rounded-full hover:bg-emerald-200 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                    </div>
                    {/* Add new tag */}
                    <input
                      type="text"
                      className="w-full px-0 py-1 border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 bg-transparent"
                      placeholder="Type a course and press Enter (e.g., Data Structures)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          const val = e.target.value.trim();
                          if (val) {
                            const existing = (formData.courses || "")
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean);
                            if (!existing.includes(val)) {
                              handleFieldChange(
                                "courses",
                                [...existing, val].join(", "),
                              );
                            }
                            e.target.value = "";
                          }
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Press Enter or comma to add. Click × to remove.
                  </p>
                </div>

                {/* Social Media Links */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Social Media (Optional)
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-500 font-medium mb-1 block">Facebook Profile</label>
                      <input
                        type="url"
                        value={formData.facebook || ""}
                        onChange={(e) => handleFieldChange("facebook", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="https://facebook.com/profile"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-medium mb-1 block">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={formData.linkedin || ""}
                        onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="https://linkedin.com/in/profile"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-medium mb-1 block">Twitter/X Profile</label>
                      <input
                        type="url"
                        value={formData.twitter || ""}
                        onChange={(e) => handleFieldChange("twitter", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="https://twitter.com/profile"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Faculty List */}
      <div className="grid gap-4">
        {filteredFaculty.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No faculty members found</p>
            <p className="text-slate-500 text-sm">Add a faculty member to get started</p>
          </div>
        ) : (
          filteredFaculty.map((member) => (
            <motion.div
              key={member._id || member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 md:p-6 flex items-start gap-4">
                {/* Image */}
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                  />
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        {member.serial && <span className="text-blue-600 mr-2 text-sm font-normal">#{member.serial}</span>}
                        {member.name}
                      </h3>
                      <p className="text-sm text-slate-600">{member.designation}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link
                        href={`/faculty/${member.slug}`}
                        className="p-2 hover:bg-cyan-200 text-cyan-600 rounded-lg transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-2 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(member._id || member.id)}
                        className="p-2 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      {member.department}
                    </span>
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </a>
                    )}
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {member.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Total Faculty</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{faculty.length}</p>
        </div>
        <div className="bg-linear-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
          <p className="text-sm text-emerald-600 font-medium">Departments</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">
            {new Set(faculty.map(f => f.department)).size}
          </p>
        </div>
        <div className="bg-linear-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Designations</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {new Set(faculty.map(f => f.designation)).size}
          </p>
        </div>
      </div>
    </div>
  );
}
