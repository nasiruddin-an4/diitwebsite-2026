"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Menu,
    X,
    ChevronDown,
    ArrowRight,
    Loader2
} from "lucide-react";
import Image from "next/image";
import useCachedFetch from "@/hooks/useCachedFetch";

// Fallback navigation data (used when API is unavailable)
const fallbackNavigationItems = [
    {
        name: "Admissions",
        dropdown: [
            { name: "Admission Eligibility", path: "/admissionEligibility" },
            { name: "Online Admission", path: "/admission/online" },
            { name: "Tuition Fees", path: "/admission/fees" },
            { name: "Scholarships & Waivers", path: "/admission/scholarships" },
            { name: "Facilities", path: "/campus/facilities" }
        ]
    },
    {
        name: "Academics",
        dropdown: [
            { name: "Academic Calendar", path: "/academics/calendar" },
            { name: "DIIT Notices", path: "/notices" },
            { name: "NU Notices", path: "https://www.nu.ac.bd/recent-news-notice.php", target: "_blank", external: true },
            { name: "Faculty Members", path: "/faculty" },
            { name: "Administrative", path: "/administrative" },
            { name: "Alumni", path: "/alumni" }
        ]
    },
    {
        name: "Programs",
        path: "/programs",
        dropdown: [
            { name: "B.Sc. in Computer Science and Engineering", path: "/programs/cse" },
            { name: "Bachelor of Business Administration (BBA)", path: "/programs/bba" },
            { name: "BBA in Tourism and Hospitality Management", path: "/programs/bthm" },
            { name: "Master of Business Administration (MBA)", path: "/programs/mba" },
            { name: "MBA in Tourism and Hospitality Management", path: "/programs/mthm" }
        ]
    },
    {
        name: "News & Events",
        dropdown: [
            { name: "News & Events", path: "/news" },
            { name: "Campus Activities", path: "/campus-activities" }
        ]
    },
    {
        name: "About",
        dropdown: [
            { name: "About Us", path: "/about" },
            { name: "FAQ", path: "/faq" },
            { name: "Career", path: "/career" },
            { name: "Contact", path: "/contact" }
        ]
    }
];

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mobileExpanded, setMobileExpanded] = useState({});
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchInputRef = useRef(null);
    const pathname = usePathname();
    const router = useRouter();

    // 1. Fetch Navigation Structure
    const { data: navData } = useCachedFetch(
        "navigation_data",
        "/api/admin/data/NavigationData",
        {
            fallback: { navigationItems: fallbackNavigationItems },
            maxAge: 10 * 60 * 1000,
            transform: (data) => data
        }
    );

    // 2. Fetch Programs Data to make the dropdown dynamic
    const { data: programsDataResult } = useCachedFetch(
        "all_programs_nav",
        "/api/admin/data/ProgramsData",
        {
            fallback: [],
            maxAge: 5 * 60 * 1000,
            transform: (data) => {
                // Programs could be an array or an object
                const programsArr = data?.programsData || data || [];
                return Array.isArray(programsArr) ? programsArr : Object.values(programsArr);
            }
        }
    );

    // 3. Process navigation items and inject dynamic programs
    const navigationItems = (navData?.navigationItems || fallbackNavigationItems).map(item => {
        if (item.name === "Programs" && programsDataResult && programsDataResult.length > 0) {
            return {
                ...item,
                dropdown: programsDataResult.map(prog => ({
                    name: prog.title || prog.shortName,
                    path: `/programs/${prog.id}`,
                    // Carry over any other properties if needed
                }))
            };
        }
        return item;
    });

    // Debounced search function
    const performSearch = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
            const data = await response.json();
            if (data.success) {
                setSearchResults(data.results || []);
            }
        } catch (error) {
            console.error("Search error:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, performSearch]);

    // Reset selected index when results change
    useEffect(() => {
        setSelectedIndex(-1);
    }, [searchResults]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    useEffect(() => {
        setIsMenuOpen(false);
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        setActiveDropdown(null);
    }, [pathname]);

    // Handle keyboard navigation in search
    const handleSearchKeyDown = (e) => {
        if (e.key === "Escape") {
            setSearchOpen(false);
            setSearchQuery("");
            setSearchResults([]);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev < searchResults.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0 && searchResults[selectedIndex]) {
                navigateToResult(searchResults[selectedIndex]);
            } else if (searchQuery.length >= 2) {
                // Navigate to search results page
                router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                setSearchOpen(false);
            }
        }
    };

    const navigateToResult = (result) => {
        router.push(result.path);
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
    };

    // Close search on ESC key (global)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const toggleMobileSubmenu = (name) => {
        setMobileExpanded(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    return (
        <>
            {/* Main Header */}
            <header
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow-sm h-[70px] lg:h-[80px]"
                    : "bg-white/90 backdrop-blur-sm h-[80px] lg:h-[90px]"
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">

                    {/* Logo (Aligned Left) */}
                    <Link href="/" className="flex items-center group relative z-50 mr-8 lg:mr-12">
                        <div className="relative w-20 h-20 lg:w-24 lg:h-24">
                            <Image
                                src="/diitLogo.png"
                                alt="DIIT Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden xl:flex items-center gap-8 ml-auto mr-6">
                        {navigationItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative h-full flex items-center"
                                onMouseEnter={() => setActiveDropdown(item.name)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    href={item.path || "#"}
                                    className={`relative z-10 py-2 text-[18px] font-semibold transition-colors duration-200 flex items-center gap-1.5 ${activeDropdown === item.name
                                        ? "text-brandColor"
                                        : "text-slate-700 hover:text-brandColor"
                                        }`}
                                >
                                    {item.name}
                                    {item.dropdown && (
                                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeDropdown === item.name ? "rotate-180" : ""}`} />
                                    )}
                                </Link>

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {item.dropdown && activeDropdown === item.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full right-0 mt-4 w-[360px] bg-white shadow-xl shadow-slate-200/50 rounded-xl border-t-4 border-brandColor overflow-hidden z-40 ring-1 ring-black/5"
                                        >
                                            <div className="py-4">
                                                {item.dropdown.map((subItem, idx) => (
                                                    <div key={idx} className="relative group/sub">
                                                        <Link
                                                            href={subItem.path || "#"}
                                                            target={subItem.target}
                                                            className="block px-8 py-3 text-[18px] font-semibold text-slate-600 hover:text-brandColor hover:bg-slate-50 transition-colors"
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>

                    {/* Shared Actions (Search, Apply, Mobile Toggle) */}
                    <div className="flex items-center gap-3 md:gap-5 ml-auto xl:ml-0">
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-2.5 text-slate-600 hover:text-brandColor cursor-pointer hover:bg-slate-50 rounded-full transition-all"
                            aria-label="Search"
                        >
                            <Search className="w-6 h-6 md:w-6 md:h-6" />
                        </button>

                        <Link
                            href="/admission/online"
                            className="hidden md:inline-flex items-center justify-center px-6 py-2.5 lg:px-7 lg:py-3 text-[15px] font-bold text-white bg-brandColor hover:bg-blue-800 transition-all duration-300 rounded-lg shadow-lg hover:shadow-brandColor/30 hover:-translate-y-0.5"
                        >
                            Apply Now
                        </Link>

                        <button
                            onClick={toggleMenu}
                            className="xl:hidden p-2 text-slate-700 hover:text-brandColor transition-colors cursor-pointer"
                        >
                            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Spotlight Search Modal - Outside Header for Full Blur */}
            <AnimatePresence>
                {searchOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setSearchOpen(false);
                                setSearchQuery("");
                                setSearchResults([]);
                            }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-100"
                        />
                        {/* Search Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="fixed top-[100px] left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-110"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/10">
                                {/* Search Input */}
                                <div className="relative border-b border-gray-100 flex items-center p-4">
                                    {isSearching ? (
                                        <Loader2 className="w-6 h-6 text-brandColor ml-2 animate-spin" />
                                    ) : (
                                        <Search className="w-6 h-6 text-slate-400 ml-2" />
                                    )}
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search programs, news, faculty, FAQs..."
                                        className="flex-1 py-2 px-4 text-xl text-slate-800 placeholder:text-slate-400 border-none outline-none focus:ring-0 bg-transparent font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearchKeyDown}
                                    />
                                    <div className="flex items-center gap-2">
                                        {searchQuery && (
                                            <button
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setSearchResults([]);
                                                    searchInputRef.current?.focus();
                                                }}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer hover:bg-slate-100 rounded-full transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                        <div className="hidden sm:flex items-center gap-1">
                                            <div className="text-xs font-semibold text-slate-400 border border-slate-200 rounded px-2 py-1">
                                                ESC
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSearchOpen(false);
                                                setSearchQuery("");
                                                setSearchResults([]);
                                            }}
                                            className="p-2 text-slate-400 hover:text-red-500 cursor-pointer hover:bg-red-50 rounded-full transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Search Results */}
                                {searchQuery.length >= 2 && (
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {isSearching ? (
                                            <div className="p-8 text-center">
                                                <Loader2 className="w-8 h-8 text-brandColor animate-spin mx-auto mb-3" />
                                                <p className="text-slate-500 font-medium">Searching...</p>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <div className="py-2">
                                                <div className="px-4 py-2 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                                                    {searchResults.length} Results Found
                                                </div>
                                                {searchResults.map((result, index) => (
                                                    <button
                                                        key={`${result.path}-${index}`}
                                                        onClick={() => navigateToResult(result)}
                                                        className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-all cursor-pointer ${selectedIndex === index
                                                                ? "bg-brandColor/10 border-l-4 border-brandColor"
                                                                : "hover:bg-slate-50 border-l-4 border-transparent"
                                                            }`}
                                                    >
                                                        <span className="text-2xl flex-shrink-0 mt-0.5">{result.icon}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-semibold text-slate-800 truncate">
                                                                    {result.title}
                                                                </h4>
                                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${result.type === 'program' ? 'bg-blue-100 text-blue-700' :
                                                                        result.type === 'news' ? 'bg-green-100 text-green-700' :
                                                                            result.type === 'faculty' ? 'bg-purple-100 text-purple-700' :
                                                                                result.type === 'faq' ? 'bg-orange-100 text-orange-700' :
                                                                                    result.type === 'notice' ? 'bg-red-100 text-red-700' :
                                                                                        result.type === 'career' ? 'bg-indigo-100 text-indigo-700' :
                                                                                            result.type === 'activity' ? 'bg-pink-100 text-pink-700' :
                                                                                                'bg-slate-100 text-slate-600'
                                                                    }`}>
                                                                    {result.type}
                                                                </span>
                                                            </div>
                                                            {result.description && (
                                                                <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">
                                                                    {result.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <ArrowRight className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${selectedIndex === index ? "translate-x-1 text-brandColor" : ""
                                                            }`} />
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center">
                                                <div className="text-4xl mb-3">🔍</div>
                                                <p className="text-slate-600 font-medium">No results found for "{searchQuery}"</p>
                                                <p className="text-slate-400 text-sm mt-1">Try different keywords or browse our quick links below</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Quick Links - Show when no search query */}
                                {searchQuery.length < 2 && (
                                    <div className="p-4 bg-slate-50 text-sm text-slate-500 font-medium">
                                        <div className="px-2 pb-2 text-xs uppercase tracking-wider text-slate-400">Quick Links</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link
                                                href="/admissionEligibility"
                                                onClick={() => setSearchOpen(false)}
                                                className="block px-3 py-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600"
                                            >
                                                📝 Admissions Guide
                                            </Link>
                                            <Link
                                                href="/programs"
                                                onClick={() => setSearchOpen(false)}
                                                className="block px-3 py-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600"
                                            >
                                                📚 Academic Programs
                                            </Link>
                                            <Link
                                                href="/news"
                                                onClick={() => setSearchOpen(false)}
                                                className="block px-3 py-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600"
                                            >
                                                📰 News & Events
                                            </Link>
                                            <Link
                                                href="/contact"
                                                onClick={() => setSearchOpen(false)}
                                                className="block px-3 py-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600"
                                            >
                                                📞 Contact Us
                                            </Link>
                                            <Link
                                                href="/faculty"
                                                onClick={() => setSearchOpen(false)}
                                                className="block px-3 py-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600"
                                            >
                                                👨‍🏫 Faculty Members
                                            </Link>
                                            <Link
                                                href="/faq"
                                                onClick={() => setSearchOpen(false)}
                                                className="block px-3 py-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600"
                                            >
                                                ❓ FAQ
                                            </Link>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-400 text-center">
                                            Type to search • Use ↑↓ to navigate • Press Enter to select
                                        </div>
                                    </div>
                                )}

                                {/* Keyboard hints at bottom when showing results */}
                                {searchQuery.length >= 2 && searchResults.length > 0 && (
                                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono">↑</kbd>
                                            <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono">↓</kbd>
                                            to navigate
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono">Enter</kbd>
                                            to select
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono">Esc</kbd>
                                            to close
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )
                }
            </AnimatePresence >

            {/* Mobile Menu Overlay */}
            < AnimatePresence >
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeMenu}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                        transition={{ duration: 0.3 }}
                    />
                )}
            </AnimatePresence >

            {/* Mobile Drawer */}
            < AnimatePresence >
                {isMenuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-y-0 right-0 z-50 w-[85vw] sm:w-[350px] bg-white shadow-2xl lg:hidden flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <span className="font-bold text-lg text-slate-900">Menu</span>
                            <button onClick={closeMenu} className="p-2 text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4 px-6 space-y-1">
                            {navigationItems.map((item, idx) => (
                                <div key={idx} className="border-b border-gray-50 last:border-0">
                                    {item.dropdown ? (
                                        <div>
                                            <div className="flex items-center justify-between py-4">
                                                {/* Main item - Link if has path, otherwise just text */}
                                                {item.path ? (
                                                    <Link
                                                        href={item.path}
                                                        onClick={closeMenu}
                                                        className="text-[18px] font-medium text-slate-800 hover:text-brandColor flex-1"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ) : (
                                                    <span className="text-[18px] font-medium text-slate-800 flex-1">
                                                        {item.name}
                                                    </span>
                                                )}
                                                {/* Chevron to toggle dropdown */}
                                                <button
                                                    onClick={() => toggleMobileSubmenu(item.name)}
                                                    className="p-2 -mr-2 text-slate-400 hover:text-brandColor"
                                                >
                                                    <ChevronDown
                                                        className={`w-6 h-6 transition-transform ${mobileExpanded[item.name] ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                            </div>
                                            <AnimatePresence>
                                                {mobileExpanded[item.name] && (
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: "auto" }}
                                                        exit={{ height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pl-4 pb-4 space-y-2">
                                                            {item.dropdown.map((subItem, sIdx) => (
                                                                <Link
                                                                    key={sIdx}
                                                                    href={subItem.path || "#"}
                                                                    target={subItem.target}
                                                                    onClick={closeMenu}
                                                                    className="block py-1.5 text-[16px] text-slate-600 hover:text-brandColor"
                                                                >
                                                                    {subItem.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.path || "#"}
                                            onClick={closeMenu}
                                            className="block py-4 text-[15px] font-medium text-slate-800 hover:text-brandColor"
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-gray-100 mt-auto">
                            <Link
                                href="/admissions/apply"
                                onClick={closeMenu}
                                className="flex w-full items-center justify-center px-6 py-3 text-sm font-bold text-white bg-brandColor rounded shadow-lg hover:bg-blue-800 transition-colors"
                            >
                                Apply Now
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence >
        </>
    );
};

export default Header;
