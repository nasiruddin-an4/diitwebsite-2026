import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, BookOpen, Edit2, Trash2, Save, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

export default function ProgramsSection({ data, updateField, addItem, deleteItem, onSave, saving }) {
  const [editingId, setEditingId] = useState(null);
  const template = { id: "", title: "", category: "learning", duration: "4 Years", degree: "", description: "", image: "" };

  const handleAdd = () => {
    const newId = Date.now();
    addItem("programsData", { ...template, id: newId, isNew: true });
    setEditingId(newId);
  };

  const handleDoneEditing = () => {
    if (editingId !== null && editingIndex !== -1) {
      const item = editingProgram;
      const isEmpty = !item.title?.trim() && !item.description?.trim() && !item.image?.trim();

      if (isEmpty) {
        deleteItem("programsData", editingIndex);
      } else {
        if (item.isNew) {
          const { isNew, ...cleanItem } = item;
          updateField("programsData", editingIndex, null, cleanItem);
        }
      }
    }
    setEditingId(null);
  };

  const programs = data?.programsData || [];
  const editingProgram = programs.find(p => (p.id || p._id) === editingId);
  const editingIndex = programs.findIndex(p => (p.id || p._id) === editingId);

  const handleDelete = (item, index) => {
    Swal.fire({
      title: "Delete Program?",
      html: `<p class="text-sm">Are you sure you want to delete <strong>${item.title || 'this program'}</strong>? This action cannot be undone.</p>`,
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
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem("programsData", index);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Academic Programs</h2>
          <p className="text-slate-500 text-sm mt-1">Manage degrees, durations and program details</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl font-medium transition-all disabled:opacity-50 text-sm shadow-md"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg transition-all hover:scale-105 active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Program
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Program</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Degree & Duration</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {programs.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-500 text-sm">
                    No programs found.
                  </td>
                </tr>
              ) : (
                programs.map((item, index) => (
                  <tr key={item.id || index} className="group hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <BookOpen className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{item.title || "Untitled Program"}</p>
                          <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{item.category || "General"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="font-medium text-slate-700">{item.degree || "N/A"}</p>
                        <p className="text-xs text-slate-500">{item.duration || "N/A"}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => setEditingId(item.id || item._id)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all border border-blue-200"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item, index)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-200"
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
        {editingId !== null && editingProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  {editingProgram.isNew ? "Add New Program" : "Edit Program"}
                </h3>
                <button
                  onClick={handleDoneEditing}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Program Title"
                    value={editingProgram.title}
                    onChange={(v) => updateField("programsData", editingIndex, "title", v)}
                    placeholder="e.g. Computer Science..."
                  />
                  <InputField
                    label="Category"
                    value={editingProgram.category}
                    onChange={(v) => updateField("programsData", editingIndex, "category", v)}
                    placeholder="e.g. engineering, business..."
                  />
                  <InputField
                    label="Degree Name"
                    value={editingProgram.degree}
                    onChange={(v) => updateField("programsData", editingIndex, "degree", v)}
                    placeholder="e.g. B.Sc. in CSE"
                  />
                  <InputField
                    label="Duration"
                    value={editingProgram.duration}
                    onChange={(v) => updateField("programsData", editingIndex, "duration", v)}
                    placeholder="e.g. 4 Years"
                  />
                </div>

                {/* Image Upload Area */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Program Image</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-40 h-40 rounded-xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                      {editingProgram.image ? (
                        <img src={editingProgram.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <label className="flex items-center justify-center h-40 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer bg-blue-50/30 hover:bg-blue-50 transition-all group">
                        <div className="text-center p-4">
                          <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                          <p className="text-sm font-semibold text-blue-700">Click to upload image</p>
                          <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                Swal.fire({ icon: "error", title: "Too large", text: "Image size must be less than 5MB", toast: true, position: "top-end", timer: 3000 });
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (ev) => updateField("programsData", editingIndex, "image", ev.target.result);
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      {editingProgram.image && (
                        <button
                          onClick={() => updateField("programsData", editingIndex, "image", "")}
                          className="text-xs text-red-600 font-bold hover:underline"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <InputField
                  label="Description"
                  value={editingProgram.description}
                  onChange={(v) => updateField("programsData", editingIndex, "description", v)}
                  textarea
                  placeholder="Tell more about the program..."
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button
                  onClick={handleDoneEditing}
                  className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDoneEditing}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-blue-600/20"
                >
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
