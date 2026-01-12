"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import homePageData from "@/public/Data/HomePage.json";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mobileExpanded, setMobileExpanded] = useState({});
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef(null);
    const pathname = usePathname();

    const { navigationItems } = homePageData;

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

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        setSearchOpen(false);
        setActiveDropdown(null);
    }, [pathname]);

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
            {/* Top Bar - Sleek Dark Theme */}
            <div className="bg-slate-900 text-slate-300 py-2.5 hidden lg:block text-xs border-b border-white/5 relative z-50">
                <div className="container mx-auto px-0 flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <span className="flex items-center hover:text-white transition-colors cursor-pointer">
                            <svg className="w-3.5 h-3.5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            +880 2-9116774
                        </span>
                        <span className="flex items-center hover:text-white transition-colors cursor-pointer">
                            <svg className="w-3.5 h-3.5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            info@diit.edu.bd
                        </span>
                    </div>
                    <div className="flex space-x-6 font-medium">
                        <Link href="/student-portal" className="hover:text-cyan-400 transition-colors">Student Portal</Link>
                        <span className="text-slate-700">|</span>
                        <Link href="/faculty-portal" className="hover:text-cyan-400 transition-colors">Faculty Portal</Link>
                    </div>
                </div>
            </div>

            <header
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${isScrolled
                    ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-blue-900/5 h-16 lg:h-20"
                    : "bg-white/95 backdrop-blur-md h-20 lg:h-24 lg:top-9"
                    }`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex items-center justify-between h-full">

                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 group relative z-50">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-600 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                <div className="relative w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                                    D
                                </div>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden xl:flex items-center space-x-1">
                            {navigationItems.map((item) => (
                                <div
                                    key={item.name}
                                    className="relative px-1"
                                    onMouseEnter={() => setActiveDropdown(item.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link
                                        href={item.path || "#"}
                                        className={`relative px-4 py-2.5 text-[15px] font-medium rounded-full transition-all duration-300 flex items-center group overflow-hidden ${activeDropdown === item.name
                                            ? "text-blue-600 bg-blue-50/80"
                                            : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <span className="relative z-10">{item.name}</span>
                                        {item.dropdown && (
                                            <svg className={`ml-1.5 w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === item.name ? "rotate-180 text-blue-500" : "text-slate-400 group-hover:text-blue-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        )}
                                    </Link>

                                    {/* Desktop Dropdown */}
                                    <AnimatePresence>
                                        {item.dropdown && activeDropdown === item.name && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                className="absolute top-full left-0 mt-2 w-72"
                                            >
                                                <div className="relative p-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-white/20 ring-1 ring-black/5 overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/20 pointer-events-none"></div>
                                                    <div className="relative space-y-0.5">
                                                        {item.dropdown.map((subItem, idx) => (
                                                            <div key={idx} className="relative group/sub">
                                                                {subItem.subDropdown ? (
                                                                    <div className="w-full">
                                                                        <div className="px-4 py-3 text-[14px] font-medium text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent rounded-xl flex items-center justify-between cursor-pointer transition-colors duration-200">
                                                                            {subItem.name}
                                                                            <svg className="w-4 h-4 text-slate-400 group-hover/sub:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                            </svg>
                                                                        </div>
                                                                        {/* Sub-dropdown (Level 3) */}
                                                                        <div className="absolute left-full top-0 ml-2 w-64 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 transform translate-x-1 group-hover/sub:translate-x-0">
                                                                            <div className="p-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 ring-1 ring-black/5">
                                                                                {subItem.subDropdown.map((nestedItem, nIdx) => (
                                                                                    <Link
                                                                                        key={nIdx}
                                                                                        href={nestedItem.path || "#"}
                                                                                        className="block px-4 py-2.5 text-[14px] text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:pl-5"
                                                                                    >
                                                                                        {nestedItem.name}
                                                                                    </Link>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <Link
                                                                        href={subItem.path || "#"}
                                                                        target={subItem.target}
                                                                        className="flex items-center px-4 py-3 text-[14px] text-slate-600 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent rounded-xl transition-all duration-200 hover:pl-5 group/link"
                                                                    >
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-3 opacity-0 group-hover/link:opacity-100 transition-opacity"></span>
                                                                        {subItem.name}
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </nav>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-3 lg:space-x-5">
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300 group"
                            >
                                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            <Link
                                href="/admissions/how-to-apply"
                                className="hidden md:inline-flex items-center justify-center px-7 py-3 text-sm font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-[length:200%_auto] hover:bg-right rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
                            >
                                Apply Now
                            </Link>

                            {/* Mobile Menu Button - Animated Hamburger */}
                            <button
                                onClick={toggleMenu}
                                className="xl:hidden p-2 text-slate-800 hover:text-blue-600 transition-colors relative z-50 focus:outline-none"
                            >
                                <div className="w-6 h-5 flex flex-col justify-between">
                                    <motion.span
                                        animate={isMenuOpen ? { rotate: 45, y: 9, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
                                        className="h-0.5 bg-current rounded-full origin-left"
                                    />
                                    <motion.span
                                        animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                        className="h-0.5 w-4 bg-current rounded-full ml-auto"
                                    />
                                    <motion.span
                                        animate={isMenuOpen ? { rotate: -45, y: -9, width: "100%" } : { rotate: 0, y: 0, width: "80%" }}
                                        className="h-0.5 bg-current rounded-full origin-left ml-auto"
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Animated Search Overlay */}
                <AnimatePresence>
                    {searchOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl z-40"
                        >
                            <div className="max-w-4xl mx-auto px-4 py-8">
                                <form onSubmit={(e) => e.preventDefault()} className="relative group">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search courses, faculty, events..."
                                        className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-100 rounded-2xl py-5 pl-14 pr-6 text-xl text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <button
                                        onClick={() => setSearchOpen(false)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-500 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Mobile Drawer (Right Side) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
                            onClick={closeMenu}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 z-50 w-[85vw] sm:w-[400px] bg-white shadow-2xl lg:hidden"
                        >
                            <div className="h-full flex flex-col">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                                        Menu
                                    </span>
                                    <button
                                        onClick={closeMenu}
                                        className="p-2 -mr-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto py-6 px-5 space-y-1 scrollbar-hide">
                                    {navigationItems.map((item, idx) => (
                                        <div key={idx} className="border-b border-gray-50 last:border-0 pb-2">
                                            {item.dropdown ? (
                                                <div>
                                                    <button
                                                        onClick={() => toggleMobileSubmenu(item.name)}
                                                        className="w-full flex items-center justify-between py-3.5 px-3 text-[16px] font-medium text-slate-700 hover:text-blue-600 transition-all rounded-xl hover:bg-blue-50/50"
                                                    >
                                                        {item.name}
                                                        <motion.svg
                                                            animate={{ rotate: mobileExpanded[item.name] ? 180 : 0 }}
                                                            className="w-5 h-5 text-slate-400"
                                                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </motion.svg>
                                                    </button>
                                                    <AnimatePresence>
                                                        {mobileExpanded[item.name] && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="pl-4 pr-2 pb-3 space-y-1 bg-gray-50/50 rounded-xl my-1 border border-gray-100/50">
                                                                    {item.dropdown.map((subItem, sIdx) => (
                                                                        <div key={sIdx}>
                                                                            {subItem.subDropdown ? (
                                                                                <div>
                                                                                    <button
                                                                                        onClick={() => toggleMobileSubmenu(subItem.name)}
                                                                                        className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-medium text-slate-600 hover:text-blue-600"
                                                                                    >
                                                                                        {subItem.name}
                                                                                        <motion.svg
                                                                                            animate={{ rotate: mobileExpanded[subItem.name] ? 180 : 0 }}
                                                                                            className="w-4 h-4 text-slate-400"
                                                                                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                                                        >
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                                        </motion.svg>
                                                                                    </button>
                                                                                    <AnimatePresence>
                                                                                        {mobileExpanded[subItem.name] && (
                                                                                            <motion.div
                                                                                                initial={{ height: 0, opacity: 0 }}
                                                                                                animate={{ height: "auto", opacity: 1 }}
                                                                                                exit={{ height: 0, opacity: 0 }}
                                                                                                className="overflow-hidden"
                                                                                            >
                                                                                                <div className="pl-4 space-y-1 border-l-2 border-blue-100 ml-3">
                                                                                                    {subItem.subDropdown.map((nested, nIdx) => (
                                                                                                        <Link
                                                                                                            key={nIdx}
                                                                                                            href={nested.path || "#"}
                                                                                                            onClick={closeMenu}
                                                                                                            className="block py-2 px-3 text-[13px] text-slate-500 hover:text-blue-600 hover:translate-x-1 transition-all"
                                                                                                        >
                                                                                                            {nested.name}
                                                                                                        </Link>
                                                                                                    ))}
                                                                                                </div>
                                                                                            </motion.div>
                                                                                        )}
                                                                                    </AnimatePresence>
                                                                                </div>
                                                                            ) : (
                                                                                <Link
                                                                                    href={subItem.path || "#"}
                                                                                    target={subItem.target}
                                                                                    onClick={closeMenu}
                                                                                    className="block py-2.5 px-3 text-sm text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                                                                                >
                                                                                    {subItem.name}
                                                                                </Link>
                                                                            )}
                                                                        </div>
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
                                                    className="block py-3.5 px-3 text-[16px] font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all"
                                                >
                                                    {item.name}
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 border-t border-gray-100 bg-gray-50/80 space-y-4">
                                    <Link
                                        href="/admissions/how-to-apply"
                                        onClick={closeMenu}
                                        className="flex w-full items-center justify-center px-6 py-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-95 transition-all"
                                    >
                                        Apply Now
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
