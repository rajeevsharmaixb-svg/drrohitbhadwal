import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutSection from "@/components/home/AboutSection";
import DoctorsSection from "@/components/home/DoctorsSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export const metadata = {
  title: "About Us | Dr Rohit Dental Clinic",
  description: "Established in 2011, Dr Rohit Dental Clinic Braces & Implant Centre is Kathua's leading dental care provider.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero-like Header for About */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-24 px-4 shadow-inner">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Legacy of Healthy Smiles</h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Serving the Kathua community since 2011 with advanced dental care, compassionate service, and clinical excellence.
          </p>
        </div>
      </section>

      <AboutSection />
      
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Vision & Mission</h2>
            <p className="text-slate-600 italic">
              "To be the most trusted dental healthcare provider in the region by delivering world-class treatments at affordable prices."
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-4 text-primary">Why Choose Us?</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-600 p-1 rounded-full text-xs">✓</span>
                  12+ Years of Clinical Expertise
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-600 p-1 rounded-full text-xs">✓</span>
                  State-of-the-art Sterilization Protocols
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-600 p-1 rounded-full text-xs">✓</span>
                  Advanced Implant & Braces Centre
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-600 p-1 rounded-full text-xs">✓</span>
                  Patient-Centric Transparent Pricing
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-4 text-primary">Patient Commitment</h3>
              <p className="text-slate-600 leading-relaxed">
                At Dr Rohit Dental Clinic, we believe every patient deserves a smile they are proud to share. 
                Our team focuses on preventive education, minimally invasive techniques, and personalized treatment plans 
                tailored to your unique dental needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DoctorsSection />
      
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
