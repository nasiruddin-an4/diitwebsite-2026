import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

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

    // 1. Clear existing slides
    await collection.deleteMany({});

    if (slides.length > 0) {
      // Prepare slides for insertion
      const slidesToInsert = slides.map((slide, index) => {
        const { _id, ...rest } = slide;
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
      message: "Slides updated successfully in MongoDB",
    });
  } catch (error) {
    console.error("MongoDB bulk update failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update slides in database" },
      { status: 500 }
    );
  }
}
