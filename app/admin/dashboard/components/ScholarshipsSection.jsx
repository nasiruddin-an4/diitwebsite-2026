import React, { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, GraduationCap, HeartHandshake, Zap, Settings } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

export default function ScholarshipsSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/data/AdmissionData");
      const result = await res.json();
      if (result.success && result.data?.scholarships) {
        setData(result.data.scholarships);
      } else {
        // Fallback default structure if empty
        setData({
          title: "Scholarships & Waivers",
          intro: "",
          merit: { title: "Merit-Based Scholarships", description: "", tiers: [], note: "" },
          needBased: { title: "Need-Based Waivers", description: "", benefits: [] },
          special: { title: "Special Categories", description: "", categories: [] }
        });
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/data/AdmissionData");
      const result = await res.json();
      const currentFullData = result.success ? result.data : {};

      const updatedData = {
        ...currentFullData,
        scholarships: data
      };

      await fetch("/api/admin/data/AdmissionData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Scholarship data updated successfully',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Failed to save data", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save data',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateMain = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const updateSection = (section, field, value) => {
    setData({
      ...data,
      [section]: {
        ...data[section],
        [field]: value
      }
    });
  };

  // --- List Management Helpers ---

  // For Merit Tiers
  const addTier = () => {
    const newTiers = [...(data.merit.tiers || []), { label: "New GPA Range", waiver: "0% Waiver" }];
    updateSection("merit", "tiers", newTiers);
  };

  const updateTier = (index, field, value) => {
    const newTiers = [...data.merit.tiers];
    newTiers[index][field] = value;
    updateSection("merit", "tiers", newTiers);
  };

  const removeTier = (index) => {
    const newTiers = data.merit.tiers.filter((_, i) => i !== index);
    updateSection("merit", "tiers", newTiers);
  };

  // For Need Based Benefits
  const addBenefit = () => {
    const newBenefits = [...(data.needBased.benefits || []), "New Benefit Description"];
    updateSection("needBased", "benefits", newBenefits);
  };

  const updateBenefit = (index, value) => {
    const newBenefits = [...data.needBased.benefits];
    newBenefits[index] = value;
    updateSection("needBased", "benefits", newBenefits);
  };

  const removeBenefit = (index) => {
    const newBenefits = data.needBased.benefits.filter((_, i) => i !== index);
    updateSection("needBased", "benefits", newBenefits);
  };

  // For Special Categories
  const addCategory = () => {
    const newCats = [...(data.special.categories || []), { label: "New Category", value: "Offer" }];
    updateSection("special", "categories", newCats);
  };

  const updateCategory = (index, field, value) => {
    const newCats = [...data.special.categories];
    newCats[index][field] = value;
    updateSection("special", "categories", newCats);
  };

  const removeCategory = (index) => {
    const newCats = data.special.categories.filter((_, i) => i !== index);
    updateSection("special", "categories", newCats);
  };


  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />;
  if (!data) return <div className="p-4 text-center">No data</div>;

  const tabs = [
    { id: 'general', label: 'General Info', icon: <Settings className="w-4 h-4" /> },
    { id: 'merit', label: 'Merit Based', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'need', label: 'Need Based', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'special', label: 'Special Cases', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Scholarships & Waivers</h2>
          <p className="text-slate-500 text-sm mt-1">Manage all scholarship programs</p>
        </div>
        <button
          onClick={saveData}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all disabled:opacity-50 text-sm shadow-md shadow-slate-900/20"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Header Information</h3>
            <InputField label="Main Page Title" value={data.title} onChange={(v) => updateMain("title", v)} />
            <InputField label="Intro Description" value={data.intro} onChange={(v) => updateMain("intro", v)} textarea />
          </div>
        )}

        {/* Merit Tab */}
        {activeTab === 'merit' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-4">
              <InputField label="Section Title" value={data.merit?.title} onChange={(v) => updateSection("merit", "title", v)} />
              <InputField label="Description" value={data.merit?.description} onChange={(v) => updateSection("merit", "description", v)} textarea />
              <InputField label="Footer Note" value={data.merit?.note} onChange={(v) => updateSection("merit", "note", v)} />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-700 mb-3 flex items-center justify-between">
                Tuition Waiver Tiers
                <button onClick={addTier} className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"><Plus className="w-3 h-3" /> Add Tier</button>
              </h4>
              <div className="space-y-3">
                {data.merit?.tiers?.map((tier, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        value={tier.label}
                        onChange={(e) => updateTier(idx, "label", e.target.value)}
                        placeholder="GPA Range (e.g. GPA 5.00)"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        value={tier.waiver}
                        onChange={(e) => updateTier(idx, "waiver", e.target.value)}
                        placeholder="Waiver (e.g. 100% Off)"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <button onClick={() => removeTier(idx)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Need Based Tab */}
        {activeTab === 'need' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-4">
              <InputField label="Section Title" value={data.needBased?.title} onChange={(v) => updateSection("needBased", "title", v)} />
              <InputField label="Description" value={data.needBased?.description} onChange={(v) => updateSection("needBased", "description", v)} textarea />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-700 mb-3 flex items-center justify-between">
                Benefits List
                <button onClick={addBenefit} className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"><Plus className="w-3 h-3" /> Add Benefit</button>
              </h4>
              <div className="space-y-2">
                {data.needBased?.benefits?.map((benefit, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600 text-xs font-bold">{idx + 1}</div>
                    <input
                      value={benefit}
                      onChange={(e) => updateBenefit(idx, e.target.value)}
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    />
                    <button onClick={() => removeBenefit(idx)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Special Tab */}
        {activeTab === 'special' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-4">
              <InputField label="Section Title" value={data.special?.title} onChange={(v) => updateSection("special", "title", v)} />
              <InputField label="Description" value={data.special?.description} onChange={(v) => updateSection("special", "description", v)} textarea />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-700 mb-3 flex items-center justify-between">
                Categories
                <button onClick={addCategory} className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"><Plus className="w-3 h-3" /> Add Category</button>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.special?.categories?.map((cat, idx) => (
                  <div key={idx} className="flex gap-2 items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex-1 space-y-2">
                      <input
                        value={cat.label}
                        onChange={(e) => updateCategory(idx, "label", e.target.value)}
                        placeholder="Category Name"
                        className="w-full p-1.5 bg-white border border-slate-200 rounded text-sm font-medium"
                      />
                      <input
                        value={cat.value}
                        onChange={(e) => updateCategory(idx, "value", e.target.value)}
                        placeholder="Value (e.g. Quota)"
                        className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs text-slate-500"
                      />
                    </div>
                    <button onClick={() => removeCategory(idx)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
