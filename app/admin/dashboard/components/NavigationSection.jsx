"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronDown, 
  ChevronUp, 
  Save, 
  ExternalLink,
  GripVertical,
  Layers,
  Link as LinkIcon
} from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

export default function NavigationSection() {
  const [navigationItems, setNavigationItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/data/NavigationData");
      const result = await res.json();
      if (result.success && result.data && result.data.navigationItems) {
        setNavigationItems(result.data.navigationItems);
      } else {
        // If data doesn't exist, we'll start with empty or some default structure
        setNavigationItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch navigation:", error);
      Swal.fire("Error", "Failed to load navigation data", "error");
    } finally {
      setLoading(false);
    }
  };

  const saveNavigation = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/data/NavigationData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ navigationItems }),
      });
      const result = await res.json();
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "Navigation menu updated successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        throw new Error(result.message || "Failed to save");
      }
    } catch (error) {
      console.error("Save error:", error);
      Swal.fire("Error", error.message || "Failed to save navigation", "error");
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    setNavigationItems([
      ...navigationItems,
      { name: "New Menu", path: "", dropdown: [] }
    ]);
  };

  const deleteItem = (index) => {
    const newItems = [...navigationItems];
    newItems.splice(index, 1);
    setNavigationItems(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...navigationItems];
    newItems[index][field] = value;
    setNavigationItems(newItems);
  };

  const addDropdownItem = (parentIndex) => {
    const newItems = [...navigationItems];
    if (!newItems[parentIndex].dropdown) {
      newItems[parentIndex].dropdown = [];
    }
    newItems[parentIndex].dropdown.push({ name: "New Submenu", path: "" });
    setNavigationItems(newItems);
  };

  const deleteDropdownItem = (parentIndex, childIndex) => {
    const newItems = [...navigationItems];
    newItems[parentIndex].dropdown.splice(childIndex, 1);
    setNavigationItems(newItems);
  };

  const updateDropdownItem = (parentIndex, childIndex, field, value) => {
    const newItems = [...navigationItems];
    newItems[parentIndex].dropdown[childIndex][field] = value;
    
    // Auto-set target to _blank if external is checked
    if (field === "external") {
      newItems[parentIndex].dropdown[childIndex]["target"] = value ? "_blank" : "";
    }
    
    setNavigationItems(newItems);
  };

  const moveItem = (index, direction) => {
    const newItems = [...navigationItems];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < newItems.length) {
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      setNavigationItems(newItems);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Navigation Menu</h2>
          <p className="text-slate-500 text-sm">Manage your website's main navigation structure.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-semibold text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Top Menu
          </button>
          <button
            onClick={saveNavigation}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 rounded-lg transition-colors font-bold shadow-lg shadow-blue-600/20"
          >
            {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Save className="w-5 h-5" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {navigationItems.map((item, index) => (
          <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Top Level Item Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="text-slate-400 hover:text-blue-600 disabled:opacity-30">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveItem(index, 1)} disabled={index === navigationItems.length - 1} className="text-slate-400 hover:text-blue-600 disabled:opacity-30">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Menu Name"
                  value={item.name}
                  onChange={(val) => updateItem(index, "name", val)}
                  placeholder="e.g. Admissions"
                />
                <InputField
                  label="Path (optional if has dropdown)"
                  value={item.path || ""}
                  onChange={(val) => updateItem(index, "path", val)}
                  placeholder="e.g. /admissions"
                />
              </div>

              <div className="flex items-center gap-2 self-end pb-1">
                <button
                  onClick={() => addDropdownItem(index)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors title='Add Submenu'"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteItem(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dropdown Items Section */}
            {item.dropdown && item.dropdown.length > 0 && (
              <div className="p-4 bg-white space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Layers className="w-3 h-3" />
                  Submenu Items
                </div>
                {item.dropdown.map((sub, sIndex) => (
                  <div key={sIndex} className="flex items-center gap-4 pl-8 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-px bg-slate-200"></div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        value={sub.name}
                        onChange={(val) => updateDropdownItem(index, sIndex, "name", val)}
                        placeholder="Submenu Name"
                      />
                      <InputField
                        value={sub.path}
                        onChange={(val) => updateDropdownItem(index, sIndex, "path", val)}
                        placeholder="Path"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {sub.external ? <ExternalLink className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={sub.external || false} 
                            onChange={(e) => updateDropdownItem(index, sIndex, "external", e.target.checked)}
                            className="w-3 h-3 rounded"
                          />
                          External
                        </label>
                      </div>
                      <button
                        onClick={() => deleteDropdownItem(index, sIndex)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {(!item.dropdown || item.dropdown.length === 0) && (
              <div className="px-12 py-3 text-sm text-slate-400 italic">
                No submenu items. This will be a direct link.
              </div>
            )}
          </div>
        ))}
        
        {navigationItems.length === 0 && (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-slate-600 font-bold">No navigation items yet</h3>
            <p className="text-slate-400 text-sm mt-1">Start by adding your first menu item.</p>
            <button
              onClick={addItem}
              className="mt-4 px-6 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-semibold text-sm"
            >
              Add Top Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
