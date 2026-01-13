import fs from 'fs';
import path from 'path';
import FaqClient from './FaqClient';

export const metadata = {
    title: "FAQ | DIIT - Frequently Asked Questions",
    description: "Find answers to frequently asked questions about admissions, academic programs, and campus life at DIIT.",
};

async function getFaqData() {
    const filePath = path.join(process.cwd(), 'public', 'Data', 'FaqData.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
}

export default async function FaqPage() {
    const data = await getFaqData();
    return <FaqClient data={data} />;
}
