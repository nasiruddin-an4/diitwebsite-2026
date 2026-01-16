import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

// Get career data
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("diit_admin");
    const collection = db.collection("career_data");

    let data = await collection.findOne({ _id: "career" });

    if (!data) {
      const filePath = path.join(
        process.cwd(),
        "public",
        "Data",
        "CareerData.json"
      );
      const fileContent = await fs.readFile(filePath, "utf-8");
      data = JSON.parse(fileContent);
    } else {
      delete data._id;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching career data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// Update career data
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
    const collection = db.collection("career_data");

    await collection.updateOne(
      { _id: "career" },
      { $set: { ...data, updatedAt: new Date(), updatedBy: user.email } },
      { upsert: true }
    );

    const filePath = path.join(
      process.cwd(),
      "public",
      "Data",
      "CareerData.json"
    );
    await fs.writeFile(filePath, JSON.stringify(data, null, 4), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Career data updated successfully",
    });
  } catch (error) {
    console.error("Error updating career data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update data" },
      { status: 500 }
    );
  }
}
