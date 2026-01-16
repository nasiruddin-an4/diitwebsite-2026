import React from "react";
import { notFound } from "next/navigation";
import { getData } from "@/lib/data-service";
import ArticleView from "./ArticleView";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const homeData = await getData("HomePage");
    const newsItem = homeData?.newsEvents?.find((n) => n.id === parseInt(id));

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
    const homeData = await getData("HomePage");
    const newsItem = homeData?.newsEvents?.find((n) => n.id === newsId);

    if (!newsItem) {
        notFound();
    }

    return <ArticleView newsId={newsId} initialData={newsItem} />;
}
