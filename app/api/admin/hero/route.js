import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { promises as fs } from "fs";
import path from "path";

// Helper to ensure data directory exists and get file path
const getDataFilePath = async () => {
  const dataDir = path.join(process.cwd(), "data");
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  return path.join(dataDir, "hero_slides.json");
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("diit_admin");

    // Fetch slides sorted by order (or creation time if order not present)
    const slides = await db
      .collection("hero_slides")
      .find({})
      .sort({ order: 1, _id: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: slides });
  } catch (error) {
    console.warn("MongoDB fetch failed, falling back to local file:", error);

    // Fallback to local JSON file
    try {
      const filePath = await getDataFilePath();
      try {
        const fileContent = await fs.readFile(filePath, "utf8");
        const slides = JSON.parse(fileContent);
        return NextResponse.json({
          success: true,
          data: slides,
          source: "local",
        });
      } catch (fileError) {
        // File doesn't exist or empty, return empty array
        return NextResponse.json({
          success: true,
          data: [],
          source: "local_empty",
        });
      }
    } catch (fsError) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch slides completely" },
        { status: 500 }
      );
    }
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("diit_admin");

    // Add timestamp
    const newSlide = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("hero_slides").insertOne(newSlide);

    return NextResponse.json({
      success: true,
      message: "Slide created successfully",
      data: { ...newSlide, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Error creating hero slide:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create slide" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { _id, ...updateData } = await request.json();

    if (!_id) {
      return NextResponse.json(
        { success: false, message: "Slide ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("diit_admin");

    // Remove _id from update data to avoid immutable field error
    delete updateData._id;

    const result = await db.collection("hero_slides").updateOne(
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
        { success: false, message: "Slide not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Slide updated successfully",
    });
  } catch (error) {
    console.error("Error updating hero slide:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update slide" },
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
        { success: false, message: "Scanning ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("diit_admin");

    const result = await db.collection("hero_slides").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Slide not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Slide deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hero slide:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete slide" },
      { status: 500 }
    );
  }
}
