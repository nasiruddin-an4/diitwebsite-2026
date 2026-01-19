"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    ChevronDown,
    ChevronUp,
    MessageCircle,
    HelpCircle,
    Book,
    GraduationCap,
    Wallet,
    Users
} from "lucide-react";
import Link from "next/link";

const categoryIcons = {
    "All": HelpCircle,
    "Admissions": GraduationCap,
    "Academics": Book,
    "Fees & Scholarships": Wallet,
    "Campus Life": Users
};

export default function FaqClient({ data }) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [openIndex, setOpenIndex] = useState(null);

    const { faqs = [], hero = {} } = data || {};

    const uniqueCategories = [...new Set(faqs.map(f => f.category).filter(Boolean))];
    const categories = ["All", ...uniqueCategories];

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const filteredFaqs = faqs.filter((faq) => {
        const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-neutral-50 min-h-screen font-sans">

            {/* 1. Hero Section */}
            <section className="relative bg-slate-900 py-24 px-4 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="relative max-w-4xl mx-auto text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{hero.title || "How can we help you?"}</h1>
                        <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto whitespace-pre-wrap">
                            {hero.description || "Find answers to the most frequently asked questions about admissions, academics, and student life at DIIT."}
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                placeholder="Search for a question..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-6 py-4 rounded-full pl-14 text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 border text-lg"
                            />
                            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. FAQ Content */}
            <section className="py-20 px-4 max-w-5xl mx-auto">

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((cat) => {
                        const Icon = categoryIcons[cat] || HelpCircle;
                        return (
                            <button
                                key={cat}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    setOpenIndex(null); // Close accordions on tab switch
                                }}
                                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300
                  ${activeCategory === cat
                                        ? "bg-indigo-600 text-white shadow transform scale-105"
                                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {cat}
                            </button>
                        );
                    })}
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    key={faq.id}
                                    className="bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow transition-shadow"
                                >
                                    <button
                                        onClick={() => toggleAccordion(index)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                                    >
                                        <span className={`font-bold text-lg ${openIndex === index ? 'text-blue-800' : 'text-gray-800'}`}>
                                            {faq.question}
                                        </span>
                                        <div className={`p-2 rounded-full transition-colors ${openIndex === index ? 'bg-indigo-100 text-blue-800' : 'bg-gray-50 text-gray-400'}`}>
                                            {openIndex === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-20">
                                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">No questions found</h3>
                                <p className="text-gray-500">Try adjusting your search or category filter.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

            </section>

            {/* 3. Still have questions? CTA */}
            <section className="bg-indigo-50 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">

                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Still have questions?</h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Can't find the answer you're looking for? Please contact our friendly team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact" className="bg-blue-800 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors cursor-pointers">
                            Contact Us
                        </Link>
                        <button className="bg-white text-gray-700 border border-gray-200 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors">
                            Call +880 2-9116774
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
