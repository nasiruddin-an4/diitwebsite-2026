import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

// Get all data from MongoDB (falls back to JSON file if not in DB)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("diit_admin");
    const collection = db.collection("homepage_data");

    let data = await collection.findOne({ _id: "homepage" });

    if (!data) {
      // If no data in MongoDB, load from JSON file
      const filePath = path.join(
        process.cwd(),
        "public",
        "Data",
        "HomePage.json"
      );
      const fileContent = await fs.readFile(filePath, "utf-8");
      data = JSON.parse(fileContent);
    } else {
      // Remove MongoDB _id field
      delete data._id;
    }

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

    // Also update the local JSON file for frontend
    const filePath = path.join(
      process.cwd(),
      "public",
      "Data",
      "HomePage.json"
    );
    await fs.writeFile(filePath, JSON.stringify(data, null, 4), "utf-8");

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
