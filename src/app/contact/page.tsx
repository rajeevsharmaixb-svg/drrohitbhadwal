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

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
