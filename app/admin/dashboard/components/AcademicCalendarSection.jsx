"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Save,
  X,
  Loader2,
  AlertCircle,
  Check,
  Edit2,
} from "lucide-react";

const eventTypeOptions = [
  { value: "admission", label: "Admission" },
  { value: "academic", label: "Academic" },
  { value: "exam", label: "Exam" },
  { value: "holiday", label: "Holiday" },
  { value: "result", label: "Result" },
  { value: "event", label: "Event" },
];

const monthOptions = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function AcademicCalendarSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/academics/calendar");
      const result = await res.json();

      if (result.success) {
        setEvents(result.data);
      } else {
        setMessage({ type: "error", text: "Failed to load events" });
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setMessage({ type: "error", text: "Error loading calendar events" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      month: "January",
      year: "2026",
      events: [
        {
          date: "01",
          title: "",
          type: "academic",
          desc: "",
        }
      ],
      month_order: 1,
    });
    setEditingId(null);
    setIsAdding(true);
  };

  const handleEdit = (event) => {
    setFormData({ ...event });
    setEditingId(event._id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setFormData(null);
    setEditingId(null);
  };

  const handleEventChange = (eventIndex, field, value) => {
    const newFormData = { ...formData };
    newFormData.events[eventIndex][field] = value;
    setFormData(newFormData);
  };

  const handleMonthChange = (field, value) => {
    const newFormData = { ...formData };
    if (field === "month") {
      newFormData.month = value;
      newFormData.month_order = monthOptions.indexOf(value) + 1;
    } else {
      newFormData[field] = value;
    }
    setFormData(newFormData);
  };

  const addEventToMonth = () => {
    const newFormData = { ...formData };
    newFormData.events.push({
      date: "01",
      title: "",
      type: "academic",
      desc: "",
    });
    setFormData(newFormData);
  };

  const removeEventFromMonth = (eventIndex) => {
    const newFormData = { ...formData };
    newFormData.events.splice(eventIndex, 1);
    setFormData(newFormData);
  };

  const handleSave = async () => {
    if (!formData.month || !formData.year) {
      setMessage({ type: "error", text: "Month and year are required" });
      return;
    }

    if (formData.events.some(e => !e.title || !e.date)) {
      setMessage({ type: "error", text: "All events must have a title and date" });
      return;
    }

    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { ...formData, _id: editingId } : formData;

      const res = await fetch("/api/admin/academics/calendar", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        setMessage({
          type: "success",
          text: editingId ? "Event updated successfully" : "Event created successfully",
        });
        fetchEvents();
        handleCancel();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: result.message || "Failed to save event" });
      }
    } catch (error) {
      console.error("Error saving event:", error);
      setMessage({ type: "error", text: "Error saving event" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this month's events?")) return;

    try {
      const res = await fetch(`/api/admin/academics/calendar?id=${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        setMessage({ type: "success", text: "Events deleted successfully" });
        fetchEvents();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to delete events" });
      }
    } catch (error) {
      console.error("Error deleting events:", error);
      setMessage({ type: "error", text: "Error deleting events" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Academic Calendar</h2>
          <p className="text-slate-600 text-sm mt-1">Manage academic year events and important dates</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 cursor-pointer py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" /> Add Month
        </button>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center gap-2 p-4 rounded-lg ${message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
              }`}
          >
            {message.type === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <AnimatePresence>
        {isAdding && formData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">
                  {editingId ? "Edit Month Events" : "Add New Month"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-1 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Month and Year */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Month
                    </label>
                    <select
                      value={formData.month}
                      onChange={(e) => handleMonthChange("month", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {monthOptions.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Year
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => handleMonthChange("year", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Events */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-800">Events</h4>
                    <button
                      onClick={addEventToMonth}
                      className="text-sm px-3 py-1 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      + Add Event
                    </button>
                  </div>

                  {formData.events.map((event, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-slate-200 rounded-md space-y-3 bg-slate-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">
                          Event {idx + 1}
                        </span>
                        {formData.events.length > 1 && (
                          <button
                            onClick={() => removeEventFromMonth(idx)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-md cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={(function () {
                              if (!event.date || event.date.includes("-")) return "";
                              const monthIdx = monthOptions.indexOf(formData.month);
                              if (monthIdx === -1) return "";
                              const y = formData.year;
                              const m = (monthIdx + 1).toString().padStart(2, '0');
                              const d = event.date.padStart(2, '0');
                              return `${y}-${m}-${d}`;
                            })()}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val) {
                                const day = val.split('-')[2];
                                handleEventChange(idx, "date", day);
                              } else {
                                handleEventChange(idx, "date", "");
                              }
                            }}
                            className="w-full px-2 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Type
                          </label>
                          <select
                            value={event.type}
                            onChange={(e) =>
                              handleEventChange(idx, "type", e.target.value)
                            }
                            className="w-full px-2 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {eventTypeOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          placeholder="Event title"
                          value={event.title}
                          onChange={(e) =>
                            handleEventChange(idx, "title", e.target.value)
                          }
                          className="w-full px-2 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Description
                        </label>
                        <textarea
                          placeholder="Event description"
                          value={event.desc}
                          onChange={(e) =>
                            handleEventChange(idx, "desc", e.target.value)
                          }
                          rows="2"
                          className="w-full px-2 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events List */}
      <div className="grid gap-4">
        {events.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No events yet</p>
            <p className="text-slate-500 text-sm">Add a month to get started</p>
          </div>
        ) : (
          events.map((monthGroup) => (
            <motion.div
              key={monthGroup._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {monthGroup.month} {monthGroup.year}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {monthGroup.events.length} event{monthGroup.events.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(monthGroup)}
                    className="p-2 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(monthGroup._id)}
                    className="p-2 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {monthGroup.events.map((event, idx) => (
                  <div key={idx} className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                          {event.date}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800">
                          {event.title}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">
                          {event.desc}
                        </p>
                        <div className="mt-2">
                          <span
                            className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full capitalize ${event.type === "admission"
                              ? "bg-emerald-100 text-emerald-700"
                              : event.type === "academic"
                                ? "bg-blue-100 text-blue-700"
                                : event.type === "exam"
                                  ? "bg-rose-100 text-rose-700"
                                  : event.type === "holiday"
                                    ? "bg-amber-100 text-amber-700"
                                    : event.type === "result"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-indigo-100 text-indigo-700"
                              }`}
                          >
                            {event.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
