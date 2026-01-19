import clientPromise from "@/lib/mongodb";
import { getData } from '@/lib/data-service';
import FaqClient from './FaqClient';

export const metadata = {
    title: "FAQ | DIIT - Frequently Asked Questions",
    description: "Find answers to frequently asked questions about admissions, academic programs, and campus life at DIIT.",
};

async function getFaqData() {
    // Fetch FAQs from the dedicated collection
    const client = await clientPromise;
    const db = client.db("diit_admin");
    let faqs = await db.collection("faqs").find({}).toArray();

    // Serialize _id to string for Client Component
    faqs = faqs.map(faq => ({
        ...faq,
        _id: faq._id.toString(),
        id: faq._id.toString()
    }));

    // Fetch Hero data from general_pages (migrating/keeping hero separate)
    // using existing getData or direct DB call
    const generalData = await getData('FaqData');
    const hero = generalData?.hero || {};

    return { faqs, hero };
}

export default async function FaqPage() {
    const data = await getFaqData();
    return <FaqClient data={data} />;
}
