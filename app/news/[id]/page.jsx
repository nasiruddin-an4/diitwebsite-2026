import React from "react";
import { notFound } from "next/navigation";
import HomePageData from "@/public/Data/HomePage.json";
import ArticleView from "./ArticleView";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const newsItem = HomePageData.newsEvents.find((n) => n.id === parseInt(id));

    if (!newsItem) {
        return {
            title: "News Not Found - DIIT",
        };
    }

    return {
        title: `${newsItem.title} - DIIT News`,
        description: newsItem.excerpt,
    };
}

export default async function NewsDetailsPage({ params }) {
    const { id } = await params;
    const newsId = parseInt(id);
    const newsItem = HomePageData.newsEvents.find((n) => n.id === newsId);

    if (!newsItem) {
        notFound();
    }

    return <ArticleView newsId={newsId} />;
}
