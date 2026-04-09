"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, Loader2, Image as ImageIcon, Edit2, Trash2,
  Save, Home, Upload, CheckCircle2, RefreshCw,
} from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

/* ─────────────────────────────────────────────────────────────
   EMPTY FORM DEFAULTS
───────────────────────────────────────────────────────────────*/
const EMPTY_SLIDE = { title: "", subtitle: "", image: "" };

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────*/
export default function HeroSection({ data, updateField, addItem, deleteItem, onSave, saving }) {
  // ── Modal state ──────────────────────────────────────────────
  const [mode, setMode] = useState(null);         // "create" | "edit" | null
  const [editingSlide, setEditingSlide] = useState(null); // slide being edited
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState(EMPTY_SLIDE);

  // ── Loading states ───────────────────────────────────────────
  const [uploading, setUploading] = useState(false);
  const [saving2, setSaving2] = useState(false);   // create / update in progress
  const [deletingId, setDeletingId] = useState(null);

  const slides = data?.heroSlides || [];

  /* ── Helpers ──────────────────────────────────────────────── */
  const openCreate = () => {
    setFormData(EMPTY_SLIDE);
    setMode("create");
  };

  const openEdit = (slide, index) => {
    setEditingSlide(slide);
    setEditingIndex(index);
    setFormData({
      title: slide.title || "",
      subtitle: slide.subtitle || "",
      image: slide.image || "",
    });
    setMode("edit");
  };

  const closeModal = () => {
    setMode(null);
    setEditingSlide(null);
    setEditingIndex(null);
    setFormData(EMPTY_SLIDE);
  };

  const updateForm = (field, value) => setFormData(p => ({ ...p, [field]: value }));

  /* ── Image upload ─────────────────────────────────────────── */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return Swal.fire({ icon: "error", title: "File too large", text: "Max 5 MB allowed.", toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "hero");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const result = await res.json();
      if (result.success) {
        updateForm("image", result.url);
        Swal.fire({ icon: "success", title: "Uploaded!", toast: true, position: "top-end", timer: 2000, showConfirmButton: false });
      } else throw new Error(result.message);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Upload Failed", text: err.message, toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
    } finally {
      setUploading(false);
    }
  };

  /* ── CREATE ────────────────────────────────────────────────── */
  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.image) {
      return Swal.fire({ icon: "warning", title: "Required fields missing", text: "Title and image are required.", toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
    }
    setSaving2(true);
    try {
      const payload = { ...formData, order: slides.length };
      const res = await fetch("/api/admin/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      addItem("heroSlides", { ...payload, _id: result.data._id, id: result.data._id });
      closeModal();
      Swal.fire({ icon: "success", title: "Slide Created!", text: "New slide has been saved to the database.", toast: true, position: "top-end", timer: 2500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Create Failed", text: err.message || "Could not create slide.", toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
    } finally {
      setSaving2(false);
    }
  };

  /* ── UPDATE ────────────────────────────────────────────────── */
  const handleUpdate = async () => {
    if (!formData.title.trim() || !formData.image) {
      return Swal.fire({ icon: "warning", title: "Required fields missing", text: "Title and image are required.", toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
    }
    const slideId = editingSlide?._id || editingSlide?.id;
    setSaving2(true);
    try {
      const payload = { _id: slideId, ...formData };
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      // Sync local state: update each field
      ["title", "subtitle", "image"].forEach(f => {
        updateField("heroSlides", editingIndex, f, formData[f]);
      });
      closeModal();
      Swal.fire({ icon: "success", title: "Slide Updated!", text: "Changes saved to database.", toast: true, position: "top-end", timer: 2500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Update Failed", text: err.message || "Could not update slide.", toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
    } finally {
      setSaving2(false);
    }
  };

  /* ── DELETE ────────────────────────────────────────────────── */
  const handleDelete = async (slide, index) => {
    const confirmed = await Swal.fire({
      title: "Delete this slide?",
      text: "This action is permanent and cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });
    if (!confirmed.isConfirmed) return;

    const slideId = slide._id || slide.id;
    setDeletingId(slideId);
    try {
      const res = await fetch(`/api/admin/hero?id=${slideId}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Delete failed");

      deleteItem("heroSlides", index);
      Swal.fire({ icon: "success", title: "Deleted!", text: "Slide removed from database.", toast: true, position: "top-end", timer: 2500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Delete Failed", text: err.message, toast: true, position: "top-end", timer: 3000, showConfirmButton: false });
    } finally {
      setDeletingId(null);
    }
  };

  /* ── RENDER ──────────────────────────────────────────────────*/
  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" /> Hero Carousel
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage slides displayed on the homepage — {slides.length} slide{slides.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 text-sm shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" /> New Slide
          </button>
        </div>
      </div>

      {/* ── Slide List ───────────────────────────────────────── */}
      {slides.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-14 text-center">
          <Home className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-800 text-lg mb-1">No slides yet</h3>
          <p className="text-sm text-slate-500 mb-6">Create your first slide to launch the homepage carousel.</p>
          <button onClick={openCreate} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-all">
            + Add First Slide
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-20">#</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Preview</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Content</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {slides.map((slide, index) => {
                const id = slide._id || slide.id;
                const isDeleting = deletingId === id;
                return (
                  <tr key={id || index} className="group hover:bg-blue-50/30 transition-colors">
                    {/* Order badge */}
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                        {index + 1}
                      </span>
                    </td>
                    {/* Thumbnail */}
                    <td className="p-4">
                      <div className="w-28 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative shadow-sm">
                        {slide.image
                          ? <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                          : <ImageIcon className="w-6 h-6 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        }
                      </div>
                    </td>
                    {/* Content */}
                    <td className="p-4 max-w-xs">
                      <p className="font-bold text-slate-900 text-sm truncate">{slide.title || "Untitled"}</p>
                      {slide.subtitle && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{slide.subtitle}</p>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEdit(slide, index)}
                          disabled={isDeleting}
                          title="Edit slide"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 disabled:opacity-40 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(slide, index)}
                          disabled={isDeleting}
                          title="Delete slide"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 disabled:opacity-40 transition-all"
                        >
                          {isDeleting
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />
                          }
                          {isDeleting ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create / Edit Modal ──────────────────────────────── */}
      <AnimatePresence>
        {mode !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-slate-50">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  {mode === "create"
                    ? <><Plus className="w-5 h-5 text-blue-600" /> Create New Slide</>
                    : <><Edit2 className="w-5 h-5 text-blue-600" /> Edit Slide</>
                  }
                </h3>
                <button
                  onClick={closeModal}
                  disabled={saving2}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

                {/* Image Upload — first */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Slide Background Image *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Preview */}
                    <div className="w-full sm:w-52 h-32 rounded-xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden relative flex-shrink-0">
                      {formData.image
                        ? <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        : <ImageIcon className="w-10 h-10 text-slate-300" />
                      }
                      {uploading && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                      )}
                    </div>
                    {/* Upload target */}
                    <label className={`flex-1 flex items-center justify-center h-32 border-2 border-dashed rounded-xl transition-all ${uploading ? "opacity-50 cursor-not-allowed border-slate-200" : "border-blue-300 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer bg-blue-50/20"}`}>
                      <div className="text-center">
                        {uploading
                          ? <Loader2 className="w-7 h-7 text-blue-500 mx-auto mb-1 animate-spin" />
                          : <Upload className="w-7 h-7 text-blue-500 mx-auto mb-1" />
                        }
                        <p className="text-xs font-bold text-blue-700">{uploading ? "Uploading…" : "Click to upload"}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Recommended: 1920 × 600 px · Max 5 MB</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                    </label>
                  </div>
                  {formData.image && (
                    <p className="text-[10px] text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Image ready
                    </p>
                  )}
                </div>

                {/* Title — second */}
                <InputField
                  label="Slide Title *"
                  value={formData.title}
                  onChange={(v) => updateForm("title", v)}
                  placeholder="Main headline…"
                />

                {/* Subtitle — third */}
                <InputField
                  label="Subtitle"
                  value={formData.subtitle}
                  onChange={(v) => updateForm("subtitle", v)}
                  placeholder="Supporting text…"
                  textarea
                />
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  disabled={saving2}
                  className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={mode === "create" ? handleCreate : handleUpdate}
                  disabled={saving2 || uploading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-50 shadow-sm"
                >
                  {saving2
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> {mode === "create" ? "Creating…" : "Updating…"}</>
                    : mode === "create"
                      ? <><Plus className="w-4 h-4" /> Create Slide</>
                      : <><RefreshCw className="w-4 h-4" /> Update Slide</>
                  }
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
