import React, { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { InputField } from "./InputField";

export default function TuitionFeesSection() {
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
        setData(result.data.fees);
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
        fees: data
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

  const updateProgram = (index, field, value) => {
    const newPrograms = [...data.programs];
    newPrograms[index][field] = value;
    setData({ ...data, programs: newPrograms });
  };

  const addProgram = () => {
    setData({
      ...data,
      programs: [...data.programs, { name: "New Program", total_credit: 0, cost_per_credit: 0, total_cost: 0 }]
    });
  };

  const removeProgram = (index) => {
    const newPrograms = data.programs.filter((_, i) => i !== index);
    setData({ ...data, programs: newPrograms });
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />;
  if (!data) return <div>No data found</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tuition Fees</h2>
          <p className="text-slate-500 text-sm mt-1">Manage program fees structure</p>
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

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600">Program Name</th>
                <th className="p-4 font-semibold text-slate-600">Credits</th>
                <th className="p-4 font-semibold text-slate-600">Cost / Credit</th>
                <th className="p-4 font-semibold text-slate-600">Total Cost</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.programs.map((program, index) => (
                <tr key={index} className="group hover:bg-slate-50/50">
                  <td className="p-4">
                    <input
                      value={program.name}
                      onChange={(e) => updateProgram(index, "name", e.target.value)}
                      className="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none transition-colors"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      value={program.total_credit}
                      onChange={(e) => updateProgram(index, "total_credit", parseFloat(e.target.value))}
                      className="w-20 bg-transparent border-b border-transparent focus:border-blue-500 outline-none transition-colors"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      value={program.cost_per_credit}
                      onChange={(e) => updateProgram(index, "cost_per_credit", parseFloat(e.target.value))}
                      className="w-24 bg-transparent border-b border-transparent focus:border-blue-500 outline-none transition-colors"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      value={program.total_cost}
                      onChange={(e) => updateProgram(index, "total_cost", parseFloat(e.target.value))}
                      className="w-24 bg-transparent border-b border-transparent focus:border-blue-500 outline-none transition-colors font-medium text-slate-900"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => removeProgram(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-2 border-t border-slate-200 bg-slate-50/50">
            <button onClick={addProgram} className="w-full py-2 flex items-center justify-center gap-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
              <Plus className="w-4 h-4" /> Add Program
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
