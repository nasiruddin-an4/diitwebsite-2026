"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  Plus,
  Trash2,
  Save,
  X,
  Loader2,
  Edit2,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Linkedin,
  User,
  Upload,
  Phone,
  Hash,
  CheckCircle,
  ArrowUpDown,
} from "lucide-react";

// Common DIIT Departments
const departmentOptions = [
  { value: "BBA", label: "BBA" },
  { value: "MBA", label: "MBA" },
  { value: "CSE", label: "CSE" },
  { value: "BTHM", label: "BTHM" },
  { value: "Others", label: "Others" },
];

export default function AlumniSection() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [filterDept, setFilterDept] = useState("All");
  const [sortOrderChanged, setSortOrderChanged] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  // Local editable sort orders keyed by _id
  const [editableSortOrders, setEditableSortOrders] = useState({});

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/alumni");
      const result = await res.json();

      if (result.success) {
        setAlumni(result.data);
        // Initialize editable sort orders from fetched data
        const orders = {};
        result.data.forEach((a, i) => {
          orders[a._id] =
            a.sortOrder !== undefined && a.sortOrder !== null ? a.sortOrder : i;
        });
        setEditableSortOrders(orders);
      } else {
        Swal.fire("Error", "Failed to load alumni data", "error");
      }
    } catch (error) {
      console.error("Error fetching alumni:", error);
      Swal.fire("Error", "Error loading alumni data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      name: "",
      department: "BBA",
      batch: "",
      designation: "",
      company: "",
      location: "",
      image: "",
      linkedin: "",
      email: "",
      phone: "",
      message: "",
    });
    setEditingId(null);
    setIsAdding(true);
  };

  const handleEdit = (alum) => {
    setFormData({ ...alum });
    setEditingId(alum._id);
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
        Swal.fire({
          title: "Uploading...",
          text: "Please wait",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const res = await fetch("/api/upload", {
          method: "POST",
          body: (() => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", "alumni");
            return formData;
          })(),
        });
        const result = await res.json();

        if (result.success) {
          setFormData((prev) => ({ ...prev, image: result.url }));
          Swal.close();
          Swal.fire({
            icon: "success",
            title: "Uploaded!",
            text: "Image uploaded successfully",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error("Upload error:", error);
        Swal.fire("Error", "Failed to upload image", "error");
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.department) {
      Swal.fire("Warning", "Name and Department are required", "warning");
      return;
    }

    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { ...formData, _id: editingId } : formData;

      const res = await fetch("/api/admin/alumni", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: editingId
            ? "Alumni updated successfully"
            : "Alumni added successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchAlumni();
        handleCancel();
      } else {
        Swal.fire("Error", result.message || "Failed to save alumni", "error");
      }
    } catch (error) {
      console.error("Error saving alumni:", error);
      Swal.fire("Error", "Error saving alumni", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Deleting...",
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const res = await fetch(`/api/admin/alumni?id=${id}`, {
          method: "DELETE",
        });

        const apiResult = await res.json();

        if (apiResult.success) {
          Swal.fire("Deleted!", "Alumni has been deleted.", "success");
          fetchAlumni();
        } else {
          Swal.fire("Error", "Failed to delete alumni", "error");
        }
      } catch (error) {
        console.error("Error deleting alumni:", error);
        Swal.fire("Error", "Error deleting alumni", "error");
      }
    }
  };

  // --- Sort Order Functions ---
  const handleSortOrderChange = (id, value) => {
    const numValue = value === "" ? "" : parseInt(value, 10);
    setEditableSortOrders((prev) => ({ ...prev, [id]: numValue }));
    setSortOrderChanged(true);
  };

  const handleSaveSortOrder = async () => {
    // Validate: no empty values
    const hasEmpty = Object.values(editableSortOrders).some(
      (v) => v === "" || isNaN(v),
    );
    if (hasEmpty) {
      Swal.fire(
        "Warning",
        "Please enter a valid number for all alumni sort positions",
        "warning",
      );
      return;
    }

    setSavingOrder(true);
    try {
      const sortUpdates = Object.entries(editableSortOrders).map(
        ([_id, sortOrder]) => ({
          _id,
          sortOrder: Number(sortOrder),
        }),
      );

      const res = await fetch("/api/admin/alumni", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortUpdates }),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Order Saved!",
          text: "Alumni display order has been updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        setSortOrderChanged(false);
        fetchAlumni();
      } else {
        Swal.fire(
          "Error",
          result.message || "Failed to save sort order",
          "error",
        );
      }
    } catch (error) {
      console.error("Error saving sort order:", error);
      Swal.fire("Error", "Error saving sort order", "error");
    } finally {
      setSavingOrder(false);
    }
  };

  const filteredAlumni =
    filterDept === "All"
      ? alumni
      : alumni.filter((a) => a.department === filterDept);

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
          <h2 className="text-2xl font-bold text-slate-800">
            Alumni Management
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Manage alumni network and success stories
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Save Sort Order Button */}
          <AnimatePresence>
            {sortOrderChanged && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                onClick={handleSaveSortOrder}
                disabled={savingOrder}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-all font-medium cursor-pointer shadow-lg shadow-emerald-200 disabled:opacity-50"
              >
                {savingOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> Save Order
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Alumni
          </button>
        </div>
      </div>

      {/* Sort Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
          <ArrowUpDown className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-blue-800">
            Sort Order (Number System)
          </p>
          <p className="text-xs text-blue-600">
            Assign a serial number to each alumni. Lower numbers appear first on
            the website (1 = first, 2 = second...). Change the numbers and click
            &quot;Save Order&quot; to update.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["All", ...departmentOptions.map((d) => d.value)].map((dept) => (
          <button
            key={dept}
            onClick={() => setFilterDept(dept)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterDept === dept
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
                  {editingId ? "Edit Alumni" : "Add New Alumni"}
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
                    placeholder="e.g., Sarah Ahmed"
                  />
                </div>

                {/* Department & Batch */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        handleFieldChange("department", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {departmentOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Batch
                    </label>
                    <input
                      type="text"
                      value={formData.batch}
                      onChange={(e) =>
                        handleFieldChange("batch", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 10th Batch"
                    />
                  </div>
                </div>

                {/* Professional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) =>
                        handleFieldChange("designation", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., HR Manager"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        handleFieldChange("company", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Unilever Bangladesh"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleFieldChange("location", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Dhaka, Bangladesh"
                  />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        handleFieldChange("phone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., +880..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin || ""}
                      onChange={(e) =>
                        handleFieldChange("linkedin", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@example.com"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                      <Upload className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-600">
                        Upload Photo
                      </span>
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

                {/* Message/Bio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message/Success Story
                  </label>
                  <textarea
                    value={formData.message || ""}
                    onChange={(e) =>
                      handleFieldChange("message", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter a message or success story..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-slate-300 cursor-pointer text-slate-700 rounded-md hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
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

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredAlumni.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No alumni found</p>
            <p className="text-slate-500 text-sm">Add alumni to get started</p>
          </div>
        ) : (
          filteredAlumni.map((alum) => (
            <motion.div
              key={alum._id || alum.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Card Image */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                {alum.image ? (
                  <img
                    src={alum.image}
                    alt={alum.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50">
                    <User className="w-16 h-16 text-slate-200" />
                  </div>
                )}

                {/* Serial Number Badge - Top Left */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-lg px-1.5 py-1 shadow-sm">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">
                    Serial
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={
                      editableSortOrders[alum._id] !== undefined
                        ? editableSortOrders[alum._id]
                        : ""
                    }
                    onChange={(e) =>
                      handleSortOrderChange(alum._id, e.target.value)
                    }
                    className="w-12 h-7 text-center text-sm font-bold border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-700 bg-white transition-all"
                    title="Display order number (lower = shown first)"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Department Badge - Top Right */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-bold shadow-sm">
                    {alum.department}
                  </span>
                </div>

                {/* Action Buttons - Bottom Right (visible on hover) */}
                <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <button
                    onClick={() => handleEdit(alum)}
                    className="p-2 bg-white/90 backdrop-blur-sm hover:bg-blue-500 text-blue-600 hover:text-white rounded-lg transition-all shadow-sm cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(alum._id)}
                    className="p-2 bg-white/90 backdrop-blur-sm hover:bg-red-500 text-red-600 hover:text-white rounded-lg transition-all shadow-sm cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <h3 className="text-[15px] font-bold text-slate-800 leading-tight mb-1 truncate">
                  {alum.name}
                </h3>
                <p className="text-[13px] font-medium text-slate-500 truncate">
                  {alum.designation}
                </p>
                {alum.company && (
                  <p className="text-[12px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                    <Briefcase className="w-3 h-3 shrink-0" />
                    {alum.company}
                  </p>
                )}

                {/* Batch & Location Row */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {alum.batch && (
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {alum.batch}
                    </span>
                  )}
                  {alum.location && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {alum.location}
                    </span>
                  )}
                </div>

                {/* Contact Icons Row */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  {alum.email && (
                    <a
                      href={`mailto:${alum.email}`}
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                      title={alum.email}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {alum.phone && (
                    <a
                      href={`tel:${alum.phone}`}
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                      title={alum.phone}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {alum.linkedin && (
                    <a
                      href={alum.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Floating Save Order Button */}
      <AnimatePresence>
        {sortOrderChanged && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <button
              onClick={handleSaveSortOrder}
              disabled={savingOrder}
              className="flex items-center gap-3 px-6 py-3.5 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all font-semibold cursor-pointer shadow-2xl shadow-emerald-300/50 disabled:opacity-50"
            >
              {savingOrder ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Saving Order...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" /> Save Display Order
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
