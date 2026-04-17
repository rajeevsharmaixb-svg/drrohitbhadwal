'use client';

import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactSection() {
  // Correct Google Maps embed for the actual clinic location in Kathua
  // Address: 9GFF+Q72 Shaheedi Smarak, CHOWK, College Rd, Urliwand, Kathua, J&K 184101
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3372.5!2d75.5167!3d32.3879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391e7a553f4ffc25%3A0x7f2b5d7d1f9b8c3e!2s9GFF%2BQ72%20Kathua%2C%20Jammu%20and%20Kashmir%20184101!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Info Side */}
          <div className="flex-1">
            <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">Get In Touch</h2>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">Visit Our Clinic</h3>
            <p className="text-lg text-slate-600 mb-12">
              Have questions about a treatment or want to schedule a visit? Our friendly team is here to assist you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-primary rounded-xl shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Our Address</h4>
                  <p className="text-slate-600">9GFF+Q72 Shaheedi Smarak, CHOWK, College Rd, Urliwand, Kathua, J&K 184101</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-primary rounded-xl shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Phone & WhatsApp</h4>
                  <p className="text-slate-600">+91 90184 64914</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-primary rounded-xl shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Email Address</h4>
                  <p className="text-slate-600">drrohitdentalclinic@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-primary rounded-xl shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Working Hours</h4>
                  <p className="text-slate-600">Mon–Sat: 9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM</p>
                  <p className="text-slate-500 text-sm">Sunday: Closed (Emergency Only)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Side */}
          <div className="flex-1 min-h-[400px] bg-slate-100 rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <iframe 
              src={mapEmbedUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: 400 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Dr Rohit Dental Clinic Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
