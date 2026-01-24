import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Search configuration for different collections
const SEARCH_SOURCES = [
    {
        collection: "programsPage",
        docId: "programs",
        type: "program",
        dataPath: "programsData",
        fields: ["title", "shortName", "description", "highlights"],
        pathPrefix: "/programs/",
        idField: "id",
        titleField: "title",
        descriptionField: "description",
        icon: "📚"
    },
    {
        collection: "news_events",
        type: "news",
        isMultiDoc: true,
        fields: ["title", "excerpt", "content", "category"],
        pathPrefix: "/news/",
        idField: "_id",
        titleField: "title",
        descriptionField: "excerpt",
        icon: "📰"
    },
    {
        collection: "faculty",
        type: "faculty",
        isMultiDoc: true,
        fields: ["name", "designation", "department", "specialization"],
        pathPrefix: "/faculty#",
        idField: "_id",
        titleField: "name",
        descriptionField: "designation",
        icon: "👨‍🏫"
    },
    {
        collection: "notices",
        type: "notice",
        isMultiDoc: true,
        fields: ["title", "description", "category"],
        pathPrefix: "/notices#",
        idField: "_id",
        titleField: "title",
        descriptionField: "description",
        icon: "📢"
    },
    {
        collection: "general_pages",
        docId: "faq",
        type: "faq",
        dataPath: "faqs",
        fields: ["question", "answer"],
        pathPrefix: "/faq#",
        idField: "id",
        titleField: "question",
        descriptionField: "answer",
        icon: "❓"
    },
    {
        collection: "campusActivities",
        docId: "activities",
        type: "activity",
        dataPath: "activities",
        fields: ["title", "description", "category"],
        pathPrefix: "/campus-activities#",
        idField: "id",
        titleField: "title",
        descriptionField: "description",
        icon: "🎭"
    },
    {
        collection: "careerPage",
        docId: "career",
        type: "career",
        dataPath: "positions",
        fields: ["title", "department", "description", "requirements"],
        pathPrefix: "/career#",
        idField: "id",
        titleField: "title",
        descriptionField: "department",
        icon: "💼"
    }
];

// Static pages for search
const STATIC_PAGES = [
    { title: "Home", path: "/", description: "DIIT - Daffodil Institute of IT", type: "page", icon: "🏠" },
    { title: "About Us", path: "/about", description: "Learn about our institution, mission and vision", type: "page", icon: "ℹ️" },
    { title: "Admissions", path: "/admissionEligibility", description: "Admission eligibility and requirements", type: "page", icon: "📝" },
    { title: "Online Admission", path: "/admission/online", description: "Apply for admission online", type: "page", icon: "💻" },
    { title: "Tuition Fees", path: "/admission/fees", description: "Fee structure and payment information", type: "page", icon: "💰" },
    { title: "Scholarships & Waivers", path: "/admission/scholarships", description: "Available scholarships and fee waivers", type: "page", icon: "🎓" },
    { title: "Campus Facilities", path: "/campus/facilities", description: "Campus facilities and amenities", type: "page", icon: "🏢" },
    { title: "Programs", path: "/programs", description: "All academic programs offered", type: "page", icon: "📚" },
    { title: "Faculty Members", path: "/faculty", description: "Our faculty and teaching staff", type: "page", icon: "👨‍🏫" },
    { title: "Administrative Staff", path: "/administrative", description: "Administrative team", type: "page", icon: "👔" },
    { title: "Alumni", path: "/alumni", description: "DIIT alumni network", type: "page", icon: "🎓" },
    { title: "News & Events", path: "/news", description: "Latest news and upcoming events", type: "page", icon: "📰" },
    { title: "Campus Activities", path: "/campus-activities", description: "Campus activities and student life", type: "page", icon: "🎭" },
    { title: "Notices", path: "/notices", description: "Official notices and announcements", type: "page", icon: "📢" },
    { title: "Academic Calendar", path: "/academics/calendar", description: "Academic calendar and schedule", type: "page", icon: "📅" },
    { title: "Career", path: "/career", description: "Job opportunities at DIIT", type: "page", icon: "💼" },
    { title: "Contact Us", path: "/contact", description: "Get in touch with us", type: "page", icon: "📞" },
    { title: "FAQ", path: "/faq", description: "Frequently asked questions", type: "page", icon: "❓" },
    { title: "Privacy Policy", path: "/privacy", description: "Privacy policy information", type: "page", icon: "🔒" },
    { title: "Terms of Service", path: "/terms", description: "Terms and conditions", type: "page", icon: "📜" },
];

