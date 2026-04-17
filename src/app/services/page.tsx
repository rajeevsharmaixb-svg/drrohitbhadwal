import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesSection from "@/components/home/ServicesSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Image from "next/image";

export const metadata = {
  title: "Services | Dr Rohit Dental Clinic",
  description: "Comprehensive dental services in Kathua, including Braces, Implants, Smile Design, and Pediatric Dentistry.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero-like Header for Services */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-24 px-4 shadow-inner">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Expert Oral Care Services</h1>
          <p className="text-xl font-medium text-white/90 mb-4 italic">
            "Painless Treatment and Modern Equipment with Expert Care."
          </p>
          <p className="text-lg text-slate-300 leading-relaxed">
            From preventive checkups to advanced cosmetic reconstructions, we provide full-spectrum dental excellence with the latest technology.
          </p>
        </div>
      </section>

      <ServicesSection />
      
      {/* Featured Visual Services */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl space-y-24">
          
          {/* Teeth Whitening */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 order-2 md:order-1">
              <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-3">Cosmetic Dentistry</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Teeth Whitening</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Achieve a brighter, more confident smile with our professional teeth whitening solutions. We use safe, industry-leading bleaching agents to remove deep stains caused by coffee, tea, and aging.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3"><span className="text-primary font-bold">✓</span> Quick, visible results</li>
                <li className="flex items-start gap-3"><span className="text-primary font-bold">✓</span> Safe for enamel</li>
                <li className="flex items-start gap-3"><span className="text-primary font-bold">✓</span> Long-lasting brightness</li>
              </ul>
            </div>
            <div className="flex-1 order-1 md:order-2 w-full relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image src="/images/services/teeth_whitening.png" alt="Sparkling white teeth" fill className="object-cover" />
            </div>
          </div>

          {/* Root Canal Treatment */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 w-full relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image src="/images/services/rct_action.png" alt="Advanced root canal treatment equipment" fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-3">Endodontics</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Root Canal Treatment</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Save your natural tooth with our virtually painless root canal therapy. Using advanced rotary endodontics and magnification, we ensure thorough cleaning and sealing of the infected root.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3"><span className="text-primary font-bold">✓</span> Pain relief and infection control</li>
                <li className="flex items-start gap-3"><span className="text-primary font-bold">✓</span> Advanced isolation protocols</li>
                <li className="flex items-start gap-3"><span className="text-primary font-bold">✓</span> Highly precise digital imaging</li>
              </ul>
            </div>
          </div>

          {/* Orthodontics */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 order-2 md:order-1">
              <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-3">Orthodontics</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Braces & Aligners</h3>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Correct misaligned teeth and jaw irregularities. From traditional ceramic braces to modern, invisible clear aligners, we offer tailored orthodontic plans for all age groups.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3"><span className="text-primary font-bold">✓</span> Clear Aligners & Invisible Braces</li>
                <li className="flex items-start gap-3"><span className="text-primary font-bold">✓</span> Custom retention strategies</li>
                <li className="flex items-start gap-3"><span className="text-primary font-bold">✓</span> Enhanced facial aesthetics</li>
              </ul>
            </div>
            <div className="flex-1 order-1 md:order-2 w-full relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image src="/images/services/aligners_close_up.png" alt="Clear invisible aligners close up" fill className="object-cover" />
            </div>
          </div>

        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
