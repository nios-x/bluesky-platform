import { Header } from "@/components/header";
import { Hero } from "@/components/home/hero";
import CityServices from "@/components/home/city-services";
import DumpsterSize from "@/components/home/dumpster-size";
import CalculateSize from "@/components/home/calculate-size";
import WhyBlue from "@/components/home/why-blue";
import HowItWorks from "@/components/home/how-it-works";
import FAQSection from "@/components/home/faq-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="bg-white">
      <Header />
      <Hero />
      <CityServices />
      <DumpsterSize />
      <CalculateSize />
      <HowItWorks />
      <WhyBlue />
      <FAQSection />
      <Footer />
    </main>
  );
}
