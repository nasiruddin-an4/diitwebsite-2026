import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";

export async function POST(request) {
  console.log("POST /api/admin/hero/bulk: Started");

  // Authentication check
  try {
    const user = await getAuthUser();
    if (!user) {
      console.warn("POST /api/admin/hero/bulk: Unauthorized access attempt");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    console.log("POST /api/admin/hero/bulk: Authenticated user:", user.email);
  } catch (authError) {
    console.error("POST /api/admin/hero/bulk: Auth error:", authError.message);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 401 }
    );
  }

  let slides;
  try {
    slides = await request.json();
    console.log("POST /api/admin/hero/bulk: Received", slides?.length || 0, "slides");
  } catch (e) {
    console.error("POST /api/admin/hero/bulk: JSON parse error:", e.message);
    return NextResponse.json(
      { success: false, message: "Invalid JSON" },
      { status: 400 }
    );
  }

  try {
    console.log("POST /api/admin/hero/bulk: Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("diit_admin");
    const collection = db.collection("hero_slides");
    console.log("POST /api/admin/hero/bulk: MongoDB connected");

    if (!Array.isArray(slides)) {
      return NextResponse.json(
        { success: false, message: "Invalid data format - expected array" },
        { status: 400 }
      );
    }

    // 1. Clear existing slides
    console.log("POST /api/admin/hero/bulk: Clearing existing slides...");
    await collection.deleteMany({});

    if (slides.length > 0) {
      // Prepare slides for insertion - only keep Cloudinary URLs, no binary data
      const slidesToInsert = slides.map((slide, index) => {
        const { _id, ...rest } = slide;
        return {
          ...rest,
          order: index,
          updatedAt: new Date(),
        };
      });

      console.log("POST /api/admin/hero/bulk: Inserting", slidesToInsert.length, "slides...");
      await collection.insertMany(slidesToInsert);
    }

    console.log("POST /api/admin/hero/bulk: Success!");
    return NextResponse.json({
      success: true,
      message: "Slides updated successfully in MongoDB",
    });
  } catch (error) {
    console.error("POST /api/admin/hero/bulk: MongoDB error:", error.message);
    console.error("POST /api/admin/hero/bulk: Full error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update slides in database" },
      { status: 500 }
    );
  }
}
