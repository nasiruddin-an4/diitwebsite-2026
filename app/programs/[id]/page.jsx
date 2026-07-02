import React from "react";
import ProgramPageClient from "./ProgramPageClient";
import { getData } from "@/lib/data-service";

const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
};

export async function generateMetadata({ params }) {
    const { id } = await params;
    
    // Fetch programs data on the server
    const data = await getData("ProgramsData");
    let program = null;

    if (data && data.programsData) {
        let programs = [];
        if (Array.isArray(data.programsData)) {
            programs = data.programsData;
        } else {
            programs = Object.values(data.programsData);
        }

        program = programs.find(
            (p) =>
                String(p.id) === String(id) ||
                p.shortName?.toLowerCase() === String(id).toLowerCase() ||
                p.active_path === String(id)
        );
    }

    if (!program) {
        return {
            title: "Program Not Found - DIIT",
            description: "The requested program could not be found.",
        };
    }

    const title = `${program.title} at DIIT`;
    let description = stripHtml(program.description);
    if (!description && program.overview) {
        if (typeof program.overview === "string") {
            description = stripHtml(program.overview);
        } else if (Array.isArray(program.overview)) {
            description = stripHtml(program.overview[0]);
        }
    }

    // Default fallback
    if (!description) {
        description = `Explore the ${program.title} program at Daffodil International Institute of Technology (DIIT).`;
    }

    // Generate keywords
    const baseKeywords = [
        program.title,
        program.shortName,
        "DIIT",
        "Daffodil International Institute of Technology",
        "Admissions",
        program.degree,
        program.category,
    ];
    const keywords = baseKeywords.filter(Boolean).join(", ");

    return {
        title,
        description: description.substring(0, 160), // Keep within optimal length
        keywords,
        openGraph: {
            title,
            description: description.substring(0, 160),
            url: `https://diit.edu.bd/programs/${id}`,
            images: [
                {
                    url: program.heroImage || program.image || "https://diit.edu.bd/default-og.jpg",
                    width: 1200,
                    height: 630,
                    alt: program.title,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: description.substring(0, 160),
            images: [program.heroImage || program.image || "https://diit.edu.bd/default-og.jpg"],
        },
    };
}

export default async function Page() {
    return <ProgramPageClient />;
}
