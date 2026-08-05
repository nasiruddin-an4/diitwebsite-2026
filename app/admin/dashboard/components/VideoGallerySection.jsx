"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  Plus,
  Trash2,
  Save,
  X,
  Loader2,
  Edit2,
  Video,
  Link as LinkIcon,
  Type,
  Tag,
  Hash,
  CheckCircle,
  ArrowUpDown,
  Play,
  ExternalLink,
} from "lucide-react";

// Video categories are generated dynamically

/**
 * Extract a YouTube video ID from common URL formats.
 * Returns null if the URL is not recognized as a YouTube link.
 */
function extractYouTubeId(url) {
  if (!url) return null;
  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/** Build a thumbnail URL for a YouTube video. */
function getYouTubeThumbnail(videoUrl) {
  const id = extractYouTubeId(videoUrl);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export default function VideoGallerySection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOrderChanged, setSortOrderChanged] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [editableSortOrders, setEditableSortOrders] = useState({});

  const categoryOptions = useMemo(() => {
    const defaultCats = [
      "Campus Life",
      "Events",
      "Seminars",
      "Workshops",
      "Student Activities",
      "Achievements",
      "Others",
    ];
    const extractedCats = videos.map(v => v.category).filter(Boolean);
    const uniqueCats = [...new Set([...defaultCats, ...extractedCats])];
    return uniqueCats.map(c => ({ value: c, label: c }));
  }, [videos]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/videos");
      const result = await res.json();

      if (result.success) {
        setVideos(result.data);
        const orders = {};
        result.data.forEach((v, i) => {
          orders[v._id] =
            v.sortOrder !== undefined && v.sortOrder !== null ? v.sortOrder : i;
        });
        setEditableSortOrders(orders);
      } else {
        Swal.fire("Error", "Failed to load video data", "error");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      Swal.fire("Error", "Error loading video data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      title: "",
      videoUrl: "",
      description: "",
      category: "Campus Life",
      thumbnail: "",
    });
    setEditingId(null);
    setIsAdding(true);
  };

  const handleEdit = (video) => {
    setFormData({ ...video });
    setEditingId(video._id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setFormData(null);
    setEditingId(null);
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.videoUrl) {
      Swal.fire("Warning", "Title and Video URL are required", "warning");
      return;
    }

    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { ...formData, _id: editingId } : formData;

      const res = await fetch("/api/admin/videos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: editingId
            ? "Video updated successfully"
            : "Video added successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchVideos();
        handleCancel();
      } else {
        Swal.fire("Error", result.message || "Failed to save video", "error");
      }
    } catch (error) {
      console.error("Error saving video:", error);
      Swal.fire("Error", "Error saving video", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Deleting...",
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const res = await fetch(`/api/admin/videos?id=${id}`, {
          method: "DELETE",
        });

        const apiResult = await res.json();

        if (apiResult.success) {
          Swal.fire("Deleted!", "Video has been deleted.", "success");
          fetchVideos();
        } else {
          Swal.fire("Error", "Failed to delete video", "error");
        }
      } catch (error) {
        console.error("Error deleting video:", error);
        Swal.fire("Error", "Error deleting video", "error");
      }
    }
  };

  const handleSortOrderChange = (id, value) => {
    const numValue = value === "" ? "" : parseInt(value, 10);
    setEditableSortOrders((prev) => ({ ...prev, [id]: numValue }));
    setSortOrderChanged(true);
  };

  const handleSaveSortOrder = async () => {
    const hasEmpty = Object.values(editableSortOrders).some(
      (v) => v === "" || isNaN(v),
    );
    if (hasEmpty) {
      Swal.fire(
        "Warning",
        "Please enter a valid number for all video sort positions",
        "warning",
      );
      return;
    }

    setSavingOrder(true);
    try {
      const sortUpdates = Object.entries(editableSortOrders).map(
        ([_id, sortOrder]) => ({
          _id,
          sortOrder: Number(sortOrder),
        }),
      );

      const res = await fetch("/api/admin/videos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortUpdates }),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Order Saved!",
          text: "Video display order has been updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        setSortOrderChanged(false);
        fetchVideos();
      } else {
        Swal.fire(
          "Error",
          result.message || "Failed to save sort order",
          "error",
        );
      }
    } catch (error) {
      console.error("Error saving sort order:", error);
      Swal.fire("Error", "Error saving sort order", "error");
    } finally {
      setSavingOrder(false);
    }
  };

  const filteredVideos =
    filterCategory === "All"
      ? videos
      : videos.filter((v) => v.category === filterCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Video Gallery Management
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Manage campus videos and multimedia content
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Save Sort Order Button */}
          <AnimatePresence>
            {sortOrderChanged && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                onClick={handleSaveSortOrder}
                disabled={savingOrder}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-all font-medium cursor-pointer shadow-lg shadow-emerald-200 disabled:opacity-50"
              >
                {savingOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> Save Order
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Video
          </button>
        </div>
      </div>

      {/* Sort Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
          <ArrowUpDown className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-blue-800">
            Sort Order (Number System)
          </p>
          <p className="text-xs text-blue-600">
            Assign a serial number to each video. Lower numbers appear first on
            the website (1 = first, 2 = second...). Change the numbers and click
            &quot;Save Order&quot; to update.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["All", ...categoryOptions.map((c) => c.value)].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isAdding && formData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">
                  {editingId ? "Edit Video" : "Add New Video"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Annual Day Celebration 2025"
                  />
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Video URL (YouTube) *
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) =>
                      handleFieldChange("videoUrl", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Paste any YouTube URL. Thumbnail will be auto-generated.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <input
                    list="video-categories"
                    value={formData.category || ""}
                    onChange={(e) => handleFieldChange("category", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Select or type new"
                  />
                  <datalist id="video-categories">
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} />
                    ))}
                  </datalist>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleFieldChange("description", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Brief description about the video..."
                    rows={3}
                  />
                </div>

                {/* Custom Thumbnail URL (optional) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Custom Thumbnail URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnail || ""}
                    onChange={(e) =>
                      handleFieldChange("thumbnail", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Leave empty to use YouTube auto-thumbnail"
                  />
                </div>

                {/* Preview */}
                {formData.videoUrl && getYouTubeThumbnail(formData.videoUrl) && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preview
                    </label>
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100">
                      <img
                        src={
                          formData.thumbnail ||
                          getYouTubeThumbnail(formData.videoUrl)
                        }
                        alt="Video preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-6 h-6 text-red-600 ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-slate-300 cursor-pointer text-slate-700 rounded-md hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredVideos.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
            <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No videos found</p>
            <p className="text-slate-500 text-sm">Add videos to get started</p>
          </div>
        ) : (
          filteredVideos.map((video) => (
            <motion.div
              key={video._id || video.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Card Thumbnail */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                {video.thumbnail || getYouTubeThumbnail(video.videoUrl) ? (
                  <img
                    src={
                      video.thumbnail || getYouTubeThumbnail(video.videoUrl)
                    }
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50">
                    <Video className="w-16 h-16 text-slate-200" />
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-red-600 ml-0.5" />
                  </div>
                </div>

                {/* Serial Number Badge - Top Left */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-lg px-1.5 py-1 shadow-sm">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">
                    Serial
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={
                      editableSortOrders[video._id] !== undefined
                        ? editableSortOrders[video._id]
                        : ""
                    }
                    onChange={(e) =>
                      handleSortOrderChange(video._id, e.target.value)
                    }
                    className="w-12 h-7 text-center text-sm font-bold border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-700 bg-white transition-all"
                    title="Display order number (lower = shown first)"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Category Badge - Top Right */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-bold shadow-sm">
                    {video.category}
                  </span>
                </div>

                {/* Action Buttons - Bottom Right */}
                <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/90 backdrop-blur-sm hover:bg-green-500 text-green-600 hover:text-white rounded-lg transition-all shadow-sm"
                    title="Open video"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleEdit(video)}
                    className="p-2 bg-white/90 backdrop-blur-sm hover:bg-blue-500 text-blue-600 hover:text-white rounded-lg transition-all shadow-sm cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="p-2 bg-white/90 backdrop-blur-sm hover:bg-red-500 text-red-600 hover:text-white rounded-lg transition-all shadow-sm cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <h3 className="text-[15px] font-bold text-slate-800 leading-tight mb-1 truncate">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-[13px] text-slate-500 line-clamp-2 mt-1">
                    {video.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Floating Save Order Button */}
      <AnimatePresence>
        {sortOrderChanged && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <button
              onClick={handleSaveSortOrder}
              disabled={savingOrder}
              className="flex items-center gap-3 px-6 py-3.5 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all font-semibold cursor-pointer shadow-2xl shadow-emerald-300/50 disabled:opacity-50"
            >
              {savingOrder ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Saving Order...
                </>
              ) : (
                <>
                  <ArrowUpDown className="w-5 h-5" /> Save Display Order
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
