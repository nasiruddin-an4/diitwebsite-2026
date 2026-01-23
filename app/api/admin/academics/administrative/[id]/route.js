import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "diit_admin";
const COLLECTION_NAME = "administrative";

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

    const member = await db.collection(COLLECTION_NAME).findOne({
      _id: new ObjectId(id),
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: "Administrative member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    console.error("Error fetching administrative member:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
