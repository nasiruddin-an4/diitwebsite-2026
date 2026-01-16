"use client";

import React, { useState, useEffect } from "react";

const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState({ students: [], guardians: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/admin/testimonials');
                const result = await response.json();
                if (result.success && result.data.testimonials) {
                    setTestimonials(result.data.testimonials);
                }
            } catch (error) {
                console.error("Failed to fetch testimonials:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 md:px-0 text-center">
                    <p className="text-gray-500">Loading testimonials...</p>
                </div>
            </section>
        );
    }

    // Combine all testimonials
    const allTestimonials = [
        ...(testimonials.students || []),
        ...(testimonials.guardians || [])
    ];

    const midPoint = Math.ceil(allTestimonials.length / 2);
    const column1 = allTestimonials.slice(0, midPoint);
    const column2 = allTestimonials.slice(midPoint);

    const displayColumn1 = [...column1, ...column1, ...column1];
    const displayColumn2 = [...column2, ...column2, ...column2];

    const TestimonialCard = ({ testimonial, isHorizontal = false }) => (
        <div className={`bg-white rounded-xl p-6 border border-gray-100 ${isHorizontal ? "w-[300px] shrink-0 mr-5" : "mb-5"
            }`}>
            <p className="text-gray-700 text-sm leading-relaxed mb-5">
                {testimonial.text}
            </p>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    {testimonial.image ? (
                        <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brandColor to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                            {testimonial.name ? testimonial.name.split(" ").map((n) => n[0]).join("") : "S"}
                        </div>
                    )}
                </div>
                <div>
                    <h5 className="font-semibold text-brandColor text-sm">
                        {testimonial.name}
                    </h5>
                    <p className="text-gray-500 text-xs">
                        {testimonial.program || testimonial.role}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-0">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start">
                    {/* Left Side - Title */}
                    {/* Mobile: Text Centered, Desktop: Text Left */}
                    <div className="lg:w-[350px] shrink-0 text-center lg:text-left lg:sticky lg:top-20">
                        <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-6 leading-tight">
                            See Our
                            <br />
                            <span className="text-brandColor">Testimonials</span>
                        </h2>
                        <p className="text-gray-500 text-base lg:text-lg leading-relaxed mb-8 lg:mb-0">
                            An outstanding experience that speaks volumes about their commitment to excellence.
                        </p>
                    </div>

                    {/* Right Side - Marquee Columns - Centered Content */}
                    <div className="flex-1 w-full">
                        {allTestimonials.length > 0 ? (
                            <>
                                {/* Mobile: Horizontal Marquee */}
                                <div className="lg:hidden relative">
                                    <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
                                    <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

                                    <div className="overflow-hidden">
                                        <div className="flex animate-marquee-left">
                                            {[...allTestimonials, ...allTestimonials, ...allTestimonials].map((testimonial, idx) => (
                                                <TestimonialCard key={`mobile-${idx}`} testimonial={testimonial} isHorizontal={true} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop: Vertical 2-Column Layout */}
                                <div className="hidden lg:block relative h-[550px] overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-50 to-transparent z-10 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none" />

                                    <div className="flex gap-6 h-full justify-center">
                                        <div className="flex-1 max-w-sm overflow-hidden">
                                            <div className="animate-marquee-up">
                                                {displayColumn1.map((testimonial, idx) => (
                                                    <TestimonialCard key={`c1-${idx}`} testimonial={testimonial} />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex-1 max-w-sm overflow-hidden">
                                            <div className="animate-marquee-down">
                                                {displayColumn2.map((testimonial, idx) => (
                                                    <TestimonialCard key={`c2-${idx}`} testimonial={testimonial} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No Testimonials Found</h3>
                                <p className="text-slate-500 max-w-xs mx-auto">
                                    Our community is growing. Check back soon to see what others have to say about us!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Marquee Animation Styles */}
            <style jsx global>{`
                @keyframes marquee-up {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(-50%);
                    }
                }
                
                @keyframes marquee-down {
                    0% {
                        transform: translateY(-50%);
                    }
                    100% {
                        transform: translateY(0);
                    }
                }
                
                @keyframes marquee-left {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                .animate-marquee-up {
                    animation: marquee-up 30s linear infinite;
                }
                
                .animate-marquee-down {
                    animation: marquee-down 30s linear infinite;
                }
                
                .animate-marquee-left {
                    animation: marquee-left 25s linear infinite;
                }
                
                .animate-marquee-up:hover,
                .animate-marquee-down:hover,
                .animate-marquee-left:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default TestimonialsSection;
