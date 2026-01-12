import Link from "next/link";

const quickLinks = [
    { label: "About DIIT", href: "/about" },
    { label: "Undergraduate Programs", href: "/programs/undergraduate" },
    { label: "Postgraduate Programs", href: "/programs/postgraduate" },
    { label: "Faculty Members", href: "/academics/faculty" },
    { label: "Academic Calendar", href: "/academics/calendar" },
];

const admissionLinks = [
    { label: "Admission Overview", href: "/admissions/overview" },
    { label: "How to Apply", href: "/admissions/how-to-apply" },
    { label: "Tuition Fees", href: "/admissions/tuition-fees" },
    { label: "Scholarships", href: "/admissions/scholarships" },
    { label: "Programs & Eligibility", href: "/admissions/eligibility" },
];

const campusLinks = [
    { label: "Campus Overview", href: "/campus/overview" },
    { label: "Facilities", href: "/campus/facilities" },
    { label: "Labs", href: "/campus/labs" },
    { label: "Library", href: "/campus/library" },
    { label: "Student Life", href: "/campus/student-life" },
];

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Institution Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center mb-6">
                            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                DIIT
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Dhaka International Institute of Technology (DIIT) is committed to providing quality education
                            and fostering innovation in technology and engineering disciplines.
                        </p>
                        {/* Affiliation Badge */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Affiliated With</p>
                            <p className="text-sm font-semibold text-cyan-400">National University, Bangladesh</p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 flex items-center">
                            <span className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 mr-3"></span>
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-200 flex items-center group"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2 text-gray-600 group-hover:text-cyan-500 transition-colors"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Admissions */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 flex items-center">
                            <span className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 mr-3"></span>
                            Admissions
                        </h3>
                        <ul className="space-y-3">
                            {admissionLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-200 flex items-center group"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2 text-gray-600 group-hover:text-cyan-500 transition-colors"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6 flex items-center">
                            <span className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 mr-3"></span>
                            Contact Us
                        </h3>
                        <div className="space-y-4">
                            {/* Address */}
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        House #54, Road #4/A, Dhanmondi
                                        <br />
                                        Dhaka-1209, Bangladesh
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">+880 2-9116774</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">info@diit.edu.bd</p>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="flex items-center space-x-3 pt-4">
                                <a
                                    href="#"
                                    className="w-10 h-10 bg-white/5 hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-500 rounded-lg flex items-center justify-center transition-all duration-300 group"
                                >
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 bg-white/5 hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-500 rounded-lg flex items-center justify-center transition-all duration-300 group"
                                >
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 bg-white/5 hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-500 rounded-lg flex items-center justify-center transition-all duration-300 group"
                                >
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 bg-white/5 hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-500 rounded-lg flex items-center justify-center transition-all duration-300 group"
                                >
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554v-11.452h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zm-15.11-13.019c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019h-3.564v-11.452h3.564v11.452zm15.106-20.452h-20.454c-.979 0-1.771.774-1.771 1.729v20.542c0 .956.792 1.729 1.771 1.729h20.451c.978 0 1.778-.773 1.778-1.729v-20.542c0-.955-.8-1.729-1.778-1.729z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} Dhaka International Institute of Technology. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6">
                            <Link href="/privacy" className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/sitemap" className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">
                                Sitemap
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
