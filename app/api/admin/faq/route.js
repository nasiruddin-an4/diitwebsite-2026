import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";
import { getData } from "@/lib/data-service";

// Get all FAQ data
export async function GET() {
  try {
    const data = await getData("FaqData");
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching FAQ data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// Update FAQ data
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
    const collection = db.collection("faq_data");

    await collection.updateOne(
      { _id: "faq" },
      { $set: { ...data, updatedAt: new Date(), updatedBy: user.email } },
      { upsert: true }
    );

    // Revalidate the FAQ page
    revalidatePath("/faq");

    // REMOVED: Local JSON file writing to save data only to database.

    return NextResponse.json({
      success: true,
      message: "FAQ data updated successfully in database",
    });
  } catch (error) {
    console.error("Error updating FAQ data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update data" },
      { status: 500 }
    );
  }
}
