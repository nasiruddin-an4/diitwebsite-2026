import React from "react";
import clientPromise from "@/lib/mongodb";
import NewsFeed from "./NewsFeed";

export const metadata = {
    title: "News & Events - DIIT",
    description: "Stay updated with the latest happenings, academic achievements, and upcoming events at DIIT.",
};

export default async function NewsPage() {
    const client = await clientPromise;
    const db = client.db("diit_admin");

    // Fetch all news/events sorted by date (newest first)
    const newsData = await db.collection("news_events")
        .find({})
        .sort({ date: -1, createdAt: -1 })
        .toArray();

    const newsEvents = newsData.map(n => ({
        ...n,
        _id: n._id.toString(),
        id: n.id || n._id.toString()
    }));

    return <NewsFeed initialNews={newsEvents} />;
}
