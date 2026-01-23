import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "diit_admin";
const COLLECTION_NAME = "alumni";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const alumnus = await db.collection(COLLECTION_NAME).findOne({
      _id: new ObjectId(id),
    });

    if (!alumnus) {
      return NextResponse.json(
        { success: false, message: "Alumni not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: alumnus });
  } catch (error) {
    console.error("Error fetching alumni:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
