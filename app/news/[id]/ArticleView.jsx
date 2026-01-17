"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Share2,
    Facebook,
    Twitter,
    Linkedin,
    Bookmark,
    ChevronRight,
    Search,
    Tag,
    User
} from "lucide-react";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ArticleView({ newsItem, recentNews }) {
    // Fallback categories or extracted from recent
    const categories = ["News", "Events", "Academic", "Notices"];

    if (!newsItem) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">News Item Not Found</h2>
                    <Link href="/news" className="text-brandColor hover:underline mt-4 inline-block">Back to News</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
            {/* Hero Section */}
            <div className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "linear" }}
                    className="absolute inset-0"
                >
                    <img
                        src={newsItem.image}
                        alt={newsItem.title}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/10 opacity-90" />

                {/* Navigation Breadcrumb overlay */}
                <div className="absolute top-0 left-0 w-full p-2 pt-14 z-10">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <Link
                            href="/news"
                            className="group inline-flex items-center text-white/90 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md px-5 py-1 rounded-full transition-all duration-300 border border-white/10"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Back to News</span>
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 pb-12">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="max-w-4xl"
                        >
                            <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-3 mb-6">
                                <span className={`
                                    px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg
                                    ${newsItem.category === 'NEWS' ? 'bg-blue-600 text-white' : 'bg-yellow-500 text-black'}
                                `}>
                                    {newsItem.category || "News"}
                                </span>
                                <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="text-xs font-semibold tracking-wide">{newsItem.date}</span>
                                </div>
                            </motion.div>

                            <motion.h1
                                variants={fadeIn}
                                className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-xl mb-6"
                            >
                                {newsItem.title}
                            </motion.h1>

                            <motion.div variants={fadeIn} className="flex items-center gap-6 text-white/80 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-brandColor flex items-center justify-center border border-white/20">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <span>By <span className="text-white font-bold underline decoration-brandColor decoration-2 underline-offset-4">DIIT Media Team</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>5 min read</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content Details Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Article Content (8 cols) */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-8"
                    >
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 ring-1 ring-gray-100/50">
                            {/* Excerpt Section */}
                            {(newsItem.excerpt || newsItem.desc) && (
                                <div className="mb-10 p-8 bg-slate-50 rounded-2xl border-l-4 border-brandColor relative overflow-hidden">
                                    <div className="absolute top-0 right-0 -mt-2 -mr-2 opacity-5">
                                        <Bookmark className="w-32 h-32" />
                                    </div>
                                    <p className="text-xl md:text-2xl font-medium text-gray-800 italic leading-relaxed relative z-10">
                                        "{newsItem.excerpt || newsItem.desc}"
                                    </p>
                                </div>
                            )}

                            {/* Main Body */}
                            <article className="prose prose-lg md:prose-xl max-w-none text-gray-600 leading-8 font-serif-setup">
                                {Array.isArray(newsItem.content) ? (
                                    newsItem.content.map((paragraph, idx) => (
                                        <p key={idx} className={`
                                        mb-6 text-gray-700
                                        ${idx === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:text-brandColor first-letter:mr-3 first-letter:float-left" : ""}
                                    `}>
                                            {paragraph}
                                        </p>
                                    ))
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
                                )}
                            </article>

                            {/* Tags */}
                            <div className="mt-12 pt-8 border-t border-gray-100">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="flex items-center gap-2 text-gray-500 font-bold text-sm mr-2">
                                        <Tag className="w-4 h-4" />
                                        Tags:
                                    </span>
                                    {["DIIT", "Education", newsItem.category || "News"].map((tag) => (
                                        <span key={tag} className="px-4 py-1.5 bg-gray-100 hover:bg-brandColor hover:text-white text-gray-600 text-sm font-medium rounded-full cursor-pointer transition-colors duration-300">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Share Actions */}
                            <div className="mt-10 flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                                <span className="font-bold text-gray-900">Share this article</span>
                                <div className="flex items-center gap-4">
                                    <button className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"><Facebook className="w-5 h-5" /></button>
                                    <button className="p-2.5 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition"><Twitter className="w-5 h-5" /></button>
                                    <button className="p-2.5 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition"><Linkedin className="w-5 h-5" /></button>
                                    <button className="p-2.5 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition"><Share2 className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Sidebar (4 cols) */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Search Box */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-gray-900 mb-4">Search</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search news & events..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brandColor/20 focus:border-brandColor transition-all"
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        {/* Recent News Widget */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center">
                                <span className="w-1 h-6 bg-brandColor mr-3 rounded-full"></span>
                                Recent Updates
                            </h3>
                            <div className="space-y-6">
                                {recentNews.map((news) => (
                                    <Link href={`/news/${news.id || news._id}`} key={news.id || news._id} className="group flex items-start gap-4">
                                        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden relative">
                                            <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-brandColor mb-1 block">{news.date}</span>
                                            <h4 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-brandColor transition-colors line-clamp-2">
                                                {news.title}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Categories Widget */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center">
                                <span className="w-1 h-6 bg-brandColor mr-3 rounded-full"></span>
                                Categories
                            </h3>
                            <ul className="space-y-3">
                                {categories.map(cat => (
                                    <li key={cat}>
                                        <Link href="/news" className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-brandColor hover:text-white group transition-all duration-300">
                                            <span className="font-medium">{cat}</span>
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Subscribe/Ad Box */}
                        <div className="relative overflow-hidden rounded-2xl bg-brandColor p-8 text-center text-white">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-xl -ml-12 -mb-12"></div>

                            <h3 className="text-2xl font-bold mb-3 relative z-10">Join Our Newsletter</h3>
                            <p className="text-blue-100 mb-6 relative z-10 text-sm">Stay Updated with DIIT Campus Life</p>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 mb-3 relative z-10"
                            />
                            <button className="w-full bg-white text-brandColor font-bold py-2.5 rounded-lg hover:bg-blue-50 transition relative z-10">
                                Subscribe Now
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
