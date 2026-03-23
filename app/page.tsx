import { Header } from "@/components/header";
import { Hero } from "@/components/home/hero";
import MapSection from "@/components/home/map-section";
import DumpsterSize from "@/components/home/dumpster-size";
import { SmartAssessment } from "@/components/home/smart-assessment";
import HowItWorks from "@/components/home/how-it-works";
import FAQSectionNew from "@/components/home/faq-section-new";
import WhyBlueSky from "@/components/home/why-blue-new";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="bg-white">
      <Header />
      {/* 1. Booking Box */}
      <Hero />
      
      {/* 2. Choose Your Dumpster Type */}
      <section id="dumpster-services">
        <DumpsterSize />
      </section>
      
      {/* 3. Find Your Perfect Dumpster - Smart Assessment */}
      <SmartAssessment />
      
      {/* 4. Cities We Service */}
      <MapSection />
      
      {/* 5. Why Blue Sky Disposal */}
      <WhyBlueSky />
      
      {/* 6. How It Works / Easy Steps */}
      <HowItWorks />
      
      {/* FAQ */}
      <section id="faq-section">
        <FAQSectionNew />
      </section>
      
      <Footer />
    </main>
  );
}
