import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronRight, BookOpen, Edit2, Trash2, Save, Loader2 } from "lucide-react";
import { InputField } from "./InputField";

export default function ProgramsSection({ data, updateField, addItem, deleteItem, onSave, saving }) {
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const template = { id: "", title: "", category: "", duration: "", degree: "", description: "", image: "" };

  const handleAdd = () => {
    const newId = Date.now();
    addItem("programsData", { ...template, id: newId });
    setEditingId(newId);
  };

  const programs = data?.programsData || [];
  const editingProgram = programs.find(p => (p.id || p._id) === editingId);
  const editingIndex = programs.findIndex(p => (p.id || p._id) === editingId);

  // If we are editing,  // Edit Mode - Inline
  if (editingId !== null && editingIndex !== -1) {
    const editingItem = data.programsData[editingIndex];
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between text-slate-900 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditingId(null)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <h2 className="text-lg font-bold">Edit Program</h2>
          </div>
          <button
            onClick={() => setEditingId(null)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all text-sm shadow-md shadow-blue-600/20"
          >
            Done Editing
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField label="Title" value={editingItem.title} onChange={(v) => updateField("programsData", editingIndex, "title", v)} />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Icon (Lucide Name)</label>
              <input
                type="text"
                value={editingItem.icon}
                onChange={(e) => updateField("programsData", editingIndex, "icon", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
              />
              <p className="text-[10px] text-slate-400">e.g. "BookOpen", "Code", "Cpu"</p>
            </div>
          </div>
          <InputField label="Description" value={editingItem.desc} onChange={(v) => updateField("programsData", editingIndex, "desc", v)} textarea />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Programs</h2>
          <p className="text-slate-500 text-sm mt-1">Manage academic programs and courses</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all disabled:opacity-50 text-sm shadow-md shadow-slate-900/20"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95 text-sm"
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
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Program Title</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.programsData?.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-500 text-sm">
                    No programs found.
                  </td>
                </tr>
              ) : (
                data?.programsData?.map((item, index) => (
                  <tr key={item.id || index} className="group hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-slate-600 text-sm line-clamp-2 max-w-md">{item.desc}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingId(item.id || index)} // Use index if ID missing for simplified editing
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id || index)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Delete"
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Program?</h3>
                <p className="text-slate-500 mt-2 text-sm">
                  Are you sure? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const index = programs.findIndex(p => (p.id || p._id) === deleteId);
                    if (index !== -1) deleteItem("programsData", index);
                    setDeleteId(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all font-medium text-sm shadow-md shadow-red-600/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
