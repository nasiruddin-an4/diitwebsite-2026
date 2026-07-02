import React from "react";
import ProgramsOverviewClient from "./ProgramsOverviewClient";

export const metadata = {
    title: "Academic Programs - DIIT",
    description: "Explore undergraduate and postgraduate academic programs at Daffodil International Institute of Technology (DIIT). Build a strong foundation for your future career with our NU Affiliated programs.",
    keywords: "Academic Programs, DIIT, Undergraduate, Postgraduate, BBA, CSE, MBA, BTHM, MTHM, National University Affiliated, Daffodil International Institute of Technology",
    openGraph: {
        title: "Academic Programs - DIIT",
        description: "Explore undergraduate and postgraduate academic programs at Daffodil International Institute of Technology (DIIT). Build a strong foundation for your future career with our NU Affiliated programs.",
        url: "https://diit.edu.bd/programs",
        images: [
            {
                url: "https://diit.edu.bd/default-og.jpg",
                width: 1200,
                height: 630,
                alt: "DIIT Academic Programs",
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Academic Programs - DIIT",
        description: "Explore undergraduate and postgraduate academic programs at Daffodil International Institute of Technology (DIIT).",
    },
};

export default function Page() {
    return <ProgramsOverviewClient />;
}
