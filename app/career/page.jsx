import fs from 'fs';
import path from 'path';
import CareerClient from './CareerClient';

export const metadata = {
    title: "Careers | DIIT",
    description: "Join the team at Daffodil Institute of Information Technology. Explore current job openings for faculty and staff positions.",
};

async function getCareerData() {
    const filePath = path.join(process.cwd(), 'public', 'Data', 'CareerData.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
}

export default async function CareerPage() {
    const data = await getCareerData();
    return <CareerClient data={data} />;
}
