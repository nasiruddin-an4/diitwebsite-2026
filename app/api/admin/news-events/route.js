import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { ObjectId } from "mongodb";

// Helper function to revalidate news-related pages
function revalidateNewsPages() {
    revalidatePath("/");           // Homepage shows news
    revalidatePath("/news");       // News listing page
}


export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("diit_admin");
        const data = await db.collection("news_events").find({}).sort({ date: -1, createdAt: -1 }).toArray();
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { action, item, id } = body;

        const client = await clientPromise;
        const db = client.db("diit_admin");
        const collection = db.collection("news_events");

        if (action === "create") {
            const newItem = {
                ...item,
                createdAt: new Date(),
                updatedAt: new Date(),
                updatedBy: user.email
            };

            // Clean up temp ID
            if (newItem.id && !ObjectId.isValid(newItem.id)) delete newItem.id;
            if (newItem._id) delete newItem._id;

            const result = await collection.insertOne(newItem);

            // Revalidate frontend pages
            revalidateNewsPages();

            return NextResponse.json({
                success: true,
                message: "Item created",
                item: { ...newItem, _id: result.insertedId }
            });
        }

        else if (action === "update") {
            const targetId = item._id || item.id || id;
            if (!targetId) return NextResponse.json({ success: false, message: "ID missing" }, { status: 400 });

            const { _id, id: pid, ...updateData } = item;

            let query = {};
            if (ObjectId.isValid(targetId)) {
                query = { _id: new ObjectId(targetId) };
            } else {
                query = { id: targetId };
            }

            await collection.updateOne(
                query,
                {
                    $set: {
                        ...updateData,
                        updatedAt: new Date(),
                        updatedBy: user.email
                    }
                }
            );

            // Revalidate frontend pages
            revalidateNewsPages();

            return NextResponse.json({ success: true, message: "Item updated" });
        }

        return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("News/Events API Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

        const client = await clientPromise;
        const db = client.db("diit_admin");
        const collection = db.collection("news_events");

        let query = {};
        if (ObjectId.isValid(id)) {
            query = { _id: new ObjectId(id) };
        } else {
            query = { id: id }; // Legacy support if needed
        }

        await collection.deleteOne(query);

        // Revalidate frontend pages
        revalidateNewsPages();

        return NextResponse.json({ success: true, message: "Item deleted" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
