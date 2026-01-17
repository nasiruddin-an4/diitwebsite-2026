import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Quote, Edit2, Trash2, Save, Loader2, Upload, User as UserIcon } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

export default function TestimonialsSection({ data, updateField }) {
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [processing, setProcessing] = useState(false);

  const template = { name: "", role: "Alumni", designation: "", batch: "", program: "", text: "", image: "", rating: 5 };

  // Handle both legacy nested structure (if any) and new flat array
  const testimonials = Array.isArray(data?.testimonials)
    ? data.testimonials
    : (data?.testimonials?.students || []);

  const handleAdd = () => {
    setIsCreating(true);
    setEditingItem({ ...template });
    setEditingId("new");
  };

  const handleClose = () => {
    setEditingId(null);
    setEditingItem(null);
    setIsCreating(false);
  };

  const updateLocalField = (field, value) => {
    setEditingItem(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveItem = async () => {
    try {
      if (!editingItem.name || !editingItem.text) {
        Swal.fire({ icon: "warning", title: "Missing Info", text: "Name and Testimony are required" });
        return;
      }

      setProcessing(true);
      const action = isCreating ? "create" : "update";

      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, item: editingItem }),
      });

      const result = await res.json();

      if (!result.success) throw new Error(result.message);

      // Optimistic / State Update
      let updatedList = [...testimonials];
      if (isCreating) {
        // Add new item with ID from server
        updatedList.push({ ...editingItem, ...result.item });
      } else {
        // Update existing item
        const idx = updatedList.findIndex(t => (t._id === editingItem._id) || (t.id === editingItem.id));
        if (idx !== -1) {
          updatedList[idx] = { ...updatedList[idx], ...editingItem };
        }
      }

      updateField("testimonials", null, null, updatedList);

      Swal.fire({
        icon: "success",
        title: isCreating ? "Created!" : "Updated!",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false
      });

      handleClose();
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error", text: error.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (item, index) => {
    Swal.fire({
      title: "Delete Testimonial?",
      text: `Are you sure you want to delete ${item.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Identify ID (could be _id or id)
          const targetId = item._id || item.id;

          if (targetId) {
            const res = await fetch(`/api/admin/testimonials?id=${targetId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
          }

          // Update local state
          const updatedList = testimonials.filter((_, i) => i !== index);
          updateField("testimonials", null, null, updatedList);

          Swal.fire({ icon: "success", title: "Deleted!", toast: true, position: "top-end", timer: 1500, showConfirmButton: false });
        } catch (error) {
          Swal.fire({ icon: "error", title: "Error", text: "Failed to delete" });
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Testimonials</h2>
          <p className="text-slate-500 text-sm mt-1">Manage student success stories</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-all hover:scale-105 active:scale-95 text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="w-[35%] p-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Student Info</th>
                <th className="w-[20%] p-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">Role</th>
                <th className="w-[25%] p-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">Program</th>
                <th className="w-[20%] p-4 pr-8 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-slate-400 text-sm italic">
                    No testimonials available.
                  </td>
                </tr>
              ) : (
                testimonials.map((item, index) => (
                  <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <UserIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 text-sm truncate uppercase tracking-tight">{item.name || "Anonymous"}</p>
                          <p className="text-slate-500 text-xs truncate mt-1 leading-relaxed italic">"{item.text ? item.text.substring(0, 30) + '...' : "No message"}"</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-slate-700 text-xs font-bold uppercase tracking-tight truncate block">
                        {item.role || "Student"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block text-blue-600 text-[10px] font-black uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded border border-blue-100 max-w-full truncate">
                        {item.program || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 pr-8">
                      <div className="flex justify-end items-center gap-3">
                        <button
                          onClick={() => {
                            setEditingItem({ ...item });
                            setEditingId(item._id || item.id || index);
                            setIsCreating(false);
                          }}
                          className="flex items-center gap-2 p-2.5 text-blue-600 bg-white hover:bg-blue-600 hover:text-white rounded-md transition-all border border-blue-100 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item, index)}
                          className="p-2.5 text-red-500 bg-white hover:bg-red-500 hover:text-white rounded-md transition-all border border-red-100 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
                  <Quote className="w-5 h-5 text-blue-600" />
                  {isCreating ? "Add New Testimonial" : "Edit Testimonial"}
                </h3>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Student Name"
                    value={editingItem.name}
                    onChange={(v) => updateLocalField("name", v)}
                    placeholder="e.g. John Doe"
                  />
                  <InputField
                    label="Category / Role"
                    value={editingItem.role}
                    onChange={(v) => updateLocalField("role", v)}
                    placeholder="e.g. Alumni or Student"
                  />
                  <InputField
                    label="Current Designation"
                    value={editingItem.designation}
                    onChange={(v) => updateLocalField("designation", v)}
                    placeholder="e.g. Software Engineer at Google"
                  />
                  <InputField
                    label="Batch"
                    value={editingItem.batch}
                    onChange={(v) => updateLocalField("batch", v)}
                    placeholder="e.g. Batch 2023"
                  />
                  <InputField
                    label="Program/Degree"
                    value={editingItem.program}
                    onChange={(v) => updateLocalField("program", v)}
                    placeholder="e.g. B.Sc. in CSE"
                  />
                  <InputField
                    label="Rating (1-5)"
                    type="number"
                    value={editingItem.rating}
                    onChange={(v) => updateLocalField("rating", parseInt(v) || 5)}
                  />
                </div>

                {/* Avatar Upload */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Student Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      {editingItem.image ? (
                        <img src={editingItem.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      {/* Upload Button */}
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors border border-blue-200 font-semibold text-sm">
                        <Upload className="w-4 h-4" />
                        Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              Swal.showLoading();
                              const formData = new FormData();
                              formData.append("file", file);
                              formData.append("folder", "testimonials");
                              const res = await fetch("/api/upload", { method: "POST", body: formData });
                              const result = await res.json();
                              if (result.success) {
                                updateLocalField("image", result.url);
                                Swal.fire({ icon: "success", title: "Uploaded!", toast: true, position: "top-end", timer: 1000 });
                              } else throw new Error(result.message);
                            } catch (err) {
                              Swal.fire({ icon: "error", title: "Upload Failed" });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <InputField
                  label="Testimonial Message"
                  value={editingItem.text}
                  onChange={(v) => updateLocalField("text", v)}
                  textarea
                  placeholder="What did the student say?..."
                />
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md cursor-pointer font-bold transition-all text-sm"
                >
                  Cancel
                </button>
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
  );
}
