import Header from "@/components/gls/Header";
import HeroSection from "@/components/gls/HeroSection";
import TrustStrip from "@/components/gls/TrustStrip";
import AboutSection from "@/components/gls/AboutSection";
import WhoGathersSection from "@/components/gls/WhoGathersSection";
import SummitPillars from "@/components/gls/SummitPillars";
import AgendaSection from "@/components/gls/AgendaSection";
import BeyondTheStage from "@/components/gls/BeyondTheStage";

import AwardsSection from "@/components/gls/AwardsSection";
import BookNowSection from "@/components/gls/BookNowSection";
import PrivilegeSection from "@/components/gls/PrivilegeSection";
import ContactSection from "@/components/gls/ContactSection";
import FinalCTA from "@/components/gls/FinalCTA";
import Footer from "@/components/gls/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <TrustStrip />
      <AboutSection />
      <WhoGathersSection />
      <SummitPillars />
      <AgendaSection />
      <BeyondTheStage />

      <AwardsSection />
      <BookNowSection />
      <PrivilegeSection />
      <ContactSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
