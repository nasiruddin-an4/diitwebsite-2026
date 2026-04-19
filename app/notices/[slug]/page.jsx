import React from "react";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import NoticeView from "./NoticeView";

async function getNoticeItem(slug) {
    const client = await clientPromise;
    const db = client.db("diit_admin");

    let item = await db.collection("notices").findOne({ slug });

    if (!item && ObjectId.isValid(slug)) {
        item = await db.collection("notices").findOne({ _id: new ObjectId(slug) });
    }

    if (!item) return null;

    return { ...item, _id: item._id.toString(), id: item.id || item._id.toString() };
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const notice = await getNoticeItem(slug);

    if (!notice) {
        return {
            title: "Notice Not Found - DIIT",
        };
    }

    return {
        title: `${notice.title} - DIIT Notice Board`,
        description: notice.description || "Stay informed with the latest official announcements from the DIIT administration.",
    };
}

export default async function NoticeDetailsPage({ params }) {
    const { slug } = await params;
    const notice = await getNoticeItem(slug);

    if (!notice) {
        notFound();
    }

    return <NoticeView initialNotice={notice} />;
}
