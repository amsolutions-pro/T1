import { Hero } from "@/components/sections/Hero";
import { Reassurance } from "@/components/sections/Reassurance";
import { WhyArmenian } from "@/components/sections/WhyArmenian";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Professors } from "@/components/sections/Professors";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <main id="main">
        <Hero />
        <Reassurance />
        <WhyArmenian />
        <HowItWorks />
        <Professors />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
