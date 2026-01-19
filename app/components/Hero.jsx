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
        <div className="relative h-[60vh] md:h-[90vh] w-full overflow-hidden">
            {/* Background Image Container with Cross-fade */}
            <div className="absolute inset-0">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        {slide.image && (
                            <Image
                                src={slide.image}
                                alt={slide.title || "Hero Image"}
                                fill
                                className="object-cover"
                                priority
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Persistent Overlay Gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent z-10" />
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 z-20 flex items-end">
                <div className="max-w-7xl mx-auto px-4 md:px-0 w-full pb-24">
                    <div className="max-w-2xl pt-24">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="space-y-2"
                            >
                                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                    {slide.title}
                                </h1>

                                <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-lg line-clamp-2">
                                    {slide.subtitle || slide.description}
                                </p>
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
