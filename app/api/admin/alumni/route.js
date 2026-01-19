import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "diit_admin";
const COLLECTION_NAME = "alumni";

export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const { searchParams } = new URL(request.url);
        const department = searchParams.get('department');

        const query = {};
        if (department && department !== "All") {
            query.department = department;
        }

        const data = await db.collection(COLLECTION_NAME).find(query).toArray();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const body = await request.json();

        // Basic validation
        if (!body.name || !body.department) {
            return NextResponse.json(
                { success: false, message: "Name and Department are required" },
                { status: 400 }
            );
        }

        const result = await db.collection(COLLECTION_NAME).insertOne({
            ...body,
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const body = await request.json();
        const { _id, ...updateData } = body;

        if (!_id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const result = await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(_id) },
            { $set: { ...updateData, updatedAt: new Date() } }
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
