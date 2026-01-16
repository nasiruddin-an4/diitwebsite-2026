import { getData } from '@/lib/data-service';
import FaqClient from './FaqClient';

export const metadata = {
    title: "FAQ | DIIT - Frequently Asked Questions",
    description: "Find answers to frequently asked questions about admissions, academic programs, and campus life at DIIT.",
};

async function getFaqData() {
    return await getData('FaqData');
}

export default async function FaqPage() {
    const data = await getFaqData();
    return <FaqClient data={data} />;
}
