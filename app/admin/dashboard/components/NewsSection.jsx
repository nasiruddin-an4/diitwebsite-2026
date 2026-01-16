import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronRight, FileText, Edit2, Trash2, Save, Loader2 } from "lucide-react";
import { InputField } from "./InputField";

export default function NewsSection({ data, updateField, addItem, deleteItem, onSave, saving }) {
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const template = { id: "", title: "", category: "NEWS", date: "", image: "", excerpt: "", content: [] };

  const handleAdd = () => {
    const newId = Date.now();
    addItem("newsEvents", { ...template, id: newId });
    setEditingId(newId);
  };

  const newsItems = data?.newsEvents || [];
  const editingItem = newsItems.find(p => (p.id || p._id) === editingId);
  const editingIndex = newsItems.findIndex(p => (p.id || p._id) === editingId);

  // Edit Mode - Inline
  if (editingId !== null && editingIndex !== -1) {
    const editingItem = data.newsEvents[editingIndex];
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
            <h2 className="text-lg font-bold">Edit News Item</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputField label="Title" value={editingItem.title} onChange={(v) => updateField("newsEvents", editingIndex, "title", v)} />
            <InputField label="Date" type="date" value={editingItem.date} onChange={(v) => updateField("newsEvents", editingIndex, "date", v)} />
            <InputField label="Image URL" value={editingItem.image} onChange={(v) => updateField("newsEvents", editingIndex, "image", v)} />
          </div>
          <InputField label="Description" value={editingItem.desc} onChange={(v) => updateField("newsEvents", editingIndex, "desc", v)} textarea />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">News & Events</h2>
          <p className="text-slate-500 text-sm mt-1">Manage latest news, events and announcements</p>
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
            <Plus className="w-4 h-4" /> Add News Item
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">News Content</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.newsEvents?.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-500 text-sm">
                    No news items found.
                  </td>
                </tr>
              ) : (
                data?.newsEvents?.map((item, index) => (
                  <tr key={item.id || index} className="group hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm line-clamp-1">{item.title || "Untitled News"}</p>
                          <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{item.desc || "No description"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 text-sm whitespace-nowrap">
                      {item.date || "No date"}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingId(item.id || index)}
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
                <h3 className="text-lg font-bold text-slate-900">Delete News Item?</h3>
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
                    const index = newsItems.findIndex(p => (p.id || p._id) === deleteId);
                    if (index !== -1) deleteItem("newsEvents", index);
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
