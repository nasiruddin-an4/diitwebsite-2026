"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Calendar, Sparkles, Phone, Download, Link as LinkIcon, ExternalLink } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";
import FileUpload from "@/app/components/FileUpload";

export default function CallToActionSection() {
    const [data, setData] = useState({
        admissionOpenText: "Admissions Open 2026",
        admissionLastDate: "25th January",
        prospectusUrl: "",
        contactNumber: "+880 1234-567890",
        applyNowUrl: "/admission/online"
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/cta");
            const result = await res.json();
            if (result.success) {
                setData(prev => ({ ...prev, ...result.data }));
            }
        } catch (error) {
            console.error("Failed to fetch CTA info", error);
            Swal.fire('Error', 'Failed to load CTA data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const saveData = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/cta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'CTA Settings Saved!',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.message || 'Failed to save data', 'error');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Call To Action Settings</h2>
                    <p className="text-slate-500 mt-1">Manage the admission status, deadlines, and prospectus download</p>
                </div>
                <button
                    onClick={saveData}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer font-medium transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admission Info */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        Admission Status
                    </h3>

                    <InputField
                        label="Admission Open Text"
                        value={data.admissionOpenText}
                        onChange={(val) => updateField('admissionOpenText', val)}
                        placeholder="e.g., Admissions Open 2026"
                    />

                    <InputField
                        label="Admission Last Date"
                        value={data.admissionLastDate}
                        onChange={(val) => updateField('admissionLastDate', val)}
                        placeholder="e.g., 25th January"
                    />
                </div>

                {/* Contact & Links */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-purple-600" />
                        Links & Contact
                    </h3>

                    <InputField
                        label="Contact Number"
                        value={data.contactNumber}
                        onChange={(val) => updateField('contactNumber', val)}
                        placeholder="+880 1234-567890"
                    />

                    <InputField
                        label="Apply Now URL"
                        value={data.applyNowUrl}
                        onChange={(val) => updateField('applyNowUrl', val)}
                        placeholder="/admission/online"
                    />
                </div>

                {/* Prospectus Upload */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 md:col-span-2">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                        <Download className="w-5 h-5 text-emerald-600" />
                        Prospectus Download
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-blue-400 transition-colors">
                            <FileUpload
                                label="Upload Prospectus (PDF/Image)"
                                folder="prospectus"
                                acceptedFileTypes="application/pdf,image/*"
                                onUploadSuccess={(res) => updateField('prospectusUrl', res.url)}
                            />
                        </div>

                        <div className="space-y-4">
                            <InputField
                                label="Prospectus URL (Manual)"
                                value={data.prospectusUrl}
                                onChange={(val) => updateField('prospectusUrl', val)}
                                placeholder="https://..."
                            />

                            {data.prospectusUrl && (
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">File Preview</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 truncate">
                                            <Download className="w-4 h-4 text-emerald-600" />
                                            <span className="text-sm text-slate-700 truncate">{data.prospectusUrl.split('/').pop()}</span>
                                        </div>
                                        <a
                                            href={data.prospectusUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-white rounded-md text-blue-600 transition-colors"
                                            title="View File"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
