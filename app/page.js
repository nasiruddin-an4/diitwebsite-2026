import Hero from "./components/Hero";
import StatsCounter from "./components/StatsCounter";
import ProgramExplorer from "./components/ProgramExplorer";

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <Hero />
      <StatsCounter />
      <ProgramExplorer />
    </div>
  );
}
