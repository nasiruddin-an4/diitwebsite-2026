import React, { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, ImageIcon } from "lucide-react";
import { InputField } from "./InputField";

export default function FacilitiesSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/data/CampusData");
      const result = await res.json();
      if (result.success) {
        setData(result.data.facilities);
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
      const res = await fetch("/api/admin/data/CampusData");
      const result = await res.json();
      const currentFullData = result.success ? result.data : {};

      const updatedData = {
        ...currentFullData,
        facilities: data
      };

      await fetch("/api/admin/data/CampusData", {
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

  const updateItem = (index, field, value) => {
    const newItems = [...data];
    newItems[index][field] = value;
    setData(newItems);
  };

  const addItem = () => {
    setData([...data, {
      title: "New Facility",
      description: "",
      icon: "Monitor",
      stat: "New",
      color: "from-blue-500 to-blue-600",
      span: "md:col-span-1"
    }]);
  };

  const removeItem = (index) => {
    const newItems = data.filter((_, i) => i !== index);
    setData(newItems);
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate upload or implement actual upload if API exists
    // For now we just use a placeholder or assume upload logic similar to HeroSection
    // But since I don't have the upload logic here, I'll alert.
    alert("Image upload implementation required. Please manually enter URL for now.");
    // Ideally: call /api/upload
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />;
  if (!data) return <div>No data found</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Campus Facilities</h2>
          <p className="text-slate-500 text-sm mt-1">Manage campus facilities and amenities</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((item, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 relative group">
            <button onClick={() => removeItem(index)} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${item.color || "bg-slate-200"} flex-shrink-0`} />
              <div className="flex-1 space-y-2">
                <InputField label="Title" value={item.title} onChange={(v) => updateItem(index, "title", v)} />
                <InputField label="Description" value={item.description} onChange={(v) => updateItem(index, "description", v)} textarea />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InputField label="Icon (Lucide)" value={item.icon} onChange={(v) => updateItem(index, "icon", v)} />
              <InputField label="Stat Badge" value={item.stat} onChange={(v) => updateItem(index, "stat", v)} />
              <InputField label="Grid Span" value={item.span} onChange={(v) => updateItem(index, "span", v)} />
              <InputField label="Gradient Color" value={item.color} onChange={(v) => updateItem(index, "color", v)} />
            </div>

            <InputField label="Image URL" value={item.image || ""} onChange={(v) => updateItem(index, "image", v)} />
          </div>
        ))}
        <button
          onClick={addItem}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition-all min-h-[300px]"
        >
          <Plus className="w-8 h-8 mb-2" />
          <span className="font-medium text-sm">Add New Facility</span>
        </button>
      </div>
    </div>
  );
}
