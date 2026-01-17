import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { getData } from "@/lib/data-service";

// Configuration mapping files to specific MongoDB collections/IDs
const DB_MAPPING = {
  AdmissionData: { collectionName: "admissionPage", docId: "admission" },
  CampusData: { collectionName: "campusPage", docId: "facilities" },
  AcademicsData: { collectionName: "academicsPage", docId: "academics" },
  CampusActivities: { collectionName: "campusActivities", docId: "activities" },
  CareerData: { collectionName: "careerPage", docId: "career" },
  FaqData: { collectionName: "faqPage", docId: "faq" },
  HomePage: { collectionName: "homepage_data", docId: "homepage" },
  NavigationData: { collectionName: "navigationPage", docId: "navigation" },
  ProgramsData: { collectionName: "programsPage", docId: "programs" },
};

export async function GET(request, context) {
  const { params } = context;
  const { filename } = await params;

  const data = await getData(filename);

  if (!data) {
    return NextResponse.json(
      { success: false, message: "Invalid file access or data not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(request, context) {
  const { params } = context;
  const { filename } = await params;
  console.log(`POST /api/admin/data/${filename}: Started`);

  if (!DB_MAPPING[filename]) {
    console.warn(`POST /api/admin/data/${filename}: Invalid file access`);
    return NextResponse.json(
      { success: false, message: "Invalid file access" },
      { status: 403 }
    );
  }

  const { collectionName, docId } = DB_MAPPING[filename];

  try {
    // Authentication check
    console.log(`POST /api/admin/data/${filename}: Checking authentication...`);
    const user = await getAuthUser();
    if (!user) {
      console.warn(`POST /api/admin/data/${filename}: Unauthorized access attempt`);
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    console.log(`POST /api/admin/data/${filename}: Authenticated user: ${user.email}`);

    // Parse request body
    let data;
    try {
      data = await request.json();
      console.log(`POST /api/admin/data/${filename}: Received payload with keys:`, Object.keys(data));
    } catch (parseError) {
      console.error(`POST /api/admin/data/${filename}: JSON parse error:`, parseError.message);
      return NextResponse.json(
        { success: false, message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    // 1. Persist to MongoDB specific collection
    console.log(`POST /api/admin/data/${filename}: Connecting to MongoDB...`);
    const client = await clientPromise;
    const db = client.db("diit_admin");
    const collection = db.collection(collectionName);
    console.log(`POST /api/admin/data/${filename}: Connected, updating collection: ${collectionName}`);

    // Clean data - remove _id if it exists to avoid MongoDB error
    const { _id, ...cleanData } = data;

    const result = await collection.updateOne(
      { _id: docId },
      { $set: { ...cleanData, updatedAt: new Date(), updatedBy: user.email } },
      { upsert: true }
    );

    console.log(`POST /api/admin/data/${filename}: MongoDB update result:`, {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    });

    return NextResponse.json({
      success: true,
      message: "Data updated successfully in database",
    });
  } catch (error) {
    console.error(`POST /api/admin/data/${filename}: Error:`, error.message);
    console.error(`POST /api/admin/data/${filename}: Full error stack:`, error.stack);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update data" },
      { status: 500 }
    );
  }
}
