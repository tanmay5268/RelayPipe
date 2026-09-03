import Navbar from "@/components/HomePage/Navbar";
import Hero from "@/components/HomePage/Hero";
import Stats from "@/components/HomePage/Stats";
import HowItWorks from "@/components/HomePage/HowItWorks";
import Features from "@/components/HomePage/Features";
import ApiBand from "@/components/HomePage/ApiBand";
import CTA from "@/components/HomePage/CTA";
import Footer from "@/components/HomePage/Footer";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <Features />
        <ApiBand />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}