import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "diit_uploads";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file received" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto", // Automatically detect if image, pdf, etc.
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || "diitdb",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // Generate an optimized URL (auto format, auto quality)
    let optimizedUrl = uploadResult.secure_url;
    if (uploadResult.resource_type === 'image') {
      optimizedUrl = optimizedUrl.replace('/upload/', '/upload/f_auto,q_auto/');
    }

    // Save metadata to MongoDB (gracefully handle connection issues)
    try {
      const client = await clientPromise;
      const db = client.db("diit_admin");
      const mediaCollection = db.collection("media_uploads");

      const mediaRecord = {
        name: file.name,
        url: optimizedUrl,
        public_id: uploadResult.public_id,
        format: uploadResult.format,
        resource_type: uploadResult.resource_type,
        size: uploadResult.bytes,
        optimized: true,
        createdAt: new Date(),
        folder: folder,
      };

      await mediaCollection.insertOne(mediaRecord);
      console.log("Media metadata saved to MongoDB with optimized URL");
    } catch (mongoError) {
      console.warn("MongoDB metadata logging failed (likely connection issue):", mongoError.message);
    }

    return NextResponse.json({
      success: true,
      url: optimizedUrl,
      public_id: uploadResult.public_id,
      message: "File uploaded and optimized successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}

