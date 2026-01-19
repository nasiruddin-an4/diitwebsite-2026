import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        const { email, phone, fullName } = data;

        // Basic validation
        if (!email || !phone || !fullName) {
            return NextResponse.json(
                { success: false, message: "Required fields are missing" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("diit_admin");
        const collection = db.collection("online_admissions");

        // Check for uniqueness (by email or phone)
        const existing = await collection.findOne({
            $or: [{ email: email.toLowerCase() }, { phone: phone }]
        });

        if (existing) {
            return NextResponse.json(
                { success: false, message: "An application with this email or phone already exists." },
                { status: 409 }
            );
        }

        // Insert new application
        const result = await collection.insertOne({
            ...data,
            email: email.toLowerCase(),
            createdAt: new Date(),
            status: "pending"
        });

        return NextResponse.json({
            success: true,
            message: "Application submitted successfully!",
            id: result.insertedId
        });
    } catch (error) {
        console.error("Admission submission error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("diit_admin");
        const collection = db.collection("online_admissions");

        const admissions = await collection.find({}).sort({ createdAt: -1 }).toArray();

        return NextResponse.json({
            success: true,
            data: admissions
        });
    } catch (error) {
        console.error("Fetch admissions error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const { ObjectId } = require("mongodb");
        const client = await clientPromise;
        const db = client.db("diit_admin");
        const collection = db.collection("online_admissions");

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Application deleted successfully" });
    } catch (error) {
        console.error("Delete admission error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const { id, status } = await request.json();

        if (!id || !status) {
            return NextResponse.json({ success: false, message: "ID and status are required" }, { status: 400 });
        }

        const { ObjectId } = require("mongodb");
        const client = await clientPromise;
        const db = client.db("diit_admin");
        const collection = db.collection("online_admissions");

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: status } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Status updated successfully" });
    } catch (error) {
        console.error("Update status error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
