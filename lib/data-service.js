import clientPromise from "@/lib/mongodb";
import fs from "fs/promises";
import path from "path";

const DB_MAPPING = {
  AdmissionData: { collectionName: "admissionPage", docId: "admission" },
  CampusData: { collectionName: "campusPage", docId: "facilities" },
  AcademicsData: { collectionName: "academicsPage", docId: "academics" },
  CampusActivities: { collectionName: "campusActivities", docId: "activities" },
  CareerData: { collectionName: "careerPage", docId: "career" },
  CareerData: { collectionName: "careerPage", docId: "career" },
  FaqData: { collectionName: "general_pages", docId: "faq" },
  AboutData: { collectionName: "general_pages", docId: "about" },
  ContactData: { collectionName: "general_pages", docId: "contact" },
  HomePage: { collectionName: "homepage_data", docId: "homepage" },
  NavigationData: { collectionName: "navigationPage", docId: "navigation" },
  ProgramsData: { collectionName: "programsPage", docId: "programs" },
};

export async function getData(filename) {
  const mapping = DB_MAPPING[filename];
  if (!mapping) return null;

  const { collectionName, docId } = mapping;

  try {
    const client = await clientPromise;
    const db = client.db("diit_admin");
    const data = await db.collection(collectionName).findOne({ _id: docId });

    if (data) {
      const { _id, ...rest } = data;
      return rest;
    }

    // Fallback to JSON and seed if DB is empty
    console.log(`[DataService] DB empty for ${filename}, seeding from JSON...`);
    const filePath = path.join(
      process.cwd(),
      "public",
      "Data",
      `${filename}.json`
    );
    const fileContent = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(fileContent);

    // Seed DB
    await db.collection(collectionName).updateOne(
      { _id: docId },
      {
        $set: {
          ...jsonData,
          updatedAt: new Date(),
          updatedBy: "system_auto_seed",
        },
      },
      { upsert: true }
    );

    return jsonData;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`[DataService] JSON file for ${filename} not found. Returning empty/default object.`);
      // Return a safe default based on filename to prevent UI crashes
      if (filename === 'ContactData') return {
        hero: { title: "Contact Us", description: "Get in touch" },
        info: { phone: [], email: [], address: [] }
      };
      if (filename === 'FaqData') return { faqs: [], hero: { title: "FAQ", description: "Frequently Asked Questions" } };
      if (filename === 'AboutData') return {
        intro: { stats: [] },
        hero: { title: "About Us" },
        mission: {},
        vision: {},
        values: []
      };
      return {};
    }
    console.error(`Error in getData(${filename}):`, error);
    return null;
  }
}
