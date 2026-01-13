import fs from 'fs';
import path from 'path';
import ActivitiesClient from './ActivitiesClient';

export const metadata = {
    title: 'Campus Activities | DIIT',
    description: 'Explore the vibrant campus life, clubs, and events at DIIT.',
};

async function getActivities() {
    const filePath = path.join(process.cwd(), 'public', 'Data', 'CampusActivities.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
}

export default async function CampusActivitiesPage() {
    const activitiesData = await getActivities();

    return <ActivitiesClient data={activitiesData} />;
}
