import React, { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

export default function CampusActivitiesSection() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingState, setUploadingState] = useState({ section: null, index: null });
    const [expandedSection, setExpandedSection] = useState("whyChoose");

    const sections = [
        { id: "whyChoose", label: "Why Choose Us" },
        { id: "facilities", label: "Facilities" },
        { id: "clubs", label: "Clubs" },
        { id: "gallery", label: "Gallery" },
        { id: "location", label: "Location" },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/admin/campus-activities");
            const result = await res.json();
            if (result.success) {
                // Ensure all arrays exist
                const safeData = {
                    header: result.data.header || { title: "DIIT Campus Life & Facilities", subtitle: "A safe, modern, and student-friendly learning environment.", bgImage: "" },
                    intro: result.data.intro || { title: "Welcome to DIIT", description: "Fostering discipline, innovation, and comprehensive student growth." },
                    sectionTitles: result.data.sectionTitles || {
                        whyChoose: { title: "Why Choose DIIT?", subtitle: "Discover the unique features that make our campus the perfect place for your growth." },
                        facilities: { title: "World-Class Facilities", subtitle: "Equipped with state-of-the-art infrastructure to support your academic journey." },
                        clubs: { title: "Clubs & Activities", subtitle: "Engage, lead, and grow outside the classroom." },
                        gallery: { title: "Life on Campus", subtitle: "Snapshots of student life and campus vibrancy." },
                        events: { title: "Upcoming Events & Workshops", subtitle: "Seminars, industry sessions, and cultural programs." },
                    },
                    whyChoose: result.data.whyChoose || [],
                    facilities: result.data.facilities || [],
                    clubs: result.data.clubs || [],
                    gallery: result.data.gallery || [],
                    events: result.data.events || [],
                    location: result.data.location || { address: "", mapEmbedUrl: "" },
                };
                setData(safeData);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
            Swal.fire('Error', 'Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const saveData = async () => {
        setSaving(true);
        try {
            await fetch("/api/admin/campus-activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Campus activities data saved successfully',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Failed to save data", error);
            Swal.fire('Error', 'Failed to save data', 'error');
        } finally {
            setSaving(false);
        }
    };

    const updateItem = (section, index, field, value) => {
        const newData = { ...data };
        if (section === "location" || section === "header" || section === "intro") {
            newData[section][field] = value;
        } else {
            newData[section][index][field] = value;
        }
        setData(newData);
    };

    const updateSectionTitle = (section, field, value) => {
        const newData = { ...data };
        if (!newData.sectionTitles) newData.sectionTitles = {};
        if (!newData.sectionTitles[section]) newData.sectionTitles[section] = {};
        newData.sectionTitles[section][field] = value;
        setData(newData);
    };

    const addItem = (section) => {
        const newData = { ...data };
        const templates = {
            whyChoose: { icon: "CheckCircle", label: "New Feature", desc: "Description" },
            facilities: { id: Date.now(), title: "New Facility", icon: "Monitor", description: "", image: "" },
            clubs: { id: Date.now(), name: "New Club", description: "", image: "" },
            gallery: { id: Date.now(), src: "", alt: "Gallery Image" },
            events: { id: Date.now(), title: "New Event", category: "General", date: "", description: "", image: "" },
        };
        newData[section].push(templates[section]);
        setData(newData);
    };

    const removeItem = (section, index) => {
        const newData = { ...data };
        newData[section].splice(index, 1);
        setData(newData);
    };

    const handleImageUpload = async (e, section, index) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingState({ section, index });
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", `campus-activities/${section}`);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const result = await res.json();
            if (result.success) {
                if (section === "gallery") {
                    updateItem(section, index, "src", result.url);
                } else {
                    updateItem(section, index, "image", result.url);
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Uploaded!',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Image upload failed', 'error');
        } finally {
            setUploadingState({ section: null, index: null });
        }
    };

    if (loading) return <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-slate-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Campus Activities</h2>
                    <p className="text-slate-500 mt-1">Manage campus life, clubs, events, and facilities</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                <div className="lg:col-span-1 space-y-2 sticky top-0 h-fit">
                    {sections.map((sec) => (
                        <button
                            key={sec.id}
                            onClick={() => setExpandedSection(sec.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${expandedSection === sec.id
                                ? "bg-white text-blue-600 shadow-md border border-blue-100"
                                : "text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            {sec.label}
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-3 space-y-6">
                    {expandedSection === "header" && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <InputField label="Hero Title" value={data.header.title || ""} onChange={(v) => updateItem("header", null, "title", v)} />
                            <InputField label="Hero Subtitle" value={data.header.subtitle || ""} onChange={(v) => updateItem("header", null, "subtitle", v)} textarea />
                            <ImageUploader
                                label="Hero Background Image"
                                image={data.header.bgImage}
                                onUpload={(e) => handleImageUpload(e, "header", null)}
                                loading={uploadingState.section === "header"}
                                onUrlChange={(v) => updateItem("header", null, "bgImage", v)}
                                height="h-48"
                            />
                        </div>
                    )}

                    {expandedSection === "intro" && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <InputField label="Intro Title" value={data.intro.title || ""} onChange={(v) => updateItem("intro", null, "title", v)} />
                            <InputField label="Intro Description" value={data.intro.description || ""} onChange={(v) => updateItem("intro", null, "description", v)} textarea />
                        </div>
                    )}

                    {expandedSection === "whyChoose" && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                                <h3 className="font-semibold text-blue-800 mb-3">Section Header</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <InputField label="Section Title" value={data.sectionTitles?.whyChoose?.title || ""} onChange={(v) => updateSectionTitle("whyChoose", "title", v)} />
                                    <InputField label="Section Subtitle" value={data.sectionTitles?.whyChoose?.subtitle || ""} onChange={(v) => updateSectionTitle("whyChoose", "subtitle", v)} textarea />
                                </div>
                            </div>
                            {data.whyChoose.map((item, index) => (
                                <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group">
                                    <button onClick={() => removeItem("whyChoose", index)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField label="Icon Name (Lucide)" value={item.icon} onChange={(v) => updateItem("whyChoose", index, "icon", v)} />
                                        <InputField label="Label" value={item.label} onChange={(v) => updateItem("whyChoose", index, "label", v)} />
                                        <div className="md:col-span-2">
                                            <InputField label="Description" value={item.desc} onChange={(v) => updateItem("whyChoose", index, "desc", v)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <ButtonAdd onClick={() => addItem("whyChoose")} label="Add Feature" />
                        </div>
                    )}

                    {expandedSection === "facilities" && (
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                                <h3 className="font-semibold text-blue-800 mb-3">Section Header</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <InputField label="Section Title" value={data.sectionTitles?.facilities?.title || ""} onChange={(v) => updateSectionTitle("facilities", "title", v)} />
                                    <InputField label="Section Subtitle" value={data.sectionTitles?.facilities?.subtitle || ""} onChange={(v) => updateSectionTitle("facilities", "subtitle", v)} textarea />
                                </div>
                            </div>
                            {data.facilities.map((item, index) => (
                                <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group">
                                    <button onClick={() => removeItem("facilities", index)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField label="Title" value={item.title} onChange={(v) => updateItem("facilities", index, "title", v)} />
                                        <InputField label="Icon" value={item.icon} onChange={(v) => updateItem("facilities", index, "icon", v)} />
                                        <div className="md:col-span-2">
                                            <InputField label="Description" value={item.description} onChange={(v) => updateItem("facilities", index, "description", v)} textarea />
                                        </div>
                                        <div className="md:col-span-2">
                                            <ImageUploader
                                                label="Facility Image"
                                                image={item.image}
                                                onUpload={(e) => handleImageUpload(e, "facilities", index)}
                                                loading={uploadingState.section === "facilities" && uploadingState.index === index}
                                                onUrlChange={(v) => updateItem("facilities", index, "image", v)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <ButtonAdd onClick={() => addItem("facilities")} label="Add Facility" />
                        </div>
                    )}

                    {expandedSection === "clubs" && (
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                                <h3 className="font-semibold text-blue-800 mb-3">Section Header</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <InputField label="Section Title" value={data.sectionTitles?.clubs?.title || ""} onChange={(v) => updateSectionTitle("clubs", "title", v)} />
                                    <InputField label="Section Subtitle" value={data.sectionTitles?.clubs?.subtitle || ""} onChange={(v) => updateSectionTitle("clubs", "subtitle", v)} textarea />
                                </div>
                            </div>
                            {data.clubs.map((item, index) => (
                                <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group">
                                    <button onClick={() => removeItem("clubs", index)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField label="Club Name" value={item.name} onChange={(v) => updateItem("clubs", index, "name", v)} />
                                        <div className="md:col-span-2">
                                            <InputField label="Description" value={item.description} onChange={(v) => updateItem("clubs", index, "description", v)} textarea />
                                        </div>
                                        <div className="md:col-span-2">
                                            <ImageUploader
                                                label="Club Image"
                                                image={item.image}
                                                onUpload={(e) => handleImageUpload(e, "clubs", index)}
                                                loading={uploadingState.section === "clubs" && uploadingState.index === index}
                                                onUrlChange={(v) => updateItem("clubs", index, "image", v)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <ButtonAdd onClick={() => addItem("clubs")} label="Add Club" />
                        </div>
                    )}

                    {expandedSection === "gallery" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4 col-span-full">
                                <h3 className="font-semibold text-blue-800 mb-3">Section Header</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <InputField label="Section Title" value={data.sectionTitles?.gallery?.title || ""} onChange={(v) => updateSectionTitle("gallery", "title", v)} />
                                    <InputField label="Section Subtitle" value={data.sectionTitles?.gallery?.subtitle || ""} onChange={(v) => updateSectionTitle("gallery", "subtitle", v)} textarea />
                                </div>
                            </div>
                            {data.gallery.map((item, index) => (
                                <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                                    <button onClick={() => removeItem("gallery", index)} className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="space-y-3">
                                        <ImageUploader
                                            label="Photo"
                                            image={item.src}
                                            onUpload={(e) => handleImageUpload(e, "gallery", index)}
                                            loading={uploadingState.section === "gallery" && uploadingState.index === index}
                                            onUrlChange={(v) => updateItem("gallery", index, "src", v)}
                                            height="h-40"
                                        />
                                        <InputField label="Alt Text" value={item.alt} onChange={(v) => updateItem("gallery", index, "alt", v)} />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => addItem("gallery")}
                                className="h-full min-h-[200px] border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                            >
                                <Plus className="w-8 h-8 mb-2" />
                                Add Photo
                            </button>
                        </div>
                    )}

                    {expandedSection === "events" && (
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                                <h3 className="font-semibold text-blue-800 mb-3">Section Header</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <InputField label="Section Title" value={data.sectionTitles?.events?.title || ""} onChange={(v) => updateSectionTitle("events", "title", v)} />
                                    <InputField label="Section Subtitle" value={data.sectionTitles?.events?.subtitle || ""} onChange={(v) => updateSectionTitle("events", "subtitle", v)} textarea />
                                </div>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-yellow-800 text-sm">
                                <strong>Note:</strong> Events logic has been automated. Upcoming events from the <em>News & Events</em> section will automatically appear here. You can only customize the section header above.
                            </div>
                        </div>
                    )}

                    {expandedSection === "location" && (
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <InputField label="Address" value={data.location.address} onChange={(v) => updateItem("location", null, "address", v)} />
                            <InputField label="Google Maps Embed URL" value={data.location.mapEmbedUrl} onChange={(v) => updateItem("location", null, "mapEmbedUrl", v)} textarea />

                            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Preview</p>
                                <iframe
                                    src={data.location.mapEmbedUrl}
                                    width="100%"
                                    height="200"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    className="rounded-lg"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ButtonAdd({ onClick, label }) {
    return (
        <button
            onClick={onClick}
            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2"
        >
            <Plus className="w-5 h-5" />
            {label}
        </button>
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
