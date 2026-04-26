import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesSection from "@/components/home/ServicesSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Image from "next/image";
import { CheckCircle2, Sparkles, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
  title: "Services | Dr Rohit Dental Clinic",
  description: "Comprehensive dental services in Kathua, including Braces, Implants, Smile Design, and Pediatric Dentistry.",
};

export default function ServicesPage() {
  const detailedServices = [
    {
      title: "Teeth Whitening",
      category: "Cosmetic Dentistry",
      description: "Achieve a brighter, more confident smile with our professional teeth whitening solutions. We use safe, industry-leading bleaching agents to remove deep stains caused by coffee, tea, and aging.",
      features: ["Quick, visible results", "Safe for enamel", "Long-lasting brightness"],
      image: "/images/services/teeth_whitening.webp",
      icon: Sparkles,
      reverse: false
    },
    {
      title: "Root Canal Treatment",
      category: "Endodontics",
      description: "Save your natural tooth with our virtually painless root canal therapy. Using advanced rotary endodontics and magnification, we ensure thorough cleaning and sealing of the infected root.",
      features: ["Pain relief and infection control", "Advanced isolation protocols", "Highly precise digital imaging"],
      image: "/images/services/rct_action.webp",
      icon: ShieldCheck,
      reverse: true
    },
    {
      title: "Braces & Aligners - Orthodontic braces, invisible aligner",
      category: "Orthodontics",
      description: "Orthodontic braces, invisible aligner. Correct misaligned teeth and jaw irregularities. From traditional ceramic braces to modern, invisible clear aligners, we offer tailored orthodontic plans for all age groups.",
      features: ["Clear Aligners & Invisible Braces", "Custom retention strategies", "Enhanced facial aesthetics"],
      image: "/images/services/aligners_close_up.webp",
      icon: Zap,
      reverse: false
    }
  ];

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* Cinematic Header */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <Image
          src="/images/services/consultation.webp"
          alt="Clinic atmosphere"
          fill
          className="object-cover opacity-40 grayscale-[0.5]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/60 to-slate-900" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
            World Class Standards
          </div>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
            Our Dental Expertise
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
            "Painless Treatment and Modern Equipment with Expert Care."
          </p>
        </div>
      </section>

      {/* Main Grid Section */}
      <ServicesSection />

      {/* Cinematic Detailed Sections */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-48">
            {detailedServices.map((service, index) => (
              <div
                key={index}
                className={`flex flex-col ${service.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16 md:gap-24 anim-group`}
              >
                <div className="flex-1 space-y-8 anim-item">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <service.icon className="text-primary w-6 h-6" />
                      <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">{service.category}</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-lg text-black leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <ul className="grid grid-cols-1 gap-4">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-4 group">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                          <CheckCircle2 size={16} />
                        </div>
                        <span className="text-slate-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-transform active:scale-95">
                    Consult About {service.title}
                  </button>
                </div>

                <div className="flex-1 w-full anim-item">
                  <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
