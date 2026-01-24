import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronRight, FileText, Edit2, Trash2, Save, Loader2, X, Upload, Image as ImageIcon, Quote, BookOpen, PlusCircle, MinusCircle } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

export default function NewsSection({ data, updateField }) {
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [processing, setProcessing] = useState(false);

  const template = { title: "", category: "NEWS", date: "", image: "", excerpt: "", content: [""] };

  const newsItems = Array.isArray(data?.newsEvents) ? data.newsEvents : [];

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

  const updateContentParagraph = (pIndex, value) => {
    const newContent = [...(editingItem.content || [])];
    newContent[pIndex] = value;
    updateLocalField("content", newContent);
  };

  const addContentParagraph = () => {
    const newContent = [...(editingItem.content || []), ""];
    updateLocalField("content", newContent);
  };

  const removeContentParagraph = (pIndex) => {
    if (editingItem.content.length <= 1) return;
    const newContent = editingItem.content.filter((_, i) => i !== pIndex);
    updateLocalField("content", newContent);
  };

  const handleSaveItem = async () => {
    try {
      if (!editingItem.title || !editingItem.date) {
        Swal.fire({ icon: "warning", title: "Missing Info", text: "Title and Date are required" });
        return;
      }

      setProcessing(true);
      const action = isCreating ? "create" : "update";

      const res = await fetch("/api/admin/news-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, item: editingItem }),
      });

      const result = await res.json();

      if (!result.success) throw new Error(result.message);

      // Optimistic / State Update
      let updatedList = [...newsItems];
      if (isCreating) {
        updatedList.unshift({ ...editingItem, ...result.item }); // Add to top
      } else {
        const idx = updatedList.findIndex(t => (t._id === editingItem._id) || (t.id === editingItem.id));
        if (idx !== -1) {
          updatedList[idx] = { ...updatedList[idx], ...editingItem };
        }
      }

      // Update parent state to reflect changes immediately
      updateField("newsEvents", null, null, updatedList);

      Swal.fire({
        icon: "success",
        title: isCreating ? "Published!" : "Updated!",
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
      title: "Delete News Item?",
      html: `<p class="text-sm">Are you sure you want to delete <strong>${item.title || 'this item'}</strong>?</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const targetId = item._id || item.id;
          if (targetId) {
            const res = await fetch(`/api/admin/news-events?id=${targetId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
          }

          const updatedList = newsItems.filter((_, i) => i !== index);
          updateField("newsEvents", null, null, updatedList);

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
          <h2 className="text-xl font-bold text-slate-900">News & Events</h2>
          <p className="text-slate-500 text-sm mt-1">Manage latest news, events and announcements</p>
        </div>
        <div className="flex items-center gap-3">
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
                        <p className="text-slate-700 text-xs font-bold">{item.date?.split(',')[0] || item.date || "TBD"}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => {
                            setEditingItem({ ...item });
                            setEditingId(item._id || item.id);
                            setIsCreating(false);
                          }}
                          className="flex items-center gap-2 p-2.5 text-blue-600 bg-white hover:bg-blue-600 hover:text-white rounded-md transition-all border border-blue-100 shadow-sm cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item, index)}
                          className="p-2.5 text-red-500 bg-white hover:bg-red-500 hover:text-white rounded-md transition-all border border-red-100 shadow-sm cursor-pointer"
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

      <AnimatePresence>
        {editingId !== null && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-xl w-full max-w-4xl shadow-xl my-auto"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-slate-100 bg-white/80 backdrop-blur-md rounded-t-xl ">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-blue-600 flex items-center justify-center text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {isCreating ? "Create News Story" : "Refine News Story"}
                    </h3>
                    <p className="text-xs text-slate-500">Edit the details and content</p>
                  </div>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer group">
                  <X className="w-6 h-6 text-slate-400 group-hover:text-slate-600" />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                  {/* Image Upload */}
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
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  Swal.showLoading();
                                  const formData = new FormData();
                                  formData.append("file", file);
                                  formData.append("folder", "news");
                                  const res = await fetch("/api/upload", { method: "POST", body: formData });
                                  const result = await res.json();
                                  if (result.success) {
                                    updateLocalField("image", result.url);
                                    Swal.fire({ icon: "success", title: "Uploaded!", toast: true, position: "top-end", timer: 1000 });
                                  } else throw new Error(result.message);
                                } catch (error) {
                                  Swal.fire({ icon: "error", title: "Upload Failed" });
                                }
                              }
                            }}
                          />
                          <div className="bg-white px-4 py-2 rounded-md shadow-lg font-bold text-sm text-blue-600 flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Change Cover
                          </div>
                        </label>
                      </div>
                      {editingItem.image && (
                        <button onClick={() => updateLocalField("image", "")} className="block w-full text-center text-[10px] font-bold text-red-500 uppercase hover:text-red-600">Remove Image</button>
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
                          onChange={(v) => updateLocalField("date", v)}
                        />
                        <div className="space-y-2">
                          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">Classification</label>
                          <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 text-sm font-semibold text-slate-700 focus:bg-white focus:border-blue-500 focus:outline-none transition-all outline-none h-[42px]"
                            value={editingItem.category}
                            onChange={(e) => updateLocalField("category", e.target.value)}
                          >
                            <option value="NEWS">General News</option>
                            <option value="EVENT">Upcoming Event</option>
                            <option value="ACADEMIC">Academic News</option>
                            <option value="BLOG">Blog</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">Story Headline</label>
                        <textarea
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-xl font-black text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-500 focus:outline-none transition-all resize-none leading-tight"
                          rows="2"
                          placeholder="Headline..."
                          value={editingItem.title}
                          onChange={(e) => updateLocalField("title", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Leading Quote */}
                    <div className="space-y-3">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Quote className="w-3 h-3" /> Leading Quote / Excerpt
                      </label>
                      <div className="relative p-6 pt-10 rounded-3xl border-l-[6px] border-blue-600 bg-blue-50/50">
                        <div className="absolute top-4 left-6"><Quote className="w-8 h-8 text-blue-200" /></div>
                        <textarea
                          className="w-full bg-transparent border-none text-blue-900 font-bold italic text-lg leading-relaxed placeholder:text-blue-200 focus:outline-none transition-all resize-none"
                          rows="3"
                          placeholder="Summary..."
                          value={editingItem.excerpt || editingItem.desc || ""}
                          onChange={(e) => updateLocalField("excerpt", e.target.value)}
                        />
                        <div className="absolute bottom-4 right-6 opacity-10"><FileText className="w-16 h-16 text-blue-600" /></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Paragraphs */}
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
                          <button onClick={() => removeContentParagraph(pIndex)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white"><MinusCircle className="w-4 h-4" /></button>
                        </div>
                        <textarea
                          className="w-full bg-transparent border-none border-b border-transparent focus:border-blue-100 text-slate-700 text-lg leading-relaxed placeholder:text-slate-300 focus:outline-none transition-all resize-none min-h-[100px]"
                          placeholder={`Paragraph ${pIndex + 1}...`}
                          value={para}
                          onChange={(e) => updateContentParagraph(pIndex, e.target.value)}
                        />
                      </div>
                    ))}
                    <button onClick={addContentParagraph} className="w-full py-6 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-blue-200 hover:text-blue-400 group">
                      <PlusCircle className="w-8 h-8 transition-transform group-hover:scale-110" />
                      <span className="font-bold text-xs uppercase tracking-widest">Append Next Paragraph</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-3xl">
                <button onClick={handleClose} className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-md font-bold hover:bg-slate-50 transition-all text-sm cursor-pointer">Discard</button>
                <button onClick={handleSaveItem} disabled={processing} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold transition-all text-sm cursor-pointer flex items-center gap-2">
                  {processing && <Loader2 className="w-4 h-4 animate-spin" />} Save & Publish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
