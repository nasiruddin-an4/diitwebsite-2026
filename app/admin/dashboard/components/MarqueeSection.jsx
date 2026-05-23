"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Megaphone, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";

export default function MarqueeSection() {
  const [data, setData] = useState({
    text: "",
    enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/marquee");
      const result = await res.json();
      if (result.success) {
        setData((prev) => ({ ...prev, ...result.data }));
      }
    } catch (error) {
      console.error("Failed to fetch marquee settings", error);
      Swal.fire("Error", "Failed to load marquee data", "error");
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/marquee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Marquee Updated!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.message || "Failed to save data", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Marquee Notice Settings
          </h2>
          <p className="text-slate-500 mt-1">
            Manage the scrolling notice text displayed below the hero section
          </p>
        </div>
        <button
          onClick={saveData}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer font-medium transition-all disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>

      {/* Toggle */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data.enabled ? (
              <Eye className="w-5 h-5 text-green-600" />
            ) : (
              <EyeOff className="w-5 h-5 text-slate-400" />
            )}
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Show Marquee Notice
              </h3>
              <p className="text-xs text-slate-500">
                Toggle the scrolling notice bar visibility on the homepage
              </p>
            </div>
          </div>
          <button
            onClick={() => setData((prev) => ({ ...prev, enabled: !prev.enabled }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              data.enabled ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                data.enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notice Text */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-blue-600" />
          Notice Text
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
            Marquee Text (Bengali / English)
          </label>
          <textarea
            value={data.text || ""}
            onChange={(e) =>
              setData((prev) => ({ ...prev, text: e.target.value }))
            }
            placeholder="Enter the scrolling notice text here..."
            rows={4}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-shadow resize-none"
          />
          <p className="text-xs text-slate-400 mt-1">
            This text will scroll continuously on the homepage below the hero
            section.
          </p>
        </div>
      </div>

      {/* Preview */}
      {data.text && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide">
            Live Preview
          </h3>
          <div
            className="rounded-xl overflow-hidden border border-slate-200 shadow-sm"
            style={{ pointerEvents: "none" }}
          >
            <div className="marquee-notice-bar">
              <div className="marquee-notice-track">
                <span className="marquee-notice-text">{data.text}</span>
                <span className="marquee-notice-separator">✦</span>
                <span className="marquee-notice-text">{data.text}</span>
                <span className="marquee-notice-separator">✦</span>
                <span className="marquee-notice-text">{data.text}</span>
                <span className="marquee-notice-separator">✦</span>
                <span className="marquee-notice-text">{data.text}</span>
                <span className="marquee-notice-separator">✦</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
