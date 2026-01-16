import { getData } from "@/lib/data-service";
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

  return (
    <div className="min-h-screen font-sans">
      <Hero />
      <StatsCounter data={homeData.statsCounter} />
      <ProgramExplorer data={programsData?.programsData || programsData} />
      <FindYourWay />
      <CredibilitySection data={homeData.credibilitySection} />
      <NewsEventsSection data={homeData.newsEvents} />
      <TestimonialsSection />
      <CallToActionSection />
      <BackToTop />
    </div>
  );
}
