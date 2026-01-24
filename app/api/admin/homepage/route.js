import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";

import { getData } from "@/lib/data-service";

// Get all data from MongoDB
export async function GET() {
  try {
    const data = await getData("HomePage");

    if (!data) {
      return NextResponse.json(
        { success: true, data: {} }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// Update homepage data
export async function POST(request) {
  console.log("POST /api/admin/homepage: Started");
  try {
    console.log("POST /api/admin/homepage: Checking authentication...");
    const user = await getAuthUser();
    if (!user) {
      console.warn("POST /api/admin/homepage: Unauthorized access attempt");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    console.log("POST /api/admin/homepage: Authenticated user:", user.email);

    let data;
    try {
      data = await request.json();
      console.log(`POST /api/admin/homepage: Received payload, keys: ${Object.keys(data)}`);
    } catch (parseError) {
      console.error("POST /api/admin/homepage: Failed to parse JSON body:", parseError.message);
      return NextResponse.json(
        { success: false, message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    console.log("POST /api/admin/homepage: Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("diit_admin");
    const collection = db.collection("homepage_data");
    console.log("POST /api/admin/homepage: MongoDB connected");

    // Clean data - remove _id if it exists to avoid MongoDB error
    const { _id, ...cleanData } = data;

    // Upsert the data
    const result = await collection.updateOne(
      { _id: "homepage" },
      { $set: { ...cleanData, updatedAt: new Date(), updatedBy: user.email } },
      { upsert: true }
    );

    console.log("POST /api/admin/homepage: Successfully updated MongoDB", {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    });

    // Revalidate frontend pages that use homepage data
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Homepage data updated successfully",
    });
  } catch (error) {
    console.error("POST /api/admin/homepage: Error:", error.message);
    console.error("POST /api/admin/homepage: Error stack:", error.stack);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update data" },
      { status: 500 }
    );
  }
}
