import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export async function GET(request, { params }) {
  const { filename } = params;

  // Security: Allow only specific files
  const allowedFiles = ["AdmissionData", "CampusData"];
  if (!allowedFiles.includes(filename)) {
    return NextResponse.json(
      { success: false, message: "Invalid file access" },
      { status: 403 }
    );
  }

  let data = null;

  // 1. Try fetching from MongoDB
  try {
    const client = await clientPromise;
    const db = client.db("diit_admin");
    const collection = db.collection("site_content");

    const dbData = await collection.findOne({ _id: filename });
    if (dbData) {
      delete dbData._id;
      data = dbData;
    }
  } catch (error) {
    console.warn(
      `[API] MongoDB fetch failed for ${filename}, falling back to file. Error:`,
      error.message
    );
  }

  // 2. If no data from DB, try local JSON file
  if (!data) {
    try {
      const filePath = path.join(
        process.cwd(),
        "public",
        "Data",
        `${filename}.json`
      );
      // console.log("[API] Reading file from:", filePath); // debug
      const fileContent = await fs.readFile(filePath, "utf-8");
      data = JSON.parse(fileContent);
    } catch (err) {
      console.error(`[API] File read failed for ${filename}:`, err.message);
      // Return empty object if both fail, so UI doesn't crash but shows empty
      data = {};
    }
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(request, { params }) {
  const { filename } = params;

  // Security
  const allowedFiles = ["AdmissionData", "CampusData"];
  if (!allowedFiles.includes(filename)) {
    return NextResponse.json(
      { success: false, message: "Invalid file access" },
      { status: 403 }
    );
  }

  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // 1. Try to persist to MongoDB
    try {
      const client = await clientPromise;
      const db = client.db("diit_admin");
      const collection = db.collection("site_content");

      await collection.updateOne(
        { _id: filename },
        { $set: { ...data, updatedAt: new Date(), updatedBy: user.email } },
        { upsert: true }
      );
    } catch (dbError) {
      console.error(`[API] DB Update failed for ${filename}:`, dbError.message);
      // Continue to update local file so we don't lose work
    }

    // 2. Update local JSON file (Source of Truth for initial load/backup)
    try {
      const filePath = path.join(
        process.cwd(),
        "public",
        "Data",
        `${filename}.json`
      );
      await fs.writeFile(filePath, JSON.stringify(data, null, 4), "utf-8");
    } catch (fileError) {
      console.error(
        `[API] File write failed for ${filename}:`,
        fileError.message
      );
      // If db also failed, then we have a problem
      throw new Error("Failed to save to both DB and FileSystem");
    }

    return NextResponse.json({
      success: true,
      message: "Data updated successfully",
    });
  } catch (error) {
    console.error(`Error updating ${filename}:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to update data" },
      { status: 500 }
    );
  }
}
