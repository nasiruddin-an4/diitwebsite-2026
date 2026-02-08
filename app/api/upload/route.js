import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import clientPromise from "@/lib/mongodb";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "diit_uploads";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file received" },
        { status: 400 },
      );
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      // Upload to Supabase Storage
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const filePath = `${folder}/${fileName}`;

      // We use 'diitdb' as the bucket name with admin client to bypass RLS
      const { data, error } = await supabaseAdmin.storage
        .from("diitdb")
        .upload(filePath, buffer, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (error) {
        // If 'diitdb' bucket doesn't exist, try 'diit_uploads' or return error
        console.error("Supabase upload error:", error);
        throw new Error(
          `Supabase upload failed: ${error.message}. Please ensure 'diitdb' bucket exists in Supabase Storage.`,
        );
      }

      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from("diitdb").getPublicUrl(filePath);

      // Save metadata to MongoDB
      try {
        const client = await clientPromise;
        const db = client.db("diit_admin");
        const mediaCollection = db.collection("media_uploads");

        const mediaRecord = {
          name: file.name,
          url: publicUrl,
          public_id: filePath,
          format: "pdf",
          resource_type: "pdf",
          size: file.size,
          provider: "supabase",
          createdAt: new Date(),
          folder: folder,
        };

        await mediaCollection.insertOne(mediaRecord);
        console.log("PDF metadata saved to MongoDB with Supabase URL");
      } catch (mongoError) {
        console.warn("MongoDB metadata logging failed:", mongoError.message);
      }

      return NextResponse.json({
        success: true,
        url: publicUrl,
        public_id: filePath,
        message: "PDF uploaded to Supabase successfully",
      });
    }

    // Convert file to buffer for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto", // Automatically detect if image, etc.
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || "diitdb",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      uploadStream.end(buffer);
    });

    // Generate an optimized URL (auto format, auto quality)
    let optimizedUrl = uploadResult.secure_url;
    if (uploadResult.resource_type === "image") {
      optimizedUrl = optimizedUrl.replace("/upload/", "/upload/f_auto,q_auto/");
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
        provider: "cloudinary",
        optimized: true,
        createdAt: new Date(),
        folder: folder,
      };

      await mediaCollection.insertOne(mediaRecord);
      console.log("Media metadata saved to MongoDB with optimized URL");
    } catch (mongoError) {
      console.warn(
        "MongoDB metadata logging failed (likely connection issue):",
        mongoError.message,
      );
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
      { status: 500 },
    );
  }
}
