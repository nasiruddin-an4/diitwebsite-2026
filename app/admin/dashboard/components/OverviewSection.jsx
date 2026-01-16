import React from "react";
import { motion } from "framer-motion";
import { Home, BookOpen, FileText, Users, Zap, TrendingUp, BarChart3, Settings, Save } from "lucide-react";

export default function OverviewSection({ data }) {
  const stats = [
    { label: "Hero Slides", value: data?.heroSlides?.length || 0, icon: Home, color: "from-blue-500 to-blue-600" },
    { label: "Programs", value: data?.programsData?.length || 0, icon: BookOpen, color: "from-indigo-500 to-indigo-600" },
    { label: "News Items", value: data?.newsEvents?.length || 0, icon: FileText, color: "from-purple-500 to-purple-600" },
    { label: "Partners", value: data?.internationalPartners?.length || 0, icon: Users, color: "from-pink-500 to-pink-600" },
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <div className="group relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    Active
                  </div>
                </div>
                <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                <p className="text-4xl font-bold text-slate-900 mt-2">{stat.value}</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500">Total items in system</p>
                </div>
              </div>

              {/* Border Gradient */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Detailed Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
      >
        {/* Content Health */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Content Summary</h3>
              <p className="text-sm text-slate-600">System statistics</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-700">Total Content Items</p>
                <p className="text-xs text-slate-500 mt-1">All sections combined</p>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{(data?.heroSlides?.length || 0) + (data?.programsData?.length || 0) + (data?.newsEvents?.length || 0) + (data?.internationalPartners?.length || 0)}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-700">Sections Configured</p>
                <p className="text-xs text-slate-500 mt-1">Active data sources</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{[data?.heroSlides?.length, data?.programsData?.length, data?.newsEvents?.length, data?.internationalPartners?.length].filter(x => x > 0).length}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-300 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-700">System Status</p>
                <p className="text-xs text-slate-500 mt-1">Overall health</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-sm font-bold text-green-600">Healthy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Key Metrics</h3>
              <p className="text-sm text-slate-600">Management overview</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-xl border border-blue-200 hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Hero Slides</p>
                <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  {data?.heroSlides?.length || 0}
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-indigo-200 hover:border-indigo-400 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Programs</p>
                <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  {data?.programsData?.length || 0}
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-purple-200 hover:border-purple-400 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">News & Events</p>
                <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  {data?.newsEvents?.length || 0}
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-pink-200 hover:border-pink-400 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Partners</p>
                <span className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-lg text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-pink-600"></span>
                  {data?.internationalPartners?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
