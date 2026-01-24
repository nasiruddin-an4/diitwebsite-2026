import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { getAuthUser } from "@/lib/auth";

// Helper function to revalidate partner-related pages
function revalidatePartnerPages() {
    revalidatePath("/");  // Homepage shows partners
}

// Get all Partners and Metadata from 'mou_partners' collection
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("diit_admin");
        const collection = db.collection("mou_partners");

        // Fetch all documents
        const documents = await collection.find({}).sort({ order: 1, createdAt: -1 }).toArray();

        // Separate special metadata document from actual partner documents
        const metadataDoc = documents.find(d => d._id === "metadata");
        const partners = documents.filter(d => d._id !== "metadata");

        return NextResponse.json({
            success: true,
            data: {
                partners: partners || [],
                benefits: metadataDoc?.collaborationBenefits || []
            }
        });

    } catch (error) {
        console.error("Fetch partners error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Handle Partners operations (Create, Update, Delete Partner, Update Benefits)
export async function POST(request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { action, partner, id, benefits } = body;

        const client = await clientPromise;
        const db = client.db("diit_admin");
        const collection = db.collection("mou_partners");

        // --- Action: Update Benefits Metadata ---
        if (action === "updateBenefits") {
            await collection.updateOne(
                { _id: "metadata" },
                {
                    $set: {
                        collaborationBenefits: benefits || [],
                        updatedAt: new Date(),
                        updatedBy: user.email
                    }
                },
                { upsert: true }
            );

            // Revalidate frontend pages
            revalidatePartnerPages();

            return NextResponse.json({ success: true, message: "Benefits updated successfully" });
        }

        // --- Action: Create Partner ---
        if (action === "create") {
            const newPartner = {
                ...partner,
                // MongoDB creates _id automatically.
                createdAt: new Date(),
                updatedAt: new Date(),
                updatedBy: user.email,
                order: await collection.countDocuments()
            };

            // Clean up temp ID from frontend if present
            if (newPartner.id === "new" || !newPartner.id) {
                delete newPartner.id;
            }

            const result = await collection.insertOne(newPartner);

            // Revalidate frontend pages
            revalidatePartnerPages();

            return NextResponse.json({
                success: true,
                message: "Partner added",
                partner: { ...newPartner, _id: result.insertedId, id: result.insertedId }
            });
        }

        // --- Action: Update Partner ---
        else if (action === "update") {
            const targetId = partner._id || partner.id || id;

            if (!targetId) {
                return NextResponse.json({ success: false, message: "Partner ID missing" }, { status: 400 });
            }

            // Handle ID matching (ObjectId vs String)
            const { ObjectId } = require('mongodb');
            let query;
            if (ObjectId.isValid(targetId)) {
                query = { _id: new ObjectId(targetId) };
            } else {
                query = { id: targetId };
            }

            // Remove immutable/id fields from update payload
            const { _id, id: pid, ...updateData } = partner;

            await collection.updateOne(
                query,
                {
                    $set: {
                        ...updateData,
                        updatedAt: new Date(),
                        updatedBy: user.email
                    }
                }
            );

            // Revalidate frontend pages
            revalidatePartnerPages();

            return NextResponse.json({ success: true, message: "Partner updated" });
        }

        return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Partners API Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("diit_admin");
        const collection = db.collection("mou_partners");

        const { ObjectId } = require('mongodb');
        let query;
        if (ObjectId.isValid(id)) {
            query = { _id: new ObjectId(id) };
        } else {
            // Try string ID match (legacy) or numeric
            const numericId = parseInt(id);
            query = {
                $or: [
                    { id: id },
                    { id: !isNaN(numericId) ? numericId : id }
                ]
            };
        }

        await collection.deleteOne(query);

        // Revalidate frontend pages
        revalidatePartnerPages();

        return NextResponse.json({ success: true, message: "Partner deleted" });

    } catch (error) {
        console.error("Partners API Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
