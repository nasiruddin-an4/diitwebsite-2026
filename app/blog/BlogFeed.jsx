"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Search, BookOpen } from "lucide-react";

export default function BlogFeed({ initialBlogs }) {
    const [searchQuery, setSearchQuery] = useState("");

    // Filter blogs based on search
    const filteredBlogs = initialBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.excerpt || blog.desc || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Section */}
            <div className="bg-brandColor border-b border-gray-100">
                <div className="max-w-7xl mx-auto text-center px-6 py-16 md:py-24">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                        Our <span className="text-white">Blog</span>
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Insights, stories, and academic perspectives from the DIIT community.
                    </p>
                </div>
            </div>

            {/* Search Section */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brandColor focus:border-brandColor sm:text-sm transition-all duration-300"
                        placeholder="Search blog posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Blog Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBlogs.map((item) => (
                        <Link
                            href={`/news/${item.slug}`}
                            key={item.id || item._id}
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Image Container */}
                            <div className="relative h-60 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider bg-brandColor text-white">
                                        BLOG
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col grow">
                                {/* Meta Info */}
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-brandColor" />
                                        <span>{item.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen className="w-4 h-4 text-brandColor" />
                                        <span>Read More</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-brandColor transition-colors duration-300">
                                    {item.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                    {item.excerpt || item.desc}
                                </p>

                                {/* Read More */}
                                <div className="mt-auto flex items-center text-brandColor font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                                    Read Full Post
                                    <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredBlogs.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No blog posts found matching your search.</p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-4 text-brandColor hover:underline font-medium"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
