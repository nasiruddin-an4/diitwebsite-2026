"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import homePageData from "@/public/Data/HomePage.json";

const Hero = () => {
    const { heroSlides } = homePageData;
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-play interval
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

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
                        <Image
                            src={heroSlides[currentSlide].image}
                            alt={heroSlides[currentSlide].title}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent" />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Content Container */}
            <div className="absolute inset-0 z-10 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="space-y-6"
                            >
                                {/* Badge/Tag line could go here */}
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

                                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
                                    {heroSlides[currentSlide].title}
                                </h1>

                                <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-lg">
                                    {heroSlides[currentSlide].description}
                                </p>

                                <div className="pt-4 flex flex-wrap gap-4">
                                    <Link href={heroSlides[currentSlide].buttonLink}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center group"
                                        >
                                            {heroSlides[currentSlide].buttonText}
                                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </motion.button>
                                    </Link>
                                    <Link href="/about">
                                        <motion.button
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-8 py-4 bg-transparent border border-white/30 text-white text-base font-semibold rounded-xl hover:border-white/60 transition-all"
                                        >
                                            Learn More
                                        </motion.button>
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
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
        </div>
    );
};

export default Hero;
