import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";

// Get all data from MongoDB
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("diit_admin");
    const collection = db.collection("homepage_data");

    let data = await collection.findOne({ _id: "homepage" });

    if (!data) {
      return NextResponse.json(
        { success: true, data: {} }
      );
    }

    // Remove MongoDB _id field
    delete data._id;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// Update homepage data
export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();

    const client = await clientPromise;
    const db = client.db("diit_admin");
    const collection = db.collection("homepage_data");

    // Upsert the data
    await collection.updateOne(
      { _id: "homepage" },
      { $set: { ...data, updatedAt: new Date(), updatedBy: user.email } },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Homepage data updated successfully",
    });
  } catch (error) {
    console.error("Error updating homepage data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update data" },
      { status: 500 }
    );
  }
}
