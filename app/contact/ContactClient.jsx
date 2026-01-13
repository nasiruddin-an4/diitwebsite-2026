"use client";

import { motion } from "framer-motion";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    MessageSquare,
    Facebook,
    Twitter,
    Linkedin,
    Instagram
} from "lucide-react";

export default function ContactClient() {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 }
    };

    return (
        <div className="bg-neutral-50 min-h-screen font-sans">

            {/* 1. Hero Section */}
            <section className="relative bg-slate-900 py-24 px-4 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                </div>

                <div className="relative max-w-4xl mx-auto text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Get in Touch</h1>
                        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Have questions about admissions, academics, or campus life? We're here to help. Reach out to us through any of the channels below.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. Contact Info Cards */}
            <section className="py-16 px-4 -mt-10 relative z-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: Phone,
                            title: "Call Us",
                            lines: ["+880 2-9116774", "+880 1713-493163"],
                            color: "bg-blue-50 text-blue-600"
                        },
                        {
                            icon: Mail,
                            title: "Email Us",
                            lines: ["info@diit.edu.bd", "admissions@diit.edu.bd"],
                            color: "bg-pink-50 text-pink-600"
                        },
                        {
                            icon: MapPin,
                            title: "Visit Us",
                            lines: ["House #54, Road #4/A", "Dhanmondi, Dhaka-1209"],
                            color: "bg-indigo-50 text-indigo-600"
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 text-center hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                <item.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                            {item.lines.map((line, i) => (
                                <p key={i} className="text-gray-600 font-medium">{line}</p>
                            ))}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 3. Main Content: Form & Map */}
            <section className="py-12 px-4 pb-24">
                <div className="max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col lg:flex-row">

                    {/* Left: Contact Form */}
                    <div className="lg:w-1/2 p-8 md:p-12">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                            <p className="text-gray-500">Fill out the form below and we'll get back to you shortly.</p>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="Doe" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="john@example.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-600">
                                    <option>General Inquiry</option>
                                    <option>Admissions</option>
                                    <option>Academic Programs</option>
                                    <option>Student Support</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                <textarea rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="How can we help you?"></textarea>
                            </div>

                            <button type="button" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                                <Send className="w-5 h-5" /> Send Message
                            </button>
                        </form>
                    </div>

                    {/* Right: Info & Map */}
                    <div className="lg:w-1/2 bg-slate-50 border-l border-gray-100 flex flex-col">
                        {/* Decorative Map Image (or Embed) */}
                        <div className="h-full min-h-[400px] w-full relative">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.848483785162!2d90.37525287602324!3d23.752778888686644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8ada2664e21%3A0x3c872fd17bc11ddb!2sDaffodil%20International%20Professional%20Training%20Institute%20(DIPTI)!5e0!3m2!1sen!2sbd!4v1705000000000!5m2!1sen!2sbd"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        </div>

                        {/* Additional Info Overlay (Bottom) */}
                        <div className="p-8 bg-white border-t border-gray-200">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start gap-4">
                                    <Clock className="w-5 h-5 text-indigo-600 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">Office Hours</h4>
                                        <p className="text-gray-500 text-sm">Sun - Thu: 9:00 AM - 6:00 PM</p>
                                        <p className="text-gray-500 text-sm">Fri: Closed</p>
                                        <p className="text-gray-500 text-sm">Sat: 10:00 AM - 4:00 PM</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                    <p className="font-bold text-gray-900">Follow Us:</p>
                                    <div className="flex gap-3">
                                        {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                                            <a key={i} href="#" className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors">
                                                <Icon className="w-4 h-4" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
}
