"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import HomePageData from "@/public/Data/HomePage.json";

const NewsEventsSection = () => {
    const [newsData] = useState(HomePageData.newsEvents || []);
    const [activeIndex, setActiveIndex] = useState(0);

    // Get featured news (first 3 items for carousel) and list items (rest)
    const featuredNews = newsData.slice(0, 3);
    const listNews = newsData.slice(0, 4);

    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex justify-between items-center mb-12">
                    <h2 className="font-bold text-3xl md:text-4xl text-gray-900">
                        News
                    </h2>
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 border border-brandColor text-brandColor px-6 py-2.5 rounded-full font-medium hover:bg-brandColor hover:text-white transition-all duration-300"
                    >
                        All News
                    </Link>
                </div>

                {/* News Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Featured News Carousel - Left Side */}
                    <div className="relative">
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={0}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            pagination={{
                                clickable: true,
                                el: '.featured-pagination',
                                bulletClass: 'featured-bullet',
                                bulletActiveClass: 'featured-bullet-active',
                            }}
                            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                            className="rounded-2xl overflow-hidden"
                        >
                            {featuredNews.map((news) => (
                                <SwiperSlide key={news.id}>
                                    <Link href={`/news/${news.id}`} className="group block">
                                        <div className="relative h-[400px] md:h-[450px] overflow-hidden">
                                            <img
                                                src={news.image}
                                                alt={news.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                            {/* Content Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                                {/* Category & Date Tags */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded">
                                                        {news.category}
                                                    </span>
                                                    <span className="text-white/80 text-sm">
                                                        {news.date}
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h3 className="font-bold text-xl md:text-2xl text-white leading-tight group-hover:text-yellow-400 transition-colors duration-300">
                                                    {news.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Custom Pagination */}
                        <div className="featured-pagination flex justify-center gap-2 mt-6" />
                    </div>

                    {/* News List - Right Side */}
                    <div className="flex flex-col gap-4">
                        {listNews.map((news) => (
                            <Link
                                key={news.id}
                                href={`/news/${news.id}`}
                                className="group flex items-stretch bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300"
                            >
                                {/* Date Box */}
                                <div className="flex-shrink-0 w-24 md:w-28 bg-slate-100 flex flex-col items-center justify-center py-4 border-r border-gray-100 group-hover:bg-brandColor transition-all duration-300">
                                    <span className="text-xl md:text-2xl font-bold text-brandColor group-hover:text-white transition-colors duration-300">
                                        {news.day} {news.month}
                                    </span>
                                    <span className="text-sm text-gray-500 group-hover:text-white/80 transition-colors duration-300">
                                        {news.year}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-4 md:p-5 flex flex-col justify-center">
                                    {/* Time & Day */}
                                    <span className="text-xs text-gray-400 mb-2">
                                        {news.dayName}, {news.time}
                                    </span>

                                    {/* Title */}
                                    <h4 className="font-semibold text-gray-900 text-sm md:text-base leading-snug group-hover:text-brandColor transition-colors duration-300 line-clamp-2">
                                        {news.title}
                                    </h4>
                                </div>

                                {/* Arrow */}
                                <div className="flex-shrink-0 flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ArrowRight className="w-5 h-5 text-brandColor" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom Pagination Styles */}
            <style jsx global>{`
                .featured-bullet {
                    width: 8px;
                    height: 8px;
                    border-radius: 9999px;
                    background-color: #d1d5db;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .featured-bullet:hover {
                    background-color: #9ca3af;
                }
                .featured-bullet-active {
                    width: 32px;
                    background-color: #002652;
                }
            `}</style>
        </section>
    );
};

export default NewsEventsSection;
