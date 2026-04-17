import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactSection from "@/components/home/ContactSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export const metadata = {
  title: "Contact Us | Dr Rohit Dental Clinic",
  description: "Get in touch with Dr Rohit Dental Clinic in Kathua. Find our address, phone number, and consultation hours.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-24 px-4 shadow-inner">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Reach Out to Us</h1>
          <p className="text-lg text-blue-100">
            Have a question or want to book an emergency consultation? We're here to help you get the best dental care in Kathua.
          </p>
        </div>
      </section>

      <ContactSection />
      
      {/* Map Embed from PRD */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-white p-4 rounded-3xl shadow-xl overflow-hidden aspect-video border border-slate-100">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3368.1066493729864!2d75.51860431526435!3d32.37583331405086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391c0989d97cb8a7%3A0xe546b5d92823616b!2sDr%20Rohit%20Dental%20Clinic!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              title="Clinic Location Map"
              className="rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
