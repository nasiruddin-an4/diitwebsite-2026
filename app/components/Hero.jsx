"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
    const [heroSlides, setHeroSlides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Fetch slides from API
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const response = await fetch('/api/admin/hero');
                const result = await response.json();
                if (result.success && result.data.length > 0) {
                    setHeroSlides(result.data);
                } else {
                    // Fallback data if API returns empty
                    setHeroSlides([{
                        title: "Welcome to DIIT",
                        subtitle: "Excellence in Education",
                        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070",
                        primaryButtonText: "Explore Programs",
                        primaryButtonLink: "/programs",
                        secondaryButtonText: "Contact Us",
                        secondaryButtonLink: "/contact"
                    }]);
                }
            } catch (error) {
                console.error("Failed to fetch hero slides:", error);
                // Fallback on error
                setHeroSlides([{
                    title: "Welcome to DIIT",
                    subtitle: "Excellence in Education",
                    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070",
                    primaryButtonText: "Explore Programs",
                    primaryButtonLink: "/programs",
                    secondaryButtonText: "Contact Us",
                    secondaryButtonLink: "/contact"
                }]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlides();
    }, []);

    // Auto-play interval
    useEffect(() => {
        if (heroSlides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    const nextSlide = () => {
        if (heroSlides.length <= 1) return;
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        if (heroSlides.length <= 1) return;
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    if (isLoading) {
        return <div className="h-[90vh] w-full bg-slate-900 animate-pulse" />;
    }

    if (!heroSlides.length) return null;

    const slide = heroSlides[currentSlide];

    return (
        <div className="relative h-[90vh] w-full overflow-hidden bg-slate-900">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div className="relative w-full h-full">
                        {slide.image && (
                            <Image
                                src={slide.image}
                                alt={slide.title || "Hero Image"}
                                fill
                                className="object-cover"
                                priority
                            />
                        )}
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent" />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Content Container */}
            <div className="absolute inset-0 z-10 flex items-center">
                <div className="max-w-7xl mx-auto px-4 md:px-0 w-full">
                    <div className="max-w-3xl pt-24">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="space-y-4"
                            >
                                {/* Badge/Tag line */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm"
                                >
                                    <span className="text-blue-300 text-sm font-semibold tracking-wide uppercase">
                                        Welcome to DIIT
                                    </span>
                                </motion.div>

                                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                    {slide.title}
                                </h1>

                                <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-lg">
                                    {slide.subtitle || slide.description}
                                </p>

                                <div className="pt-4 flex flex-wrap gap-4">
                                    {/* Primary Button */}
                                    {(slide.primaryButtonLink || slide.buttonLink) && (
                                        <Link href={slide.primaryButtonLink || slide.buttonLink || "/"} passHref>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-base font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center group"
                                            >
                                                {slide.primaryButtonText || slide.buttonText || "Learn More"}
                                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </motion.button>
                                        </Link>
                                    )}

                                    {/* Secondary Button */}
                                    {slide.secondaryButtonText && (
                                        <Link href={slide.secondaryButtonLink || "/ contact"} passHref>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer text-white text-base font-semibold rounded-xl backdrop-blur-sm transition-all flex items-center"
                                            >
                                                {slide.secondaryButtonText}
                                            </motion.button>
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Navigation Controls only if multiple slides */}
            {heroSlides.length > 1 && (
                <div className="absolute bottom-8 left-0 right-0 z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-end">
                        {/* Dots */}
                        <div className="flex space-x-3">
                            {heroSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-blue-500" : "w-4 bg-white/30 hover:bg-white/50"
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Arrows */}
                        <div className="hidden md:flex space-x-4">
                            <button
                                onClick={prevSlide}
                                className="p-3 rounded-full border border-white/20 text-white hover:bg-white/10 backdrop-blur-md transition-all group"
                            >
                                <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="p-3 rounded-full border border-white/20 text-white hover:bg-white/10 backdrop-blur-md transition-all group"
                            >
                                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default Hero;
