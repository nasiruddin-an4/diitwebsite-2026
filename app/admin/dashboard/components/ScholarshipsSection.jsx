import React, { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { InputField } from "./InputField";

export default function ScholarshipsSection() {
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
        setData(result.data.scholarships);
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

  const updateItem = (index, field, value) => {
    const newItems = [...data.items];
    newItems[index][field] = value;
    setData({ ...data, items: newItems });
  };

  const addItem = () => {
    setData({ ...data, items: [...data.items, { title: "New Scholarship", criteria: "", waiver: "" }] });
  };

  const removeItem = (index) => {
    const newItems = data.items.filter((_, i) => i !== index);
    setData({ ...data, items: newItems });
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />;
  if (!data) return <div>No data found</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Scholarships & Waivers</h2>
          <p className="text-slate-500 text-sm mt-1">Manage scholarship programs and criteria</p>
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
        <InputField label="Section Title" value={data.title} onChange={(v) => updateField("title", v)} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item, index) => (
            <div key={index} className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3 relative group">
              <button onClick={() => removeItem(index)} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
              <InputField label="Scholarship Title" value={item.title} onChange={(v) => updateItem(index, "title", v)} />
              <InputField label="Criteria" value={item.criteria} onChange={(v) => updateItem(index, "criteria", v)} textarea />
              <InputField label="Waiver Amount" value={item.waiver} onChange={(v) => updateItem(index, "waiver", v)} />
            </div>
          ))}
          <button
            onClick={addItem}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition-all min-h-[200px]"
          >
            <Plus className="w-8 h-8 mb-2" />
            <span className="font-medium text-sm">Add Opportunity</span>
          </button>
        </div>
      </div>
    </div>
  );
}
