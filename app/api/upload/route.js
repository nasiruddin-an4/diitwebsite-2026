import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "uploads";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file received" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

    // Ensure directory exists
    const publicDataDir = path.join(process.cwd(), "public", "uploads", folder);

    try {
      await fs.access(publicDataDir);
    } catch {
      await fs.mkdir(publicDataDir, { recursive: true });
    }

    const filePath = path.join(publicDataDir, filename);
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${folder}/${filename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
