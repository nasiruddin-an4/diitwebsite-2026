import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Loader2, Image as ImageIcon, Edit2, Trash2, Save, Home, Upload } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";
import Image from "next/image";

export default function HeroSection({ data, updateField, addItem, deleteItem, onSave, saving }) {
  const [editingId, setEditingId] = useState(null);
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

  const slides = data?.heroSlides || [];
  const editingSlide = slides.find(s => (s.id || s._id) === editingId);
  const editingIndex = slides.findIndex(s => (s.id || s._id) === editingId);

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: "error", title: "File too large", text: "Please upload an image smaller than 5MB", toast: true, position: "top-end", timer: 3000 });
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof index === 'number') {
        updateField("heroSlides", index, "image", event.target.result);
      } else {
        setNewSlide(prev => ({ ...prev, image: event.target.result }));
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateSlide = () => {
    if (!newSlide.title || !newSlide.image) {
      Swal.fire({ icon: "warning", title: "Information Required", text: "Title and Image are required for a slide.", toast: true, position: "top-end", timer: 3000 });
      return;
    }

    addItem("heroSlides", { ...newSlide, id: Date.now() });
    setIsCreating(false);
    setNewSlide({
      title: "",
      subtitle: "",
      image: "",
      buttons: { primary: { text: "Explore", link: "/programs" }, secondary: { text: "Contact", link: "/contact" } }
    });
  };

  const handleDelete = (item, index) => {
    Swal.fire({
      title: "Delete Slide?",
      text: "This action will remove the slide from the homepage.",
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
        deleteItem("heroSlides", index);
      }
    });
  };

  const SlideForm = ({ slide, index, isNew = false }) => {
    const updateLocalField = (field, value) => {
      if (isNew) setNewSlide(p => ({ ...p, [field]: value }));
      else updateField("heroSlides", index, field, value);
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField label="Slide Title" value={slide.title} onChange={(v) => updateLocalField("title", v)} placeholder="Main headline..." />
          <InputField label="Subtitle" value={slide.subtitle} onChange={(v) => updateLocalField("subtitle", v)} placeholder="Supporting text..." />
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Slide Background</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-60 h-32 rounded-md bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden">
              {slide.image ? (
                <img src={slide.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-10 h-10 text-slate-300" />
              )}
            </div>
            <div className="flex-1">
              <label className="flex items-center justify-center h-32 border-2 border-dashed border-blue-200 rounded-md cursor-pointer bg-blue-50/30 hover:bg-blue-50 transition-all group">
                <div className="text-center">
                  <Upload className="w-6 h-6 text-blue-500 mx-auto mb-1 group-hover:scale-110" />
                  <p className="text-xs font-bold text-blue-700">Upload Image</p>
                  <p className="text-[10px] text-slate-400 mt-1">Recommended: 1920x600px</p>
                </div>
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index)} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Hero Carousel</h2>
          <p className="text-slate-500 text-sm mt-1">Manage slides displayed on the main landing page</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md cursor-pointer font-medium transition-all disabled:opacity-50 text-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer font-medium transition-all"
          >
            <Plus className="w-4 h-4" /> New Slide
          </button>
        </div>
      </div>

      {slides.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
          <Home className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-900">No slides found</h3>
          <p className="text-sm text-slate-500 mb-6">Create your first slide to start your homepage carousel.</p>
          <button onClick={() => setIsCreating(true)} className="px-6 py-2 bg-blue-600 text-white rounded-md cursor-pointer font-bold">Add Slide</button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Preview</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Content</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {slides.map((slide, index) => (
                <tr key={slide.id || index} className="group hover:bg-slate-50">
                  <td className="p-4">
                    <div className="w-24 h-14 rounded-md overflow-hidden border border-slate-200 relative bg-slate-100">
                      {slide.image && <img src={slide.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900 text-sm">{slide.title || "Untitled"}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{slide.subtitle}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setEditingId(slide.id || slide._id)} className="p-2 text-blue-600 bg-blue-50 border border-blue-100 rounded-md cursor-pointer hover:bg-blue-100"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(slide, index)} className="p-2 text-red-600 bg-red-50 border border-red-100 rounded-md cursor-pointer hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Shared Modal UI */}
      <AnimatePresence>
        {(isCreating || editingId !== null) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-xl w-full max-w-3xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  {isCreating ? "Create New Slide" : "Edit Slide"}
                </h3>
                <button onClick={() => { setIsCreating(false); setEditingId(null); }} className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {isCreating ? (
                  <SlideForm slide={newSlide} isNew />
                ) : editingSlide ? (
                  <SlideForm slide={editingSlide} index={editingIndex} />
                ) : null}
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button onClick={() => { setIsCreating(false); setEditingId(null); }} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md cursor-pointer font-bold text-sm">Cancel</button>
                <button onClick={() => { if (isCreating) handleCreateSlide(); else setEditingId(null); }} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer font-bold text-sm">
                  {isCreating ? "Create Slide" : "Save & Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
