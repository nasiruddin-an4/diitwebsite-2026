import React, { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { InputField } from "./InputField";

export default function AdmissionEligibilitySection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/data/AdmissionData");
      const result = await res.json();
      if (result.success) {
        setData(result.data.eligibility);
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
      // First fetch current full data to not overwrite other sections
      const res = await fetch("/api/admin/data/AdmissionData");
      const result = await res.json();
      const currentFullData = result.success ? result.data : {};

      const updatedData = {
        ...currentFullData,
        eligibility: data
      };

      await fetch("/api/admin/data/AdmissionData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Failed to save data", error);
      alert("Failed to save data");
    } finally {
      setSaving(false);
    }
  };

  const updateNestedField = (path, value) => {
    const keys = path.split(".");
    const newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setData(newData);
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />;
  if (!data) return (
    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 mt-4">
      <p className="text-slate-500 mb-4 font-medium">No admission eligibility data found.</p>
      <p className="text-sm text-slate-400 mb-6">The initial data might not be loaded yet.</p>
      <button
        onClick={fetchData}
        className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 mx-auto"
      >
        <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Try Loading Again
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Admission Eligibility</h2>
          <p className="text-slate-500 text-sm mt-1">Manage HSC & Diploma requirements</p>
        </div>
        <button
          onClick={saveData}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-md font-medium transition-all disabled:opacity-50 text-sm cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* HSC Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2">HSC & Equivalent</h3>
          <InputField label="Title" value={data.hsc.title} onChange={(v) => updateNestedField("hsc.title", v)} />

          <div className="grid grid-cols-2 gap-4">
            <InputField label="SSC Years" value={data.hsc.ssc_years} onChange={(v) => updateNestedField("hsc.ssc_years", v)} />
            <InputField label="HSC Years" value={data.hsc.hsc_years} onChange={(v) => updateNestedField("hsc.hsc_years", v)} />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
            <h4 className="col-span-2 text-sm font-semibold text-slate-500">SSC GPA Requirements</h4>
            <InputField label="Business/Arts" type="number" value={data.hsc.ssc_gpa_business_arts} onChange={(v) => updateNestedField("hsc.ssc_gpa_business_arts", parseFloat(v))} />
            <InputField label="Science" type="number" value={data.hsc.ssc_gpa_science} onChange={(v) => updateNestedField("hsc.ssc_gpa_science", parseFloat(v))} />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
            <h4 className="col-span-2 text-sm font-semibold text-slate-500">HSC GPA Requirements</h4>
            <InputField label="Business/Arts" type="number" value={data.hsc.hsc_gpa_business_arts} onChange={(v) => updateNestedField("hsc.hsc_gpa_business_arts", parseFloat(v))} />
            <InputField label="Science" type="number" value={data.hsc.hsc_gpa_science} onChange={(v) => updateNestedField("hsc.hsc_gpa_science", parseFloat(v))} />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h4 className="col-span-2 text-sm font-semibold text-blue-600">Combined GPA Requirements</h4>
            <InputField label="Business/Arts" type="number" value={data.hsc.combined_gpa_business_arts} onChange={(v) => updateNestedField("hsc.combined_gpa_business_arts", parseFloat(v))} />
            <InputField label="Science" type="number" value={data.hsc.combined_gpa_science} onChange={(v) => updateNestedField("hsc.combined_gpa_science", parseFloat(v))} />
          </div>
        </div>

        {/* Diploma Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2">Diploma Holders</h3>
          <InputField label="Title" value={data.diploma.title} onChange={(v) => updateNestedField("diploma.title", v)} />

          <div className="grid grid-cols-2 gap-4">
            <InputField label="SSC Years" value={data.diploma.ssc_years} onChange={(v) => updateNestedField("diploma.ssc_years", v)} />
            <InputField label="Diploma Years" value={data.diploma.diploma_years} onChange={(v) => updateNestedField("diploma.diploma_years", v)} />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
            <h4 className="col-span-2 text-sm font-semibold text-slate-500">GPA Requirements</h4>
            <InputField label="Minimum SSC GPA" type="number" value={data.diploma.ssc_gpa} onChange={(v) => updateNestedField("diploma.ssc_gpa", parseFloat(v))} />
            <InputField label="Minimum Diploma GPA" type="number" value={data.diploma.diploma_gpa} onChange={(v) => updateNestedField("diploma.diploma_gpa", parseFloat(v))} />
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <h4 className="text-sm font-semibold text-indigo-600 mb-2">Combined GPA Requirement</h4>
            <InputField label="Required Combined GPA" type="number" value={data.diploma.combined_gpa} onChange={(v) => updateNestedField("diploma.combined_gpa", parseFloat(v))} />
          </div>
        </div>
      </div>
    </div>
  );
}
