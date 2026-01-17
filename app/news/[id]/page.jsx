import React from "react";
import { notFound } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import ArticleView from "./ArticleView";

// Helper to fetch single news item
async function getNewsItem(id) {
    const client = await clientPromise;
    const db = client.db("diit_admin");

    let query = {};
    if (ObjectId.isValid(id)) {
        query = { _id: new ObjectId(id) };
    } else {
        // Try parsing as int for legacy IDs, otherwise use string
        const numId = parseInt(id);
        query = { id: isNaN(numId) ? id : numId };
    }

    const item = await db.collection("news_events").findOne(query);
    if (!item) return null;

    // Serialize _id
    return { ...item, _id: item._id.toString(), id: item.id || item._id.toString() };
}

// Helper to fetch recent news
async function getRecentNews(excludeId) {
    const client = await clientPromise;
    const db = client.db("diit_admin");

    let query = {};
    if (excludeId) {
        if (ObjectId.isValid(excludeId)) {
            query = { _id: { $ne: new ObjectId(excludeId) } };
        } else {
            const numId = parseInt(excludeId);
            query = { id: { $ne: isNaN(numId) ? excludeId : numId } };
        }
    }

    const items = await db.collection("news_events")
        .find(query)
        .sort({ date: -1, createdAt: -1 })
        .limit(5)
        .toArray();

    return items.map(item => ({
        ...item,
        _id: item._id.toString(),
        id: item.id || item._id.toString()
    }));
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const newsItem = await getNewsItem(id);

    if (!newsItem) {
        return {
            title: "News Not Found - DIIT",
        };
    }

    return {
        title: `${newsItem.title} - DIIT News`,
        description: newsItem.excerpt || newsItem.desc,
    };
}

export default async function NewsDetailsPage({ params }) {
    const { id } = await params;
    const newsItem = await getNewsItem(id);

    if (!newsItem) {
        notFound();
    }

    const recentNews = await getRecentNews(id);

    return <ArticleView newsItem={newsItem} recentNews={recentNews} />;
}
