import { getData } from '@/lib/data-service';
import ActivitiesClient from './ActivitiesClient';
import clientPromise from "@/lib/mongodb";

export const metadata = {
    title: 'Campus Activities | DIIT',
    description: 'Explore the vibrant campus life, clubs, and events at DIIT.',
};

async function getActivities() {
    return await getData('CampusActivities');
}

async function getUpcomingEvents() {
    try {
        const client = await clientPromise;
        const db = client.db("diit_admin");

        // Simple string comparison assumes ISO format YYYY-MM-DD or similar
        // Ideally we compare Date objects, but let's try to fetch all and filter for robustness if schema is mixed
        const allEvents = await db.collection("news_events")
            .find({ category: "EVENT" }) // Assuming category is 'EVENT' for events
            .sort({ date: 1 }) // Closest dates first
            .toArray();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = allEvents.filter(ev => {
            const evDate = new Date(ev.date);
            return evDate >= today;
        }).slice(0, 3); // Take top 3 upcoming

        return upcoming.map(n => ({
            ...n,
            _id: n._id.toString(),
            id: n.id || n._id.toString()
        }));
    } catch (e) {
        console.error("Failed to fetch upcoming events", e);
        return [];
    }
}

export default async function CampusActivitiesPage() {
    const activitiesData = await getActivities();
    const upcomingEvents = await getUpcomingEvents();

    return <ActivitiesClient data={activitiesData} upcomingEvents={upcomingEvents} />;
}
