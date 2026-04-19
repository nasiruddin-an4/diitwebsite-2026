"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, ArrowRight, Film } from "lucide-react";
import { useStoreData } from "@/hooks/useDataStore";

/* ─── YouTube helpers ──────────────────────────────────────── */
function getYouTubeId(url = "") {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/,
    /youtube\.com\/shorts\/([^&?\s]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function getThumbnail(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
}

function getEmbedUrl(url) {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
}

/* ─── Video Card ───────────────────────────────────────────── */
function VideoCard({ video, index, onPlay }) {
  const thumb = getThumbnail(video.videoUrl);
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer border border-slate-100 transition-all duration-500 hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onPlay(video)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        {thumb ? (
          <img
            src={thumb}
            alt={video.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${hovering ? "scale-110" : "scale-100"}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <Film className="w-16 h-16 text-slate-600" />
          </div>
        )}

        {/* Dark overlay */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${hovering ? "opacity-60" : "opacity-30"}`}
        />

        {/* Play button */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${hovering ? "scale-110" : "scale-100"}`}
        >
          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:bg-white transition-all duration-300">
            <Play className="w-7 h-7 text-brandColor fill-brandColor ml-1" />
          </div>
        </div>

        {/* Category badge */}
        {video.category && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-brandColor/90 text-white text-[10px] font-bold rounded-full uppercase tracking-wider backdrop-blur-sm">
            {video.category}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-6 bg-white border-t border-slate-100">
        <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-brandColor transition-colors duration-200">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Modal Player ─────────────────────────────────────────── */
function VideoModal({ video, onClose }) {
  const embedUrl = video ? getEmbedUrl(video.videoUrl) : null;

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!video) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-video w-full">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/60">
              Video not available
            </div>
          )}
        </div>
        <div className="px-5 py-4 bg-slate-900 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold text-sm">{video.title}</p>
            {video.category && (
              <p className="text-slate-400 text-xs mt-0.5">{video.category}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white/70 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Section ─────────────────────────────────────────── */
export default function VideoSection({ videos: initialVideos }) {
  // Use global data store as fallback when no initialVideos prop
  const storeVideos = useStoreData("videos", []);
  const videos = initialVideos || storeVideos || [];
  const loading = !initialVideos && videos.length === 0;
  const [activeVideo, setActiveVideo] = useState(null);

  const preview = videos.slice(0, 3);

  return (
    <>
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brandColor/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight">
                Watch &amp; Learn{" "}
                <span className="text-brandColor">From DIIT</span>
              </h2>
            </div>

            <Link
              href="/video-gallery"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brandColor hover:bg-brandColor/90 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brandColor/30 hover:-translate-y-0.5 shrink-0 text-sm"
            >
              See All Videos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Video Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-slate-200" />
                  <div className="p-4 bg-white border-t border-slate-100 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : preview.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <Film className="w-14 h-14 text-slate-300 mx-auto mb-4" />
              <h3 className="font-bold text-slate-700 text-lg mb-1">
                No Videos Yet
              </h3>
              <p className="text-slate-400 text-sm">
                Videos will appear here once added from the admin panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {preview.map((video, i) => (
                <VideoCard
                  key={video._id || i}
                  video={video}
                  index={i}
                  onPlay={setActiveVideo}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  );
}
