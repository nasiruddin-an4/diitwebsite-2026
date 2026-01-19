import React, { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Globe, Phone, Mail, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

export default function SiteInfoSection() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/site-info");
            const result = await res.json();
            if (result.success) {
                setData(ensureStructure(result.data));
            }
        } catch (error) {
            console.error("Failed to fetch site info", error);
            Swal.fire('Error', 'Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const ensureStructure = (fetchedData) => {
        const d = fetchedData || {};
        return {
            phone: d.phone || [],
            email: d.email || [],
            address: d.address || [],
            mapUrl: d.mapUrl || "",
            officeHours: d.officeHours || "Sun - Thu: 9:00 AM - 6:00 PM",
            socialMedia: {
                facebook: d.socialMedia?.facebook || "",
                twitter: d.socialMedia?.twitter || "",
                linkedin: d.socialMedia?.linkedin || "",
                instagram: d.socialMedia?.instagram || "",
                youtube: d.socialMedia?.youtube || ""
            }
        };
    };

    const saveData = async () => {
        setSaving(true);
        try {
            await fetch("/api/site-info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            Swal.fire({
                icon: 'success',
                title: 'Site Info Saved!',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to save data', 'error');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const updateSocialMedia = (platform, value) => {
        setData(prev => ({
            ...prev,
            socialMedia: { ...prev.socialMedia, [platform]: value }
        }));
    };

    const addArrayItem = (field) => {
        setData(prev => ({ ...prev, [field]: [...(prev[field] || []), ""] }));
    };

    const updateArrayItem = (field, index, value) => {
        setData(prev => {
            const newArr = [...prev[field]];
            newArr[index] = value;
            return { ...prev, [field]: newArr };
        });
    };

    const removeArrayItem = (field, index) => {
        setData(prev => {
            const newArr = prev[field].filter((_, i) => i !== index);
            return { ...prev, [field]: newArr };
        });
    };

    if (loading) return <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mt-10" />;

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-center border-b border-slate-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Site Information</h2>
                    <p className="text-slate-500 mt-1">Manage contact details, social media, and location info used across the website</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Phone Numbers */}
                <SectionBox title="Phone Numbers" icon={Phone}>
                    <div className="space-y-3">
                        {data.phone.map((ph, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                                    value={ph}
                                    onChange={(e) => updateArrayItem('phone', i, e.target.value)}
                                    placeholder="+880 1234-567890"
                                />
                                <button onClick={() => removeArrayItem('phone', i)} className="text-red-500 hover:text-red-700 px-2">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button onClick={() => addArrayItem('phone')} className="text-blue-600 text-sm flex items-center gap-1 font-medium mt-2">
                            <Plus className="w-4 h-4" /> Add Phone
                        </button>
                    </div>
                </SectionBox>

                {/* Email Addresses */}
                <SectionBox title="Email Addresses" icon={Mail}>
                    <div className="space-y-3">
                        {data.email.map((em, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                                    value={em}
                                    onChange={(e) => updateArrayItem('email', i, e.target.value)}
                                    placeholder="info@diit.edu.bd"
                                />
                                <button onClick={() => removeArrayItem('email', i)} className="text-red-500 hover:text-red-700 px-2">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button onClick={() => addArrayItem('email')} className="text-blue-600 text-sm flex items-center gap-1 font-medium mt-2">
                            <Plus className="w-4 h-4" /> Add Email
                        </button>
                    </div>
                </SectionBox>

                {/* Address Lines */}
                <SectionBox title="Address" icon={MapPin}>
                    <div className="space-y-3">
                        {data.address.map((ad, i) => (
                            <div key={i} className="flex gap-2">
                                <input
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                                    value={ad}
                                    onChange={(e) => updateArrayItem('address', i, e.target.value)}
                                    placeholder="House #54, Road #4/A"
                                />
                                <button onClick={() => removeArrayItem('address', i)} className="text-red-500 hover:text-red-700 px-2">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <button onClick={() => addArrayItem('address')} className="text-blue-600 text-sm flex items-center gap-1 font-medium mt-2">
                            <Plus className="w-4 h-4" /> Add Line
                        </button>
                    </div>
                </SectionBox>

                {/* Office Hours */}
                <SectionBox title="Office Hours" icon={Clock}>
                    <textarea
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm min-h-[100px]"
                        value={data.officeHours}
                        onChange={(e) => updateField('officeHours', e.target.value)}
                        placeholder="Sun - Thu: 9:00 AM - 6:00 PM&#10;Fri: Closed"
                    />
                    <p className="text-xs text-slate-400 mt-2">Use new lines for multiple timings</p>
                </SectionBox>
            </div>

            {/* Map URL - Full Width */}
            <SectionBox title="Google Map Embed URL" icon={Globe}>
                <textarea
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm min-h-[80px] font-mono text-xs"
                    value={data.mapUrl}
                    onChange={(e) => updateField('mapUrl', e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                />
                <p className="text-xs text-slate-400 mt-2">Paste the 'src' URL from Google Maps embed code</p>
            </SectionBox>

            {/* Social Media Links */}
            <SectionBox title="Social Media Links" icon={Globe}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                        </label>
                        <input
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                            value={data.socialMedia.facebook}
                            onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                            placeholder="https://facebook.com/diit"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <Twitter className="w-4 h-4 text-sky-500" /> Twitter / X
                        </label>
                        <input
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                            value={data.socialMedia.twitter}
                            onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                            placeholder="https://twitter.com/diit"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <Linkedin className="w-4 h-4 text-blue-700" /> LinkedIn
                        </label>
                        <input
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                            value={data.socialMedia.linkedin}
                            onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                            placeholder="https://linkedin.com/company/diit"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <Instagram className="w-4 h-4 text-pink-500" /> Instagram
                        </label>
                        <input
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                            value={data.socialMedia.instagram}
                            onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                            placeholder="https://instagram.com/diit"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <Youtube className="w-4 h-4 text-red-600" /> YouTube
                        </label>
                        <input
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                            value={data.socialMedia.youtube}
                            onChange={(e) => updateSocialMedia('youtube', e.target.value)}
                            placeholder="https://youtube.com/@diit"
                        />
                    </div>
                </div>
            </SectionBox>

        </div>
    );
}

function SectionBox({ title, icon: Icon, children }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                {Icon && <Icon className="w-5 h-5 text-blue-600" />}
                {title}
            </h3>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}
