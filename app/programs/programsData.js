import {
    Monitor, Briefcase, Globe, Code, Database, Cpu, Lock, Award, FileText, BarChart, Hotel,
    PieChart, DollarSign, TrendingUp, Users, ShoppingBag, Calendar
} from 'lucide-react';

export const programsData = {
    "cse": {
        id: "cse",
        title: "B.Sc. in Computer Science & Engineering",
        shortName: "CSE",
        department: "Department of CSE",
        heroImage: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2070&auto=format&fit=crop", // Students coding/lab
        description: "A 4-year National University affiliated program designed to shape the next generation of tech innovators, software engineers, and IT leaders.",
        degree: "B.Sc. in CSE",
        duration: "4 Years",
        affiliation: "National University",
        semesters: "8 Semesters",
        credits: "148 Credits",
        headName: "Dr. Md. Shafiul Islam",
        headRole: "Head of Department, CSE",
        headImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
        headMessage: "Our CSE program is designed to bridge the gap between academic theory and industry reality. We focus on cultivating problem-solvers who can adapt to the rapidly evolving tech landscape.",
        overview: [
            "The B.Sc. in Computer Science & Engineering (CSE) program at DIIT offers a robust curriculum that blends theoretical foundations with practical application. As technology continues to reshape our world, this program prepares students to become architects of the digital future.",
            "Students will engage with core topics such as algorithms, data structures, artificial intelligence, and software engineering. The program is designed not only to teach coding but to foster problem-solving skills, critical thinking, and innovation. With access to modern labs and mentorship from experienced faculty, graduates leave ready to tackle real-world challenges in the tech industry."
        ],
        eligibility: [
            "Minimum GPA of 2.5 in both SSC and HSC (or equivalent).",
            "Must have a Science background in HSC with Mathematics/Physics.",
            "HSC passing year must be within the last 3 years as per NU rules.",
            "Polytechnic Diploma holders in Computer/Electronics are also eligible."
        ],
        curriculum: [
            { semester: "1st Semester", subjects: ["Introduction to Computer Systems", "Structured Programming Language", "Physics-I", "English Foundation", "Calculus"] },
            { semester: "2nd Semester", subjects: ["Discrete Mathematics", "Object Oriented Programming", "Physics-II", "Integral Calculus & Differential Equations", "Chemistry"] },
            { semester: "3rd Semester", subjects: ["Data Structures", "Digital Logic Design", "Statistics for Engineers", "Financial Accounting", "Bangladesh Studies"] },
            { semester: "4th Semester", subjects: ["Algorithms", "Database Management Systems", "Computer Architecture", "Numerical Analysis", "Sociology"] },
            { semester: "5th Semester", subjects: ["Software Engineering", "Computer Networks", "Microprocessors & Microcontrollers", "Theory of Computation", "Economics"] },
            { semester: "6th Semester", subjects: ["Operating Systems", "Web Engineering", "Compiler Design", "Artificial Intelligence", "Technical Writing"] },
            { semester: "7th Semester", subjects: ["Computer Graphics", "System Analysis & Design", "Cyber Security", "Project (Phase I)", "Elective I"] },
            { semester: "8th Semester", subjects: ["Machine Learning", "E-Commerce", "Project/Thesis (Phase II)", "Elective II", "Industrial Training"] }
        ],
        careers: [
            { title: "Software Engineer", company: "Google, Microsoft, Pathao", description: "Design and build sophisticated software systems.", icon: Code },
            { title: "Data Scientist", company: "Grameenphone, Robi", description: "Analyze complex data to drive business decisions.", icon: Database },
            { title: "Network Architect", company: "Cisco, Link3", description: "Design secure and scalable network infrastructures.", icon: Globe },
            { title: "Cyber Security Specialist", company: "Banks, Govt. Agencies", description: "Protect systems and data from cyber threats.", icon: Lock },
            { title: "AI/ML Engineer", company: "TigerIT, Brain Station 23", description: "Develop intelligent systems and algorithms.", icon: Cpu },
        ],
        facilities: [
            { name: "Advanced Software Lab", image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2070&auto=format&fit=crop" },
            { name: "Hardware & IoT Lab", image: "https://images.unsplash.com/photo-1581092921461-eab62e97a782?q=80&w=2070&auto=format&fit=crop" },
            { name: "Digital Library", image: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=2015&auto=format&fit=crop" },
            { name: "Research Center", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop" }
        ],
        faculty: [
            { name: "Dr. Md. Shafiul Islam", designation: "Head of Department", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop", specialization: "Artificial Intelligence" },
            { name: "Ms. Farhana Ahmed", designation: "Senior Lecturer", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop", specialization: "Software Engineering" },
            { name: "Mr. Tanvir Hasan", designation: "Assistant Professor", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop", specialization: "Network Security" }
        ],
        stats: [
            { label: "Students Enrolled", value: "800+" },
            { label: "Expert Faculty", value: "25+" },
            { label: "Graduates", value: "1200+" },
            { label: "Employment Rate", value: "96%" }
        ],
        faqs: [
            { question: "Is this degree recognized by the National University?", answer: "Yes, the B.Sc. in Computer Science & Engineering program at DIIT is fully affiliated with the National University of Bangladesh. Graduates receive their degree directly from National University." },
            { question: "What are the job prospects after completing B.Sc. in CSE?", answer: "CSE graduates have high demand in both local and international markets. You can work as a Software Engineer, Web Developer, App Developer, Network Engineer, AI Specialist, or pursue higher studies in prestigious universities." },
            { question: "Does the program include practical lab work?", answer: "Absolutely. We have state-of-the-art computer labs where students practice programming, networking, hardware design, and IoT. The curriculum emphasizes hands-on learning with a 60% practical component." },
            { question: "Are credit transfers available to foreign universities?", answer: "Yes, the credit structure is standard and compatible with many international universities, facilitating credit transfers for higher studies abroad." }
        ],
        resources: [
            { name: "Syllabus Structure", size: "2.4 MB" },
            { name: "Academic Calendar 2026", size: "1.1 MB" },
            { name: "Lab Manual Guidelines", size: "3.5 MB" }
        ]
    },
    "bba": {
        id: "bba",
        title: "Bachelor of Business Administration (BBA)",
        shortName: "BBA",
        department: "Department of Business Admin",
        heroImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop",
        description: "Develop strategic leadership skills and business acumen to thrive in the global corporate landscape with our NU affiliated BBA program.",
        degree: "BBA",
        duration: "4 Years",
        affiliation: "National University",
        semesters: "8 Semesters",
        credits: "124 Credits",
        headName: "Ms. Helena Begum",
        headRole: "Head of Department, BBA",
        headImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
        headMessage: "Our BBA program is built to foster the next generation of business leaders. We emphasize ethical leadership, strategic thinking, and entrepreneurial innovation.",
        overview: [
            "The Bachelor of Business Administration (BBA) program provides a comprehensive understanding of business management, marketing, finance, and human resources. It is designed to prepare students for the complexities of the modern business world.",
            "Through a blend of case studies, presentations, and internships, students gain practical insights into corporate operations. Our curriculum is constantly updated to reflect global business trends."
        ],
        eligibility: [
            "Minimum GPA of 2.5 in both SSC and HSC (or equivalent).",
            "Students from Science, Commerce, and Arts backgrounds are eligible.",
            "HSC passing year must be within the last 3 years as per NU rules."
        ],
        curriculum: [
            { semester: "1st Semester", subjects: ["Introduction to Business", "Business Communication", "Basic Accounting", "Business Mathematics", "Computer Fundamentals"] },
            { semester: "2nd Semester", subjects: ["Principles of Management", "Micro Economics", "Principles of Marketing", "Business Statistics-I", "Viva-Voce"] },
            { semester: "3rd Semester", subjects: ["Business Law", "Macro Economics", "Taxation in Bangladesh", "Business Statistics-II", "Insurance & Risk Mgmt"] },
            { semester: "4th Semester", subjects: ["Advanced Accounting", "Financial Management", "Organizational Behavior", "Auditing", "Production Management"] },
            { semester: "5th Semester", subjects: ["Cost Accounting", "Human Resource Management", "International Business", "Entrepreneurship", "SME Management"] },
            { semester: "6th Semester", subjects: ["Strategic Management", "Supply Chain Management", "Management Information System", "Research Methodology", "Operations Research"] },
            { semester: "7th Semester", subjects: ["Major Course I", "Major Course II", "Major Course III", "Major Course IV", "E-Business"] },
            { semester: "8th Semester", subjects: ["Internship/Project Work", "Viva-Voce", "Defense", "Major Course V", "Major Course VI"] }
        ],
        careers: [
            { title: "HR Manager", company: "Unilever, BAT", description: "Manage organizational talent and culture.", icon: Users },
            { title: "Financial Analyst", company: "Standard Chartered, IDLC", description: "Analyze financial data and market trends.", icon: BarChart },
            { title: "Marketing Executive", company: "Nestle, Marico", description: "Plan and execute marketing strategies.", icon: ShoppingBag },
            { title: "Supply Chain Manager", company: "Square, Beximco", description: "Oversee logistics and operations.", icon: TrendingUp },
            { title: "Entrepreneur", company: "Self-Employed", description: "Start and run your own successful business.", icon: Award },
        ],
        facilities: [
            { name: "Business Incubation Center", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" },
            { name: "Seminar Library", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2128&auto=format&fit=crop" },
            { name: "Conference Room", image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=2074&auto=format&fit=crop" },
            { name: "Digital Classrooms", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" }
        ],
        faculty: [
            { name: "Ms. Helena Begum", designation: "Assistant Professor", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop", specialization: "HRM" },
            { name: "Mr. Rakib Hossain", designation: "Senior Lecturer", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop", specialization: "Finance" },
            { name: "Ms. Sadia Islam", designation: "Lecturer", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop", specialization: "Marketing" }
        ],
        stats: [
            { label: "Students Enrolled", value: "1100+" },
            { label: "Business Partners", value: "40+" },
            { label: "Graduates", value: "2500+" },
            { label: "Placement Rate", value: "94%" }
        ],
        faqs: [
            { question: "Can Arts students apply for BBA?", answer: "Yes, students from Science, Arts, and Commerce backgrounds are all eligible for the BBA program, provided they meet the minimum GPA requirements." },
            { question: "Is there an internship requirement?", answer: "Yes, the program includes a mandatory internship or project work in the final semester to ensure industry exposure." },
            { question: "What major areas are available?", answer: "Students can major in Finance, Marketing, Human Resource Management (HRM), or Management depending on their interest and performance." }
        ],
        resources: [
            { name: "BBA Syllabus", size: "1.8 MB" },
            { name: "Internship Guidelines", size: "0.9 MB" },
            { name: "Project Template", size: "1.2 MB" }
        ]
    },
    "bthm": {
        id: "bthm",
        title: "BBA in Tourism & Hospitality Management",
        shortName: "bthm",
        department: "Department of THM",
        heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
        description: "Prepare for a dynamic career in the booming tourism and hospitality industry with practical training and global career opportunities.",
        degree: "BBA in THM",
        duration: "4 Years",
        affiliation: "National University",
        semesters: "8 Semesters",
        credits: "128 Credits",
        headName: "Mr. Ashraful Islam",
        headRole: "Head of Department, THM",
        headImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        headMessage: "The hospitality industry is about creating experiences. We train our students to be excellent hosts and efficient managers, ready for the global stage.",
        overview: [
            "This specialized program focuses on the management of travel, tourism, hospitality, and event management. It combines business principles with industry-specific skills.",
            "Students benefit from partnerships with top hotels and resorts, gaining hands-on experience through internships and industrial visits."
        ],
        eligibility: [
            "Minimum GPA of 2.5 in both SSC and HSC (or equivalent).",
            "Open to students from any background (Science/Arts/Commerce).",
            "Standard NU admission rules apply."
        ],
        curriculum: [
            { semester: "1st Semester", subjects: ["Intro to Hospitality", "Business English", "Computer App in THM", "Tourism Economics", "Basic Accounting"] },
            { semester: "2nd Semester", subjects: ["Food & Beverage Service", "Front Office Ops", "Tourism Geography", "Business Stats", "French Language I"] },
            { semester: "3rd Semester", subjects: ["Housekeeping Mgmt", "Travel Agency Ops", "Cost Accounting", "Events Management", "French Language II"] },
            { semester: "4th Semester", subjects: ["Tourism Marketing", "HRM in Hospitality", "Aviation Management", "Resort Management", "Customer Service"] },
            { semester: "5th Semester", subjects: ["Financial Management", "Legal Aspects of Tourism", "Eco-Tourism", "Sustainable Tourism", "Strategic Management"] },
            { semester: "6th Semester", subjects: ["Culinary Arts", "Hospitality Law", "Entrepreneurship in THM", "Research Methods", "E-Tourism"] },
            { semester: "7th Semester", subjects: ["Industrial Attachment I", "Project Work I", "Seminar on Tourism", "Cultural Tourism", "Business Comm II"] },
            { semester: "8th Semester", subjects: ["Industrial Attachment II", "Final Thesis/Project", "Viva Voce", "Career Planning", "Internship Report"] }
        ],
        careers: [
            { title: "Hotel Manager", company: "Radisson, Westin", description: "Oversee hotel operations and guest satisfaction.", icon: Hotel },
            { title: "Travel Consultant", company: "Booking.com, Agoda", description: "Advise clients on travel arrangements.", icon: Globe },
            { title: "Event Planner", company: "Large Corporations", description: "Organize conferences, weddings, and events.", icon: Calendar },
            { title: "Resort Manager", company: "Grand Sultan, Cox's Bazar", description: "Manage resort facilities and staff.", icon: Hotel },
            { title: "Airline Executive", company: "Biman, US-Bangla", description: "Manage ground handling or customer service.", icon: Monitor },
        ],
        facilities: [
            { name: "Mock Hotel Room", image: "https://images.unsplash.com/photo-1590490360182-f33db0930386?q=80&w=2074&auto=format&fit=crop" },
            { name: "Food & Beverage Lab", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop" },
            { name: "Front DESK Lab", image: "https://images.unsplash.com/photo-1563911302283-d2bc129e7c1f?q=80&w=2070&auto=format&fit=crop" },
            { name: "Culinary Kitchen", image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop" }
        ],
        faculty: [
            { name: "Mr. Ashraful Islam", designation: "Associate Professor", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", specialization: "Hotel Mgmt" },
            { name: "Ms. Nusrat Jahan", designation: "Lecturer", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop", specialization: "Tourism Marketing" },
            { name: "Mr. Peter Gomes", designation: "Chef Instructor", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=200&auto=format&fit=crop", specialization: "Culinary Arts" }
        ],
        stats: [
            { label: "Students Enrolled", value: "500+" },
            { label: "Partner Hotels", value: "30+" },
            { label: "Graduates", value: "900+" },
            { label: "Placement Rate", value: "98%" }
        ],
        faqs: [
            { question: "Is this degree recognized globally?", answer: "Yes, hospitality degrees are highly transferable skills-wise, and our curriculum meets international standards." },
            { question: "Do I need to know cooking?", answer: "Basic culinary knowledge is part of the course (Food & Beverage), but you don't need to be a chef unless you specialize in that area." },
            { question: "What is the dress code?", answer: "THM students are expected to wear formal attire or uniforms on specific days to mimic professional hotel standards." }
        ],
        resources: [
            { name: "THM Brochure", size: "3.2 MB" },
            { name: "Internship Manual", size: "1.5 MB" },
            { name: "Grooming Guidelines", size: "0.5 MB" }
        ]
    },
    // New Entries for MBA and MTHM
    "mba": {
        id: "mba",
        title: "Master of Business Administration (MBA)",
        shortName: "MBA",
        department: "Department of Business Admin",
        heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
        description: "Accelerate your career with our Professional MBA program designed for future corporate leaders and entrepreneurs.",
        degree: "MBA",
        duration: "1 or 2 Years",
        affiliation: "National University",
        semesters: "2 or 4 Semesters",
        credits: "60 Credits",
        headName: "Ms. Helena Begum",
        headRole: "Head of Department, MBA",
        headImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
        headMessage: "Our MBA program focuses on advanced management strategies and decision-making skills required for top-tier corporate positions.",
        overview: [
            "The MBA program is tailored for graduates and professionals seeking to advance their careers. It covers advanced topics in finance, marketing, and leadership.",
            "Choose between a 1-year (for BBA holders) or 2-year track to suit your academic background."
        ],
        eligibility: [
            "Bachelor's degree from any recognized university.",
            "Minimum CGPA of 2.50 or 2nd Class.",
            "Working professionals are encouraged to apply."
        ],
        curriculum: [
            { semester: "Semester 1", subjects: ["Management & Org Behavior", "Managerial Economics", "Marketing Management", "Financial Management"] },
            { semester: "Semester 2", subjects: ["Human Resource Management", "Operations Management", "Business Research Methods", "Strategic Management"] },
            { semester: "Semester 3 (Concentration)", subjects: ["Advanced Corp Finance", "Investment Analysis", "Consumer Behavior", "Brand Management"] },
            { semester: "Semester 4", subjects: ["International Business", "Thesis/Project", "Viva Voce", "Internship"] }
        ],
        careers: [
            { title: "Corporate Manager", company: "Multinationals", description: "Lead departments and drive business growth.", icon: Briefcase },
            { title: "Business Consultant", company: "Consulting Firms", description: "Advise companies on efficiency and strategy.", icon: BarChart },
            { title: "Brand Manager", company: "FMCG Companies", description: "Manage product lines and brand strategy.", icon: ShoppingBag },
            { title: "Investment Banker", company: "Financial Inst.", description: "Manage portfolios and corporate assets.", icon: DollarSign },
        ],
        facilities: [
            { name: "Executive Lounge", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" },
            { name: "Case Study Room", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop" },
            { name: "Digital Library Access", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" }
        ],
        faculty: [
            { name: "Dr. Anisur Rahman", designation: "Professor", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop", specialization: "Strategic Mgmt" },
            { name: "Ms. Helena Begum", designation: "Assistant Professor", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop", specialization: "HRM" }
        ],
        stats: [
            { label: "Graduates", value: "1500+" },
            { label: "Avg Salary Rise", value: "40%" },
            { label: "Executive Partners", value: "25+" }
        ],
        faqs: [
            { question: "Is this an Executive MBA?", answer: "We offer both Regular and Professional/Executive MBA tracks depending on your work experience." },
            { question: "Are classes held in the evening?", answer: "Yes, to accommodate working professionals, MBA classes are primarily scheduled in the evenings and weekends." }
        ],
        resources: [
            { name: "MBA Application Form", size: "0.5 MB" },
            { name: "Thesis Guidelines", size: "1.0 MB" }
        ]
    },
    "mthm": {
        id: "mthm",
        title: "MBA in Tourism & Hospitality Management",
        shortName: "MTHM",
        department: "Department of THM",
        heroImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
        description: "Specialized master's program for leadership roles in the global hospitality and tourism sector.",
        degree: "MBA in THM",
        duration: "1 or 2 Years",
        affiliation: "National University",
        semesters: "2 or 4 Semesters",
        credits: "60 Credits",
        headName: "Mr. Ashraful Islam",
        headRole: "Head of Department, THM",
        headImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        headMessage: "Our MTHM program is designed for future leaders of the tourism industry, focusing on sustainable tourism and advanced hospitality management.",
        overview: [
            "The Master of Business Administration in Tourism & Hospitality Management (MTHM) is a postgraduate degree designed to groom students for senior management positions.",
            "The curriculum covers advanced concepts in tourism planning, destination management, and hospitality operations."
        ],
        eligibility: [
            "Bachelor's degree in any discipline.",
            "Graduates with BBA in THM can complete the program in 1 year."
        ],
        curriculum: [
            { semester: "Semester 1", subjects: ["Adv Hospitality Mgmt", "Tourism Policy & Planning", "Service Quality Mgmt", "Tourism Economics"] },
            { semester: "Semester 2", subjects: ["Destination Management", "Hospitality Marketing", "Event Management", "Research Methodology"] },
            { semester: "Semester 3", subjects: ["Sustainable Tourism", "Strategic Mgmt in THM", "Legal Aspects of Hospitality", "International Tourism"] },
            { semester: "Semester 4", subjects: ["Thesis/Project", "Internship", "Viva Voce", "Industrial Tour"] }
        ],
        careers: [
            { title: "General Manager", company: "Luxury Hotels", description: "Top-level management of hotel properties.", icon: Hotel },
            { title: "Tourism Consultant", company: "Govt. & Private", description: "Develop tourism strategies and policies.", icon: Globe },
            { title: "Destination Manager", company: "DMOs", description: "Promote and manage tourist destinations.", icon: Monitor }
        ],
        facilities: [
            { name: "Research Lab", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" },
            { name: "Digital Classroom", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" }
        ],
        faculty: [
            { name: "Mr. Ashraful Islam", designation: "Associate Professor", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", specialization: "Tourism Policy" },
            { name: "Ms. Nusrat Jahan", designation: "Lecturer", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop", specialization: "Marketing" }
        ],
        stats: [
            { label: "Elite Graduates", value: "300+" },
            { label: "Global Partners", value: "15+" }
        ],
        faqs: [
            { question: "Is prior experience required?", answer: "While not mandatory, work experience in the hospitality sector is beneficial." }
        ],
        resources: [
            { name: "MTHM Syllabus", size: "1.0 MB" }
        ]
    }
};
