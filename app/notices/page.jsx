import React from "react";
import clientPromise from "@/lib/mongodb";
import NoticesFeed from "./NoticesFeed";

export const metadata = {
    title: "Notice Board - DIIT",
    description: "Stay informed with the latest official announcements, exam schedules, and academic updates from the DIIT administration.",
};

export default async function NoticesPage() {
    // Better data load handling directly on the server to prevent deploy/hydration issues
    const client = await clientPromise;
    const db = client.db("diit_admin");

    const noticesData = await db.collection("notices")
        .find({})
        .sort({ pinned: -1, date: -1, createdAt: -1 })
        .toArray();

    // Serialize _id
    const notices = noticesData.map(n => ({
        ...n,
        _id: n._id.toString(),
        id: n.id || n._id.toString(),
        slug: n.slug || ''
    }));

    return <NoticesFeed initialNotices={notices} />;
}
