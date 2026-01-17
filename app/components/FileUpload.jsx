"use client";

import React, { useState, useRef } from "react";
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { uploadFile } from "@/lib/upload-utils";

/**
 * A premium FileUpload component that handles Cloudinary uploads via our API.
 * Supports image, pdf, and other common file types.
 */
const FileUpload = ({
    onUploadSuccess,
    folder = "diit_uploads",
    acceptedFileTypes = "image/*,application/pdf",
    label = "Upload File",
    maxSizeInMB = 5
}) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
                Swal.fire({
                    icon: "error",
                    title: "File too large",
                    text: `File size exceeds ${maxSizeInMB}MB limit.`,
                });
                e.target.value = ""; // Reset input
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            Swal.fire({
                icon: "warning",
                title: "No file selected",
                text: "Please select a file to upload.",
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        setIsUploading(true);
        setUploadProgress(10);

        try {
            // Simulate progress for better UX since fetch doesn't support progress natively without XHR
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => (prev < 90 ? prev + 10 : prev));
            }, 500);

            const result = await uploadFile(file, folder);

            clearInterval(progressInterval);
            setUploadProgress(100);

            Swal.fire({
                icon: "success",
                title: "Uploaded!",
                text: "File has been uploaded and stored successfully.",
                timer: 2000,
                showConfirmButton: false,
            });

            if (onUploadSuccess) {
                onUploadSuccess(result);
            }

            setFile(null);
        } catch (error) {
            console.error("Upload failed:", error);
            Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: error.message || "An error occurred during upload.",
            });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 transition-all duration-300">
            <div className="flex flex-col items-center justify-center space-y-4">
                <label className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {label}
                </label>

                <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`group relative w-full h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 
            ${file ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept={acceptedFileTypes}
                        className="hidden"
                        disabled={isUploading}
                    />

                    {!file ? (
                        <>
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full text-blue-600 dark:text-blue-400 mb-2"
                            >
                                <Upload size={24} />
                            </motion.div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Click or drag to upload
                            </p>
                            <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                (Images or PDFs)
                            </span>
                        </>
                    ) : (
                        <div className="flex flex-col items-center space-y-2 max-w-full px-4 text-center">
                            <File size={32} className="text-blue-500" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate w-full">
                                {file.name}
                            </span>
                            <span className="text-xs text-slate-400">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </span>

                            {!isUploading && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                    className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {isUploading && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full space-y-2 mt-4"
                        >
                            <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Loader2 size={12} className="animate-spin" /> Uploading...
                                </span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all duration-300 shadow-lg
            ${!file || isUploading
                            ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/20 active:scale-[0.98]'
                        }
          `}
                >
                    {isUploading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 size={18} className="animate-spin" /> Processing...
                        </span>
                    ) : (
                        "Start Upload"
                    )}
                </button>
            </div>
        </div>
    );
};

export default FileUpload;
