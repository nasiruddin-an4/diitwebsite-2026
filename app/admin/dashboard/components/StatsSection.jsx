import React from "react";
import { Save, Loader2 } from "lucide-react";
import { InputField } from "./InputField";

export default function StatsSection({ data, updateField, onSave, saving }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Statistics Counter</h2>
          <p className="text-slate-500 text-sm mt-1">Manage homepage statistics</p>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all disabled:opacity-50 text-sm shadow-md shadow-slate-900/20"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.statsCounter?.map((stat, index) => (
          <div key={stat.id || index} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <InputField label="Value" type="number" value={stat.value} onChange={(v) => updateField("statsCounter", index, "value", parseInt(v))} />
            <InputField label="Suffix" value={stat.suffix} onChange={(v) => updateField("statsCounter", index, "suffix", v)} />
            <InputField label="Label" value={stat.label} onChange={(v) => updateField("statsCounter", index, "label", v)} />
          </div>
        ))}
      </div>
    </div>
  );
}
