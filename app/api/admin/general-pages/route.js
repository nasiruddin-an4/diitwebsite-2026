import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'about', 'contact', 'faq'

    if (!type || !['about', 'contact', 'faq'].includes(type)) {
        return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("diit_admin");

        const data = await db.collection("general_pages").findOne({ _id: type });

        return NextResponse.json({
            success: true,
            data: data || {}
        });
    } catch (error) {
        console.error("Failed to fetch general page data:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type || !['about', 'contact', 'faq'].includes(type)) {
        return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
    }

    try {
        const body = await request.json();
        const client = await clientPromise;
        const db = client.db("diit_admin");

        // Remove _id from body if present to avoid immutable field error
        const { _id, ...updateData } = body;

        await db.collection("general_pages").updateOne(
            { _id: type },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        return NextResponse.json({ success: true, message: `${type} updated successfully` });
    } catch (error) {
        console.error("Failed to update general page data:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
