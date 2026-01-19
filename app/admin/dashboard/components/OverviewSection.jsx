import React from "react";
import { motion } from "framer-motion";
import { Home, BookOpen, FileText, MessageSquare, Monitor, Users, Zap, TrendingUp, BarChart3, Clock, CheckCircle2, AlertCircle, ArrowUpRight, UserCheck } from "lucide-react";
import Link from "next/link";

export default function OverviewSection({ data, setActiveSection }) {
  const [admissions, setAdmissions] = React.useState([]);
  const [loadingAdmissions, setLoadingAdmissions] = React.useState(true);

  React.useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const res = await fetch("/api/admission/submit");
        const result = await res.json();
        if (result.success) {
          setAdmissions(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch admissions for overview", error);
      } finally {
        setLoadingAdmissions(false);
      }
    };
    fetchAdmissions();
  }, []);

  const admissionStats = {
    total: admissions.length,
    pending: admissions.filter(a => a.status === "pending").length,
    done: admissions.filter(a => a.status === "done").length,
  };

  const stats = [
    {
      label: "Online Admissions",
      value: admissionStats.total,
      icon: Monitor,
      color: "from-blue-600 to-blue-700",
      status: `${admissionStats.pending} Pending`,
      id: "online"
    },
    {
      label: "Academic Programs",
      value: data?.programsData?.length || 0,
      icon: BookOpen,
      color: "from-indigo-600 to-indigo-700",
      status: "Active",
      id: "programs"
    },
    {
      label: "News & Events",
      value: data?.newsEvents?.length || 0,
      icon: FileText,
      color: "from-purple-600 to-purple-700",
      status: "Published",
      id: "news"
    },
    {
      label: "Hero Slides",
      value: data?.heroSlides?.length || 0,
      icon: Home,
      color: "from-rose-600 to-rose-700",
      status: "Carousel",
      id: "hero"
    },
    {
      label: "MoU Partners",
      value: data?.internationalPartners?.length || 0,
      icon: Users,
      color: "from-amber-600 to-amber-700",
      status: "Global",
      id: "partners"
    },
    {
      label: "Testimonials",
      value: data?.testimonials?.length || 0,
      icon: MessageSquare,
      color: "from-emerald-600 to-emerald-700",
      status: "Stories",
      id: "testimonials"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-slate-600 text-base mt-2">Real-time analytics and content management statistics</p>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <div
              onClick={() => setActiveSection(stat.id)}
              className="group relative bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 overflow-hidden cursor-pointer h-full"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-slate-200 to-transparent opacity-50 -mr-12 -mt-12 rounded-full group-hover:scale-150 transition-transform duration-500" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-10 h-10 rounded-md bg-linear-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[12px] font-bold tracking-wider ${stat.status.includes('Pending') ? 'bg-amber-100 text-amber-700' :
                    stat.status.includes('Active') ? 'bg-emerald-100 text-emerald-700' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                    {stat.status}
                  </span>
                </div>
                <div>
                  <p className="text-slate-600 text-[16px] font-bold mb-4">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 leading-none">
                    {loadingAdmissions && stat.id === 'online' ? '...' : stat.value}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity & Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Recent Admissions List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Recent Online Admissions</h3>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Program</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {admissions.slice(0, 5).map((admission, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold border border-slate-200">
                          {admission.fullName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {admission.fullName}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium font-mono">{admission.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {admission.program}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${admission.status === 'done'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-amber-100 text-amber-600'
                        }`}>
                        {admission.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[10px] font-bold text-slate-400">
                        {new Date(admission.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                  </tr>
                ))}
                {admissions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400 text-sm italic">
                      No recent applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 mt-auto">
            <button
              onClick={() => setActiveSection('online')}
              className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              View All Applications <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* System & Stats Breakdown */}
        <div className="space-y-6">
          {/* Database Metrics */}
          <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
            <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-6">Database Health</h3>
            <div className="space-y-4">
              {[
                { label: "News Records", count: data?.newsEvents?.length || 0, max: 50, color: "bg-purple-500" },
                { label: "MoU Partners", count: data?.internationalPartners?.length || 0, max: 50, color: "bg-blue-500" },
                { label: "Hero Content", count: data?.heroSlides?.length || 0, max: 20, color: "bg-rose-500" }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{item.label}</span>
                    <span className="opacity-60">{item.count} Active</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${Math.min((item.count / item.max) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monitoring Actions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" /> Monitoring
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Applications</p>
                <p className="text-2xl font-black text-slate-800">{admissionStats.total}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Site Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-sm font-bold text-emerald-600">LIVE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
