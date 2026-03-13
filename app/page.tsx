import { Header } from "@/components/header";
import { Hero } from "@/components/home/hero";
import MapSection from "@/components/home/map-section";
import DumpsterSize from "@/components/home/dumpster-size";
import CalculateSizeNew from "@/components/home/calculate-size-new";
import HowItWorks from "@/components/home/how-it-works";
import FAQSectionNew from "@/components/home/faq-section-new";
import WhyBlueSky from "@/components/home/why-blue-new";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="bg-white">
      <Header />
      <Hero />
      <MapSection />
      <DumpsterSize />
      <CalculateSizeNew />
      <HowItWorks />
      <FAQSectionNew />
      <WhyBlueSky />
      <Footer />
    </main>
  );
}
