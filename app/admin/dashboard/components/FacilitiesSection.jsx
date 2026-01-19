import React, { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, ImageIcon } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

export default function FacilitiesSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

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
      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Changes saved successfully',
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

  const updateItem = (index, field, value) => {
    const newItems = [...data];
    newItems[index][field] = value;
    setData(newItems);
  };

  const addItem = () => {
    setData([...data, {
      title: "New Facility",
      description: "",
      stat: "New",
      span: "md:col-span-1",
      image: ""
    }]);
  };

  const removeItem = async (index) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Delete this facility item?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const newItems = data.filter((_, i) => i !== index);
      setData(newItems);
      Swal.fire('Deleted!', 'Item has been removed.', 'success');
    }
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingIndex(index);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "facilities");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) {
        updateItem(index, "image", result.url);
        Swal.fire({
          icon: 'success',
          title: 'Uploaded!',
          text: 'Image uploaded successfully',
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
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Could not upload image',
      });
    } finally {
      setUploadingIndex(null);
    }
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />;
  if (!data) return (
    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 mt-4">
      <p className="text-slate-500 mb-4 font-medium">No facilities data found.</p>
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
          <h2 className="text-xl font-bold text-slate-900">Campus Facilities</h2>
          <p className="text-slate-500 text-sm mt-1">Manage campus facilities and amenities</p>
        </div>
        <button
          onClick={saveData}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-md cursor-pointer font-medium transition-all disabled:opacity-50 text-sm"
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

            <div className="space-y-4">
              <InputField label="Title" value={item.title} onChange={(v) => updateItem(index, "title", v)} />
              <InputField label="Description" value={item.description} onChange={(v) => updateItem(index, "description", v)} textarea />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InputField label="Stat Badge" value={item.stat} onChange={(v) => updateItem(index, "stat", v)} />
              <InputField label="Grid Span" value={item.span} onChange={(v) => updateItem(index, "span", v)} />
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Facility Image</label>
              {uploadingIndex === index ? (
                <div className="h-24 w-full bg-slate-50 border border-slate-200 border-dashed rounded-xl flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="relative group/img flex-1">
                    <label
                      className="flex items-center gap-2 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors text-sm"
                    >
                      <ImageIcon className="w-4 h-4 text-slate-500" />
                      <span className="truncate">{item.image ? "Change Image" : "Upload Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {item.image && (
                    <div className="h-16 w-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative group/preview">
                      <img src={item.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/10 transition-colors" />
                    </div>
                  )}
                  {!item.image && (
                    <div className="h-16 w-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
              )}
              {/* Fallback for manual URL entry if upload fails or external URL needed */}
              <input
                value={item.image || ""}
                onChange={(e) => updateItem(index, "image", e.target.value)}
                className="w-full text-xs text-slate-400 bg-transparent border-none focus:ring-0 p-0 mt-1"
                placeholder="or paste image URL here"
              />
            </div>
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
