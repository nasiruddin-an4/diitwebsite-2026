import React from "react";
import { motion } from "framer-motion";
import { Home, BookOpen, FileText, Users, Settings, Save } from "lucide-react";

export default function OverviewSection({ data }) {
  const stats = [
    { label: "Hero Slides", value: data?.heroSlides?.length || 0, icon: Home, color: "blue" },
    { label: "Programs", value: data?.programsData?.length || 0, icon: BookOpen, color: "indigo" },
    { label: "Hero Slides", value: data?.heroSlides?.length || 0, icon: Home, color: "from-blue-500 to-blue-600" },
    { label: "Programs", value: data?.programsData?.length || 0, icon: BookOpen, color: "from-indigo-500 to-indigo-600" },
    { label: "News Items", value: data?.newsEvents?.length || 0, icon: FileText, color: "from-purple-500 to-purple-600" },
    { label: "Partners", value: data?.internationalPartners?.length || 0, icon: Users, color: "from-pink-500 to-pink-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm mt-1">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                <span className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" />
            Quick Tips
          </h3>
          <ul className="space-y-3">
            {[
              "Use the sidebar to navigate between data sections",
              "Click 'Save Changes' to push updates to the live site",
              "Use the 'Overview' to check content health"
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-blue-400">{i + 1}</span>
                </div>
                <span className="text-slate-300 text-sm leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Save className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Auto-Save Protection</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Your changes are cached locally, but remember to click "Save Changes" to publish them to the live website.
          </p>
        </div>
      </div>
    </div>
  );
}
