'use client'

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import AboutHero from "@/components/home/about-hero";
import Commitment from "@/components/home/commitment";
import GrowthJourney from "@/components/home/growth-journey";
import HowItStarted from "@/components/home/how-it-started";
import OurCommitment from "@/components/home/our-commitment";
import OurMission from "@/components/home/our-mission";

export default function AboutPage() {
  return (
    <main className="bg-white">
      <Header />
      <AboutHero />
      <OurMission />
      <GrowthJourney />
      <HowItStarted />
      <Commitment />
      <OurCommitment />
      <Footer />
    </main>
  )
}
