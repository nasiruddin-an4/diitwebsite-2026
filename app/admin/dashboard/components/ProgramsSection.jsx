import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, BookOpen, Edit2, Trash2, Save, Loader2, Upload, Image as ImageIcon, Plus as PlusIcon, Users, Briefcase, HelpCircle } from "lucide-react";
import Swal from "sweetalert2";
import { InputField } from "./InputField";

export default function ProgramsSection({ data, updateField, onSave, saving }) {
  const [editingId, setEditingId] = useState(null);
  const [localSaving, setLocalSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [curriculumInput, setCurriculumInput] = useState({
    semesterName: "",
    subjects: ""
  });
  const [careerInput, setCareerInput] = useState({
    area: "",
    description: "",
    skills: ""
  });

  const programs = data?.programsData || [];

  const template = { 
    id: Date.now(), 
    serial: programs.length + 1,
    title: "", 
    category: "engineering", 
    duration: "4 Years", 
    degree: "B.Sc.", 
    description: "", 
    image: "",
    // Quick Facts
    affiliation: "National University",
    semesters: "8 Semesters",
    credits: "148 Credits",
    // Head Message
    headName: "",
    headRole: "",
    headImage: "",
    headMessage: "",
    // Program Details
    overview: [],
    eligibility: [],
    // Curriculum
    curriculum: [],
    // Career Opportunities (per program)
    careers: [],
    // Facilities
    facilities: [],
    // Student Resources
    studentResources: [],
    // Alumni Stories
    alumniStories: []
    // Note: Faculty and FAQs are auto-managed by department
  };

  const editingProgram = programs.find(p => (p.id || p._id) === editingId);
  const editingIndex = programs.findIndex(p => (p.id || p._id) === editingId);

  const handleAdd = () => {
    const newProgram = { ...template, id: Date.now() };
    updateField("programsData", null, null, [...programs, newProgram]);
    setEditingId(newProgram.id);
  };

  const handleDelete = (item, index) => {
    Swal.fire({
      title: "Delete Program?",
      html: `<p class="text-sm">Are you sure you want to delete <strong>${item.title || 'this program'}</strong>? This action cannot be undone.</p>`,
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
        const updatedPrograms = programs.filter((_, i) => i !== index);
        updateField("programsData", null, null, updatedPrograms);
        
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Program has been deleted.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  const handleSaveAll = async () => {
    setLocalSaving(true);
    try {
      await onSave();
    } catch (error) {
      console.error("Error saving programs:", error);
    } finally {
      setLocalSaving(false);
    }
  };

  const handleUpdateField = (field, value) => {
    updateField("programsData", editingIndex, field, value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
      >
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Academic Programs</h2>
          <p className="text-slate-600 text-sm mt-1">Manage degrees, durations and program details</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer font-medium transition-all hover:scale-105 active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Program
          </button>
          <button
            onClick={handleSaveAll}
            disabled={localSaving || saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md cursor-pointer font-medium transition-all disabled:opacity-50 text-sm"
          >
            {localSaving || saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All Changes
          </button>
        </div>
      </motion.div>

      {/* Programs Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">#</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Program</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Degree & Duration</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {programs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500 text-sm">
                    No programs found. Click "Add Program" to create one.
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {programs.map((item, index) => (
                    <motion.tr
                      key={item.id || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                          {item.serial || index + 1}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            {item.image ? (
                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <BookOpen className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{item.title || "Untitled Program"}</p>
                            <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{item.category || "General"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="font-medium text-slate-700">{item.degree || "N/A"}</p>
                          <p className="text-xs text-slate-500">{item.duration || "N/A"}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => setEditingId(item.id || item._id)}
                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all border border-blue-200"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item, index)}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingId !== null && editingProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl shadow-xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Edit Program
                </h3>
                <button
                  onClick={() => setEditingId(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-slate-200 bg-slate-50 px-4 flex gap-1 overflow-x-auto">
                {[
                  { id: "basic", label: "Basic Info" },
                  { id: "details", label: "Details" },
                  { id: "head", label: "Head Message" },
                  { id: "curriculum", label: "Curriculum" },
                  { id: "extras", label: "Career" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {/* Basic Info Tab */}
                {activeTab === "basic" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputField
                        label="Display Order (Serial)"
                        type="number"
                        value={editingProgram.serial || ""}
                        onChange={(v) => handleUpdateField("serial", parseInt(v) || 0)}
                        placeholder="e.g. 1, 2, 3..."
                      />
                      <InputField
                        label="Program Title"
                        value={editingProgram.title}
                        onChange={(v) => handleUpdateField("title", v)}
                        placeholder="e.g. Computer Science Engineering..."
                      />
                      <InputField
                        label="Category"
                        value={editingProgram.category}
                        onChange={(v) => handleUpdateField("category", v)}
                        placeholder="e.g. engineering, business..."
                      />
                      <InputField
                        label="Degree Name"
                        value={editingProgram.degree}
                        onChange={(v) => handleUpdateField("degree", v)}
                        placeholder="e.g. B.Sc. in CSE"
                      />
                      <InputField
                        label="Duration"
                        value={editingProgram.duration}
                        onChange={(v) => handleUpdateField("duration", v)}
                        placeholder="e.g. 4 Years"
                      />
                    </div>

                    <InputField
                      label="Description"
                      value={editingProgram.description}
                      onChange={(v) => handleUpdateField("description", v)}
                      textarea
                      placeholder="Brief description of the program..."
                      rows={4}
                    />

                    {/* Image Upload Area */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Program Image</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-40 h-40 rounded-md bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                          {editingProgram.image ? (
                            <img src={editingProgram.image} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-10 h-10 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <label className="flex items-center justify-center h-40 border-2 border-dashed border-blue-200 rounded-md cursor-pointer bg-blue-50/30 hover:bg-blue-50 transition-all group">
                            <div className="text-center p-4">
                              <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                              <p className="text-sm font-semibold text-blue-700">Click to upload</p>
                              <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 5 * 1024 * 1024) {
                                    Swal.fire({ icon: "error", title: "Too large", text: "Image size must be less than 5MB", toast: true, position: "top-end", timer: 3000 });
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = (ev) => handleUpdateField("image", ev.target.result);
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                          {editingProgram.image && (
                            <button
                              onClick={() => handleUpdateField("image", "")}
                              className="text-xs text-red-600 font-bold hover:underline"
                            >
                              Remove Image
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === "details" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <InputField
                        label="Affiliation"
                        value={editingProgram.affiliation || ""}
                        onChange={(v) => handleUpdateField("affiliation", v)}
                        placeholder="e.g. National University"
                      />
                      <InputField
                        label="Semesters"
                        value={editingProgram.semesters || ""}
                        onChange={(v) => handleUpdateField("semesters", v)}
                        placeholder="e.g. 8 Semesters"
                      />
                      <InputField
                        label="Credits"
                        value={editingProgram.credits || ""}
                        onChange={(v) => handleUpdateField("credits", v)}
                        placeholder="e.g. 148 Credits"
                      />
                    </div>
                    <InputField
                      label="Program Overview"
                      value={(editingProgram.overview || []).join("\n")}
                      onChange={(v) => handleUpdateField("overview", v.split("\n").filter(x => x.trim()))}
                      textarea
                      placeholder="Enter each overview point on a new line..."
                      rows={5}
                    />
                    <InputField
                      label="Eligibility Criteria"
                      value={(editingProgram.eligibility || []).join("\n")}
                      onChange={(v) => handleUpdateField("eligibility", v.split("\n").filter(x => x.trim()))}
                      textarea
                      placeholder="Enter each requirement on a new line..."
                      rows={4}
                    />
                  </div>
                )}

                {/* Head Message Tab */}
                {activeTab === "head" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputField
                        label="Head Name"
                        value={editingProgram.headName || ""}
                        onChange={(v) => handleUpdateField("headName", v)}
                        placeholder="e.g. Dr. Md. Shafiul Islam"
                      />
                      <InputField
                        label="Head Role"
                        value={editingProgram.headRole || ""}
                        onChange={(v) => handleUpdateField("headRole", v)}
                        placeholder="e.g. Head of Department"
                      />
                    </div>
                    <InputField
                      label="Head Message"
                      value={editingProgram.headMessage || ""}
                      onChange={(v) => handleUpdateField("headMessage", v)}
                      textarea
                      placeholder="Message from the head..."
                      rows={5}
                    />
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-600 uppercase">Head Image</label>
                      <div className="flex gap-4">
                        {editingProgram.headImage && (
                          <img src={editingProgram.headImage} alt="Head" className="w-20 h-20 rounded object-cover" />
                        )}
                        <label className="flex-1 flex items-center justify-center border-2 border-dashed border-blue-200 rounded cursor-pointer bg-blue-50/30 hover:bg-blue-50 p-3">
                          <Upload className="w-5 h-5 text-blue-500 mr-2" />
                          <span className="text-sm text-blue-700">Upload Head Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => handleUpdateField("headImage", ev.target.result);
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === "curriculum" && (
                  <div className="space-y-6">
                    {/* Curriculum List */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-slate-900">Program Semesters</h3>
                      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3 max-h-96 overflow-y-auto">
                        {editingProgram.curriculum && editingProgram.curriculum.length > 0 ? (
                          editingProgram.curriculum.map((item, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="font-bold text-slate-900">{item.semester}</p>
                                  <p className="text-xs text-slate-500 mt-1">{item.subjects?.length || 0} subjects</p>
                                </div>
                                <button
                                  onClick={() => {
                                    const updated = editingProgram.curriculum.filter((_, i) => i !== idx);
                                    handleUpdateField("curriculum", updated);
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {item.subjects?.map((subject, sIdx) => (
                                  <span key={sIdx} className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs text-blue-700 font-medium">
                                    {subject}
                                    <button
                                      onClick={() => {
                                        const newSubjects = item.subjects.filter((_, i) => i !== sIdx);
                                        const updated = editingProgram.curriculum.map((c, i) =>
                                          i === idx ? { ...c, subjects: newSubjects } : c
                                        );
                                        handleUpdateField("curriculum", updated);
                                      }}
                                      className="hover:text-blue-900 ml-1"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-slate-500 text-sm py-6">No semesters added yet. Add one below.</p>
                        )}
                      </div>
                    </div>

                    {/* Add New Semester */}
                    <div className="border-t border-slate-200 pt-4 space-y-4">
                      <h3 className="font-semibold text-slate-900">Add New Semester</h3>
                      <InputField
                        label="Semester Name"
                        value={curriculumInput.semesterName}
                        onChange={(v) => setCurriculumInput({ ...curriculumInput, semesterName: v })}
                        placeholder="e.g. 1st Semester, 2nd Semester..."
                      />
                      <InputField
                        label="Subjects (one per line)"
                        value={curriculumInput.subjects}
                        onChange={(v) => setCurriculumInput({ ...curriculumInput, subjects: v })}
                        textarea
                        placeholder="Enter each subject on a new line&#10;e.g.&#10;Introduction to Programming&#10;Data Structures&#10;Web Development"
                        rows={5}
                      />
                      <button
                        onClick={() => {
                          if (!curriculumInput.semesterName.trim()) {
                            Swal.fire({ icon: "warning", title: "Required", text: "Please enter semester name", toast: true, position: "top-end", timer: 2000 });
                            return;
                          }
                          const subjects = curriculumInput.subjects
                            .split("\n")
                            .map(s => s.trim())
                            .filter(s => s.length > 0);
                          
                          if (subjects.length === 0) {
                            Swal.fire({ icon: "warning", title: "Required", text: "Please add at least one subject", toast: true, position: "top-end", timer: 2000 });
                            return;
                          }

                          const newSemester = {
                            semester: curriculumInput.semesterName,
                            subjects
                          };

                          const updated = [...(editingProgram.curriculum || []), newSemester];
                          handleUpdateField("curriculum", updated);
                          setCurriculumInput({ semesterName: "", subjects: "" });
                          
                          Swal.fire({
                            icon: "success",
                            title: "Added!",
                            text: `${curriculumInput.semesterName} added successfully`,
                            toast: true,
                            position: "top-end",
                            timer: 2000,
                            showConfirmButton: false
                          });
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer font-bold transition-all text-sm"
                      >
                        <PlusIcon className="w-4 h-4" /> Add Semester
                      </button>
                    </div>
                  </div>
                )}

                {/* Career & Faculty Tab */}
                {activeTab === "extras" && (
                  <div className="space-y-8">
                    {/* Career Opportunities Section */}
                    <div className="space-y-6">
                      <div className="border-b border-slate-200 pb-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                          Career Opportunities
                        </h3>
                        <p className="text-xs text-slate-500">Define career areas and paths for program graduates</p>
                      </div>

                      {/* Career List */}
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-slate-600 uppercase">Career Paths</p>
                        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3 max-h-96 overflow-y-auto">
                          {editingProgram.careers && editingProgram.careers.length > 0 ? (
                            editingProgram.careers.map((career, idx) => (
                              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-all">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <p className="font-bold text-slate-900 text-sm">{career.area}</p>
                                    {career.description && (
                                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{career.description}</p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => {
                                      const updated = editingProgram.careers.filter((_, i) => i !== idx);
                                      handleUpdateField("careers", updated);
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors shrink-0 ml-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                {career.skills && (
                                  <div className="flex flex-wrap gap-1">
                                    {career.skills.split(",").map((skill, sIdx) => (
                                      <span key={sIdx} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded border border-blue-200">
                                        {skill.trim()}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-slate-500 text-sm py-6">No career paths added yet. Add one below.</p>
                          )}
                        </div>
                      </div>

                      {/* Add New Career */}
                      <div className="border-t border-slate-200 pt-4 space-y-4">
                        <h4 className="font-semibold text-slate-900">Add Career Path</h4>
                        <InputField
                          label="Career Area"
                          value={careerInput.area}
                          onChange={(v) => setCareerInput({ ...careerInput, area: v })}
                          placeholder="e.g. Software Development, Data Science, Web Development..."
                        />
                        <InputField
                          label="Career Description"
                          value={careerInput.description}
                          onChange={(v) => setCareerInput({ ...careerInput, description: v })}
                          textarea
                          placeholder="What does a graduate in this area do? What are the responsibilities and opportunities?"
                          rows={4}
                        />
                        <InputField
                          label="Key Skills (comma separated)"
                          value={careerInput.skills}
                          onChange={(v) => setCareerInput({ ...careerInput, skills: v })}
                          placeholder="e.g. Problem Solving, Database Design, API Development, Leadership..."
                        />
                        <button
                          onClick={() => {
                            if (!careerInput.area.trim()) {
                              Swal.fire({ icon: "warning", title: "Required", text: "Please enter career area", toast: true, position: "top-end", timer: 2000 });
                              return;
                            }

                            const newCareer = {
                              area: careerInput.area,
                              description: careerInput.description,
                              skills: careerInput.skills
                            };

                            const updated = [...(editingProgram.careers || []), newCareer];
                            handleUpdateField("careers", updated);
                            setCareerInput({ area: "", description: "", skills: "" });
                            
                            Swal.fire({
                              icon: "success",
                              title: "Added!",
                              text: `${careerInput.area} career path added successfully`,
                              toast: true,
                              position: "top-end",
                              timer: 2000,
                              showConfirmButton: false
                            });
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer font-bold transition-all text-sm"
                        >
                          <PlusIcon className="w-4 h-4" /> Add Career Path
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-2 text-xs text-slate-500 bg-white">Faculty & FAQs Managed by Department</span>
                      </div>
                    </div>

                    {/* Info about auto-managed content */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">Auto-Managed Content</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Faculty and FAQs are automatically managed by department. They are fetched dynamically based on the program category/department.
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Go to the <strong>Faculty Page</strong> or <strong>FAQ Page</strong> to manage department-specific content.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <a href="/admin/dashboard?tab=faculty" className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:shadow-md transition-all cursor-pointer">
                        <Users className="w-6 h-6 text-purple-600" />
                        <div className="text-left">
                          <p className="font-semibold text-slate-900 text-sm">Manage Faculty</p>
                          <p className="text-xs text-slate-600">By Department</p>
                        </div>
                      </a>
                      <a href="/admin/dashboard?tab=faq" className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg hover:shadow-md transition-all cursor-pointer">
                        <HelpCircle className="w-6 h-6 text-orange-600" />
                        <div className="text-left">
                          <p className="font-semibold text-slate-900 text-sm">Manage FAQs</p>
                          <p className="text-xs text-slate-600">By Department</p>
                        </div>
                      </a>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-900">
                        <strong>💡 How it works:</strong> Career Opportunities are added per program. Faculty members and FAQs are fetched automatically from the department level, ensuring all programs in the same department show the same consistent information.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <button
                  onClick={() => setEditingId(null)}
                  className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md cursor-pointer font-bold transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer font-bold transition-all text-sm"
                >
                  Save & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
