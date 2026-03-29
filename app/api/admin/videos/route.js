import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "diit_admin";
const COLLECTION_NAME = "video_gallery";

// Helper function to revalidate video gallery pages
function revalidateVideoPages() {
  revalidatePath("/video-gallery");
}

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const query = {};
    if (category && category !== "All") {
      query.category = category;
    }

    const data = await db
      .collection(COLLECTION_NAME)
      .find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .toArray();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.videoUrl) {
      return NextResponse.json(
        { success: false, message: "Title and Video URL are required" },
        { status: 400 },
      );
    }

    // Auto-assign sortOrder if not provided
    if (body.sortOrder === undefined || body.sortOrder === null) {
      const maxDoc = await db
        .collection(COLLECTION_NAME)
        .find()
        .sort({ sortOrder: -1 })
        .limit(1)
        .toArray();
      body.sortOrder =
        maxDoc.length > 0 && maxDoc[0].sortOrder !== undefined
          ? maxDoc[0].sortOrder + 1
          : 0;
    }

    const result = await db.collection(COLLECTION_NAME).insertOne({
      ...body,
      sortOrder: body.sortOrder,
      createdAt: new Date(),
    });

    // Revalidate video gallery pages
    revalidateVideoPages();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 },
      );
    }

    const result = await db
      .collection(COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...updateData, updatedAt: new Date() } },
      );

    // Revalidate video gallery pages
    revalidateVideoPages();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 },
      );
    }

    const result = await db
      .collection(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });

    // Revalidate video gallery pages
    revalidateVideoPages();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// PATCH - Bulk update sort order
export async function PATCH(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const body = await request.json();
    const { sortUpdates } = body; // Array of { _id, sortOrder }

    if (!sortUpdates || !Array.isArray(sortUpdates)) {
      return NextResponse.json(
        { success: false, message: "sortUpdates array is required" },
        { status: 400 },
      );
    }

    const bulkOps = sortUpdates.map((item) => ({
      updateOne: {
        filter: { _id: new ObjectId(item._id) },
        update: { $set: { sortOrder: item.sortOrder, updatedAt: new Date() } },
      },
    }));

    const result = await db.collection(COLLECTION_NAME).bulkWrite(bulkOps);

    // Revalidate video gallery pages
    revalidateVideoPages();

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
