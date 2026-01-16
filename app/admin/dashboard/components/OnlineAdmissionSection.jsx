import React, { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { InputField } from "./InputField";

export default function OnlineAdmissionSection() {
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
        setData(result.data.online);
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
        online: data
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

  const updateField = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...data.steps];
    newSteps[index][field] = value;
    setData({ ...data, steps: newSteps });
  };

  const addStep = () => {
    setData({ ...data, steps: [...data.steps, { title: "New Step", description: "" }] });
  };

  const removeStep = (index) => {
    const newSteps = data.steps.filter((_, i) => i !== index);
    setData({ ...data, steps: newSteps });
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />;
  if (!data) return (
    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 mt-4">
      <p className="text-slate-500 mb-4 font-medium">No online admission data found.</p>
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
          <h2 className="text-xl font-bold text-slate-900">Online Admission</h2>
          <p className="text-slate-500 text-sm mt-1">Manage online application steps and links</p>
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

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Section Title" value={data.title} onChange={(v) => updateField("title", v)} />
          <InputField label="Apply Link" value={data.applyLink} onChange={(v) => updateField("applyLink", v)} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Application Steps</h3>
            <button onClick={addStep} className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700">
              <Plus className="w-4 h-4" /> Add Step
            </button>
          </div>

          <div className="space-y-4">
            {data.steps.map((step, index) => (
              <div key={index} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-4 items-start group">
                <div className="flex-shrink-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <InputField label="Step Title" value={step.title} onChange={(v) => updateStep(index, "title", v)} />
                  <InputField label="Description" value={step.description} onChange={(v) => updateStep(index, "description", v)} textarea />
                </div>
                <button onClick={() => removeStep(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
