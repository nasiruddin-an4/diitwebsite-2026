import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Users, Edit2, Trash2, Save, Loader2, Upload, Globe, Quote } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

export default function PartnersSection({ data, updateField, addItem, deleteItem }) {
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // Local state for the item being edited/created
  const [isCreating, setIsCreating] = useState(false);
  const [processing, setProcessing] = useState(false); // For local loading states

  const template = { id: "", name: "", logo: "", country: "", type: "", description: "", website: "" };

  const partners = data?.internationalPartners || [];
  const benefits = data?.collaborationBenefits || [];
  const [newBenefit, setNewBenefit] = useState("");

  const handleSaveBenefits = async (updatedBenefits) => {
    // Optimistic update
    updateField("collaborationBenefits", null, null, updatedBenefits);

    try {
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateBenefits", benefits: updatedBenefits }),
      });
      if (!res.ok) throw new Error("Failed to save");

      const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
      Toast.fire({ icon: 'success', title: 'Benefits updated' });
    } catch (error) {
      console.error("Benefit save error:", error);
      Swal.fire({ icon: "error", title: "Save Failed", text: "Could not save benefits", toast: true });
    }
  };

  const handleAdd = () => {
    setIsCreating(true);
    setEditingItem({ ...template }); // Start with empty template
    setEditingId("new");
  };

  const handleEdit = (partner) => {
    setIsCreating(false);
    setEditingItem({ ...partner }); // detailed copy
    setEditingId(partner.id || partner._id);
  };

  const handleClose = () => {
    setEditingId(null);
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleSaveItem = async () => {
    if (!editingItem.name?.trim()) {
      Swal.fire({ icon: "warning", title: "Missing Name", text: "Partner name is required", toast: true, position: "top-end", timer: 2000 });
      return;
    }

    setProcessing(true);
    try {
      const action = isCreating ? "create" : "update";
      const payload = {
        action,
        partner: editingItem,
        id: editingItem.id || editingItem._id
      };

      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.success) {
        if (isCreating) {
          // Add to parent state
          addItem("internationalPartners", result.partner);
        } else {
          // Update parent state
          // Find index
          const index = partners.findIndex(p => (p.id || p._id) === editingId);
          if (index !== -1) {
            updateField("internationalPartners", index, null, editingItem);
          }
        }

        Swal.fire({ icon: "success", title: "Saved!", text: "Partner saved successfully", toast: true, position: "top-end", timer: 2000 });
        handleClose();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Save partner error:", error);
      Swal.fire({ icon: "error", title: "Save Failed", text: error.message, toast: true, position: "top-end", timer: 3000 });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (partner, index) => {
    const result = await Swal.fire({
      title: "Delete Partner?",
      html: `<p class="text-sm">Are you sure you want to delete <strong>${partner.name || 'this partner'}</strong>? This action cannot be undone.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-lg px-6 py-2 font-bold",
        cancelButton: "rounded-lg px-6 py-2 font-bold"
      }
    });

    if (result.isConfirmed) {
      try {
        const id = partner.id || partner._id;

        // If it looks like a temporary ID (rare now as we fetch from DB), just remove local
        // But better to always try API if possible
        const res = await fetch(`/api/admin/partners?id=${id}`, { method: "DELETE" });
        const apiResult = await res.json();

        if (apiResult.success) {
          deleteItem("internationalPartners", index);
          Swal.fire({ icon: "success", title: "Deleted", text: "Partner removed", toast: true, position: "top-end", timer: 2000 });
        } else {
          throw new Error(apiResult.message);
        }
      } catch (error) {
        console.error("Delete partner error:", error);
        Swal.fire({ icon: "error", title: "Delete Failed", text: error.message, toast: true });
      }
    }
  };

  // Local field updater for the modal form
  const updateLocalField = (field, value) => {
    setEditingItem(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Partners List */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">International Partners</h2>
            <p className="text-slate-500 text-sm mt-1">Manage partner universities and institutions</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer font-medium transition-all hover:scale-105 active:scale-95 text-sm"
            >
              <Plus className="w-4 h-4" /> Add Partner
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Partner</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location & Type</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {partners.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-slate-500 text-sm">
                      No partners found.
                    </td>
                  </tr>
                ) : (
                  partners.map((partner, index) => (
                    <tr key={partner.id || index} className="group hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 p-1.5">
                            {partner.logo ? (
                              <img src={partner.logo} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <Users className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{partner.name || "Untitled"}</p>
                            {partner.website && (
                              <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-[10px] hover:underline flex items-center gap-1 mt-0.5">
                                <Globe className="w-2.5 h-2.5" /> Visit Site
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="font-medium text-slate-700">{partner.country || "N/A"}</p>
                          <p className="text-xs text-slate-500">{partner.type || "N/A"}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEdit(partner)}
                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md cursor-pointer transition-all border border-blue-200"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(partner, index)}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-md cursor-pointer transition-all border border-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingId !== null && editingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    {isCreating ? "Add New Partner" : "Edit Partner"}
                  </h3>
                  <button onClick={handleClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Name" value={editingItem.name} onChange={(v) => updateLocalField("name", v)} />
                    <InputField label="Country" value={editingItem.country} onChange={(v) => updateLocalField("country", v)} />
                    <InputField label="Partnership Type" value={editingItem.type} onChange={(v) => updateLocalField("type", v)} />
                    <InputField label="Website URL" value={editingItem.website} onChange={(v) => updateLocalField("website", v)} placeholder="https://example.com" />
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Partner Logo</label>
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-md bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden p-2 shrink-0">
                        {editingItem.logo ? (
                          <img src={editingItem.logo} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                          <Users className="w-10 h-10 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <label className="flex items-center justify-center h-24 border-2 border-dashed border-blue-200 rounded-md cursor-pointer bg-blue-50/30 hover:bg-blue-50 transition-colors group">
                          <div className="text-center">
                            <Upload className="w-6 h-6 text-blue-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                            <p className="text-xs font-bold text-blue-700">Upload Logo</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  Swal.fire({ icon: "error", title: "Too large", text: "Logo must be less than 5MB", toast: true, position: "top-end", timer: 3000 });
                                  return;
                                }

                                try {
                                  Swal.showLoading();
                                  const formData = new FormData();
                                  formData.append("file", file);
                                  formData.append("folder", "partners");

                                  const res = await fetch("/api/upload", {
                                    method: "POST",
                                    body: formData,
                                  });
                                  const result = await res.json();

                                  if (result.success) {
                                    updateLocalField("logo", result.url);
                                    Swal.fire({ icon: "success", title: "Uploaded!", text: "Logo updated", toast: true, position: "top-end", timer: 2000 });
                                  } else {
                                    throw new Error(result.message);
                                  }
                                } catch (error) {
                                  console.error("Partner logo upload error:", error);
                                  Swal.fire({ icon: "error", title: "Upload Failed", text: error.message || "Could not upload logo" });
                                }
                              }
                            }}

                            className="hidden"
                          />
                        </label>
                        {editingItem.logo && (
                          <button onClick={() => updateLocalField("logo", "")} className="text-[10px] text-red-600 font-bold hover:underline">
                            Remove logo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <InputField label="Description" value={editingItem.description} onChange={(v) => updateLocalField("description", v)} textarea />
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                  <button onClick={handleClose} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md cursor-pointer font-bold transition-all text-sm">Cancel</button>
                  <button
                    onClick={handleSaveItem}
                    disabled={processing}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer font-bold transition-all text-sm flex items-center gap-2"
                  >
                    {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save & Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Collaboration Benefits Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Quote className="w-5 h-5 text-blue-600" />
          Collaboration Benefits (Carousel Text)
        </h3>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
            placeholder="Add new benefit text..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newBenefit.trim()) {
                const updated = [...benefits, newBenefit.trim()];
                handleSaveBenefits(updated);
                setNewBenefit("");
              }
            }}
          />
          <button
            onClick={() => {
              if (newBenefit.trim()) {
                const updated = [...benefits, newBenefit.trim()];
                handleSaveBenefits(updated);
                setNewBenefit("");
              }
            }}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition-colors"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {benefits.length === 0 && <p className="text-slate-500 text-sm italic">No benefits added yet.</p>}
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm group">
              <p className="text-slate-700 text-sm font-medium">{benefit}</p>
              <button
                onClick={() => {
                  const updated = benefits.filter((_, i) => i !== idx);
                  handleSaveBenefits(updated);
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-green-600 mt-3 text-right flex justify-end items-center gap-1">
          <Save className="w-3 h-3" /> Changes saved immediately
        </p>
      </div>
    </div>
  );
}
