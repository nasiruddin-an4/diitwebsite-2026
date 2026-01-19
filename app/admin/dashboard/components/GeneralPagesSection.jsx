import React, { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, ImageIcon, Search, Edit, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

export default function GeneralPagesSection({ pageType }) { // pageType: 'about', 'contact', 'faq'
    const [data, setData] = useState(null);
    const [faqList, setFaqList] = useState([]); // Separate state for FAQ list
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingState, setUploadingState] = useState({ key: null, index: null });

    // FAQ Modal State
    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
    const [faqForm, setFaqForm] = useState({ question: "", answer: "", category: "General" });
    const [editingFaqId, setEditingFaqId] = useState(null);
    const [isSavingFaq, setIsSavingFaq] = useState(false);

    useEffect(() => {
        if (pageType) fetchData(pageType);
    }, [pageType]);

    const fetchData = async (type) => {
        setLoading(true);
        try {
            // Fetch General Page Data (Hero, etc.)
            const res = await fetch(`/api/admin/general-pages?type=${type}`);
            const result = await res.json();

            if (result.success) {
                setData(ensureStructure(type, result.data));
            }

            // Fetch FAQs specific list if on FAQ page
            if (type === 'faq') {
                const faqRes = await fetch("/api/faqs");
                const faqResult = await faqRes.json();
                if (faqResult.success) {
                    setFaqList(faqResult.data);
                }
            }

        } catch (error) {
            console.error("Failed to fetch data", error);
            Swal.fire('Error', 'Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const ensureStructure = (type, fetchedData) => {
        const d = fetchedData || {};
        if (type === 'about') {
            return {
                hero: d.hero || { title: "Daffodil Institute of Information Technology", subtitle: "Pioneering quality in computer-based education.", bgImage: "", badge: "Since 2000" },
                intro: d.intro || {
                    title: "A Legacy of Excellence",
                    description: "DIIT runs professional programs...",
                    image: "",
                    cardTitle: "Top Position",
                    cardDesc: "Consistently ranking highest in results under National University.",
                    stats: [
                        { label: "Founded", value: "2000" },
                        { label: "Programs", value: "BBA, CSE, MBA" },
                        { label: "Affiliation", value: "National University" },
                        { label: "Status", value: "Non-Profit" }
                    ]
                },
                mission: d.mission || { title: "Our Mission", description: "To provide quality education..." },
                vision: d.vision || { title: "Our Vision", description: "DIIT aspires to enhance its reputation..." },
                values: d.values || [],
            };
        } else if (type === 'contact') {
            return {
                hero: d.hero || { title: "Get in Touch", description: "Reach out to us anytime." },
                info: d.info || { phone: ["+880 1713-493163"], email: ["info@diit.edu.bd"], address: ["Dhanmondi, Dhaka-1209"] },
                mapUrl: d.mapUrl || "",
                officeHours: d.officeHours || "Sun - Thu: 9:00 AM - 6:00 PM"
            };
        } else if (type === 'faq') {
            return {
                hero: d.hero || { title: "Frequently Asked Questions", description: "Find answers to your questions." },
                // faqs: [] - Moved to separate collection/state
            };
        }
        return {};
    };

    const saveData = async () => {
        setSaving(true);
        try {
            await fetch(`/api/admin/general-pages?type=${pageType}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            Swal.fire({
                icon: 'success',
                title: 'Page Settings Saved!',
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

    // Generic Update Helpers
    const updateDeep = (path, value) => {
        const newData = { ...data };
        const keys = path.split('.');
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setData(newData);
    };

    const updateArrayItem = (path, index, field, value) => {
        const newData = { ...data };
        const keys = path.split('.');
        let current = newData;
        for (let key of keys) current = current[key];

        if (typeof current[index] === 'object' && field) {
            current[index][field] = value;
        } else {
            current[index] = value;
        }
        setData(newData);
    };

    const addArrayItem = (path, template) => {
        const newData = { ...data };
        const keys = path.split('.');
        let current = newData;
        for (let key of keys) current = current[key];
        current.push(template);
        setData(newData);
    };

    const removeArrayItem = (path, index) => {
        const newData = { ...data };
        const keys = path.split('.');
        let current = newData;
        for (let key of keys) current = current[key];
        current.splice(index, 1);
        setData(newData);
    };

    const handleImageUpload = async (e, path, index = null) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingState({ key: path, index });
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", `general/${pageType}`);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const result = await res.json();
            if (result.success) {
                if (index !== null) {
                    updateArrayItem(path, index, "image", result.url);
                } else {
                    updateDeep(path, result.url);
                }
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Upload failed', 'error');
        } finally {
            setUploadingState({ key: null, index: null });
        }
    };

    // --- FAQ SPECIFIC HANDLERS ---
    const openFaqModal = (faq = null) => {
        if (faq) {
            setFaqForm({ question: faq.question, answer: faq.answer, category: faq.category });
            setEditingFaqId(faq._id);
        } else {
            setFaqForm({ question: "", answer: "", category: "General" });
            setEditingFaqId(null);
        }
        setIsFaqModalOpen(true);
    };

    const handleSaveFaq = async () => {
        if (!faqForm.question || !faqForm.answer) {
            Swal.fire('Warning', 'Question and Answer are required', 'warning');
            return;
        }

        setIsSavingFaq(true);
        try {
            const method = editingFaqId ? "PUT" : "POST";
            const body = editingFaqId ? { ...faqForm, _id: editingFaqId } : faqForm;

            const res = await fetch("/api/faqs", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const result = await res.json();

            if (result.success) {
                setIsFaqModalOpen(false);
                // Refresh list
                const listRes = await fetch("/api/faqs");
                const listData = await listRes.json();
                if (listData.success) setFaqList(listData.data);

                Swal.fire('Success', editingFaqId ? 'FAQ updated' : 'FAQ added', 'success');
            } else {
                Swal.fire('Error', result.error || 'Failed to save', 'error');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'An error occurred', 'error');
        } finally {
            setIsSavingFaq(false);
        }
    };

    const handleDeleteFaq = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: "This cannot be undone",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirm.isConfirmed) {
            try {
                const res = await fetch(`/api/faqs?id=${id}`, { method: "DELETE" });
                const result = await res.json();
                if (result.success) {
                    setFaqList(prev => prev.filter(f => f._id !== id));
                    Swal.fire('Deleted', 'FAQ has been deleted', 'success');
                } else {
                    Swal.fire('Error', result.error, 'error');
                }
            } catch (err) {
                Swal.fire('Error', 'Failed to delete', 'error');
            }
        }
    };

    if (loading) return <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mt-10" />;

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-center border-b border-slate-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 capitalize">{pageType} Page Manager</h2>
                    <p className="text-slate-500 mt-1">Manage content for {pageType} section</p>
                </div>
                <button
                    onClick={saveData}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer font-medium transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Page Settings
                </button>
            </div>

            {/* About Page Form */}
            {pageType === 'about' && data?.intro && (
                <div className="space-y-8">
                    {/* Hero */}
                    <SectionBox title="Hero Section">
                        <InputField label="Hero Badge" value={data.hero?.badge || ""} onChange={(v) => updateDeep('hero.badge', v)} placeholder="e.g. Since 2000" />
                        <InputField label="Hero Title" value={data.hero?.title} onChange={(v) => updateDeep('hero.title', v)} />
                        <InputField label="Hero Subtitle" value={data.hero?.subtitle} onChange={(v) => updateDeep('hero.subtitle', v)} textarea />
                        <ImageUploader
                            label="Hero Background"
                            image={data.hero?.bgImage}
                            onUpload={(e) => handleImageUpload(e, 'hero.bgImage')}
                            loading={uploadingState.key === 'hero.bgImage'}
                            onUrlChange={(v) => updateDeep('hero.bgImage', v)}
                        />
                    </SectionBox>

                    {/* Intro */}
                    <SectionBox title="Introduction">
                        <InputField label="Title" value={data.intro?.title} onChange={(v) => updateDeep('intro.title', v)} />
                        <InputField label="Description" value={data.intro?.description} onChange={(v) => updateDeep('intro.description', v)} textarea />
                        <ImageUploader
                            label="Intro Image"
                            image={data.intro?.image}
                            onUpload={(e) => handleImageUpload(e, 'intro.image')}
                            loading={uploadingState.key === 'intro.image'}
                            onUrlChange={(v) => updateDeep('intro.image', v)}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 mt-4">
                            <div className="md:col-span-2 text-sm font-semibold text-slate-500">Floating Card Details</div>
                            <InputField label="Card Title" value={data.intro?.cardTitle || ""} onChange={(v) => updateDeep('intro.cardTitle', v)} />
                            <InputField label="Card Description" value={data.intro?.cardDesc || ""} onChange={(v) => updateDeep('intro.cardDesc', v)} />
                        </div>
                    </SectionBox>

                    {/* Intro Stats */}
                    <SectionBox title="Intro Key Stats">
                        <div className="space-y-4">
                            {(data.intro?.stats || []).map((stat, idx) => (
                                <div key={idx} className="flex gap-4 items-end bg-slate-50 p-3 rounded-lg border border-slate-200">
                                    <div className="flex-1">
                                        <InputField label="Label" value={stat.label} onChange={(v) => updateArrayItem('intro.stats', idx, 'label', v)} />
                                    </div>
                                    <div className="flex-1">
                                        <InputField label="Value" value={stat.value} onChange={(v) => updateArrayItem('intro.stats', idx, 'value', v)} />
                                    </div>
                                    <button onClick={() => removeArrayItem('intro.stats', idx)} className="mb-2 text-red-500 hover:text-red-700">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('intro.stats', { label: "New Stat", value: "Value" })} className="text-blue-600 text-sm flex items-center gap-1 font-medium">
                                <Plus className="w-4 h-4" /> Add Statistic
                            </button>
                        </div>
                    </SectionBox>

                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <SectionBox title="Mission">
                            <InputField label="Mission Title" value={data.mission?.title} onChange={(v) => updateDeep('mission.title', v)} />
                            <InputField label="Description" value={data.mission?.description} onChange={(v) => updateDeep('mission.description', v)} textarea />
                        </SectionBox>
                        <SectionBox title="Vision">
                            <InputField label="Vision Title" value={data.vision?.title} onChange={(v) => updateDeep('vision.title', v)} />
                            <InputField label="Description" value={data.vision?.description} onChange={(v) => updateDeep('vision.description', v)} textarea />
                        </SectionBox>
                    </div>

                    {/* Values */}
                    <SectionBox title="Core Values">
                        <div className="space-y-4">
                            {data.values?.map((val, idx) => (
                                <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative group">
                                    <button onClick={() => removeArrayItem('values', idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField label="Title" value={val.title} onChange={(v) => updateArrayItem('values', idx, 'title', v)} />

                                        <IconPicker
                                            value={val.icon}
                                            onChange={(v) => updateArrayItem('values', idx, 'icon', v)}
                                        />

                                        <div className="md:col-span-2">
                                            <InputField label="Description" value={val.desc} onChange={(v) => updateArrayItem('values', idx, 'desc', v)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('values', { title: "New Value", icon: "Star", desc: "" })} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 flex justify-center items-center gap-2">
                                <Plus className="w-4 h-4" /> Add Value
                            </button>
                        </div>
                    </SectionBox>
                </div>
            )}

            {/* Contact Page Form */}
            {pageType === 'contact' && data?.info && (
                <div className="space-y-8">
                    <SectionBox title="Hero">
                        <InputField label="Title" value={data.hero?.title} onChange={(v) => updateDeep('hero.title', v)} />
                        <InputField label="Description" value={data.hero?.description} onChange={(v) => updateDeep('hero.description', v)} textarea />
                    </SectionBox>

                    <SectionBox title="Contact Details">
                        <div className="space-y-6">
                            {/* Phones */}
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Phone Numbers</label>
                                {data.info?.phone?.map((ph, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input className="w-full px-3 py-2 border rounded-md" value={ph} onChange={(e) => updateArrayItem('info.phone', i, null, e.target.value)} />
                                        <button onClick={() => removeArrayItem('info.phone', i)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                <button onClick={() => addArrayItem('info.phone', "")} className="text-blue-600 text-sm flex items-center gap-1"><Plus className="w-3 h-3" /> Add Phone</button>
                            </div>

                            {/* Emails */}
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Emails</label>
                                {data.info?.email?.map((em, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input className="w-full px-3 py-2 border rounded-md" value={em} onChange={(e) => updateArrayItem('info.email', i, null, e.target.value)} />
                                        <button onClick={() => removeArrayItem('info.email', i)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                <button onClick={() => addArrayItem('info.email', "")} className="text-blue-600 text-sm flex items-center gap-1"><Plus className="w-3 h-3" /> Add Email</button>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Address Lines</label>
                                {data.info?.address?.map((ad, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input className="w-full px-3 py-2 border rounded-md" value={ad} onChange={(e) => updateArrayItem('info.address', i, null, e.target.value)} />
                                        <button onClick={() => removeArrayItem('info.address', i)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                <button onClick={() => addArrayItem('info.address', "")} className="text-blue-600 text-sm flex items-center gap-1"><Plus className="w-3 h-3" /> Add Line</button>
                            </div>
                        </div>
                    </SectionBox>

                    <SectionBox title="Additional Info">
                        <InputField label="Map Embed URL (src only)" value={data.mapUrl} onChange={(v) => updateDeep('mapUrl', v)} textarea />
                        <InputField label="Office Hours Text" value={data.officeHours} onChange={(v) => updateDeep('officeHours', v)} />
                    </SectionBox>
                </div>
            )}

            {/* FAQ Page Form - UPDATED with Table and Modal */}
            {pageType === 'faq' && (
                <div className="space-y-8">
                    <SectionBox title="Hero">
                        <InputField label="Title" value={data.hero.title} onChange={(v) => updateDeep('hero.title', v)} />
                        <InputField label="Description" value={data.hero.description} onChange={(v) => updateDeep('hero.description', v)} textarea />
                    </SectionBox>

                    {/* FAQ List Table */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Questions & Answers</h3>
                            <button
                                onClick={() => openFaqModal()}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition ps-3 cursor-pointer"
                            >
                                <Plus className="w-4 h-4" /> Add FAQ
                            </button>
                        </div>

                        {faqList.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                No FAQs found. Add some to get started.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3 rounded-tl-lg">Question</th>
                                            <th className="px-4 py-3">Category</th>
                                            <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 border border-slate-100">
                                        {faqList.map((faq) => (
                                            <tr key={faq._id} className="hover:bg-slate-50 transition">
                                                <td className="px-4 py-3 font-medium text-slate-800">{faq.question}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                                                        {faq.category || "General"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openFaqModal(faq)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteFaq(faq._id)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* FAQ Modal */}
            {isFaqModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800">{editingFaqId ? "Edit FAQ" : "Add New FAQ"}</h3>
                            <button onClick={() => setIsFaqModalOpen(false)} className="text-slate-400 hover:text-red-500 transition">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <InputField
                                label="Question"
                                value={faqForm.question}
                                onChange={(val) => setFaqForm(prev => ({ ...prev, question: val }))}
                                placeholder="e.g. key admission dates?"
                            />
                            <InputField
                                label="Answer"
                                value={faqForm.answer}
                                onChange={(val) => setFaqForm(prev => ({ ...prev, answer: val }))}
                                textarea
                                placeholder="Enter detailed answer..."
                            />
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Category</label>
                                <select
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition text-sm text-slate-700"
                                    value={faqForm.category}
                                    onChange={(e) => setFaqForm(prev => ({ ...prev, category: e.target.value }))}
                                >
                                    <option value="General">General</option>
                                    <option value="Admissions">Admissions</option>
                                    <option value="Academics">Academics</option>
                                    <option value="Fees & Scholarships">Fees & Scholarships</option>
                                    <option value="Campus Life">Campus Life</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsFaqModalOpen(false)}
                                className="px-5 py-2.5 text-slate-600 font-medium hover:bg-white hover:shadow-sm rounded-lg border border-transparent hover:border-slate-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveFaq}
                                disabled={isSavingFaq}
                                className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSavingFaq && <Loader2 className="w-4 h-4 animate-spin" />}
                                {editingFaqId ? "Update FAQ" : "Save FAQ"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

function IconPicker({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // safe icon retrieval
    const SelectedIcon = LucideIcons[value] || LucideIcons.HelpCircle;

    // Filter valid icons (components start with uppercase)
    const iconNames = Object.keys(LucideIcons).filter(key =>
        key !== "createLucideIcon" &&
        key !== "default" &&
        /^[A-Z]/.test(key)
    );

    const filteredIcons = iconNames.filter(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Icon</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg text-left hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                            <SelectedIcon size={18} />
                        </div>
                        <span className="font-medium text-slate-700 text-sm">{value}</span>
                    </div>
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <div className="absolute z-50 bottom-full left-0 w-full mb-2 bg-white rounded-xl shadow-2xl border border-slate-100 p-3 min-w-[300px]">
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search icons..."
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto pr-1">
                                {filteredIcons.slice(0, 100).map(iconName => {
                                    const Icon = LucideIcons[iconName];
                                    return (
                                        <button
                                            key={iconName}
                                            onClick={() => { onChange(iconName); setIsOpen(false); }}
                                            className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-slate-100 transition-colors ${value === iconName ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200' : 'text-slate-500'}`}
                                            title={iconName}
                                        >
                                            <Icon size={20} />
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="text-xs text-center text-slate-400 mt-2 border-t pt-2">
                                Showing top {Math.min(filteredIcons.length, 100)} of {filteredIcons.length}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function SectionBox({ title, children }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
            <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">{title}</h3>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}

function ImageUploader({ label, image, onUpload, loading, onUrlChange, height = "h-32" }) {
    return (
        <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>
            <div className="flex gap-4 items-start">
                <div className={`relative w-40 ${height} bg-slate-100 rounded-lg border border-slate-200 overflow-hidden shrink-0 group`}>
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                        </div>
                    ) : image ? (
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-8 h-8" />
                        </div>
                    )}
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-medium text-xs">
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
                    </label>
                </div>

                <div className="flex-1 space-y-2">
                    <input
                        type="text"
                        value={image || ""}
                        onChange={(e) => onUrlChange(e.target.value)}
                        placeholder="Image URL"
                        className="w-full text-sm border-slate-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-slate-600"
                    />
                    <p className="text-xs text-slate-400">Upload an image or paste a direct URL.</p>
                </div>
            </div>
        </div>
    );
}
