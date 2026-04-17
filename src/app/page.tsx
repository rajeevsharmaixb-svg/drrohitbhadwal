'use client';

import SmileScroll from '@/components/SmileScroll';
import Navbar from "@/components/layout/Navbar";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import DoctorsSection from "@/components/home/DoctorsSection";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <Navbar />
      <SmileScroll />
      <TestimonialsCarousel />
      <AboutSection />
      <ServicesSection />
      <DoctorsSection />
      <FAQSection />
      <CTASection />
      <ContactSection />
      <Footer />

      {/* Interactive Elements */}
      <FloatingWhatsApp />
    </main>
  );
}

