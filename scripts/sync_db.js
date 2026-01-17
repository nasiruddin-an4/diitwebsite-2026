const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri =
  "mongodb+srv://diitdb:4y9AgAazdY2WfrFb@diitdb.96eb9tv.mongodb.net/?appName=diitdb";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("diit_admin");
    const collection = db.collection("admissionPage"); // AdmissionData maps to this
    const docId = "admission";

    const jsonPath = path.join(
      __dirname,
      "public",
      "Data",
      "AdmissionData.json"
    );
    const fileContent = fs.readFileSync(jsonPath, "utf8");
    const data = JSON.parse(fileContent);

    console.log("Read data from JSON:", Object.keys(data));

    const result = await collection.updateOne(
      { _id: docId },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
          updatedBy: "manual_sync_script",
        },
      },
      { upsert: true }
    );

    console.log("Database updated successfully:", result);
  } catch (error) {
    console.error("Error updating DB:", error);
  } finally {
    await client.close();
  }
}

run();
