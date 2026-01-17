import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("diit_admin");
        const media = await db.collection("media_uploads")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ success: true, data: media });
    } catch (error) {
        console.error("Fetch media error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch media" },
            { status: 500 }
        );
    }
}
