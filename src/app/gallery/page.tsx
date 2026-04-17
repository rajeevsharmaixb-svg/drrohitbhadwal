import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export const metadata = {
  title: "Gallery | Dr Rohit Dental Clinic",
  description: "View our state-of-the-art clinic facilities, sterilization protocols, and smile success stories in Kathua.",
};

export default function GalleryPage() {
  // Mock data for clinic gallery - in V3 this would fetch from Supabase
  const images = [
    { id: 1, title: "Clinic Sterilization Bench", category: "Facility", url: "/images/tools/shelf-overview.jpg" },
    { id: 2, title: "BioSonic Ultrasonic Cleaner", category: "Sterilization", url: "/images/tools/biosonic-close.jpg" },
    { id: 3, title: "Advanced Surgical Tools", category: "Equipment", url: "/images/tools/tools-composite.jpg" },
    { id: 4, title: "Piezo Surgery Unit", category: "Surgical", url: "/images/tools/piezo-surgery.jpg" },
    { id: 5, title: "Alerio DC X-ray System", category: "Diagnostics", url: "/images/tools/alerio-xray.jpg" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-24 px-4 shadow-inner">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Clinic Gallery</h1>
          <p className="text-lg text-blue-100">
            A visual tour of our facility, sterilization standards, and the high-tech equipment we use to care for your smile.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((img) => (
              <div key={img.id} className="group relative overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100 aspect-[4/3] hover:shadow-xl transition-all duration-500">
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <span className="text-primary-light text-xs font-bold uppercase tracking-widest mb-2">{img.category}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{img.title}</h3>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
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
