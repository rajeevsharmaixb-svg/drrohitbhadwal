import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import GallerySection from "@/components/gallery/GallerySection";

export const metadata = {
  title: "Gallery | Dr Rohit Dental Clinic",
  description: "View our state-of-the-art clinic facilities, sterilization protocols, and smile success stories in Kathua.",
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-grow mt-[72px]">
        <GallerySection />
      </div>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Patient Privacy Matters</h2>
              <p className="text-slate-400 max-w-2xl mx-auto mb-8">
                To respect HIPAA guidelines and patient confidentiality, clinical result photos (Before/After) are only shown during in-person consultations.
              </p>
            </div>
            {/* Subtle background decoration */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary rounded-full blur-[100px] opacity-20"></div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
