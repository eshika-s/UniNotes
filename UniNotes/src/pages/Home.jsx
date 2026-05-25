import HeroSection from "../components/Home/HeroSection";
import FeaturesSection from "../components/Home/FeaturesSection";
import InstitutionsSection from "../components/Home/InstitutionsSection";
import FounderSection from "../components/Home/FounderSection";

function Home() {
  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh", color: "#ffffff", paddingBottom: "2rem" }}>
      <HeroSection />
      <FeaturesSection />
      <InstitutionsSection />
      <FounderSection />
    </div>
  );
}

export default Home;