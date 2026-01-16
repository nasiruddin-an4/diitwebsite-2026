import { getData } from '@/lib/data-service';
import ActivitiesClient from './ActivitiesClient';

export const metadata = {
    title: 'Campus Activities | DIIT',
    description: 'Explore the vibrant campus life, clubs, and events at DIIT.',
};

async function getActivities() {
    return await getData('CampusActivities');
}

export default async function CampusActivitiesPage() {
    const activitiesData = await getActivities();

    return <ActivitiesClient data={activitiesData} />;
}
