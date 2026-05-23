import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const DOC_ID = "marquee_settings";
const COLLECTION = "site_settings";

const DEFAULT_MARQUEE = {
  text: "📢 ফরম ফিলাপ নোটিশ — বিবিএ, সিএসই ২৩তম ব্যাচ এবং ট্যুরিজম ৮ম ব্যাচের চতুর্থ সেমিস্টারের ফরম ফিলাপ আগামী ৩ জুন থেকে শুরু হয়ে ১০ জুন পর্যন্ত চলবে। সকল শিক্ষার্থীকে নির্ধারিত সময়ের মধ্যে ফরম ফিলাপ সম্পন্ন করার জন্য অনুরোধ করা হলো।",
  enabled: true,
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("diit_admin");
    const data = await db.collection(COLLECTION).findOne({ _id: DOC_ID });

    if (data) {
      const { _id, ...rest } = data;
      return NextResponse.json({ success: true, data: rest });
    }

    return NextResponse.json({ success: true, data: DEFAULT_MARQUEE });
  } catch (error) {
    console.error("Error fetching marquee settings:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("diit_admin");
    const body = await req.json();

    const { _id, ...updateData } = body;

    await db.collection(COLLECTION).updateOne(
      { _id: DOC_ID },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Revalidate homepage so the marquee updates
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Marquee settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating marquee settings:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
