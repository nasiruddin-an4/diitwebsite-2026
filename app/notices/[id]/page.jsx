"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  ArrowLeft,
  Download,
  Share2,
  Printer,
  FileText,
  Pin,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useParams } from "next/navigation";

const NoticeDetailsPage = () => {
  const params = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/academics/notices");
        const result = await res.json();

        if (result.success && result.data) {
          // Find the notice by _id
          const foundNotice = result.data.find((n) => n._id === params.id);
          if (foundNotice) {
            setNotice(foundNotice);
          } else {
            setError("Notice not found");
          }
        } else {
          setError("Failed to load notices");
        }
      } catch (err) {
        console.error("Error fetching notice:", err);
        setError("Failed to load notice details");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading notice...</p>
        </div>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {error || "Notice Not Found"}
          </h2>
          <Link
            href="/notices"
            className="text-brandColor hover:underline font-medium"
          >
            Back to Notices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 1. Page Hero Section with Title */}
      <div className="bg-[#001229] pt-6 md:pt-12 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brandColor/20 rounded-full blur-3xl opacity-50" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Breadcrumb / Back */}
          <Link
            href="/notices"
            className="inline-flex items-center gap-2 text-blue-200/60 hover:text-white font-medium mb-6 transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Notice Board
          </Link>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/20 text-[10px] md:text-xs font-bold uppercase tracking-wider">
              {notice.category}
            </span>
            {notice.pinned && (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/20 text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Pin className="w-3 h-3" /> Pinned
              </span>
            )}
            <span className="flex items-center gap-2 text-slate-400 text-xs md:text-sm ml-1">
              <Clock className="w-3.5 h-3.5" /> {notice.date}
            </span>
          </div>

          {/* Hero Title */}
          <h1 className="text-2xl md:text-5xl font-bold text-white leading-tight mb-4">
            {notice.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20 pb-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 p-5 md:p-12">
          {/* 2. Full View Image (No Cropping) */}
          {notice.image ? (
            <div className="w-full bg-slate-50 border border-slate-100 rounded-xl overflow-hidden mb-8 md:mb-10 shadow-inner">
              <img
                src={notice.image}
                alt={notice.title}
                className="w-full h-auto object-contain"
              />
            </div>
          ) : (
            // Fallback purely decorative
            <div className="w-full h-48 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl mb-10 flex items-center justify-center border border-slate-100 border-dashed">
              <div className="flex flex-col items-center text-slate-400">
                <FileText className="w-12 h-12 mb-2 opacity-50" />
                <span className="text-sm font-medium">
                  No Image Preview Available
                </span>
              </div>
            </div>
          )}

          {/* Content Body */}
          <div className="prose prose-base md:prose-lg text-slate-600 max-w-none leading-relaxed whitespace-pre-line mb-8 md:mb-12">
            {notice.description ||
              "No specific details provided for this notice."}
          </div>

          {/* Actions Footer */}
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Download Logic: Opens PDF in new tab or downloads image */}
            {(notice.pdf || notice.image) && (
              <button
                onClick={() => {
                  if (notice.pdf) {
                    // Open PDF in new tab for viewing/download (works with Supabase URLs)
                    window.open(notice.pdf, "_blank", "noopener,noreferrer");
                  } else if (notice.image) {
                    // Open image in new tab
                    window.open(notice.image, "_blank", "noopener,noreferrer");
                  }
                }}
                className="flex items-center justify-center gap-2 bg-brandColor text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-800 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
              >
                <Download className="w-5 h-5" />
                {notice.pdf ? "View PDF Document" : "View Notice Image"}
              </button>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                className="p-3 rounded-full hover:bg-slate-50 text-slate-500 transition-colors border border-transparent hover:border-slate-200"
                title="Print"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                className="p-3 rounded-full hover:bg-slate-50 text-slate-500 transition-colors border border-transparent hover:border-slate-200"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailsPage;
