"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Loader2, ArrowRight, Filter } from "lucide-react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

// Category badges configuration
const CATEGORY_STYLES = {
    program: "bg-blue-100 text-blue-700 border-blue-200",
    news: "bg-green-100 text-green-700 border-green-200",
    faculty: "bg-purple-100 text-purple-700 border-purple-200",
    notice: "bg-red-100 text-red-700 border-red-200",
    faq: "bg-orange-100 text-orange-700 border-orange-200",
    activity: "bg-pink-100 text-pink-700 border-pink-200",
    career: "bg-indigo-100 text-indigo-700 border-indigo-200",
    page: "bg-slate-100 text-slate-700 border-slate-200",
    default: "bg-gray-100 text-gray-700 border-gray-200"
};

const SearchContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") || "";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState(query);

    useEffect(() => {
        setSearchQuery(query);
    }, [query]);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;

            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=50`);
                const data = await res.json();
                if (data.success) {
                    setResults(data.results);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Filter results
    const filteredResults = filter === "all"
        ? results
        : results.filter(item => item.type === filter);

    // Get unique types for filter tabs
    const availableTypes = ["all", ...new Set(results.map(item => item.type))];

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <main className="flex-grow pt-[100px] lg:pt-[120px] pb-20">
                <div className="container mx-auto px-4 max-w-5xl">

                    {/* Search Header */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
                        <h1 className="text-2xl font-bold text-slate-800 mb-6">Search Results</h1>

                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for anything..."
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-brandColor focus:ring-4 focus:ring-brandColor/10 transition-all outline-none text-lg"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-brandColor text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Results Area */}
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Filters Sidebar (Desktop) */}
                        <div className="lg:w-64 flex-shrink-0">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sticky top-[120px]">
                                <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
                                    <Filter className="w-4 h-4" />
                                    Filters
                                </div>
                                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                                    {availableTypes.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setFilter(type)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium text-left transition-colors whitespace-nowrap ${filter === type
                                                    ? "bg-brandColor text-white shadow-md shadow-brandColor/20"
                                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                                }`}
                                        >
                                            {capitalize(type)}
                                            <span className="ml-2 text-xs opacity-70">
                                                {type === 'all' ? results.length : results.filter(r => r.type === type).length}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Results List */}
                        <div className="flex-1">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-10 h-10 text-brandColor animate-spin mb-4" />
                                    <p className="text-slate-500 font-medium">Searching our database...</p>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="space-y-4">
                                    <p className="text-slate-500 mb-4">
                                        Found <span className="font-bold text-slate-800">{filteredResults.length}</span> results for "<span className="font-bold text-slate-800">{query}</span>"
                                    </p>

                                    {filteredResults.map((result, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={idx}
                                        >
                                            <Link
                                                href={result.path}
                                                className="group block bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-brandColor/30 transition-all duration-300"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="text-3xl bg-slate-50 w-12 h-12 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                                                        {result.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${CATEGORY_STYLES[result.type] || CATEGORY_STYLES.default}`}>
                                                                {result.type.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-brandColor transition-colors mb-2">
                                                            {result.title}
                                                        </h3>
                                                        <p className="text-slate-600 leading-relaxed text-sm mb-4 line-clamp-2">
                                                            {result.description}
                                                        </p>
                                                        <div className="flex items-center text-sm font-medium text-brandColor group-hover:translate-x-1 transition-transform">
                                                            View Details <ArrowRight className="w-4 h-4 ml-1" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
                                    <div className="text-6xl mb-6">🤔</div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">No results found</h3>
                                    <p className="text-slate-500 max-w-md mx-auto">
                                        We couldn't find any matches for "{query}". Try checking your spelling or using different keywords.
                                    </p>
                                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                                        <Link href="/" className="text-brandColor font-semibold hover:underline">Return Home</Link>
                                        <span className="text-slate-300">|</span>
                                        <Link href="/programs" className="text-brandColor font-semibold hover:underline">Browse Programs</Link>
                                        <span className="text-slate-300">|</span>
                                        <Link href="/contact" className="text-brandColor font-semibold hover:underline">Contact Support</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-brandColor animate-spin" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
