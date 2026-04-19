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
  User,
  Mail,
} from "lucide-react";

// Sanitize rich text HTML — replace &nbsp; with regular spaces so text wraps normally
const cleanHtml = (html) => {
  if (!html) return "";
  return typeof html === "string" ? html.replace(/&nbsp;/g, " ") : html;
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ArticleView({ newsItem, recentNews }) {
  // Fallback categories or extracted from recent
  const categories = ["News", "Events", "Academic", "Notices"];

  if (!newsItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            News Item Not Found
          </h2>
          <Link
            href="/news"
            className="text-brandColor hover:underline mt-4 inline-block"
          >
            Back to News
          </Link>
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
              <motion.div
                variants={fadeIn}
                className="flex flex-wrap items-center gap-3 mb-6"
              >
                <span
                  className={`
                                    px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg
                                    ${newsItem.category === "NEWS" ? "bg-blue-600 text-white" : "bg-yellow-500 text-black"}
                                `}
                >
                  {newsItem.category || "News"}
                </span>
                <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold tracking-wide">
                    {newsItem.date}
                  </span>
                </div>
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-xl mb-6"
              >
                {newsItem.title}
              </motion.h1>

              <motion.div
                variants={fadeIn}
                className="flex items-center gap-6 text-white/80 text-sm font-medium"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brandColor flex items-center justify-center border border-white/20">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span>
                    By{" "}
                    <span className="text-white font-bold underline decoration-brandColor decoration-2 underline-offset-4">
                      {newsItem.author}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{newsItem.readTime}</span>
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
              {newsItem.category === "BLOG" && (
                <div className="text-center mb-12">
                  <div className="inline-block px-4 py-1 bg-brandColor/5 text-brandColor rounded-full text-xs font-black uppercase tracking-widest mb-4">
                    The DIIT Newsletter
                  </div>
                  <h2 className="text-sm text-gray-400 font-medium uppercase tracking-[0.2em]">
                    In-depth Insights & Perspectives
                  </h2>
                  <div className="w-20 h-1 bg-brandColor mx-auto mt-6 rounded-full"></div>
                </div>
              )}

              {/* Excerpt Section */}
              {(newsItem.excerpt || newsItem.desc) && (
                <div className="mb-10 p-8 bg-slate-50 rounded-2xl border-l-4 border-brandColor relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 opacity-5">
                    <Bookmark className="w-32 h-32" />
                  </div>
                  <p className="text-xl md:text-2xl font-medium text-gray-800 italic leading-relaxed relative z-10">
                    {newsItem.excerpt || newsItem.desc}
                  </p>
                </div>
              )}

              {/* Main Body */}
              <article
                className={`
                                content-area
                                max-w-none text-gray-700 leading-relaxed
                                ${newsItem.category === "BLOG" ? "blog-newsletter-serif" : "font-sans"}
                            `}
              >
                {Array.isArray(newsItem.content) ? (
                  newsItem.content.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className={`
                                        mb-6 text-lg
                                        ${idx === 0 && newsItem.category === "BLOG" ? "drop-cap" : ""}
                                    `}
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <div
                    className="rich-text-content prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600"
                    dangerouslySetInnerHTML={{
                      __html: cleanHtml(newsItem.content),
                    }}
                  />
                )}
              </article>

              <style jsx global>{`
                .content-area {
                  font-size: 1.125rem;
                  word-break: normal;
                  overflow-wrap: break-word;
                  white-space: normal;
                }
                .blog-newsletter-serif {
                  font-family: var(--font-manrope), Georgia, serif;
                  line-height: 1.8;
                }
                .rich-text-content p {
                  margin-bottom: 1.5rem;
                  word-break: normal;
                }
                .rich-text-content h1,
                .rich-text-content h2,
                .rich-text-content h3 {
                  color: #111827;
                  font-weight: 800;
                  margin-top: 2.5rem;
                  margin-bottom: 1rem;
                  line-height: 1.2;
                  word-break: normal;
                }
                .rich-text-content h1 {
                  font-size: 2.25rem;
                }
                .rich-text-content h2 {
                  font-size: 1.875rem;
                }
                .rich-text-content h3 {
                  font-size: 1.5rem;
                }
                .rich-text-content blockquote {
                  font-style: italic;
                  border-left: 4px solid #002652;
                  padding-left: 1.5rem;
                  margin: 2rem 0;
                  color: #4b5563;
                  font-size: 1.25rem;
                }
                .rich-text-content ul,
                .rich-text-content ol {
                  margin-bottom: 1.5rem;
                  padding-left: 1.5rem;
                }
                .rich-text-content ul {
                  list-style-type: disc;
                }
                .rich-text-content ol {
                  list-style-type: decimal;
                }
                .rich-text-content li {
                  margin-bottom: 0.5rem;
                }
                .rich-text-content img {
                  border-radius: 1rem;
                  margin: 2.5rem 0;
                  max-width: 100%;
                  height: auto;
                }
                .drop-cap:first-letter {
                  float: left;
                  font-size: 4.5rem;
                  line-height: 1;
                  font-weight: 800;
                  margin-right: 0.75rem;
                  color: #002652;
                  text-transform: uppercase;
                }
              `}</style>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-2 text-gray-500 font-bold text-sm mr-2">
                    <Tag className="w-4 h-4" />
                    Tags:
                  </span>
                  {["DIIT", "Education", newsItem.category || "News"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-4 py-1.5 bg-gray-100 hover:bg-brandColor hover:text-white text-gray-600 text-sm font-medium rounded-full cursor-pointer transition-colors duration-300"
                      >
                        #{tag}
                      </span>
                    ),
                  )}
                </div>
              </div>

              {/* Share Actions */}
              <div className="mt-10 flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                <span className="font-bold text-gray-900">
                  Share this article
                </span>
                <div className="flex items-center gap-4">
                  <button className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Suggested Others Blogs */}
            {newsItem.category === "BLOG" && recentNews.length > 0 && (
              <div className="mt-20 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">
                    Recommended Readings
                  </h3>
                  <Link
                    href="/blog"
                    className="text-brandColor font-bold text-sm hover:underline flex items-center gap-1 uppercase tracking-widest"
                  >
                    View Blog <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {recentNews
                    .filter(
                      (n) => n.id !== newsItem.id && n._id !== newsItem._id,
                    )
                    .slice(0, 2)
                    .map((blog) => (
                      <Link
                        key={blog.id || blog._id}
                        href={`/news/${blog.slug}`}
                        className="group block"
                      >
                        <div className="aspect-video rounded-2xl overflow-hidden mb-4 shadow-sm border border-slate-100">
                          <img
                            src={blog.image}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <span className="text-[10px] font-black text-brandColor uppercase tracking-widest mb-2 block">
                          {blog.date}
                        </span>
                        <h4 className="font-bold text-slate-800 text-lg group-hover:text-brandColor transition-colors line-clamp-2 leading-tight">
                          {blog.title}
                        </h4>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column: Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-8 sticky top-24 self-start">
            {/* Recent News/Blogs Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center">
                <span className="w-1 h-6 bg-brandColor mr-3 rounded-full"></span>
                Latest Insights
              </h3>
              <div className="space-y-6">
                {recentNews.slice(0, 5).map((news) => (
                  <Link
                    href={`/news/${news.slug}`}
                    key={news.id || news._id}
                    className="group flex items-start gap-4"
                  >
                    <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden relative border border-slate-100 shadow-sm">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black text-brandColor/60 mb-1 block uppercase tracking-widest">
                        {news.date}
                      </span>
                      <h4 className="text-xs font-bold text-gray-800 leading-snug group-hover:text-brandColor transition-colors line-clamp-2">
                        {news.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact DIIT Widget */}
            <div className="bg-gradient-to-br from-slate-900 to-brandColor rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Need Guidance?</h3>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  Have questions about admissions or our programs? Our
                  counselors are here to help you.
                </p>
                <Link
                  href="/contact"
                  className="block w-full py-3 bg-white text-brandColor font-black text-center rounded-xl text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors shadow-lg"
                >
                  Contact Admissions
                </Link>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                <Tag className="w-4 h-4 text-brandColor" />
                Popular Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Academics",
                  "Campus Life",
                  "Admissions",
                  "DIIT",
                  "Blockchain",
                  "Graphics",
                  "Scholarship",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-md hover:bg-brandColor hover:text-white transition-all cursor-pointer border border-slate-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
