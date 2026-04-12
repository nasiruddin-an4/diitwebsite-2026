import React from "react";
import clientPromise from "@/lib/mongodb";
import BlogFeed from "./BlogFeed";

export const metadata = {
    title: "Blog - DIIT",
    description: "Insights, stories, and academic perspectives from the DIIT community.",
};

export default async function BlogPage() {
    const client = await clientPromise;
    const db = client.db("diit_admin");

    // Fetch all blog posts sorted by date (newest first)
    const blogsData = await db.collection("news_events")
        .find({ category: "BLOG" })
        .sort({ date: -1, createdAt: -1 })
        .toArray();

    const blogPosts = blogsData.map(b => ({
        ...b,
        _id: b._id.toString(),
        id: b.id || b._id.toString(),
        slug: b.slug || ''
    }));

    return <BlogFeed initialBlogs={blogPosts} />;
}
