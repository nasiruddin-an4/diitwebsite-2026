import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Helper to revalidate faculty-related pages
function revalidateFacultyPages() {
  revalidatePath("/faculty");
}

// Generate URL-friendly slug from name
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s.]+/g, '-')      // Replace spaces and dots with hyphens
    .replace(/[^\w-]+/g, '')      // Remove non-word chars (except hyphens)
    .replace(/--+/g, '-')         // Replace multiple hyphens with single
    .replace(/^-+/, '')           // Trim leading hyphens
    .replace(/-+$/, '');          // Trim trailing hyphens
}

// Get a unique slug (appends -2, -3, etc. if duplicate exists)
async function getUniqueSlug(db, name, excludeId = null) {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: new ObjectId(excludeId) };
    }
    const existing = await db.collection("faculty").findOne(query);
    if (!existing) break;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("diit_admin");

    // Fetch faculty sorted by serial, department and designation
    // Use aggregation to handle missing serials by defaulting them to 999
    const faculty = await db
      .collection("faculty")
      .aggregate([
        {
          $addFields: {
            sortSerial: { $ifNull: ["$serial", 999] },
          },
        },
        {
          $sort: { sortSerial: 1, department: 1, designation: 1, _id: -1 },
        },
      ])
      .toArray();

    // Backfill slugs for any faculty members that don't have one yet
    for (const member of faculty) {
      if (!member.slug && member.name) {
        const slug = await getUniqueSlug(db, member.name, member._id.toString());
        await db.collection("faculty").updateOne(
          { _id: member._id },
          { $set: { slug } }
        );
        member.slug = slug;
      }
    }

    return NextResponse.json({ success: true, data: faculty });
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch faculty" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("diit_admin");

    // Generate slug from name
    const slug = await getUniqueSlug(db, data.name);

    // Add timestamp and slug
    const newFaculty = {
      ...data,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("faculty").insertOne(newFaculty);

    // Revalidate frontend pages
    revalidateFacultyPages();

    return NextResponse.json({
      success: true,
      message: "Faculty member created successfully",
      data: { ...newFaculty, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Error creating faculty:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create faculty member" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const { _id, ...updateData } = await request.json();

    if (!_id) {
      return NextResponse.json(
        { success: false, message: "Faculty ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("diit_admin");

    // Remove _id from update data
    delete updateData._id;

    // Regenerate slug if name changed
    if (updateData.name) {
      updateData.slug = await getUniqueSlug(db, updateData.name, _id);
    }

    const result = await db.collection("faculty").updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Faculty member not found" },
        { status: 404 },
      );
    }

    // Revalidate frontend pages
    revalidateFacultyPages();

    return NextResponse.json({
      success: true,
      message: "Faculty member updated successfully",
    });
  } catch (error) {
    console.error("Error updating faculty:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update faculty member" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Faculty ID is required" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("diit_admin");

    const result = await db.collection("faculty").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Faculty member not found" },
        { status: 404 },
      );
    }

    // Revalidate frontend pages
    revalidateFacultyPages();

    return NextResponse.json({
      success: true,
      message: "Faculty member deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete faculty member" },
      { status: 500 },
    );
  }
}
