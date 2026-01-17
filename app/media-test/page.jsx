"use client";

import React, { useState, useEffect } from "react";
import FileUpload from "@/app/components/FileUpload";
import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, ExternalLink, Calendar, Database } from "lucide-react";

export default function MediaTestPage() {
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMedia = async () => {
        try {
            const response = await fetch("/api/media");
            const data = await response.json();
            if (data.success) {
                setMediaList(data.data);
            }
        } catch (error) {
            console.error("Error fetching media:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleUploadSuccess = (result) => {
        console.log("Upload success:", result);
        fetchMedia(); // Refresh list
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-slate-900 dark:text-white mb-4"
                    >
                        Cloudinary + MongoDB Smart Manager
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 dark:text-slate-400"
                    >
                        Upload files to Cloudinary and store their metadata in MongoDB efficiently.
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <Database className="text-blue-500" size={20} />
                            New Upload
                        </h2>
                        <FileUpload onUploadSuccess={handleUploadSuccess} />
                    </div>

                    {/* Media List Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                                Recent Uploads ({mediaList.length})
                            </h2>
                            <button
                                onClick={fetchMedia}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Refresh List
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center p-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                            </div>
                        ) : mediaList.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
                                <p className="text-slate-500">No media uploaded yet. Start by uploading a file!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {mediaList.map((item) => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                                {item.resource_type === "image" ? (
                                                    <ImageIcon size={24} className="text-blue-500" />
                                                ) : (
                                                    <FileText size={24} className="text-red-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </p>
                                                <div className="mt-3 flex gap-2">
                                                    <a
                                                        href={item.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors"
                                                    >
                                                        <ExternalLink size={12} /> View File
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
