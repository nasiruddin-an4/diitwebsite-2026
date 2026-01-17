import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("diit_admin");
    const data = await db.collection("testimonials").find({}).sort({ createdAt: -1 }).toArray();
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
    const collection = db.collection("testimonials");

    if (action === "create") {
      const newItem = {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: user.email
      };

      // Remove temp id
      if (newItem.id === "new" || !newItem.id) delete newItem.id;
      if (newItem._id) delete newItem._id; // Ensure no _id is passed for creation

      const result = await collection.insertOne(newItem);

      return NextResponse.json({
        success: true,
        message: "Testimonial created",
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

      return NextResponse.json({ success: true, message: "Testimonial updated" });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Testimonials API Error:", error);
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
    const collection = db.collection("testimonials");

    let query = {};
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id: id };
    }

    await collection.deleteOne(query);

    return NextResponse.json({ success: true, message: "Testimonial deleted" });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
