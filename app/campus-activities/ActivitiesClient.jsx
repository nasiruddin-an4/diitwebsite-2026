"use client";

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
    Mic2,
    CheckCircle
} from "lucide-react";

// Icon mapping for dynamic icons from JSON
const iconMap = {
    MonitorPlay: MonitorPlay,
    Cpu: Cpu,
    BookOpen: BookOpen,
    Wifi: Wifi,
    Users: Users,
    Mic2: Mic2,
    CheckCircle: CheckCircle,
    Coffee: Coffee,
    Video: Video,
    Shield: Shield,
    Monitor: Monitor
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

export default function ActivitiesClient({ data, upcomingEvents = [] }) {
    // Destructure data safely with defaults
    const {
        header = {},
        intro = {},
        sectionTitles = {},
        facilities = [],
        whyChoose = [],
        clubs = [],
        gallery = [],
        location = {}
    } = data || {};

    const dTitle = (section, defaultText) => sectionTitles[section]?.title || defaultText;
    const dSub = (section, defaultText) => sectionTitles[section]?.subtitle || defaultText;

    const headerTitle = header.title || "DIIT Campus Life & Facilities";
    const headerSubtitle = header.subtitle || "A safe, modern, and student-friendly learning environment.";
    const headerBg = header.bgImage || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";

    return (
        <div className="bg-neutral-50 min-h-screen font-sans">
            {/* 1. Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img
                        src={headerBg}
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
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                            {headerTitle}
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-200 mb-8 font-light max-w-2xl mx-auto">
                            {headerSubtitle}
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-300">
                            <span className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                                <MapPin className="w-4 h-4 text-indigo-400" />
                                {location.address || "Dhanmondi, Dhaka"}
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
                            {intro.title || "Welcome to our Campus"}
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {intro.description || "Experience a vibrant ecosystem designed to nurture academic excellence and personal development."}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 3. Campus Facilities */}
            {facilities.length > 0 && (
                <section className="py-20 px-4 bg-slate-50">
                    <div className="max-w-7xl mx-auto">
                        <motion.div className="text-center mb-16" {...fadeInUp}>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{dTitle("facilities", "World-Class Facilities")}</h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                {dSub("facilities", "Equipped with state-of-the-art infrastructure to support your academic journey.")}
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
                                const Icon = iconMap[facility.icon] || Monitor;
                                return (
                                    <motion.div
                                        key={facility.id}
                                        variants={fadeInUp}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col"
                                    >
                                        {facility.image && (
                                            <div className="h-48 w-full overflow-hidden">
                                                <img src={facility.image} alt={facility.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                        )}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{facility.title}</h3>
                                            <p className="text-gray-500 mb-4 text-sm flex-1">{facility.description}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* 4. Why Choose Us (Replaces static Student Life) */}
            {whyChoose.length > 0 && (
                <section className="py-24 px-4 bg-indigo-900 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <motion.div {...fadeInUp} className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">{dTitle("whyChoose", "Why Choose DIIT?")}</h2>
                            <p className="text-indigo-100 text-xl max-w-2xl mx-auto">
                                {dSub("whyChoose", "Discover the unique features that make our campus the perfect place for your growth.")}
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {whyChoose.map((item, idx) => {
                                const Icon = iconMap[item.icon] || CheckCircle;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/15 transition-colors"
                                    >
                                        <Icon className="w-10 h-10 text-pink-400 mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-2">{item.label}</h3>
                                        <p className="text-indigo-200 text-sm">{item.desc}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* 5. Clubs & Activities */}
            {clubs.length > 0 && (
                <section className="py-20 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{dTitle("clubs", "Clubs & Activities")}</h2>
                                <p className="text-gray-500">{dSub("clubs", "Engage, lead, and grow outside the classroom.")}</p>
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
            )}

            {/* 6. Upcoming Events (Dynamic from News & Events) */}
            {upcomingEvents.length > 0 && (
                <section className="py-20 px-4 bg-slate-50">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{dTitle("events", "Upcoming Events & Workshops")}</h2>
                            <p className="text-gray-600">{dSub("events", "Seminars, industry sessions, and cultural programs.")}</p>
                        </div>

                        <div className="space-y-4">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition-shadow">
                                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">{event.category}</div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                        <p className="text-gray-500 text-sm mb-2 line-clamp-2">{event.description || event.excerpt || event.desc}</p>
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-400">
                                            <Calendar className="w-4 h-4" />
                                            {event.date}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <a href={`/news/${event.id}`} className="btn-secondary px-6 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors">
                                            View Details
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <a href="/news" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                                See All Events <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {/* 7. Campus Gallery */}
            {gallery.length > 0 && (
                <section className="py-20 px-4 bg-slate-50">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">{dTitle("gallery", "Life on Campus")}</h2>
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
            )}

            {/* 8. Location & Contact */}
            <section className="py-0 relative h-[500px] w-full">
                <div className="absolute inset-0 flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 h-full bg-gray-200">
                        {location.mapEmbedUrl ? (
                            <iframe
                                src={location.mapEmbedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Campus Location"
                                className=" transition-all duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-200">Map Unavailable</div>
                        )}
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
                                    <p className="text-gray-400">{location.address || "Contact us for location details."}</p>
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
