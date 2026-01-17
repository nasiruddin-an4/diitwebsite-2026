import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronRight, FileText, Edit2, Trash2, Save, Loader2, X, Upload, Image as ImageIcon, Quote, BookOpen, PlusCircle, MinusCircle } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

export default function NewsSection({ data, updateField, addItem, deleteItem, onSave, saving }) {
  const [editingId, setEditingId] = useState(null);
  const template = { id: "", title: "", category: "NEWS", date: "", image: "", excerpt: "", content: [""] };

  const handleAdd = () => {
    const newId = Date.now();
    addItem("newsEvents", { ...template, id: newId, isNew: true });
    setEditingId(newId);
  };

  const handleDoneEditing = () => {
    if (editingId !== null && editingIndex !== -1) {
      const item = editingItem;

      // Strict check for empty content
      const hasContent = item.content?.some(p => p.trim() !== "");
      const isEmpty = !item.title?.trim() && !item.excerpt?.trim() && !item.image?.trim() && !hasContent;

      if (isEmpty) {
        // Remove the item if it has no data
        deleteItem("newsEvents", editingIndex);
      } else {
        // If it's a new valid item, strip the internal isNew flag
        if (item.isNew) {
          const { isNew, ...cleanItem } = item;
          updateField("newsEvents", editingIndex, null, cleanItem);
        }
      }
    }
    setEditingId(null);
  };

  const newsItems = data?.newsEvents || [];
  const editingItem = newsItems.find(p => (p.id || p._id) === editingId);
  const editingIndex = newsItems.findIndex(p => (p.id || p._id) === editingId);

  const handleDelete = (item, index) => {
    Swal.fire({
      title: "Delete News Item?",
      html: `<p class="text-sm">Are you sure you want to delete <strong>${item.title || 'this item'}</strong>? This action cannot be undone.</p>`,
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
        deleteItem("newsEvents", index);
      }
    });
  };

  const updateContentParagraph = (pIndex, value) => {
    const newContent = [...(editingItem.content || [])];
    newContent[pIndex] = value;
    updateField("newsEvents", editingIndex, "content", newContent);
  };

  const addContentParagraph = () => {
    const newContent = [...(editingItem.content || []), ""];
    updateField("newsEvents", editingIndex, "content", newContent);
  };

  const removeContentParagraph = (pIndex) => {
    if (editingItem.content.length <= 1) return;
    const newContent = editingItem.content.filter((_, i) => i !== pIndex);
    updateField("newsEvents", editingIndex, "content", newContent);
  };

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
            className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md font-medium transition-all disabled:opacity-50 text-sm cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium cursor-pointer transition-all hover:scale-105 active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" /> Add News Item
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="w-[45%] p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Article Details</th>
                <th className="w-[15%] p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Type</th>
                <th className="w-[20%] p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Date</th>
                <th className="w-[20%] p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {newsItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-slate-400 text-sm italic">
                    No news items available.
                  </td>
                </tr>
              ) : (
                newsItems.map((item, index) => (
                  <tr key={item.id || index} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 text-sm truncate uppercase tracking-tight">{item.title || "Untitled Article"}</p>
                          <p className="text-slate-500 text-xs truncate mt-1 leading-relaxed">{item.excerpt || item.desc || "No summary provided"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider
                            ${item.category === 'EVENT' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                          item.category === 'NOTICE' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                            'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                        {item.category || 'NEWS'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-slate-700 text-xs font-bold">{item.date?.split(',')[0] || "TBD"}</p>
                        <p className="text-slate-400 text-[10px] font-medium mt-0.5">{item.date?.split(',')[1]?.trim() || ""}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => setEditingId(item.id || item._id)}
                          className="flex items-center gap-2 p-2.5 text-blue-600 bg-white hover:bg-blue-600 hover:text-white rounded-md transition-all border border-blue-100 shadow-sm cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item, index)}
                          className="p-2.5 text-red-500 bg-white hover:bg-red-500 hover:text-white rounded-md transition-all border border-red-100 shadow-sm cursor-pointer"
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

      {/* Edit Modal - Enhanced to look like Details Page */}
      <AnimatePresence>
        {editingId !== null && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-xl w-full max-w-4xl shadow-xl my-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-slate-100 bg-white/80 backdrop-blur-md rounded-t-xl ">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-blue-600 flex items-center justify-center text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {editingItem.isNew ? "Create News Story" : "Refine News Story"}
                    </h3>
                    <p className="text-xs text-slate-500">Edit the details and content structure</p>
                  </div>
                </div>
                <button
                  onClick={handleDoneEditing}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer group"
                >
                  <X className="w-6 h-6 text-slate-400 group-hover:text-slate-600" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">

                {/* 1. Top Meta Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  <div className="md:col-span-4 space-y-4">
                    <div className="space-y-4">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[2px]">Cover Imagery</label>
                      <div className="relative group">
                        <div className="aspect-[4/5] rounded-xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-300">
                          {editingItem.image ? (
                            <img src={editingItem.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          ) : (
                            <div className="text-center p-4">
                              <Upload className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Awaiting Image</p>
                            </div>
                          )}
                        </div>
                        <label className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 bg-blue-600/10 backdrop-blur-[2px] transition-all rounded-xl">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  Swal.fire({ icon: "error", title: "Too large", text: "Image size must be less than 5MB", toast: true, position: "top-end", timer: 3000 });
                                  return;
                                }

                                try {
                                  Swal.showLoading();
                                  const formData = new FormData();
                                  formData.append("file", file);
                                  formData.append("folder", "news");

                                  const res = await fetch("/api/upload", {
                                    method: "POST",
                                    body: formData,
                                  });
                                  const result = await res.json();

                                  if (result.success) {
                                    updateField("newsEvents", editingIndex, "image", result.url);
                                    Swal.fire({ icon: "success", title: "Uploaded!", text: "Cover image updated", toast: true, position: "top-end", timer: 2000 });
                                  } else {
                                    throw new Error(result.message);
                                  }
                                } catch (error) {
                                  console.error("News upload error:", error);
                                  Swal.fire({ icon: "error", title: "Upload Failed", text: error.message || "Could not upload image" });
                                }
                              }
                            }}

                            className="hidden"
                          />
                          <div className="bg-white px-4 py-2 rounded-md shadow-lg font-bold text-sm text-blue-600 flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Change Cover
                          </div>
                        </label>
                      </div>
                      {editingItem.image && (
                        <button onClick={() => updateField("newsEvents", editingIndex, "image", "")} className="block w-full text-center text-[10px] font-bold text-red-500 uppercase hover:text-red-600">Remove Image</button>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-8 space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Publishing Date"
                          type="date"
                          value={editingItem.date}
                          onChange={(v) => updateField("newsEvents", editingIndex, "date", v)}
                        />
                        <div className="space-y-2">
                          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">Classification</label>
                          <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 text-sm font-semibold text-slate-700 focus:bg-white focus:border-blue-500 focus:outline-none transition-all outline-none h-[42px]"
                            value={editingItem.category}
                            onChange={(e) => updateField("newsEvents", editingIndex, "category", e.target.value)}
                          >
                            <option value="NEWS">General News</option>
                            <option value="EVENT">Upcoming Event</option>
                            <option value="ACADEMIC">Academic Update</option>
                            <option value="NOTICE">Official Notice</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">Story Headline</label>
                        <textarea
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-xl font-black text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 focus:outline-none transition-all resize-none leading-tight"
                          rows="2"
                          placeholder="The headline that catches attention..."
                          value={editingItem.title}
                          onChange={(e) => updateField("newsEvents", editingIndex, "title", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* 2. Quote/Excerpt Box (Like the design provided) */}
                    <div className="space-y-3">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Quote className="w-3 h-3" /> Leading Quote / Excerpt
                      </label>
                      <div className="relative p-6 pt-10 rounded-3xl border-l-[6px] border-blue-600 bg-blue-50/50">
                        <div className="absolute top-4 left-6">
                          <Quote className="w-8 h-8 text-blue-200" />
                        </div>
                        <textarea
                          className="w-full bg-transparent border-none text-blue-900 font-bold italic text-lg leading-relaxed placeholder:text-blue-200 focus:outline-none transition-all resize-none"
                          rows="3"
                          placeholder="Enter a compelling summary or standout quote here..."
                          value={editingItem.excerpt || editingItem.desc || ""}
                          onChange={(e) => updateField("newsEvents", editingIndex, "excerpt", e.target.value)}
                        />
                        <div className="absolute bottom-4 right-6 opacity-10">
                          <FileText className="w-16 h-16 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Detailed Story Content (Paragraph by Paragraph) */}
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Story Narrative</h4>
                    </div>
                    <button
                      onClick={addContentParagraph}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add Paragraph
                    </button>
                  </div>

                  <div className="space-y-8 max-w-3xl mx-auto">
                    {(editingItem.content || [""]).map((para, pIndex) => (
                      <div key={pIndex} className="group relative">
                        <div className="absolute -left-12 top-0 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">{pIndex + 1}</div>
                          <button
                            onClick={() => removeContentParagraph(pIndex)}
                            className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        </div>

                        {pIndex === 0 ? (
                          <div className="relative">
                            <span className="absolute left-0 top-1 text-5xl font-black text-blue-600 opacity-20 pointer-events-none select-none">
                              {para ? para.charAt(0).toUpperCase() : "D"}
                            </span>
                            <textarea
                              className="w-full bg-transparent border-none border-b border-transparent focus:border-blue-100 text-slate-700 text-lg leading-relaxed placeholder:text-slate-300 focus:outline-none transition-all resize-none min-h-[120px] pt-1 pl-1"
                              placeholder="Start writing the lead paragraph..."
                              value={para}
                              onChange={(e) => updateContentParagraph(pIndex, e.target.value)}
                            />
                          </div>
                        ) : (
                          <textarea
                            className="w-full bg-transparent border-none border-b border-transparent focus:border-blue-100 text-slate-700 text-lg leading-relaxed placeholder:text-slate-300 focus:outline-none transition-all resize-none min-h-[100px]"
                            placeholder={`Paragraph ${pIndex + 1}...`}
                            value={para}
                            onChange={(e) => updateContentParagraph(pIndex, e.target.value)}
                          />
                        )}
                      </div>
                    ))}

                    {(!editingItem.content || editingItem.content.length === 0) && (
                      <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                        <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-medium">Click "Add Paragraph" to start the story.</p>
                      </div>
                    )}

                    <button
                      onClick={addContentParagraph}
                      className="w-full py-6 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-blue-200 hover:text-blue-400 transition-all group"
                    >
                      <PlusCircle className="w-8 h-8 transition-transform group-hover:scale-110" />
                      <span className="font-bold text-xs uppercase tracking-widest">Append Next Paragraph</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-3xl">
                <button
                  onClick={handleDoneEditing}
                  className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-md font-bold hover:bg-slate-50 transition-all text-sm cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleDoneEditing}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold transition-all text-sm cursor-pointer"
                >
                  Confirm & Finalize
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
