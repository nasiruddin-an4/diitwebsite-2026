import { getData } from "@/lib/data-service";
import clientPromise from "@/lib/mongodb";
import Hero from "./components/Hero";
import StatsCounter from "./components/StatsCounter";
import ProgramExplorer from "./components/ProgramExplorer";
import CredibilitySection from "./components/CredibilitySection";
import FindYourWay from "./components/FindYourWay";
import NewsEventsSection from "./components/NewsEventsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CallToActionSection from "./components/CallToActionSection";
import BackToTop from "./components/BackToTop";

export default async function Home() {
  const homeData = (await getData("HomePage")) || {};
  const programsData = (await getData("ProgramsData")) || {};

  const client = await clientPromise;
  const db = client.db("diit_admin");

  // --- Partners & Benefits ---
  const allPartnerDocs = await db.collection("mou_partners")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const metaDoc = allPartnerDocs.find(d => d._id === "metadata" || d._id.toString() === "metadata");
  const partnerDocs = allPartnerDocs.filter(d => d._id !== "metadata" && d._id.toString() !== "metadata");

  const partners = partnerDocs.map(p => ({
    ...p,
    _id: p._id.toString(),
    id: p.id || p._id.toString()
  }));

  const benefits = metaDoc?.collaborationBenefits || [];

  // --- Testimonials ---
  const testimonialsData = await db.collection("testimonials")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const testimonials = testimonialsData.map(t => ({
    ...t,
    _id: t._id.toString(),
    id: t.id || t._id.toString()
  }));

  return (
    <div className="min-h-screen font-sans">
      <Hero />
      <StatsCounter data={homeData.statsCounter} />
      <ProgramExplorer data={programsData?.programsData || programsData} />
      <FindYourWay />
      <CredibilitySection data={{ ...homeData, internationalPartners: partners, collaborationBenefits: benefits }} />
      <NewsEventsSection data={homeData.newsEvents} />
      <TestimonialsSection testimonials={testimonials} />
      <CallToActionSection />
      <BackToTop />
    </div>
  );
}
