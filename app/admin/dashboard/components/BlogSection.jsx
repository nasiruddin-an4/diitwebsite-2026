"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  FileText,
  Edit2,
  Trash2,
  Loader2,
  X,
  Upload,
  Image as ImageIcon,
  Quote,
  BookOpen,
  PenTool,
  Search,
} from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-slate-50 animate-pulse rounded-xl border border-slate-200" />
  ),
});
import "react-quill-new/dist/quill.bubble.css";

export default function BlogSection({ data, updateField }) {
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const template = {
    title: "",
    category: "BLOG",
    date: new Date().toISOString().split("T")[0],
    image: "",
    excerpt: "",
    content: "",
    author: "DIIT Admin",
    readTime: "5 min read",
  };

  // Filter only blogs from the newsEvents collection
  const allItems = Array.isArray(data?.newsEvents) ? data.newsEvents : [];
  const blogs = allItems.filter((item) => item.category === "BLOG");

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
    setEditingItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveItem = async () => {
    try {
      if (!editingItem.title || !editingItem.date) {
        Swal.fire({
          icon: "warning",
          title: "Missing Info",
          text: "Title and Date are required",
        });
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

      // Update parent state
      let updatedList = [...allItems];
      if (isCreating) {
        updatedList.unshift({ ...editingItem, ...result.item });
      } else {
        const targetId = editingItem._id || editingItem.id;
        const idx = updatedList.findIndex(
          (t) => t._id === targetId || t.id === targetId,
        );
        if (idx !== -1) {
          updatedList[idx] = { ...updatedList[idx], ...editingItem };
        }
      }

      updateField("newsEvents", null, null, updatedList);

      Swal.fire({
        icon: "success",
        title: isCreating ? "Published!" : "Updated!",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });

      handleClose();
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error", text: error.message });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (item) => {
    Swal.fire({
      title: "Delete Blog Post?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const targetId = item._id || item.id;
          if (targetId) {
            const res = await fetch(`/api/admin/news-events?id=${targetId}`, {
              method: "DELETE",
            });
            if (!res.ok) throw new Error("Delete failed");
          }

          const updatedList = allItems.filter(
            (i) => (i._id || i.id) !== targetId,
          );
          updateField("newsEvents", null, null, updatedList);

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            toast: true,
            position: "top-end",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete",
          });
        }
      }
    });
  };

  return (
    <div className="space-y-6 container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-blue-600 pl-4">
            Blog Management
          </h2>
          <p className="text-slate-500 text-sm mt-1 ml-4 underline decoration-blue-200 underline-offset-4">
            Create and curate newsletter-style blog posts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-sm uppercase tracking-wider"
          >
            <PenTool className="w-4 h-4" /> Write New Post
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Total {blogs.length} Posts
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/30">
                <th className="w-[50%] p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Post Title & Analytics
                </th>
                <th className="w-[15%] p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Author
                </th>
                <th className="w-[15%] p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Date
                </th>
                <th className="w-[20%] p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                        <PenTool className="w-8 h-8" />
                      </div>
                      <p className="text-slate-400 text-sm font-medium italic">
                        No blog posts found.
                      </p>
                      <button
                        onClick={handleAdd}
                        className="text-blue-600 font-bold text-sm hover:underline"
                      >
                        Write your first post
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="group hover:bg-slate-50/80 transition-all"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-sm ring-2 ring-white">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-xs">
                              NO IMG
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-extrabold text-slate-800 text-sm leading-tight group-hover:text-blue-600 transition-colors tracking-tight line-clamp-2">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />{" "}
                              {item.readTime || "5 min"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {item.author || "Admin"}
                      </span>
                    </td>
                    <td className="p-4 text-center text-xs font-bold text-slate-500">
                      {item.date}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingItem({ ...item });
                            setEditingId(item._id || item.id);
                            setIsCreating(false);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all font-bold text-[10px] uppercase cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
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

      <AnimatePresence>
        {editingId !== null && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl shadow-2xl my-auto overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                    <PenTool className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                      {isCreating ? "Draft New Post" : "Edit Blog Post"}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      Category: {editingItem.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Sidebar Inputs */}
                  <div className="md:col-span-4 space-y-6">
                    <div className="space-y-4">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[2px]">
                        Featured Image
                      </label>
                      <div className="relative group aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-400">
                        {editingItem.image ? (
                          <img
                            src={editingItem.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Upload className="w-10 h-10 text-slate-200" />
                        )}
                        <label className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 bg-blue-600/40 backdrop-blur-sm transition-all">
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
                                  formData.append("folder", "blogs");
                                  const res = await fetch("/api/upload", {
                                    method: "POST",
                                    body: formData,
                                  });
                                  const result = await res.json();
                                  if (result.success) {
                                    updateLocalField("image", result.url);
                                    Swal.fire({
                                      icon: "success",
                                      title: "Uploaded!",
                                      toast: true,
                                      position: "top-end",
                                      timer: 1000,
                                    });
                                  } else throw new Error(result.message);
                                } catch (error) {
                                  Swal.fire({
                                    icon: "error",
                                    title: "Upload Failed",
                                  });
                                }
                              }
                            }}
                          />
                          <div className="bg-white px-4 py-2 rounded-lg font-black text-xs text-blue-600 uppercase shadow-xl">
                            Choose Photo
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <InputField
                        label="Publish Date"
                        type="date"
                        value={editingItem.date}
                        onChange={(v) => updateLocalField("date", v)}
                      />
                      <InputField
                        label="Author"
                        value={editingItem.author}
                        onChange={(v) => updateLocalField("author", v)}
                      />
                      <InputField
                        label="Reading Time"
                        value={editingItem.readTime}
                        onChange={(v) => updateLocalField("readTime", v)}
                      />
                    </div>
                  </div>

                  {/* Main Content Areas */}
                  <div className="md:col-span-8 space-y-6">
                    <div className="space-y-2">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Main Headline
                      </label>
                      <textarea
                        placeholder="Headline..."
                        rows="2"
                        value={editingItem.title}
                        onChange={(e) =>
                          updateLocalField("title", e.target.value)
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-2xl font-black text-slate-900 focus:border-blue-500 focus:outline-none transition-all resize-none leading-tight"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Quote className="w-3 h-3" /> Summary / Leading Thought
                      </label>
                      <textarea
                        placeholder="Short excerpt for lists..."
                        rows="3"
                        value={editingItem.excerpt || editingItem.desc || ""}
                        onChange={(e) =>
                          updateLocalField("excerpt", e.target.value)
                        }
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-600 font-medium italic focus:bg-white focus:border-blue-400 focus:outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <BookOpen className="w-3 h-3" /> Main Narrative
                      </label>
                      <div className="quill-editor-container bg-slate-50/50 rounded-2xl border border-slate-100 transition-all focus-within:bg-white focus-within:border-blue-200">
                        <ReactQuill
                          theme="bubble"
                          value={
                            typeof editingItem.content === "string"
                              ? editingItem.content
                              : Array.isArray(editingItem.content)
                                ? editingItem.content.join("<br>")
                                : ""
                          }
                          onChange={(val) => updateLocalField("content", val)}
                          modules={{
                            toolbar: [
                              [{ header: [1, 2, 3, false] }],
                              [
                                "bold",
                                "italic",
                                "underline",
                                "strike",
                                "blockquote",
                              ],
                              [{ list: "ordered" }, { list: "bullet" }],
                              ["link", "image", "video"],
                              ["clean"],
                            ],
                          }}
                          placeholder="Tell your story... Select text to format."
                          className="min-h-[500px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-xs uppercase tracking-widest"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveItem}
                  disabled={processing}
                  className="px-10 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black transition-all text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  {processing && <Loader2 className="w-4 h-4 animate-spin" />}{" "}
                  {isCreating ? "Publish Post" : "Update Post"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .quill-editor-container .ql-container.ql-bubble {
          border-radius: 1rem;
          min-height: 500px;
          font-size: 1.125rem;
          font-family: var(--font-manrope), ui-sans-serif, system-ui;
        }
        .quill-editor-container .ql-editor {
          min-height: 500px;
          padding: 2rem;
        }
        .ql-bubble .ql-tooltip {
          background-color: #002652;
          color: white;
          border-radius: 0.75rem;
          padding: 0.5rem 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .ql-bubble .ql-toolbar button {
          color: white !important;
        }
        .ql-bubble .ql-toolbar button:hover {
          color: #60a5fa !important;
        }
        .ql-bubble .ql-stroke {
          stroke: white !important;
        }
      `}</style>
    </div>
  );
}
