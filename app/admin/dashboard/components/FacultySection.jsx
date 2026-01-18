"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";

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
    });
    setEditingId(null);
    setIsAdding(true);
  };

  const handleEdit = (member) => {
    setFormData({ ...member });
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
      const payload = editingId ? { ...formData, _id: editingId } : formData;

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
    if (!confirm("Are you sure you want to delete this faculty member?")) return;

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
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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

                {/* Education */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Education/Qualifications
                  </label>
                  <textarea
                    value={formData.education || ""}
                    onChange={(e) => handleFieldChange("education", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="e.g., B.Sc in CSE, M.Tech in Software Engineering, PhD in AI"
                    rows="3"
                  />
                </div>

                {/* About */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    About
                  </label>
                  <textarea
                    value={formData.about || ""}
                    onChange={(e) => handleFieldChange("about", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Brief biography and professional background..."
                    rows="3"
                  />
                </div>

                {/* Years Experience */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    value={formData.yearsExperience || ""}
                    onChange={(e) => handleFieldChange("yearsExperience", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 10+, 15 years"
                  />
                </div>

                {/* Publications */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Publications
                  </label>
                  <textarea
                    value={formData.publications || ""}
                    onChange={(e) => handleFieldChange("publications", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="List of publications and research papers..."
                    rows="3"
                  />
                </div>

                {/* Awards */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Awards & Recognition
                  </label>
                  <textarea
                    value={formData.awards || ""}
                    onChange={(e) => handleFieldChange("awards", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Awards, honors, and recognition received..."
                    rows="3"
                  />
                </div>

                {/* Achievements */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Achievements
                  </label>
                  <textarea
                    value={formData.achievements || ""}
                    onChange={(e) => handleFieldChange("achievements", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Key achievements and milestones..."
                    rows="3"
                  />
                </div>

                {/* Research Interests */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Research Interests
                  </label>
                  <textarea
                    value={formData.researchInterests || ""}
                    onChange={(e) => handleFieldChange("researchInterests", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="e.g., AI, Machine Learning, Data Science (comma separated)"
                    rows="3"
                  />
                </div>

                {/* Courses */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Courses Taught
                  </label>
                  <textarea
                    value={formData.courses || ""}
                    onChange={(e) => handleFieldChange("courses", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="e.g., CS101 - Data Structures, CS205 - Algorithms..."
                    rows="3"
                  />
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
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{member.name}</h3>
                      <p className="text-sm text-slate-600">{member.designation}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link
                        href={`/faculty/${member._id || member.id}`}
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
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Total Faculty</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{faculty.length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
          <p className="text-sm text-emerald-600 font-medium">Departments</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">
            {new Set(faculty.map(f => f.department)).size}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Designations</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {new Set(faculty.map(f => f.designation)).size}
          </p>
        </div>
      </div>
    </div>
  );
}
