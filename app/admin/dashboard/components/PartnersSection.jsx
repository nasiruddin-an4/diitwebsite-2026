import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Users, Edit2, Trash2, Save, Loader2, Upload, Globe } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

export default function PartnersSection({ data, updateField, addItem, deleteItem, onSave, saving }) {
  const [editingId, setEditingId] = useState(null);
  const template = { id: "", name: "", logo: "", country: "", type: "", description: "", website: "" };

  const handleAdd = () => {
    const newId = Date.now();
    addItem("internationalPartners", { ...template, id: newId, isNew: true });
    setEditingId(newId);
  };

  const handleDoneEditing = () => {
    if (editingId !== null && editingIndex !== -1) {
      const p = editingPartner;
      const isEmpty = !p.name?.trim() && !p.description?.trim() && !p.logo?.trim();

      if (isEmpty) {
        deleteItem("internationalPartners", editingIndex);
      } else {
        if (p.isNew) {
          const { isNew, ...cleanPartner } = p;
          updateField("internationalPartners", editingIndex, null, cleanPartner);
        }
      }
    }
    setEditingId(null);
  };

  const partners = data?.internationalPartners || [];
  const editingPartner = partners.find(p => (p.id || p._id) === editingId);
  const editingIndex = partners.findIndex(p => (p.id || p._id) === editingId);

  const handleDelete = (partner, index) => {
    Swal.fire({
      title: "Delete Partner?",
      html: `<p class="text-sm">Are you sure you want to delete <strong>${partner.name || 'this partner'}</strong>? This action cannot be undone.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-lg px-6 py-2 font-bold",
        cancelButton: "rounded-lg px-6 py-2 font-bold"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem("internationalPartners", index);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">International Partners</h2>
          <p className="text-slate-500 text-sm mt-1">Manage partner universities and institutions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md cursor-pointer font-medium transition-all disabled:opacity-50 text-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer font-medium transition-all hover:scale-105 active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Partner
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Partner</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location & Type</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {partners.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-slate-500 text-sm">
                    No partners found.
                  </td>
                </tr>
              ) : (
                partners.map((partner, index) => (
                  <tr key={partner.id || index} className="group hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 p-1.5">
                          {partner.logo ? (
                            <img src={partner.logo} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <Users className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{partner.name || "Untitled"}</p>
                          {partner.website && (
                            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-[10px] hover:underline flex items-center gap-1 mt-0.5">
                              <Globe className="w-2.5 h-2.5" /> Visit Site
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="font-medium text-slate-700">{partner.country || "N/A"}</p>
                        <p className="text-xs text-slate-500">{partner.type || "N/A"}</p>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => setEditingId(partner.id || partner._id)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md cursor-pointer transition-all border border-blue-200"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(partner, index)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-md cursor-pointer transition-all border border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingId !== null && editingPartner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {editingPartner.isNew ? "Add New Partner" : "Edit Partner"}
                </h3>
                <button onClick={handleDoneEditing} className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Name" value={editingPartner.name} onChange={(v) => updateField("internationalPartners", editingIndex, "name", v)} />
                  <InputField label="Country" value={editingPartner.country} onChange={(v) => updateField("internationalPartners", editingIndex, "country", v)} />
                  <InputField label="Partnership Type" value={editingPartner.type} onChange={(v) => updateField("internationalPartners", editingIndex, "type", v)} />
                  <InputField label="Website URL" value={editingPartner.website} onChange={(v) => updateField("internationalPartners", editingIndex, "website", v)} placeholder="https://example.com" />
                </div>

                {/* Logo Upload */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Partner Logo</label>
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-md bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden p-2 shrink-0">
                      {editingPartner.logo ? (
                        <img src={editingPartner.logo} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <Users className="w-10 h-10 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <label className="flex items-center justify-center h-24 border-2 border-dashed border-blue-200 rounded-md cursor-pointer bg-blue-50/30 hover:bg-blue-50 transition-colors group">
                        <div className="text-center">
                          <Upload className="w-6 h-6 text-blue-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                          <p className="text-xs font-bold text-blue-700">Upload Logo</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                Swal.fire({ icon: "error", title: "Too large", text: "Logo must be less than 5MB", toast: true, position: "top-end", timer: 3000 });
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (ev) => updateField("internationalPartners", editingIndex, "logo", ev.target.result);
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      {editingPartner.logo && (
                        <button onClick={() => updateField("internationalPartners", editingIndex, "logo", "")} className="text-[10px] text-red-600 font-bold hover:underline">
                          Remove logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <InputField label="Description" value={editingPartner.description} onChange={(v) => updateField("internationalPartners", editingIndex, "description", v)} textarea />
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button onClick={handleDoneEditing} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md cursor-pointer font-bold transition-all text-sm">Cancel</button>
                <button onClick={handleDoneEditing} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer font-bold transition-all text-sm">Save & Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
