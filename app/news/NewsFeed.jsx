"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 16;

export default function NewsFeed({ initialNews }) {
  const [filter, setFilter] = useState("ALL"); // ALL, NEWS, EVENT
  const [currentPage, setCurrentPage] = useState(1);

  // Ensure news array
  const allNews = initialNews || [];

  const filteredNews = allNews.filter((item) => {
    if (filter === "ALL") return true;
    return item.category === filter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = filteredNews.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Reset to page 1 when filter changes
  const handleFilterChange = (type) => {
    setFilter(type);
    setCurrentPage(1);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-brandColor border-b border-gray-100 pt-28 md:pt-32">
        <div className="container mx-auto px-4 md:px-6 pb-16 pt-8 md:py-24">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight text-center">
            News & <span className="text-white">Events</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto text-center">
            Stay updated with the latest happenings, academic achievements, and
            upcoming events at DIIT.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-2 text-gray-500 font-medium mr-2">
              <Filter className="w-5 h-5" />
              Filter by:
            </span>
            {["ALL", "NEWS", "EVENT"].map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  filter === type
                    ? "bg-brandColor text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {type === "ALL"
                  ? "All Updates"
                  : type === "NEWS"
                    ? "Latest News"
                    : "Upcoming Events"}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400 font-medium">
            Showing {startIndex + 1}–
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredNews.length)} of{" "}
            {filteredNews.length} results
          </p>
        </div>
      </div>

      {/* News Grid */}
      <div className="container mx-auto px-4 md:px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {paginatedNews.map((item) => (
            <Link
              href={`/news/${item.slug}`}
              key={item.id || item._id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
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
                    className={`text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider ${
                      item.category === "NEWS"
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
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-brandColor transition-colors duration-300 line-clamp-3">
                  {item.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                  {item.excerpt || item.desc}
                </p>

                {/* Read More */}
                <div className="mt-auto flex items-center text-brandColor font-semibold text-sm group-hover:gap-2 group-hover:text-blue-800 group-hover:tracking-wider transition-all duration-300">
                  Read Full Story
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No items found for this category.
            </p>
            <button
              onClick={() => handleFilterChange("ALL")}
              className="mt-4 text-brandColor hover:underline font-medium"
            >
              View all updates
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-12 pb-8">
            {/* Previous Button */}
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                scrollToTop();
              }}
              disabled={currentPage === 1}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed bg-gray-50"
                  : "text-gray-600 hover:bg-brandColor hover:text-white bg-white border border-gray-200 shadow-sm"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span
                  key={`dots-${idx}`}
                  className="px-2 py-2 text-gray-400 text-sm select-none"
                >
                  •••
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    scrollToTop();
                  }}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${
                    currentPage === page
                      ? "bg-brandColor text-white shadow-lg shadow-brandColor/20"
                      : "text-gray-600 hover:bg-gray-100 bg-white border border-gray-200"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next Button */}
            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                scrollToTop();
              }}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed bg-gray-50"
                  : "text-gray-600 hover:bg-brandColor hover:text-white bg-white border border-gray-200 shadow-sm"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
