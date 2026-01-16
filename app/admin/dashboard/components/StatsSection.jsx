import React, { useState } from "react";
import { Save, Loader2, Edit2, X, Check } from "lucide-react";
import { InputField } from "./InputField";
import { motion, AnimatePresence } from "framer-motion";

export default function StatsSection({ data, updateField, onSave, saving }) {
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Statistics</h2>
          <p className="text-slate-600 text-sm mt-1">Manage the statistics counters displayed on your homepage</p>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-md font-semibold transition-all disabled:opacity-50 text-sm cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {data?.statsCounter?.map((stat, index) => (
          <motion.div
            key={stat.id || index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 transition-all group"
          >
            {editingId === (stat.id || index) ? (
              <>
                <div className="space-y-4">
                  <InputField
                    label="Value"
                    type="number"
                    value={stat.value}
                    onChange={(v) => updateField("statsCounter", index, "value", parseInt(v) || 0)}
                  />
                  <InputField
                    label="Label"
                    value={stat.label}
                    onChange={(v) => updateField("statsCounter", index, "label", v)}
                    placeholder="e.g., Students Enrolled"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold transition-all text-sm"
                  >
                    <Check className="w-4 h-4" /> Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-all text-sm"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Value</p>
                    <p className="text-4xl font-bold text-blue-600 mt-1">{stat.value || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Label</p>
                    <p className="text-lg font-semibold text-slate-900 mt-1">{stat.label || "—"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingId(stat.id || index)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold transition-all text-sm opacity-0 group-hover:opacity-100"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
              </>
            )}
          </motion.div>
        ))}
      </motion.div>

      {!data?.statsCounter || data.statsCounter.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-2">No statistics yet</h3>
          <p className="text-slate-600 max-w-sm mx-auto">Add statistics counters to showcase key metrics on your homepage.</p>
        </motion.div>
      )}
    </div>
  );
}
