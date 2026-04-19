"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  X,
  Search,
  Sparkles,
  Video,
  Filter,
  ChevronDown,
} from "lucide-react";
import { useStoreData } from "@/hooks/useDataStore";

const ITEMS_PER_PAGE = 12;

// Video categories matching admin panel
const categories = [
  "All",
  "Campus Life",
  "Events",
  "Seminars",
  "Workshops",
  "Student Activities",
  "Achievements",
  "Others",
];

/**
 * Extract a YouTube video ID from common URL formats.
 */
function extractYouTubeId(url) {
  if (!url) return null;
  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/** Build a high-quality thumbnail URL for a YouTube video. */
function getYouTubeThumbnail(videoUrl, quality = "hqdefault") {
  const id = extractYouTubeId(videoUrl);
  return id ? `https://img.youtube.com/vi/${id}/${quality}.jpg` : null;
}

/** Build the YouTube embed URL. */
function getYouTubeEmbedUrl(videoUrl) {
  const id = extractYouTubeId(videoUrl);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
}

const VideoGalleryPage = () => {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Read videos from global data store (pre-loaded)
  const videos = useStoreData("videos", []) || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedVideo(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter logic
  const filteredVideos = videos.filter((video) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      video.title?.toLowerCase().includes(searchLower) ||
      video.description?.toLowerCase().includes(searchLower) ||
      video.category?.toLowerCase().includes(searchLower);
    const matchesCategory =
      selectedCategory === "All" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Determine which categories actually have videos
  const activeCats = new Set(videos.map((v) => v.category));

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-100 rounded-full animate-spin border-t-brandColor" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brandColor animate-pulse" />
        </div>
        <p className="text-slate-500 font-medium animate-pulse">
          Loading Videos...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-brandColor/10 selection:text-brandColor overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative bg-[#020617] pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)]" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
            className="absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-[120px]"
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-2 leading-[1.1] tracking-tight">
              Video{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-300 to-cyan-300">
                Gallery
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Explore our campus moments, events, seminars, and student
              achievements through our curated video collection.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20 pb-32">
        {/* Search & Filter Bar */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-100 rounded-xl p-3 mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] sticky top-20 z-40"
        >
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brandColor transition-colors" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-full bg-slate-50 border-none outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-brandColor transition-all text-slate-800 font-semibold placeholder:text-slate-400"
              />
            </div>
            <div className="w-px h-8 bg-slate-100 hidden sm:block mx-1" />
            <div className="relative w-full sm:w-auto">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-[220px] appearance-none pl-11 pr-12 py-4 rounded-xl bg-slate-50 ring-1 ring-slate-100 focus:ring-2 focus:ring-brandColor outline-none text-slate-800 font-semibold text-sm cursor-pointer transition-all hover:bg-slate-100"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredVideos.map((video, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.05,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  key={video._id || video.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                    <img
                      src={
                        video.thumbnail ||
                        getYouTubeThumbnail(video.videoUrl) ||
                        "/placeholder-video.jpg"
                      }
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl transform scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                        <Play className="w-7 h-7 text-brandColor ml-1" />
                      </div>
                    </div>

                    {/* Category Badge */}
                    {video.category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[11px] font-bold text-brandColor uppercase tracking-wider shadow-sm">
                          {video.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="mt-4 px-1">
                    <h3 className="text-[18px] font-bold text-[#020617] leading-tight group-hover:text-brandColor transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-[14px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-40 border-2 border-dashed border-slate-100 rounded-[3rem]">
            <Video className="w-16 h-16 text-slate-100 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">
              No videos found
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Try adjusting your search or filter
            </p>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-100"
            />

            {/* Fullscreen Video */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-110 bg-black"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer backdrop-blur-sm"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Video Frame */}
              {getYouTubeEmbedUrl(selectedVideo.videoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(selectedVideo.videoUrl)}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>Unable to load video</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoGalleryPage;
