import { getData } from "@/lib/data-service";
import AboutClient from "./AboutClient";

export const metadata = {
    title: "About Us | DIIT",
    description: "Learn about Daffodil Institute of Information Technology (DIIT), our mission, vision, and history of excellence since 2000.",
};

async function getAboutData() {
    return await getData("AboutData");
}

export default async function AboutPage() {
    const data = await getAboutData();
    return <AboutClient data={data} />;
}
