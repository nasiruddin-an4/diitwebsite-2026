import React from "react";
import { notFound } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import ArticleView from "./ArticleView";

// Generate URL-friendly slug from title
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s.]+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Get a unique slug
async function getUniqueSlug(db, title, excludeId = null) {
    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const query = { slug };
        if (excludeId) {
            query._id = { $ne: new ObjectId(excludeId) };
        }
        const existing = await db.collection("news_events").findOne(query);
        if (!existing) break;
        counter++;
        slug = `${baseSlug}-${counter}`;
    }

    return slug;
}

// Helper to fetch single news item by slug
async function getNewsItem(slug) {
    const client = await clientPromise;
    const db = client.db("diit_admin");

    // Try finding by slug first
    let item = await db.collection("news_events").findOne({ slug });

    // Fallback: if not found by slug, check if it's an ObjectId (for backward compat)
    if (!item && ObjectId.isValid(slug)) {
        item = await db.collection("news_events").findOne({ _id: new ObjectId(slug) });
        // Backfill slug if found by ID
        if (item && !item.slug && item.title) {
            const newSlug = await getUniqueSlug(db, item.title, item._id.toString());
            await db.collection("news_events").updateOne(
                { _id: item._id },
                { $set: { slug: newSlug } }
            );
            item.slug = newSlug;
        }
    }

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

    // Backfill slugs for recent news items
    for (const item of items) {
        if (!item.slug && item.title) {
            const slug = await getUniqueSlug(db, item.title, item._id.toString());
            await db.collection("news_events").updateOne(
                { _id: item._id },
                { $set: { slug } }
            );
            item.slug = slug;
        }
    }

    return items.map(item => ({
        ...item,
        _id: item._id.toString(),
        id: item.id || item._id.toString()
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const newsItem = await getNewsItem(slug);

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
    const { slug } = await params;
    const newsItem = await getNewsItem(slug);

    if (!newsItem) {
        notFound();
    }

    const recentNews = await getRecentNews(newsItem._id);

    return <ArticleView newsItem={newsItem} recentNews={recentNews} />;
}
