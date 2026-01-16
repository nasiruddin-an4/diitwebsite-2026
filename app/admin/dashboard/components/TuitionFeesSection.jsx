import React, { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, X } from "lucide-react";
import { InputField } from "./InputField";

export default function TuitionFeesSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("CSE");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/data/AdmissionData");
      const result = await res.json();
      if (result.success && result.data?.fees) {
        setData(result.data.fees);
        const keys = Object.keys(result.data.fees);
        if (keys.length > 0 && !keys.includes(activeTab)) {
          setActiveTab(keys[0]);
        }
      } else {
        setData({});
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

  const addProgram = () => {
    const name = prompt("Enter new program abbreviation (e.g., PHARM):");
    if (name && !data[name]) {
      setData({
        ...data,
        [name]: []
      });
      setActiveTab(name);
    }
  };

  const removeProgram = (key) => {
    if (confirm(`Are you sure you want to delete ${key} and all its tables?`)) {
      const newData = { ...data };
      delete newData[key];
      setData(newData);
      if (activeTab === key) setActiveTab(Object.keys(newData)[0] || "");
    }
  };

  const addTableToProgram = () => {
    if (!data[activeTab]) return;
    const newTable = {
      type: "undergrad",
      title: "New Fee Structure",
      headers: ["Item", "Cost", "Total"],
      rows: [["Admission", "1000", "1000"]]
    };
    const newData = { ...data };
    newData[activeTab] = [...newData[activeTab], newTable];
    setData(newData);
  };

  const updateTable = (tableIndex, field, value) => {
    const newData = { ...data };
    const tables = [...newData[activeTab]];
    tables[tableIndex] = { ...tables[tableIndex], [field]: value };
    newData[activeTab] = tables;
    setData(newData);
  };

  const removeTable = (tableIndex) => {
    if (confirm("Delete this table?")) {
      const newData = { ...data };
      newData[activeTab] = newData[activeTab].filter((_, i) => i !== tableIndex);
      setData(newData);
    }
  };

  // --- Visual Table Editor Functions ---

  const updateHeader = (tableIndex, headerIndex, value) => {
    const newData = { ...data };
    const tables = [...newData[activeTab]];
    tables[tableIndex].headers[headerIndex] = value;
    newData[activeTab] = tables;
    setData(newData);
  };

  const updateCell = (tableIndex, rowIndex, cellIndex, value) => {
    const newData = { ...data };
    const tables = [...newData[activeTab]];
    tables[tableIndex].rows[rowIndex][cellIndex] = value;
    newData[activeTab] = tables;
    setData(newData);
  };

  const addColumn = (tableIndex) => {
    const newData = { ...data };
    const tables = [...newData[activeTab]];
    tables[tableIndex].headers.push(`New Col`);
    tables[tableIndex].rows.forEach(row => row.push(""));
    newData[activeTab] = tables;
    setData(newData);
  };

  const removeColumn = (tableIndex, colIndex) => {
    if (confirm("Delete this column?")) {
      const newData = { ...data };
      const tables = [...newData[activeTab]];
      tables[tableIndex].headers.splice(colIndex, 1);
      tables[tableIndex].rows.forEach(row => row.splice(colIndex, 1));
      newData[activeTab] = tables;
      setData(newData);
    }
  };

  const addRow = (tableIndex) => {
    const newData = { ...data };
    const tables = [...newData[activeTab]];
    const colCount = tables[tableIndex].headers.length;
    tables[tableIndex].rows.push(new Array(colCount).fill(""));
    newData[activeTab] = tables;
    setData(newData);
  };

  const removeRow = (tableIndex, rowIndex) => {
    const newData = { ...data };
    const tables = [...newData[activeTab]];
    tables[tableIndex].rows.splice(rowIndex, 1);
    newData[activeTab] = tables;
    setData(newData);
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />;
  if (!data) return <div className="p-4 text-center">No data</div>;

  const programs = Object.keys(data);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tuition Fees</h2>
          <p className="text-slate-500 text-sm mt-1">Manage fee tables with visual editor</p>
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

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
        {programs.map(prog => (
          <button
            key={prog}
            onClick={() => setActiveTab(prog)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative group ${activeTab === prog
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
          >
            {prog}
            <span
              onClick={(e) => { e.stopPropagation(); removeProgram(prog); }}
              className="ml-2 opacity-0 group-hover:opacity-100 hover:text-red-200 transition-opacity"
            >
              ×
            </span>
          </button>
        ))}
        <button onClick={addProgram} className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
          + Add Program
        </button>
      </div>

      {/* Program Content */}
      <div className="space-y-12">
        {data[activeTab]?.map((table, tIdx) => (
          <div key={tIdx} className="bg-white border border-slate-200 rounded-2xl shadow-sm relative group overflow-hidden">
            {/* Table Header / Settings Bar */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 w-full md:w-auto">
                <InputField
                  label="Table Title"
                  value={table.title}
                  onChange={(e) => updateTable(tIdx, "title", e)}
                  className="mb-0"
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type:</span>
                  <select
                    value={table.type}
                    onChange={(e) => updateTable(tIdx, "type", e.target.value)}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 focus:border-blue-500 outline-none"
                  >
                    <option value="undergrad">Undergraduate</option>
                    <option value="postgrad">Postgraduate</option>
                    <option value="diploma">Diploma</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => removeTable(tIdx)}
                className="flex items-center gap-2 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Table
              </button>
            </div>

            {/* Visual Table Editor */}
            <div className="p-1 overflow-x-auto">
              <div className="min-w-max">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      {table.headers.map((header, hIdx) => (
                        <th key={hIdx} className="p-2 border-b border-slate-200 min-w-[150px] relative group/head">
                          <div className="flex items-center gap-1">
                            <input
                              value={header}
                              onChange={(e) => updateHeader(tIdx, hIdx, e.target.value)}
                              className="w-full bg-transparent font-bold text-slate-700 uppercase text-xs tracking-wider border-b border-transparent focus:border-blue-500 outline-none transition-colors py-1"
                              placeholder="HEADER"
                            />
                            <button
                              onClick={() => removeColumn(tIdx, hIdx)}
                              className="opacity-0 group-hover/head:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                              title="Remove Column"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </th>
                      ))}
                      <th className="p-2 border-b border-slate-200 w-10">
                        <button
                          onClick={() => addColumn(tIdx)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Add Column"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="group/row hover:bg-slate-50/50">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2 border-b border-slate-100">
                            <textarea
                              value={cell}
                              onChange={(e) => updateCell(tIdx, rIdx, cIdx, e.target.value)}
                              rows={1}
                              className="w-full bg-transparent text-slate-600 border border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded px-2 py-1 outline-none transition-all resize-none overflow-hidden"
                              style={{ minHeight: "36px" }}
                              onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                              }}
                            />
                          </td>
                        ))}
                        <td className="p-2 border-b border-slate-100 text-center">
                          <button
                            onClick={() => removeRow(tIdx, rIdx)}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover/row:opacity-100 transition-all"
                            title="Delete Row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50/30">
              <button
                onClick={() => addRow(tIdx)}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> Add New Row
              </button>
            </div>

          </div>
        ))}

        {data[activeTab] && (
          <button
            onClick={addTableToProgram}
            className="w-full py-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all font-bold flex items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            Add Another Fee Table to {activeTab}
          </button>
        )}
      </div>
    </div>
  );
}
