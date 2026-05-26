import HeroSection from "../components/Home/HeroSection";
import UniversityLogos from "../components/Home/UniversityLogos";
import FeaturesSection from "../components/Home/FeaturesSection";
import InstitutionsSection from "../components/Home/InstitutionsSection";
import FAQSection from "../components/Home/FAQSection";
import FounderSection from "../components/Home/FounderSection";

function Home() {
  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", color: "var(--text)", paddingBottom: "0px" }}>
      <HeroSection />
      <UniversityLogos />
      <FeaturesSection />
      <InstitutionsSection />
      <FAQSection />
      <FounderSection />
    </div>
  );
}

export default Home;