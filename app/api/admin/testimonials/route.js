import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";

// Get all testimonials from MongoDB
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("diit_admin");
    const collection = db.collection("testimonials");

    const testimonials = await collection.findOne({ _id: "testimonials" });

    if (!testimonials) {
      return NextResponse.json({
        success: true,
        data: {
          testimonials: {
            students: [],
            guardians: [],
          },
        },
      });
    }

    // Remove MongoDB _id field
    delete testimonials._id;

    return NextResponse.json({
      success: true,
      data: {
        testimonials: testimonials.data || { students: [], guardians: [] },
      },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// Update testimonials data
export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const testimonialData = body.testimonials || body.data || body;

    const client = await clientPromise;
    const db = client.db("diit_admin");
    const collection = db.collection("testimonials");

    // Upsert the testimonials data
    await collection.updateOne(
      { _id: "testimonials" },
      {
        $set: {
          data: testimonialData,
          updatedAt: new Date(),
          updatedBy: user.email,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Testimonials updated successfully",
      data: {
        testimonials: testimonialData,
      },
    });
  } catch (error) {
    console.error("Error updating testimonials:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update testimonials" },
      { status: 500 }
    );
  }
}

// Delete a specific testimonial
export async function DELETE(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category"); // 'students' or 'guardians'
    const index = parseInt(searchParams.get("index"));

    if (!category || index === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing category or index parameter" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("diit_admin");
    const collection = db.collection("testimonials");

    const testimonials = await collection.findOne({ _id: "testimonials" });

    if (!testimonials) {
      return NextResponse.json(
        { success: false, message: "No testimonials found" },
        { status: 404 }
      );
    }

    const data = testimonials.data;
    if (data[category] && data[category][index]) {
      data[category].splice(index, 1);

      await collection.updateOne(
        { _id: "testimonials" },
        {
          $set: {
            data,
            updatedAt: new Date(),
            updatedBy: user.email,
          },
        }
      );

      return NextResponse.json({
        success: true,
        message: "Testimonial deleted successfully",
      });
    }

    return NextResponse.json(
      { success: false, message: "Testimonial not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
