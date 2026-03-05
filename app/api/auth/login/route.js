import { NextResponse } from "next/server";
import { generateToken } from "@/lib/auth";

// Use environment variables for admin credentials
const ADMIN_CREDENTIALS = {
  super: {
    email: process.env.SUPER_ADMIN_EMAIL || "admin@diit.edu.bd",
    password: process.env.SUPER_ADMIN_PASSWORD || "mangoan4",
    name: "DIIT Super Admin",
    role: "super_admin",
  },
  notice: {
    email: process.env.NOTICE_ADMIN_EMAIL || "notice@diit.edu.bd",
    password: process.env.NOTICE_ADMIN_PASSWORD || "diitnotice",
    name: "DIIT Notice Admin",
    role: "notice_admin",
  },
};

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    let user = null;

    // Check against super admin credentials
    if (
      email.toLowerCase() === ADMIN_CREDENTIALS.super.email.toLowerCase() &&
      password === ADMIN_CREDENTIALS.super.password
    ) {
      user = ADMIN_CREDENTIALS.super;
    }
    // Check against notice admin credentials
    else if (
      email.toLowerCase() === ADMIN_CREDENTIALS.notice.email.toLowerCase() &&
      password === ADMIN_CREDENTIALS.notice.password
    ) {
      user = ADMIN_CREDENTIALS.notice;
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Generate JWT token
    const token = generateToken({
      _id: user.role === "super_admin" ? "admin_001" : "admin_002",
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set the auth cookie
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
