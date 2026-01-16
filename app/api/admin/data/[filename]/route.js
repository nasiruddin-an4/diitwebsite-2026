import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

// Configuration mapping files to specific MongoDB collections/IDs
const DB_MAPPING = {
  AdmissionData: { collectionName: "admissionPage", docId: "admission" },
  CampusData: { collectionName: "campusPage", docId: "facilities" },
};

export async function GET(request, context) {
  const { params } = context;
  const { filename } = await params;

  // Security: Allow only specific files
  if (!DB_MAPPING[filename]) {
    return NextResponse.json(
      { success: false, message: "Invalid file access" },
      { status: 403 }
    );
  }

  const { collectionName, docId } = DB_MAPPING[filename];
  // ... inside GET function
  const { searchParams } = new URL(request.url);
  const forceUpdate = searchParams.get("force") === "true";

  let data = null;
  let sourcedFromDB = false;

  // 1. Try fetching from MongoDB
  try {
    const client = await clientPromise;
    const db = client.db("diit_admin");
    const collection = db.collection(collectionName);

    if (forceUpdate) {
      console.log(
        `[API] Force update requested for ${filename}. Ignoring DB data.`
      );
    } else {
      const dbData = await collection.findOne({ _id: docId });
      if (dbData) {
        delete dbData._id;
        data = dbData;
        sourcedFromDB = true;
      }
    }
  } catch (error) {
    // ...
  }

  // 2. If no data from DB (or forced), try local JSON file
  if (!data) {
    try {
      const filePath = path.join(
        process.cwd(),
        "public",
        "Data",
        `${filename}.json`
      );

      const fileContent = await fs.readFile(filePath, "utf-8");
      data = JSON.parse(fileContent);

      // 3. AUTO-SEED DATABASE
      // Update logic: If forced or empty, save to DB.
      if (data && (!sourcedFromDB || forceUpdate)) {
        try {
          const client = await clientPromise;
          const db = client.db("diit_admin");
          const collection = db.collection(collectionName);
          await collection.updateOne(
            { _id: docId },
            {
              $set: {
                ...data,
                updatedAt: new Date(),
                updatedBy: "system_auto_seed",
              },
            },
            { upsert: true }
          );
          console.log(
            `[API] Auto-seeded ${collectionName} collection with data from ${filename}.json`
          );
        } catch (seedError) {
          console.warn(
            `[API] Failed to seed ${filename} to MongoDB:`,
            seedError.message
          );
        }
      }
    } catch (err) {
      console.error(`[API] File read failed for ${filename}:`, err.message);
      data = {};
    }
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(request, context) {
  const { params } = context;
  const { filename } = await params;

  if (!DB_MAPPING[filename]) {
    return NextResponse.json(
      { success: false, message: "Invalid file access" },
      { status: 403 }
    );
  }

  const { collectionName, docId } = DB_MAPPING[filename];

  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();

    // 1. Persist to MongoDB specific collection
    try {
      const client = await clientPromise;
      const db = client.db("diit_admin");
      const collection = db.collection(collectionName);

      await collection.updateOne(
        { _id: docId },
        { $set: { ...data, updatedAt: new Date(), updatedBy: user.email } },
        { upsert: true }
      );
    } catch (dbError) {
      console.error(`[API] DB Update failed for ${filename}:`, dbError.message);
    }

    // 2. Update local JSON file (Backup/Source of Truth for initial load)
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
