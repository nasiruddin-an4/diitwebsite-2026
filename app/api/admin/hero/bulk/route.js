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

export async function POST(request) {
  let slides;
  try {
    slides = await request.json();
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Invalid JSON" },
      { status: 400 }
    );
  }

  // Try MongoDB first
  try {
    const client = await clientPromise;
    const db = client.db("diit_admin");
    const collection = db.collection("hero_slides");

    if (!Array.isArray(slides)) {
      return NextResponse.json(
        { success: false, message: "Invalid data format" },
        { status: 400 }
      );
    }

    // 1. Clear existing slides (or handle smart diffing, but simple replace is safer for matching UI state)
    // We want to keep _id if it exists to avoid breaking references if any, but re-generating is fine for hero slides usually.
    // However, to be safe, let's just delete all and insert all.

    await collection.deleteMany({});

    if (slides.length > 0) {
      // Prepare slides for insertion
      const slidesToInsert = slides.map((slide, index) => {
        // Ensure _id is handled correctly or removed to let MongoDB generate new ones
        // If we want to preserve IDs, we can cast them to ObjectId if they exist
        const { _id, id, ...rest } = slide;
        return {
          ...rest,
          order: index,
          updatedAt: new Date(),
        };
      });

      await collection.insertMany(slidesToInsert);
    }

    return NextResponse.json({
      success: true,
      message: "Slides updated successfully (MongoDB)",
    });
  } catch (error) {
    console.warn(
      "MongoDB bulk update failed, falling back to local file:",
      error
    );

    // Fallback to local JSON file
    try {
      const filePath = await getDataFilePath();
      // Just save the slides array as JSON
      // We preserve the IDs if they exist or let them be whatever validation allowed
      await fs.writeFile(filePath, JSON.stringify(slides, null, 2));

      return NextResponse.json({
        success: true,
        message: "Slides updated successfully (Local Fallback)",
        source: "local",
      });
    } catch (fsError) {
      console.error("Local file save failed:", fsError);
      return NextResponse.json(
        { success: false, message: "Failed to update slides completely" },
        { status: 500 }
      );
    }
  }
}