function highlightMatch(text, query) {
    if (!text || !query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '**$1**');
}

function getMatchScore(item, query, fields) {
    const lowerQuery = query.toLowerCase();
    let score = 0;

    for (const field of fields) {
        const value = getNestedValue(item, field);
        if (!value) continue;

        const lowerValue = String(value).toLowerCase();

        // Exact match in title gets highest score
        if (field === 'title' || field === 'name' || field === 'question') {
            if (lowerValue === lowerQuery) score += 100;
            else if (lowerValue.startsWith(lowerQuery)) score += 50;
            else if (lowerValue.includes(lowerQuery)) score += 25;
        } else {
            if (lowerValue.includes(lowerQuery)) score += 10;
        }
    }

    return score;
}

function getNestedValue(obj, path) {
    if (!path.includes('.')) return obj[path];
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function truncateText(text, maxLength = 120) {
    if (!text) return "";
    const str = String(text);
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + "...";
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.length < 2) {
        return NextResponse.json({
            success: true,
            results: [],
            message: "Query must be at least 2 characters"
        });
    }

    const lowerQuery = query.toLowerCase();
    let allResults = [];

    try {
        // 1. Search static pages first
        const staticResults = STATIC_PAGES.filter(page =>
            page.title.toLowerCase().includes(lowerQuery) ||
            page.description.toLowerCase().includes(lowerQuery)
        ).map(page => ({
            title: page.title,
            description: truncateText(page.description),
            path: page.path,
            type: page.type,
            icon: page.icon,
            score: page.title.toLowerCase().includes(lowerQuery) ? 50 : 10
        }));

        allResults.push(...staticResults);

        // 2. Search database collections
        const client = await clientPromise;
        const db = client.db("diit_admin");

        for (const source of SEARCH_SOURCES) {
            try {
                let items = [];

                if (source.isMultiDoc) {
                    // This collection has multiple documents
                    items = await db.collection(source.collection).find({}).toArray();
                } else if (source.docId) {
                    // Single document with nested array
                    const doc = await db.collection(source.collection).findOne({ _id: source.docId });
                    if (doc && source.dataPath) {
                        items = doc[source.dataPath] || [];
                    }
                }

                // Search through items
                for (const item of items) {
                    let matches = false;

                    for (const field of source.fields) {
                        const value = getNestedValue(item, field);
                        if (value && String(value).toLowerCase().includes(lowerQuery)) {
                            matches = true;
                            break;
                        }

                        // Check if field is an array (like highlights)
                        if (Array.isArray(value)) {
                            for (const v of value) {
                                if (String(v).toLowerCase().includes(lowerQuery)) {
                                    matches = true;
                                    break;
                                }
                            }
                        }
                    }

                    if (matches) {
                        const itemId = item[source.idField] || item._id?.toString() || "";
                        const title = item[source.titleField] || "Untitled";
                        const description = item[source.descriptionField] || "";

                        allResults.push({
                            title: title,
                            description: truncateText(description),
                            path: source.pathPrefix + itemId,
                            type: source.type,
                            icon: source.icon,
                            score: getMatchScore(item, query, source.fields)
                        });
                    }
                }
            } catch (err) {
                console.error(`Search error in ${source.collection}:`, err.message);
                // Continue with other sources
            }
        }

        // Sort by score and limit results
        allResults.sort((a, b) => b.score - a.score);
        const limitedResults = allResults.slice(0, limit);

        return NextResponse.json({
            success: true,
            results: limitedResults,
            total: allResults.length,
            query: query
        });

    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({
            success: false,
            message: error.message,
            results: []
        }, { status: 500 });
    }
}
