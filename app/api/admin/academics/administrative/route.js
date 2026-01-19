import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("diit_admin");

        // Fetch administrative staff sorted by type and order
        const staff = await db
            .collection("administrative")
            .find({})
            .sort({ type: 1, _id: -1 })
            .toArray();

        return NextResponse.json({ success: true, data: staff });
    } catch (error) {
        console.error("Error fetching administrative staff:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch administrative staff" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const client = await clientPromise;
        const db = client.db("diit_admin");

        const newStaff = {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection("administrative").insertOne(newStaff);

        return NextResponse.json({
            success: true,
            message: "Administrative member created successfully",
            data: { ...newStaff, _id: result.insertedId },
        });
    } catch (error) {
        console.error("Error creating administrative member:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create administrative member" },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const { _id, ...updateData } = await request.json();

        if (!_id) {
            return NextResponse.json(
                { success: false, message: "ID is required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("diit_admin");

        delete updateData._id;

        const result = await db.collection("administrative").updateOne(
            { _id: new ObjectId(_id) },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Member updated successfully",
        });
    } catch (error) {
        console.error("Error updating administrative member:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update member" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID is required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("diit_admin");

        const result = await db.collection("administrative").deleteOne({
            _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Member not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Member deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting administrative member:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete member" },
            { status: 500 }
        );
    }
}
