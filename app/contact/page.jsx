import clientPromise from "@/lib/mongodb";
import { getData } from "@/lib/data-service";
import ContactClient from './ContactClient';

export const metadata = {
    title: "Contact Us | DIIT",
    description: "Get in touch with Daffodil Institute of Information Technology. Contact our admissions office, or visit our campus in Dhanmondi, Dhaka.",
};

async function getContactData() {
    try {
        const client = await clientPromise;
        const db = client.db("diit_admin");

        // Get site-wide info (phone, email, address, social, map, etc.)
        const siteInfo = await db.collection("site_settings").findOne({ _id: "site_info" });

        // Get hero info from general_pages (for Contact page hero section)
        const pageData = await getData("ContactData");
        const hero = pageData?.hero || { title: "Contact Us", description: "Get in touch with us." };

        return {
            hero,
            info: {
                phone: siteInfo?.phone || [],
                email: siteInfo?.email || [],
                address: siteInfo?.address || [],
            },
            mapUrl: siteInfo?.mapUrl || "",
            officeHours: siteInfo?.officeHours || "Sun - Thu: 9:00 AM - 6:00 PM",
            socialMedia: siteInfo?.socialMedia || {}
        };
    } catch (error) {
        console.error("Error fetching contact data:", error);
        return {
            hero: { title: "Contact Us", description: "Get in touch with us." },
            info: { phone: [], email: [], address: [] },
            mapUrl: "",
            officeHours: ""
        };
    }
}

export default async function ContactPage() {
    const data = await getContactData();
    return <ContactClient data={data} />;
}

