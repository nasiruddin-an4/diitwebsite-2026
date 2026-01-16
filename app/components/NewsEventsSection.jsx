"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import HomePageData from "@/public/Data/HomePage.json";

const NewsEventsSection = ({ data }) => {
    const [newsData, setNewsData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const newsEventsData = data || HomePageData.newsEvents;
        const rawData = (newsEventsData?.news || newsEventsData) || [];

        // Helper to parse date strings into Date objects
        const parseDate = (dateStr) => {
            if (!dateStr) return new Date(0);

            // Try standard Date constructor first (handles YYYY-MM-DD)
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) return date;

            // Handle human-readable formats like "Nov. 9, 2025" or "Oct. 25, 2025"
            try {
                // Remove dots and split by space
                const parts = dateStr.replace(/\./g, '').split(/[ ,]+/);
                if (parts.length >= 3) {
                    const monthStr = parts[0];
                    const day = parts[1];
                    const year = parts[2];

                    const months = {
                        "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
                        "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11,
                        "January": 0, "February": 1, "March": 2, "April": 3, "August": 7,
                        "September": 8, "October": 9, "November": 10, "December": 11
                    };

                    const month = months[monthStr] !== undefined ? months[monthStr] : 0;
                    return new Date(year, month, day);
                }
            } catch (e) {
                console.error("Date parsing error:", e, dateStr);
            }
            return new Date(0);
        };

        // Sort items by date (newest first)
        const sortedData = [...rawData].sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);

            // If dates are the same, use ID as fallback (assuming higher ID = newer)
            if (dateB.getTime() === dateA.getTime()) {
                return (b.id || 0) - (a.id || 0);
            }
            return dateB.getTime() - dateA.getTime();
        });

        // Enhance items with derived date fields if missing
        const enhancedData = sortedData.map(item => {
            const dateObj = parseDate(item.date);
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            return {
                ...item,
                day: item.day || dateObj.getDate().toString().padStart(2, '0'),
                month: item.month || months[dateObj.getMonth()],
                year: item.year || dateObj.getFullYear(),
                dayName: item.dayName || days[dateObj.getDay()],
                time: item.time || "All Day"
            };
        });

        setNewsData(enhancedData);
    }, []);

    // Get the top 4 latest items
    // We show these 4 in BOTH the slider and the side-list for a consistent "Latest 4" view
    const latestItems = newsData.slice(0, 4);

    if (newsData.length === 0) return null;

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-12 h-1.5 bg-brandColor rounded-full"></span>
                            <span className="text-brandColor font-black tracking-widest uppercase text-xs">Featured Updates</span>
                        </div>
                        <h2 className="font-bold text-3xl md:text-5xl text-slate-900 tracking-tight">
                            Latest News & Events
                        </h2>
                    </div>
                    <Link
                        href="/news"
                        className="group inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-brandColor hover:text-white hover:border-brandColor transition-all duration-500 shadow-sm cursor-pointer"
                    >
                        Explore All
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* News Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Featured Slider - Left Side */}
                    <div className="relative">
                        <Swiper
                            modules={[Autoplay, EffectFade]}
                            effect="fade"
                            fadeEffect={{ crossFade: true }}
                            spaceBetween={0}
                            slidesPerView={1}
                            loop={latestItems.length > 1}
                            speed={1200}
                            autoplay={{
                                delay: 6000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                            className="rounded-xl overflow-hidden h-full min-h-[500px]"
                        >
                            {latestItems.map((news) => (
                                <SwiperSlide key={`slide-${news.id}`}>
                                    <Link href={`/news/${news.id}`} className="group block relative h-full">
                                        <div className="relative h-full min-h-[500px] overflow-hidden">
                                            <img
                                                src={news.image}
                                                alt={news.title}
                                                className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-110"
                                            />
                                            {/* Advanced Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />

                                            {/* Content Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-5 md:px-8">
                                                {/* Meta Tags */}
                                                <div className="flex items-center gap-4 mb-2">
                                                    <span className="bg-brandColor text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-[0.15em] shadow-lg shadow-brandColor/30">
                                                        {news.category}
                                                    </span>
                                                    <span className="text-white/80 text-sm flex items-center gap-2 font-bold backdrop-blur-sm bg-black/20 px-3 py-1 rounded-xl">
                                                        <Calendar className="w-4 h-4 text-brandColor" />
                                                        {news.date}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h3 className="font-black text-xl md:text-3xl text-white group-hover:text-yellow-500 transition-colors duration-500 line-clamp-2 mb-2">
                                                    {news.title}
                                                </h3>

                                                {/* Excerpt */}
                                                {(news.excerpt || news.desc) && (
                                                    <p className="text-white/70 text-base md:text-md max-w-xl line-clamp-1 leading-relaxed font-medium">
                                                        {news.excerpt || news.desc}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Modern Pagination - Center Below Slider */}
                        <div className="flex justify-center gap-3 mt-8">
                            {latestItems.map((_, idx) => (
                                <button
                                    key={`dot-${idx}`}
                                    className={`h-1 rounded-md transition-all duration-700 cursor-pointer ${activeIndex === idx
                                        ? "w-6 bg-brandColor"
                                        : "w-4 bg-slate-200 hover:bg-slate-300"
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Quick List - Right Side */}
                    <div className="flex flex-col gap-5">
                        {latestItems.map((news, index) => (
                            <Link
                                key={`list-${news.id}`}
                                href={`/news/${news.id}`}
                                className="group flex items-center bg-white rounded-xl p-5 border border-slate-100 hover:border-brandColor/30 hover:shadow-md hover:-translate-y-1 transition-all duration-500"
                            >
                                {/* Date Box */}
                                <div className="shrink-0 w-20 h-20 bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-brandColor group-hover:border-brandColor transition-all duration-500">
                                    <span className="text-2xl font-black leading-none text-slate-800 group-hover:text-white transition-colors duration-500">
                                        {news.day}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter mt-1 text-slate-400 group-hover:text-white/80 transition-colors duration-500">
                                        {news.month}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 ml-6 mr-2">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-brandColor">
                                            {news.category}
                                        </span>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <span className="text-[10px] text-slate-400 font-bold">{news.dayName}</span>
                                    </div>

                                    <h4 className="font-bold text-base md:text-lg leading-snug text-slate-900 group-hover:text-brandColor transition-colors duration-500 line-clamp-2">
                                        {news.title}
                                    </h4>
                                </div>

                                {/* Link Arrow */}
                                <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-brandColor group-hover:text-white transition-all duration-500">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsEventsSection;
