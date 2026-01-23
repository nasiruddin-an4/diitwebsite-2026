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
    Phone,
    User,
    Upload,
} from "lucide-react";

const typeOptions = [
    { value: "Chairman", label: "Chairman" },
    { value: "Governing Body", label: "Governing Body" },
    { value: "Administrative", label: "Administrative" },
];

export default function AdministrativeSection() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(null);
    const [filterType, setFilterType] = useState("All");

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/academics/administrative");
            const result = await res.json();

            if (result.success) {
                setStaff(result.data);
            } else {
                Swal.fire("Error", "Failed to load staff", "error");
            }
        } catch (error) {
            console.error("Error fetching staff:", error);
            Swal.fire("Error", "Error loading staff", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setFormData({
            name: "",
            designation: "",
            type: "Administrative", // Default
            serial: "",
            email: "",
            phone: "",
            image: "",
            message: "",
            facebook: "",
            linkedin: "",
            twitter: "",
            instagram: "",
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
                Swal.fire({
                    title: 'Uploading...',
                    text: 'Please wait',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: (() => {
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("folder", "administrative");
                        return formData;
                    })(),
                });
                const result = await res.json();

                if (result.success) {
                    setFormData(prev => ({ ...prev, image: result.url }));
                    Swal.close();
                    Swal.fire({
                        icon: 'success',
                        title: 'Uploaded!',
                        text: 'Image uploaded successfully',
                        timer: 1500,
                        showConfirmButton: false
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
        if (!formData.name || !formData.designation || !formData.type) {
            Swal.fire("Warning", "Name, designation, and type are required", "warning");
            return;
        }

        setSaving(true);
        try {
            const method = editingId ? "PUT" : "POST";
            const payload = editingId ? { ...formData, _id: editingId } : formData;

            const res = await fetch("/api/admin/academics/administrative", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: editingId ? "Member updated successfully" : "Member created successfully",
                    timer: 1500,
                    showConfirmButton: false
                });
                fetchStaff();
                handleCancel();
            } else {
                Swal.fire("Error", result.message || "Failed to save member", "error");
            }
        } catch (error) {
            console.error("Error saving member:", error);
            Swal.fire("Error", "Error saving member", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: 'Deleting...',
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const res = await fetch(`/api/admin/academics/administrative?id=${id}`, {
                    method: "DELETE",
                });

                const apiResult = await res.json();

                if (apiResult.success) {
                    Swal.fire(
                        'Deleted!',
                        'Member has been deleted.',
                        'success'
                    );
                    fetchStaff();
                } else {
                    Swal.fire("Error", "Failed to delete member", "error");
                }
            } catch (error) {
                console.error("Error deleting member:", error);
                Swal.fire("Error", "Error deleting member", "error");
            }
        }
    };

    const filteredStaff = (filterType === "All"
        ? staff
        : staff.filter(f => f.type === filterType)).sort((a, b) => (a.serial || 9999) - (b.serial || 9999));

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
                    <h2 className="text-2xl font-bold text-slate-800">Administrative Staff</h2>
                    <p className="text-slate-600 text-sm mt-1">Manage Governing Body and Academic Administration</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Add Member
                </button>
            </div>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
                {["All", ...typeOptions.map(d => d.value)].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === type
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                    >
                        {type}
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
                                    {editingId ? "Edit Member" : "Add New Member"}
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
                                        placeholder="e.g., Dr. Md. Sabur Khan"
                                    />
                                </div>

                                {/* Designation, Type, and Serial */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Designation
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.designation}
                                            onChange={(e) => handleFieldChange("designation", e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., Chairman"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Type
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => handleFieldChange("type", e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {typeOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Serial (Order)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.serial || ""}
                                            onChange={(e) => handleFieldChange("serial", e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., 1"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
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

                                {/* Social Media Links */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        Social Media & Contact
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-500 font-medium mb-1 block">Email</label>
                                            <input
                                                type="email"
                                                value={formData.email || ""}
                                                onChange={(e) => handleFieldChange("email", e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                placeholder="email@diit.edu.bd"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 font-medium mb-1 block">LinkedIn</label>
                                            <input
                                                type="url"
                                                value={formData.linkedin || ""}
                                                onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                placeholder="LinkedIn URL"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 font-medium mb-1 block">Facebook</label>
                                            <input
                                                type="url"
                                                value={formData.facebook || ""}
                                                onChange={(e) => handleFieldChange("facebook", e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                placeholder="Facebook URL"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 font-medium mb-1 block">Instagram</label>
                                            <input
                                                type="url"
                                                value={formData.instagram || ""}
                                                onChange={(e) => handleFieldChange("instagram", e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                placeholder="Instagram URL"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Message/Bio */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Message/Short Bio
                                    </label>
                                    <textarea
                                        value={formData.message || ""}
                                        onChange={(e) => handleFieldChange("message", e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        placeholder="Enter a short message or about DIIT..."
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

            {/* Staff List */}
            <div className="grid gap-4">
                {filteredStaff.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-600 font-medium">No members found</p>
                        <p className="text-slate-500 text-sm">Add a member to get started</p>
                    </div>
                ) : (
                    filteredStaff.map((member) => (
                        <motion.div
                            key={member._id || member.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-4 md:p-6 flex items-start gap-4">
                                {/* Image */}
                                {member.image ? (
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                        <User className="w-8 h-8 text-slate-300" />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800">{member.name}</h3>
                                            <p className="text-sm text-slate-600">{member.designation}</p>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
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
                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded ${member.type === 'Governing Body' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            <User className="w-4 h-4" />
                                            {member.type}
                                        </span>
                                        {member.serial && (
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono">
                                                #{member.serial}
                                            </span>
                                        )}
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
        </div >
    );
}
