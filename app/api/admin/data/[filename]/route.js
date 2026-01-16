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
    const client = await clientPromise;
    const db = client.db("diit_admin");
    const collection = db.collection(collectionName);

    await collection.updateOne(
      { _id: docId },
      { $set: { ...data, updatedAt: new Date(), updatedBy: user.email } },
      { upsert: true }
    );

    // REMOVED: Local JSON file writing as requested by user.
    // We now rely on MongoDB as the primary source of truth.

    return NextResponse.json({
      success: true,
      message: "Data updated successfully in database",
    });
  } catch (error) {
    console.error(`Error updating ${filename}:`, error);
    return NextResponse.json(
      { success: false, message: "Failed to update data" },
      { status: 500 }
    );
  }
}
