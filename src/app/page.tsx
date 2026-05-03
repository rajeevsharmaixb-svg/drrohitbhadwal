'use client';

import dynamic from 'next/dynamic';

const StickyHeroSequence = dynamic(
  () => import('@/components/home/StickyHeroSequence'),
  { ssr: false }
);

// Above-fold: eagerly loaded
import Navbar from "@/components/layout/Navbar";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";

// Below-fold: lazy loaded for faster initial paint
const DoctorsSection = dynamic(() => import("@/components/home/DoctorsSection"), { ssr: false });
const TestimonialsCarousel = dynamic(() => import("@/components/home/TestimonialsCarousel"), { ssr: false });
const FAQSection = dynamic(() => import("@/components/home/FAQSection"), { ssr: false });
const CTASection = dynamic(() => import("@/components/home/CTASection"), { ssr: false });
const ContactSection = dynamic(() => import("@/components/home/ContactSection"), { ssr: false });
import Footer from "@/components/layout/Footer";
const FloatingWhatsApp = dynamic(() => import("@/components/FloatingWhatsApp"), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <Navbar />
      <StickyHeroSequence />
      <AboutSection />
      <ServicesSection />
      <DoctorsSection />
      <FAQSection />
      <CTASection />
      <ContactSection hideForm={true} />
      <TestimonialsCarousel />
      <Footer />

      {/* Interactive Elements */}
      <FloatingWhatsApp />
    </main>
  );
}
