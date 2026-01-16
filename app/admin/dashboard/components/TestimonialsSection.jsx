import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Quote, Edit2, Trash2, Save, Loader2, Upload, User as UserIcon } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

export default function TestimonialsSection({ data, updateField, addItem, deleteItem, onSave, saving }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const template = { name: "", role: "Student", program: "", text: "", university: "", image: "", rating: 5 };

  const students = data?.testimonials?.students || [];

  const handleAdd = () => {
    const newStudents = [...students, { ...template, isNew: true }];
    updateField("testimonials", null, "students", newStudents);
    setEditingIndex(newStudents.length - 1);
  };

  const handleDoneEditing = () => {
    if (editingIndex !== null && students[editingIndex]) {
      const item = students[editingIndex];
      const isEmpty = !item.name?.trim() && !item.text?.trim();

      if (isEmpty) {
        const newStudents = students.filter((_, i) => i !== editingIndex);
        updateField("testimonials", null, "students", newStudents);
      } else {
        if (item.isNew) {
          const { isNew, ...cleanItem } = item;
          const newStudents = [...students];
          newStudents[editingIndex] = cleanItem;
          updateField("testimonials", null, "students", newStudents);
        }
      }
    }
    setEditingIndex(null);
  };

  const handleUpdate = (index, field, value) => {
    const newStudents = [...students];
    newStudents[index] = { ...newStudents[index], [field]: value };
    updateField("testimonials", null, "students", newStudents);
  };

  const handleDelete = (index) => {
    const item = students[index];
    Swal.fire({
      title: "Delete Testimonial?",
      html: `<p class="text-sm">Are you sure you want to delete testimonial from <strong>${item.name || 'this student'}</strong>?</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-lg px-6 py-2 font-bold",
        cancelButton: "rounded-lg px-6 py-2 font-bold"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newStudents = students.filter((_, i) => i !== index);
        updateField("testimonials", null, "students", newStudents);
      }
    });
  };

  const editingItem = editingIndex !== null ? students[editingIndex] : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Testimonials</h2>
          <p className="text-slate-500 text-sm mt-1">Manage student success stories and recommendations</p>
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
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role & Program</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-500 text-sm">
                    No testimonials found.
                  </td>
                </tr>
              ) : (
                students.map((item, index) => (
                  <tr key={index} className="group hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <UserIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{item.name || "Anonymous"}</p>
                          <p className="text-slate-500 text-xs line-clamp-1">{item.text || "No text provided"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="font-medium text-slate-700">{item.role || "Student"}</p>
                        <p className="text-xs text-slate-500">{item.program || "N/A"}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => setEditingIndex(index)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all border border-blue-200"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
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
        {editingIndex !== null && editingItem && (
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
                  <Quote className="w-5 h-5 text-blue-600" />
                  {editingItem.isNew ? "Add New Testimonial" : "Edit Testimonial"}
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
                    label="Student Name"
                    value={editingItem.name}
                    onChange={(v) => handleUpdate(editingIndex, "name", v)}
                    placeholder="e.g. John Doe"
                  />
                  <InputField
                    label="Role"
                    value={editingItem.role}
                    onChange={(v) => handleUpdate(editingIndex, "role", v)}
                    placeholder="e.g. Alumni - Batch 2024"
                  />
                  <InputField
                    label="Program/Degree"
                    value={editingItem.program}
                    onChange={(v) => handleUpdate(editingIndex, "program", v)}
                    placeholder="e.g. B.Sc. in CSE"
                  />
                  <InputField
                    label="Rating (1-5)"
                    type="number"
                    value={editingItem.rating}
                    onChange={(v) => handleUpdate(editingIndex, "rating", parseInt(v) || 5)}
                  />
                </div>

                {/* Avatar Upload Area */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Student Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {editingItem.image ? (
                        <img src={editingItem.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors border border-blue-200 font-semibold text-sm">
                        <Upload className="w-4 h-4" />
                        Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => handleUpdate(editingIndex, "image", ev.target.result);
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      {editingItem.image && (
                        <button
                          onClick={() => handleUpdate(editingIndex, "image", "")}
                          className="block text-xs text-red-600 font-bold hover:underline"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <InputField
                  label="Testimonial Message"
                  value={editingItem.text}
                  onChange={(v) => handleUpdate(editingIndex, "text", v)}
                  textarea
                  placeholder="What did the student say?..."
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
