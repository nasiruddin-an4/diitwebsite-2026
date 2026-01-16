import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Loader2, Image as ImageIcon, Edit2, Trash2, Save, Home, ChevronRight } from "lucide-react";
import { InputField } from "./InputField";
import Image from "next/image";

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        onClick={() => setIsCreating(false)}
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-8 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Create New Slide</h2>
              <p className="text-slate-600 text-sm mt-2">Design and configure your hero slide content</p>
            </div>
            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreating(false)}
              className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Modal Content */}
          <div className="p-8 space-y-8 max-h-[calc(100vh-280px)] overflow-y-auto">
            {/* Step 1: Image & Content */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-sm font-bold">1</div>
                <span>Slide Content</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Slide Image *</label>
                  {uploading ? (
                    <div className="h-64 w-full bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-600">Uploading image...</p>
                      </div>
                    </div>
                  ) : newSlide.image ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative h-64 w-full rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg group"
                    >
                      <Image src={newSlide.image} fill alt="Preview" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <label className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/40 cursor-pointer">
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 text-white mx-auto mb-2" />
                          <p className="text-sm font-semibold text-white">Change Image</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, true)}
                          className="hidden"
                        />
                      </label>
                    </motion.div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-4 w-full px-8 py-12 bg-gradient-to-br from-blue-50 via-slate-50 to-slate-50 border-2 border-dashed border-blue-300 rounded-2xl text-slate-600 cursor-pointer hover:border-blue-500 hover:bg-blue-50/80 transition-all group">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-100 transition-colors shadow-lg"
                      >
                        <ImageIcon className="w-8 h-8 text-blue-600" />
                      </motion.div>
                      <div className="text-center">
                        <p className="font-bold text-slate-900 text-base">Upload Image</p>
                        <p className="text-xs text-slate-500 mt-2">Drag and drop or click to select</p>
                        <p className="text-[10px] text-slate-400 mt-1">Recommended: 1920x600px, JPG or PNG</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Content Section */}
                <div className="space-y-5">
                  <div>
                    <InputField 
                      label="Slide Title *" 
                      value={newSlide.title} 
                      onChange={(v) => setNewSlide(p => ({ ...p, title: v }))}
                      placeholder="e.g., Welcome to DIIT"
                    />
                    <p className="text-xs text-slate-500 mt-2">Displayed as the main headline on the slide</p>
                  </div>
                  <div>
                    <InputField 
                      label="Slide Subtitle" 
                      value={newSlide.subtitle} 
                      onChange={(v) => setNewSlide(p => ({ ...p, subtitle: v }))}
                      placeholder="e.g., Excellence in Digital Education"
                    />
                    <p className="text-xs text-slate-500 mt-2">Displayed as supporting text (optional)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Message */}
            {operationMessage.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${operationMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
                  }`}
              >
                {operationMessage.type === "success" ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                {operationMessage.text}
              </motion.div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between gap-3 p-8 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500">* Required fields</p>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreating(false)}
                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all text-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateSlide}
                className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all text-sm shadow-lg shadow-blue-600/40 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Slide
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Edit Mode - Inline Form
  if (editingId !== null && editingIndex !== -1 && editingSlide) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditingId(null)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Edit Slide</h2>
              <p className="text-slate-600 text-sm mt-1">Update slide content and actions</p>
            </div>
          </div>
          <button
            onClick={() => setEditingId(null)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer font-semibold transition-all text-sm"
          >
            Done Editing
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Slide Image</label>
              {uploading ? (
                <div className="h-48 w-full bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Uploading...</p>
                  </div>
                </div>
              ) : editingSlide.image ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative h-48 w-full rounded-xl overflow-hidden border-2 border-slate-200 shadow-md group"
                >
                  <Image src={editingSlide.image} fill alt="Preview" className="object-cover" />
                  <label htmlFor={`edit-upload-${editingId}`} className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/40 cursor-pointer">
                    <div className="text-center">
                      <ImageIcon className="w-6 h-6 text-white mx-auto mb-1" />
                      <p className="text-xs font-semibold text-white">Change Image</p>
                    </div>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, editingIndex)}
                    className="hidden"
                    id={`edit-upload-${editingId}`}
                  />
                </motion.div>
              ) : (
                <label
                  htmlFor={`edit-upload-${editingId}`}
                  className="flex flex-col items-center justify-center gap-3 w-full px-6 py-8 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <ImageIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-slate-900">Upload Image</span>
                    <p className="text-xs text-slate-500 mt-1">Drag and drop or click to select</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, editingIndex)}
                    className="hidden"
                    id={`edit-upload-${editingId}`}
                  />
                </label>
              )}
            </div>

            {/* Content Section */}
            <div className="space-y-5">
              <InputField 
                label="Slide Title" 
                value={editingSlide.title} 
                onChange={(v) => updateField("heroSlides", editingIndex, "title", v)}
              />
              <InputField 
                label="Slide Subtitle" 
                value={editingSlide.subtitle} 
                onChange={(v) => updateField("heroSlides", editingIndex, "subtitle", v)}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Hero Slides</h2>
          <p className="text-slate-600 text-sm mt-1">Manage the carousel slides displayed on your homepage</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition-all disabled:opacity-50 text-sm cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-md cursor-pointer font-semibold transition-all hover:scale-105 active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" /> New Slide
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      {slides.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-200"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          Total Slides: <span className="font-bold">{slides.length}</span>
        </motion.div>
      )}

      {/* Messages */}
      {operationMessage.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${operationMessage.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
            }`}
        >
          {operationMessage.type === "success" ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {operationMessage.text}
        </motion.div>
      )}

      {/* Slides List - Table Format */}
      <div className="space-y-4">
        {slides.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Home className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No slides yet</h3>
            <p className="text-slate-600 mb-6 max-w-sm mx-auto">Create your first hero slide to showcase important content and messages on the homepage.</p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/30"
            >
              <Plus className="w-4 h-4" /> Create First Slide
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header */}
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Subtitle</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100">
                  {slides.map((slide, index) => (
                    <motion.tr
                      key={slide.id || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.02)" }}
                      className="transition-colors hover:bg-blue-50/50"
                    >
                      {/* Image */}
                      <td className="px-6 py-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 shadow-sm">
                          {slide.image ? (
                            <Image src={slide.image} fill alt={slide.title} className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                              <ImageIcon className="w-8 h-8 text-slate-300" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Title */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{slide.title || "—"}</p>
                          <p className="text-xs text-slate-500 mt-1">Slide {index + 1}</p>
                        </div>
                      </td>

                      {/* Subtitle */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 line-clamp-2">{slide.subtitle || "No subtitle"}</p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setEditingId(slide.id || slide._id)}
                            className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all border border-transparent hover:border-blue-300 font-medium"
                            title="Edit Slide"
                          >
                            <Edit2 className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDeleteId(slide.id || slide._id)}
                            className="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-all border border-transparent hover:border-red-300 font-medium"
                            title="Delete Slide"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-600 font-medium">
                Showing <span className="font-bold text-slate-900">{slides.length}</span> slide{slides.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-semibold text-sm border border-transparent hover:border-blue-200"
              >
                <Plus className="w-4 h-4" /> Add Slide
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal - SweetAlert Style */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              {/* Icon Section */}
              <div className="pt-8 px-6 flex justify-center">
                <motion.div
                  animate={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center border-4 border-red-100 shadow-lg"
                >
                  <Trash2 className="w-10 h-10 text-red-600" />
                </motion.div>
              </div>

              {/* Content Section */}
              <div className="px-6 py-6 text-center space-y-3">
                <h3 className="text-2xl font-bold text-slate-900">Delete Slide?</h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  Are you sure you want to delete this slide? This action cannot be undone.
                </p>
              </div>

              {/* Buttons Section */}
              <div className="px-6 pb-6 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteSlide}
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-bold text-base shadow-lg shadow-red-600/30 transition-all"
                >
                  Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteId(null)}
                  className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-base transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
