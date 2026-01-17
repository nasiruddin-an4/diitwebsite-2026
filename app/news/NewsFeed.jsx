"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Filter, Loader2 } from "lucide-react";

export default function NewsFeed({ initialNews }) {
    const [filter, setFilter] = useState("ALL"); // ALL, NEWS, EVENT

    // Ensure news array
    const allNews = initialNews || [];

    const filteredNews = allNews.filter((item) => {
        if (filter === "ALL") return true;
        return item.category === filter;
    });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        News & <span className="text-brandColor">Events</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl">
                        Stay updated with the latest happenings, academic achievements, and upcoming events at DIIT.
                    </p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-2 text-gray-500 font-medium mr-2">
                        <Filter className="w-5 h-5" />
                        Filter by:
                    </span>
                    {["ALL", "NEWS", "EVENT"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${filter === type
                                ? "bg-brandColor text-white shadow-lg shadow-brandColor/30"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                }`}
                        >
                            {type === "ALL" ? "All Updates" : type === "NEWS" ? "Latest News" : "Upcoming Events"}
                        </button>
                    ))}
                </div>
            </div>

            {/* News Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredNews.map((item) => (
                        <Link
                            href={`/news/${item.id || item._id}`}
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
                                    <span
                                        className={`text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider ${item.category === "NEWS"
                                            ? "bg-blue-600 text-white"
                                            : "bg-yellow-500 text-black"
                                            }`}
                                    >
                                        {item.category}
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
                                    {item.time && (
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-brandColor" />
                                            <span>{item.time}</span>
                                        </div>
                                    )}
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
                                    Read Full Story
                                    <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredNews.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No items found for this category.</p>
                        <button
                            onClick={() => setFilter("ALL")}
                            className="mt-4 text-brandColor hover:underline font-medium"
                        >
                            View all updates
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
