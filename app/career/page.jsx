import { getData } from '@/lib/data-service';
import CareerClient from './CareerClient';

export const metadata = {
    title: "Careers | DIIT",
    description: "Join the team at Daffodil Institute of Information Technology. Explore current job openings for faculty and staff positions.",
};

async function getCareerData() {
    return await getData('CareerData');
}

export default async function CareerPage() {
    const data = await getCareerData();
    return <CareerClient data={data} />;
}
