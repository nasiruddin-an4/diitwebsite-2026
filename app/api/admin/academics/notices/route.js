import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Helper to revalidate notices-related pages
function revalidateNoticesPages() {
  revalidatePath("/notices");
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("diit_admin");

    // Fetch notices sorted by pinned status and date
    const notices = await db
      .collection("notices")
      .find({})
      .sort({ pinned: -1, createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: notices });
  } catch (error) {
    console.error("Error fetching notices:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch notices" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("diit_admin");

    // Add timestamp
    const newNotice = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("notices").insertOne(newNotice);

    // Revalidate frontend pages
    revalidateNoticesPages();

    return NextResponse.json({
      success: true,
      message: "Notice created successfully",
      data: { ...newNotice, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Error creating notice:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create notice" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { _id, ...updateData } = await request.json();

    if (!_id) {
      return NextResponse.json(
        { success: false, message: "Notice ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("diit_admin");

    // Remove _id from update data
    delete updateData._id;

    const result = await db.collection("notices").updateOne(
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
        { success: false, message: "Notice not found" },
        { status: 404 }
      );
    }

    // Revalidate frontend pages
    revalidateNoticesPages();

    return NextResponse.json({
      success: true,
      message: "Notice updated successfully",
    });
  } catch (error) {
    console.error("Error updating notice:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update notice" },
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
        { success: false, message: "Notice ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("diit_admin");

    const result = await db.collection("notices").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Notice not found" },
        { status: 404 }
      );
    }

    // Revalidate frontend pages
    revalidateNoticesPages();

    return NextResponse.json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notice:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete notice" },
      { status: 500 }
    );
  }
}
