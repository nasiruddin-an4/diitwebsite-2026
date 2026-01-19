import React, { useState, useEffect } from "react";
import { Loader2, User, Phone, Mail, Calendar, MapPin, Eye, Trash2, ExternalLink, X, Check } from "lucide-react";
import Swal from "sweetalert2";

export default function OnlineAdmissionSection() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admission/submit");
      const result = await res.json();
      if (result.success) {
        setAdmissions(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch admissions", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmission = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/admission/submit?id=${id}`, { method: "DELETE" });
        const result = await res.json();
        if (result.success) {
          setAdmissions(prev => prev.filter(item => item._id !== id));
          Swal.fire('Deleted!', 'Application has been removed.', 'success');
        } else {
          Swal.fire('Error', result.message || 'Failed to delete', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Connection error', 'error');
      }
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch("/api/admission/submit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        setAdmissions(prev => prev.map(item =>
          item._id === id ? { ...item, status: newStatus } : item
        ));
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: `Application marked as ${newStatus}`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
      }
    } catch (error) {
      console.error("Failed to update status", error);
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-2" />
      <p className="text-slate-500 font-medium">Loading applications...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admission Applications</h2>
          <p className="text-slate-500 text-sm mt-1">Review and manage online student applications</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
            Total: {admissions.length}
          </span>
          <button
            onClick={fetchData}
            className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
            title="Refresh"
          >
            <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Program</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submission Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium italic">
                    No applications found yet.
                  </td>
                </tr>
              ) : (
                admissions.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                          {item.photoUrl ? (
                            <img src={item.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-full h-full p-2 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none">{item.fullName}</p>
                          <p className="text-xs text-slate-500 mt-1 uppercase font-semibold tracking-tighter">DOB: {item.dob}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                        {item.program}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{item.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{item.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${item.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-green-100 text-green-700 border border-green-200'
                        }`}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedAdmission(item)}
                          className="p-2 text-slate-600 cursor-pointer hover:bg-white hover:text-blue-600 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAdmission(item._id)}
                          className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all cursor-pointer"
                          title="Delete"
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

      {/* Detail Modal/Overlay */}
      {selectedAdmission && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedAdmission(null)} />
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-900">Application Details</h3>
              <button
                onClick={() => setSelectedAdmission(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1 space-y-6">
                  <div className="aspect-square bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative group">
                    {selectedAdmission.photoUrl ? (
                      <img src={selectedAdmission.photoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <User className="w-20 h-20" />
                      </div>
                    )}
                    {selectedAdmission.photoUrl && (
                      <a
                        href={selectedAdmission.photoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold"
                      >
                        <ExternalLink className="w-5 h-5" /> View Full
                      </a>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <p className="text-[10px] uppercase font-bold text-blue-600 mb-1">Applied Program</p>
                      <p className="font-bold text-slate-900">{selectedAdmission.program}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Session</p>
                      <p className="font-bold text-slate-900">{selectedAdmission.session || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Info Content */}
                <div className="md:col-span-2 space-y-8">
                  {/* Basic Info */}
                  <section>
                    <h4 className="flex items-center gap-2 text-blue-600 font-bold uppercase text-xs tracking-widest mb-4">
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div>
                        <p className="text-slate-400 mb-1">Full Name</p>
                        <p className="font-bold text-slate-900">{selectedAdmission.fullName}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Email</p>
                        <p className="font-bold text-slate-900 truncate">{selectedAdmission.email}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Phone</p>
                        <p className="font-bold text-slate-900">{selectedAdmission.phone}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Date of Birth</p>
                        <p className="font-bold text-slate-900">{selectedAdmission.dob}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-slate-400 mb-1">Present Address</p>
                        <p className="font-bold text-slate-900 leading-relaxed">{selectedAdmission.presentAddress}</p>
                      </div>
                    </div>
                  </section>

                  {/* Guardian Info */}
                  <section>
                    <h4 className="flex items-center gap-2 text-purple-600 font-bold uppercase text-xs tracking-widest mb-4">
                      Guardian Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-purple-50/30 p-4 rounded-xl border border-purple-100">
                      <div>
                        <p className="text-slate-400 mb-1">Guardian Name</p>
                        <p className="font-bold text-slate-900">{selectedAdmission.guardianName}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Guardian Phone</p>
                        <p className="font-bold text-slate-900">{selectedAdmission.guardianPhone}</p>
                      </div>
                    </div>
                  </section>

                  {/* Academic Info */}
                  <section>
                    <h4 className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-xs tracking-widest mb-4">
                      Academic Background
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                        <div className="col-span-2">
                          <p className="text-slate-400 mb-1 uppercase text-[10px] font-bold">SSC / O-Level Institute</p>
                          <p className="font-bold text-slate-900">{selectedAdmission.sscInstitute}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 mb-1 uppercase text-[10px] font-bold">GPA</p>
                          <p className="font-bold text-slate-900">{selectedAdmission.sscGpa}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 mb-1 uppercase text-[10px] font-bold">Year</p>
                          <p className="font-bold text-slate-900">{selectedAdmission.sscYear}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                        <div className="col-span-2">
                          <p className="text-slate-400 mb-1 uppercase text-[10px] font-bold">HSC / Diploma Institute</p>
                          <p className="font-bold text-slate-900">{selectedAdmission.hscInstitute}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 mb-1 uppercase text-[10px] font-bold">GPA</p>
                          <p className="font-bold text-slate-900">{selectedAdmission.hscGpa}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 mb-1 uppercase text-[10px] font-bold">Year</p>
                          <p className="font-bold text-slate-900">{selectedAdmission.hscYear}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Payment Verification */}
                  <section>
                    <h4 className="flex items-center gap-2 text-rose-600 font-bold uppercase text-xs tracking-widest mb-4">
                      Payment Verification
                    </h4>
                    <div className="bg-rose-50/50 p-5 rounded-xl border border-rose-100 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <p className="text-slate-400 text-xs uppercase font-bold mb-1">Transaction ID</p>
                        <p className="font-mono font-bold text-lg text-rose-700">{selectedAdmission.transactionId || 'N/A'}</p>
                      </div>
                      {selectedAdmission.paymentScreenshot ? (
                        <a
                          href={selectedAdmission.paymentScreenshot}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-sm font-bold hover:bg-rose-50 transition-colors shadow-sm"
                        >
                          <ExternalLink className="w-4 h-4" /> View Payment Screenshot
                        </a>
                      ) : (
                        <span className="text-slate-400 text-sm italic">No screenshot uploaded</span>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 sticky bottom-0 flex justify-between">
              <p className="text-xs text-slate-400 italic">
                Submitted on: {new Date(selectedAdmission.createdAt).toLocaleString()}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    updateStatus(selectedAdmission._id, 'done');
                    setSelectedAdmission(null);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Mark as Contacted
                </button>
                <button
                  onClick={() => {
                    deleteAdmission(selectedAdmission._id);
                    setSelectedAdmission(null);
                  }}
                  className="px-6 py-2 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <button
                  onClick={() => setSelectedAdmission(null)}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
