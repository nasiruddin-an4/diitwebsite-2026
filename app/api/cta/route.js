import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

const DOC_ID = "cta_settings";
const COLLECTION = "site_settings";

// Default structure for CTA info
const DEFAULT_CTA_INFO = {
    admissionOpenText: "Admissions Open 2026",
    admissionLastDate: "25th January",
    prospectusUrl: "",
    contactNumber: "+880 1234-567890",
    applyNowUrl: "/admission/online"
};

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("diit_admin");
        const data = await db.collection(COLLECTION).findOne({ _id: DOC_ID });

        if (data) {
            const { _id, ...rest } = data;
            return NextResponse.json({ success: true, data: rest });
        }

        // Return default if not found
        return NextResponse.json({ success: true, data: DEFAULT_CTA_INFO });
    } catch (error) {
        console.error("Error fetching CTA info:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const client = await clientPromise;
        const db = client.db("diit_admin");
        const body = await req.json();

        // Remove _id if present to avoid immutable field errors
        const { _id, ...updateData } = body;

        await db.collection(COLLECTION).updateOne(
            { _id: DOC_ID },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        return NextResponse.json({ success: true, message: "CTA info updated successfully" });
    } catch (error) {
        console.error("Error updating CTA info:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
