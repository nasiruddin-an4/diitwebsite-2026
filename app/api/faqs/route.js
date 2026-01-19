import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("diit_admin");
        const faqs = await db.collection("faqs").find({}).toArray();
        return NextResponse.json({ success: true, data: faqs });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const client = await clientPromise;
        const db = client.db("diit_admin");
        const body = await req.json();

        // items should have question, answer, category
        const result = await db.collection("faqs").insertOne({
            ...body,
            createdAt: new Date()
        });

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const client = await clientPromise;
        const db = client.db("diit_admin");
        const body = await req.json();
        const { _id, ...updateData } = body;

        if (!_id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        const result = await db.collection("faqs").updateOne(
            { _id: new ObjectId(_id) },
            { $set: { ...updateData, updatedAt: new Date() } }
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("diit_admin");

        const result = await db.collection("faqs").deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
