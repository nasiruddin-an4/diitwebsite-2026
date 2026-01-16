import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

// This endpoint is for initial admin setup only
// You should remove or protect this in production
export async function POST(request) {
  try {
    const { email, password, name, setupKey } = await request.json();

    // Simple setup key protection (change this in production)
    if (setupKey !== "DIIT_ADMIN_SETUP_2026") {
      return NextResponse.json(
        { success: false, message: "Invalid setup key" },
        { status: 403 }
      );
    }

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("diit_admin");
    const adminsCollection = db.collection("admins");

    // Check if admin already exists
    const existingAdmin = await adminsCollection.findOne({
      email: email.toLowerCase(),
    });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const result = await adminsCollection.insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: "admin",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      adminId: result.insertedId,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
