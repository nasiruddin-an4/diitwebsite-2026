import Hero from "./components/Hero";
import StatsCounter from "./components/StatsCounter";
import ProgramExplorer from "./components/ProgramExplorer";
import CredibilitySection from "./components/CredibilitySection";
import FindYourWay from "./components/FindYourWay";
import NewsEventsSection from "./components/NewsEventsSection";
import TestimonialsSection from "./components/TestimonialsSection";

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <Hero />
      <StatsCounter />
      <ProgramExplorer />
      <FindYourWay />
      <CredibilitySection />
      <NewsEventsSection />
      <TestimonialsSection />
    </div>
  );
}
