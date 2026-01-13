"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    MapPin,
    BookOpen,
    Monitor,
    Users,
    Shield,
    Calendar,
    ArrowRight,
    Wifi,
    Video,
    Coffee,
    MonitorPlay,
    Cpu,
    Mic2
} from "lucide-react";

// Icon mapping for dynamic icons from JSON
const iconMap = {
    MonitorPlay: MonitorPlay,
    Cpu: Cpu,
    BookOpen: BookOpen,
    Wifi: Wifi,
    Users: Users,
    Mic2: Mic2,
};

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ActivitiesClient({ data }) {
    // Destructure data safely
    const { facilities = [], clubs = [], gallery = [], events = [], location = {} } = data || {};

    return (
        <div className="bg-neutral-50 min-h-screen font-sans">

            {/* 1. Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Campus Life"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                            DIIT Campus <br />
                            <span className="text-indigo-400">Life & Facilities</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-200 mb-8 font-light max-w-2xl mx-auto">
                            A safe, modern, and student-friendly learning environment at the National University.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-300">
                            <span className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                                <MapPin className="w-4 h-4 text-indigo-400" />
                                {location.address || "Dhanmondi, Dhaka"}
                            </span>
                            <span className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                                <Shield className="w-4 h-4 text-indigo-400" />
                                NU Affiliated
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. Campus Introduction */}
            <section className="py-20 px-4 bg-white relative">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div {...fadeInUp}>
                        <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-3">Welcome to DIIT</h2>
                        <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-snug">
                            Fostering discipline, innovation, and <br />comprehensive student growth.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Our campus is more than just classrooms. It is a vibrant ecosystem designed to nurture academic excellence and personal development. As a proud affiliate of the National University, we provide a structured yet dynamic environment where students are empowered to explore their potential, engage in modern research, and build lasting professional networks.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 3. Campus Facilities (Grid) */}
            <section className="py-20 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        {...fadeInUp}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">World-Class Facilities</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Equipped with state-of-the-art infrastructure to support your academic journey.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {facilities.map((facility) => {
                            const Icon = iconMap[facility.icon] || monitor;
                            return (
                                <motion.div
                                    key={facility.id}
                                    variants={fadeInUp}
                                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                                >
                                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{facility.title}</h3>
                                    <p className="text-gray-500 mb-4">{facility.description}</p>
                                    <a href={`#${facility.title.replace(/\s+/g, '-').toLowerCase()}`} className="inline-flex items-center text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
                                        Learn more <ArrowRight className="w-4 h-4 ml-1" />
                                    </a>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* 4. Detailed Sections: Library */}
            <section id="digital-library" className="py-20 px-4 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            className="lg:w-1/2"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=1682&q=80"
                                    alt="Library"
                                    className="w-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                                    <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">Academic Resource</span>
                                    <h3 className="text-white text-2xl font-bold">Knowledge Hub</h3>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="lg:w-1/2"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                The Library: <span className="text-indigo-600">Heart of Learning</span>
                            </h2>
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                Our library is a sanctuary for knowledge seekers, providing a quiet and resource-rich environment essential for academic success. It is a cornerstone of our commitment to student excellence, highly valued by guardians and faculty alike.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Extensive collection of physical books & academic journals",
                                    "24/7 Digital Library access for tailored research",
                                    "Dedicated quiet zones for focused study",
                                    "Comfortable reading facilities with modern seating"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-green-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 5. Detailed Sections: Laboratories */}
            <section id="computer-labs" className="py-20 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                        <motion.div
                            className="lg:w-1/2"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1740&q=80"
                                    alt="Computer Lab"
                                    className="w-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-900/90 to-transparent p-8">
                                    <span className="text-indigo-200 text-sm font-semibold uppercase tracking-wider">Practical Learning</span>
                                    <h3 className="text-white text-2xl font-bold">Advanced CSE Labs</h3>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="lg:w-1/2"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Cutting-Edge <span className="text-indigo-600">Laboratories</span>
                            </h2>
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                Designed specifically for our CSE and practical programs, our labs are equipped with the latest hardware and software tools to bridge the gap between theory and industry application.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { title: "High-Performance Rigs", desc: "For coding & rendering" },
                                    { title: "Licensed Software", desc: "Full access to pro tools" },
                                    { title: "Gigabit Internet", desc: "Uninterrupted connectivity" },
                                    { title: "Expert Supervision", desc: "Lab assistants always present" }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="font-bold text-gray-800">{item.title}</h4>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 6. Student Life */}
            <section className="py-24 px-4 bg-indigo-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div {...fadeInUp} className="mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Student Life at DIIT</h2>
                        <p className="text-indigo-100 text-xl max-w-2xl mx-auto">
                            More than just a degree. It's about finding your community, your passion, and your lifelong friends.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {[
                            { title: "Vibrant Community", desc: "Join a diverse network of ambitious students.", icon: Users },
                            { title: "Academic Culture", desc: "Collaborate on projects and peer learning.", icon: BookOpen },
                            { title: "Friendly Environment", desc: "A supportive space where everyone belongs.", icon: Coffee },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/15 transition-colors"
                            >
                                <item.icon className="w-10 h-10 text-pink-400 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-indigo-200">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Clubs & Activities */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Clubs & Activities</h2>
                            <p className="text-gray-500">Engage, lead, and grow outside the classroom.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {clubs.map((club, idx) => (
                            <motion.div
                                key={club.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                            >
                                <img
                                    src={club.image}
                                    alt={club.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-6">
                                    <h3 className="text-white font-bold text-lg mb-1">{club.name}</h3>
                                    <p className="text-gray-300 text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        {club.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. Events Snippet */}
            <section className="py-20 px-4 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events & Workshops</h2>
                        <p className="text-gray-600">Seminars, industry sessions, and cultural programs.</p>
                    </div>

                    <div className="space-y-4">
                        {events.slice(0, 3).map((event) => (
                            <div key={event.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition-shadow">
                                <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">{event.category}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                    <p className="text-gray-500 text-sm mb-2">{event.description}</p>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        {event.date}
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <a href="/events" className="btn-secondary px-6 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors">
                                        View Details
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <a href="/events" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                            See All Events <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </section>

            {/* 9. Safety & Support */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto bg-blue-600 rounded-3xl p-8 md:p-16 text-white text-center shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Safety & Student Support</h2>
                        <p className="text-blue-100 text-lg max-w-3xl mx-auto mb-10">
                            We prioritize the safety and well-being of every student. Our campus is monitored 24/7, with strict anti-harassment policies and dedicated support staff to ensure a secure learning environment.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            {[
                                { icon: Video, label: "24/7 CCTV Monitoring" },
                                { icon: Users, label: "Dedicated Security Staff" },
                                { icon: Shield, label: "Anti-Harassment Policy" },
                                { icon: Coffee, label: "Counseling Support" }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-blue-700/50 p-4 rounded-xl backdrop-blur-sm border border-blue-500/30">
                                    <item.icon className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                                    <span className="text-sm font-semibold text-white">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 10. Campus Gallery */}
            <section className="py-20 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">Life on Campus</h2>
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {gallery.map((img, idx) => (
                            <motion.div
                                key={img.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="break-inside-avoid rounded-2xl overflow-hidden shadow-md group relative"
                            >
                                <img src={img.src} alt={img.alt} className="w-full h-auto transform group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 11. Location & Contact */}
            <section className="py-0 relative h-[500px] w-full">
                <div className="absolute inset-0 flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 h-full bg-gray-200">
                        <iframe
                            src={location.mapEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Campus Location"
                            className="grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                    <div className="w-full md:w-1/2 bg-gray-900 p-10 md:p-20 flex flex-col justify-center text-white">
                        <h2 className="text-3xl font-bold mb-6">Visit Our Campus</h2>
                        <p className="text-gray-400 mb-8 max-w-sm">
                            Experience the energy of DIIT firsthand. We welcome students and guardians to visit us for a campus tour.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-6 h-6 text-indigo-500 mt-1" />
                                <div>
                                    <h4 className="font-bold text-white">Campus Address</h4>
                                    <p className="text-gray-400">{location.address}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Calendar className="w-6 h-6 text-indigo-500 mt-1" />
                                <div>
                                    <h4 className="font-bold text-white">Visiting Hours</h4>
                                    <p className="text-gray-400">Sun - Thu: 9:00 AM - 5:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <button className="mt-10 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold transition-colors w-fit">
                            Get Directions
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
