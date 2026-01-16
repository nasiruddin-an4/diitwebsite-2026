import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Loader2, Image as ImageIcon, Edit2, Trash2, Save, Home, ChevronRight } from "lucide-react";
import { InputField } from "./InputField";

export default function HeroSection({ data, updateField, addItem, deleteItem, onSave, saving }) {
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newSlide, setNewSlide] = useState({
    title: "",
    subtitle: "",
    image: "",
    buttons: {
      primary: { text: "Explore Programs", link: "/programs" },
      secondary: { text: "Contact Us", link: "/contact" }
    }
  });

  const [operationMessage, setOperationMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setOperationMessage({ type, text });
    setTimeout(() => setOperationMessage({ type: "", text: "" }), 3000);
  };

  const slides = data?.heroSlides || [];
  const editingSlide = slides.find(s => (s.id || s._id) === editingId);
  const editingIndex = slides.findIndex(s => (s.id || s._id) === editingId);

  // Helper to handle nested button updates
  const updateNestedField = (index, buttonType, field, value) => {
    const slide = slides[index];
    const currentButtons = slide.buttons || { primary: {}, secondary: {} };
    const updatedButtons = {
      ...currentButtons,
      [buttonType]: {
        ...currentButtons[buttonType],
        [field]: value
      }
    };
    updateField("heroSlides", index, "buttons", updatedButtons);
  };

  // Helper to handle Upload
  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "hero");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) {
        if (typeof index === 'number') {
          updateField("heroSlides", index, "image", result.url);
        } else {
          setNewSlide(prev => ({ ...prev, image: result.url }));
        }
        showMessage("success", "Image uploaded successfully");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
      showMessage("error", "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // CREATE
  const handleCreateSlide = async () => {
    if (!newSlide.title) {
      showMessage("error", "Title is required");
      return;
    }

    const id = Date.now();
    addItem("heroSlides", { ...newSlide, id });
    setIsCreating(false);
    setNewSlide({
      title: "",
      subtitle: "",
      image: "",
      buttons: { primary: { text: "Explore", link: "/programs" }, secondary: { text: "Contact", link: "/contact" } }
    });
    showMessage("success", "Slide added. Don't forget to Save Changes.");
  };

  // DELETE
  const handleDeleteSlide = async () => {
    if (deleteId) {
      const index = slides.findIndex(s => (s.id || s._id) === deleteId);
      if (index !== -1) deleteItem("heroSlides", index);
      setDeleteId(null);
      showMessage("success", "Slide deleted. Don't forget to Save Changes.");
    }
  };

  const handleAdd = () => setIsCreating(true);

  // Creation Form
  if (isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between text-slate-900 border-b border-slate-200 pb-4">
          <h2 className="text-lg font-bold">Add New Slide</h2>
          <button
            onClick={() => setIsCreating(false)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Slide Image</label>
              {uploading ? (
                <div className="h-24 w-full bg-slate-50 border border-slate-200 border-dashed rounded-xl flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
              ) : (
                <div className="relative group">
                  <label
                    className="flex items-center gap-2 w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 cursor-pointer hover:bg-slate-50 transition-colors text-sm shadow-sm"
                  >
                    <ImageIcon className="w-4 h-4 text-slate-500" />
                    <span className="truncate">{newSlide.image ? "Change Image" : "Upload Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                  {newSlide.image && (
                    <div className="mt-2 relative h-24 w-full rounded-lg overflow-hidden border border-slate-200">
                      <img src={newSlide.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>
            <InputField label="Title" value={newSlide.title} onChange={(v) => setNewSlide(p => ({ ...p, title: v }))} />
            <InputField label="Subtitle" value={newSlide.subtitle} onChange={(v) => setNewSlide(p => ({ ...p, subtitle: v }))} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateSlide}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all text-sm shadow-md shadow-green-600/20"
            >
              Add Slide
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Edit Mode - Inline Form
  if (editingId !== null && editingIndex !== -1 && editingSlide) {
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
            <h2 className="text-lg font-bold">Edit Slide</h2>
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
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Slide Image</label>
              {uploading ? (
                <div className="h-24 w-full bg-slate-50 border border-slate-200 border-dashed rounded-xl flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
              ) : (
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, editingIndex)}
                    className="hidden"
                    id={`edit-upload-${editingId}`}
                  />
                  <label
                    htmlFor={`edit-upload-${editingId}`}
                    className="flex items-center gap-2 w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 cursor-pointer hover:bg-slate-50 transition-colors text-sm shadow-sm"
                  >
                    <ImageIcon className="w-4 h-4 text-slate-500" />
                    <span className="truncate">{editingSlide.image ? "Change Image" : "Upload Image"}</span>
                  </label>
                  {editingSlide.image && (
                    <div className="mt-2 relative h-24 w-full rounded-lg overflow-hidden border border-slate-200">
                      <img src={editingSlide.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>
            <InputField label="Title" value={editingSlide.title} onChange={(v) => updateField("heroSlides", editingIndex, "title", v)} />
            <InputField label="Subtitle" value={editingSlide.subtitle} onChange={(v) => updateField("heroSlides", editingIndex, "subtitle", v)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Button</h3>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Text" value={editingSlide.buttons?.primary?.text} onChange={(v) => updateNestedField(editingIndex, "primary", "text", v)} />
                <InputField label="Link" value={editingSlide.buttons?.primary?.link} onChange={(v) => updateNestedField(editingIndex, "primary", "link", v)} />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Secondary Button</h3>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Text" value={editingSlide.buttons?.secondary?.text} onChange={(v) => updateNestedField(editingIndex, "secondary", "text", v)} />
                <InputField label="Link" value={editingSlide.buttons?.secondary?.link} onChange={(v) => updateNestedField(editingIndex, "secondary", "link", v)} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Hero Slides Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage the hero carousel slides displayed on the homepage</p>
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
            <Plus className="w-4 h-4" /> Add New Slide
          </button>
        </div>
      </div>

      {slides.length > 0 && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100 mb-2">
          <span>Total Slides: {slides.length}</span>
        </div>
      )}

      {operationMessage.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl mb-4 ${operationMessage.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
            }`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            {operationMessage.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {operationMessage.text}
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {slides.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Home className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No slides yet</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">Create your first hero slide to showcase important content on the homepage.</p>
            <button
              onClick={handleAdd}
              className="mt-6 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-2 mx-auto"
            >
              Get Started <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          slides.map((slide, index) => (
            <motion.div
              key={slide.id || index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 group hover:border-blue-200 hover:shadow-lg transition-all shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-medium border border-slate-200">
                    {index + 1}
                  </span>
                  <h3 className="font-semibold text-slate-900 line-clamp-1">{slide.title || "Untitled Slide"}</h3>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingId(slide.id || slide._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(slide.id || slide._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-1 md:col-span-1 relative h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                  {slide.image ? (
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-[10px]">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Title</span>
                    <p className="text-sm font-medium text-slate-900 line-clamp-2">{slide.title || "—"}</p>

                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 mt-4">Subtitle</span>
                    <p className="text-sm text-slate-600 line-clamp-2">{slide.subtitle || "No subtitle"}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Actions</span>
                    <div className="flex flex-wrap gap-2">
                      {slide.buttons?.primary?.text && (
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium border border-blue-100">
                          {slide.buttons.primary.text}
                        </span>
                      )}
                      {slide.buttons?.secondary?.text && (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium border border-slate-200">
                          {slide.buttons.secondary.text}
                        </span>
                      )}
                      {!slide.buttons?.primary?.text && !slide.buttons?.secondary?.text && (
                        <span className="text-xs text-slate-400 italic">No buttons configured</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2 mx-auto">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">Delete Slide?</h3>
                <p className="text-slate-500 mt-2 text-sm">
                  Are you sure you want to delete this slide? This action cannot be undone.
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
                  onClick={handleDeleteSlide}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all font-medium text-sm shadow-lg shadow-red-600/20"
                >
                  Delete Slide
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
