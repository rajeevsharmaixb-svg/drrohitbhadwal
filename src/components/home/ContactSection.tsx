'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Navigation } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ContactSectionProps {
  hideForm?: boolean;
}

export default function ContactSection({ hideForm = false }: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-premium-gradient">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-16 anim-heading is-visible">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
            {hideForm ? 'Our Locations' : 'Get in Touch & Locations'}
          </h2>
          <div className="w-24 h-1.5 bg-primary/30 mx-auto rounded-full mb-8" />
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience premium dental care at our state-of-the-art facilities. Find the branch closest to you or reach out for inquiries.
          </p>
        </div>

        {/* Global Contact Info (Phone/Email) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20 anim-item is-visible">
          <a href="tel:+919018464914" className="flex items-center gap-5 p-6 bg-white rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md hover:border-primary/20 transition-all">
            <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              <Phone size={24} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Call for consultation</h4>
              <p className="text-xl text-slate-900 font-bold tracking-tight">+91 90184 64914</p>
            </div>
          </a>
          <a href="mailto:drrohitbhadwal@gmail.com" className="flex items-center gap-5 p-6 bg-white rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md hover:border-primary/20 transition-all">
            <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              <Mail size={24} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Direct Inquiries</h4>
              <p className="text-xl text-slate-900 font-bold tracking-tight truncate max-w-[200px] sm:max-w-none">drrohitbhadwal@gmail.com</p>
            </div>
          </a>
        </div>

        {/* Contact Form Container (Only if !hideForm) */}
        {!hideForm && (
          <div className="max-w-3xl mx-auto mb-24 anim-item is-visible">
            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-100 p-12 rounded-[2.5rem] text-center shadow-lg">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-3xl font-bold text-slate-900 mb-3">Message Sent!</h4>
                <p className="text-slate-600 mb-8 text-lg">We've received your inquiry and will get back to you shortly.</p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline" className="rounded-full px-8 border-emerald-200 text-emerald-700 hover:bg-emerald-100">Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
                <h3 className="text-2xl font-bold text-slate-900 mb-8">Send us a message</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <Input required placeholder="Your Name" className="rounded-2xl h-14 bg-slate-50 border-slate-200 focus:bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                    <Input required type="tel" placeholder="+91 00000 00000" className="rounded-2xl h-14 bg-slate-50 border-slate-200 focus:bg-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <Input required type="email" placeholder="email@example.com" className="rounded-2xl h-14 bg-slate-50 border-slate-200 focus:bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    required 
                    rows={4} 
                    placeholder="How can we help you?" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all placeholder:text-slate-400 resize-none"
                  />
                </div>
                <Button disabled={isSubmitting} type="submit" className="w-full h-14 rounded-2xl shadow-lg shadow-primary/25 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 mt-4">
                  {isSubmitting ? 'Sending...' : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Locations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 anim-item is-visible">
          
          {/* Branch 1 */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col h-full relative overflow-hidden group transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,119,182,0.08)] hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent opacity-80 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start gap-5 mb-8">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
                <MapPin size={28} />
              </div>
              <div className="pt-1">
                <h3 className="text-3xl font-bold text-slate-900 mb-1">Branch 1</h3>
                <p className="text-primary font-bold text-sm tracking-wide">FIRST FLOOR, SHAHEEDI CHOWK</p>
              </div>
            </div>

            <p className="text-slate-600 mb-8 flex-grow text-lg leading-relaxed">
              9GFF+Q72, Shaheedi Smarak Chowk, College Road, Kathua, Jammu and Kashmir - 184101
            </p>

            {/* Working Hours */}
            <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
              <div className="flex items-center gap-3 mb-5">
                 <Clock size={22} className="text-primary" />
                 <h4 className="font-bold text-slate-900 text-lg">Working Hours</h4>
              </div>
              <ul className="space-y-4">
                <li className="flex justify-between items-start">
                  <span className="text-slate-500 font-medium pt-1">Mon – Sat</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">10:00 AM – 2:00 PM</span>
                    <span className="font-bold text-slate-900 block mt-1">4:30 PM – 7:30 PM</span>
                  </div>
                </li>
                <li className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Sunday</span>
                  <span className="text-primary font-bold uppercase tracking-widest text-xs bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">Closed</span>
                </li>
              </ul>
            </div>

            {/* Map Embed */}
            <div className="w-full aspect-video rounded-3xl overflow-hidden mb-6 relative border border-slate-200 shadow-inner group-hover:border-primary/20 transition-colors">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3368.1066493729864!2d75.51860431526435!3d32.37583331405086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391c0989d97cb8a7%3A0xe546b5d92823616b!2sDr%20Rohit%20Dental%20Clinic!5e0!3m2!1sen!2sin!4v1713800000000!5m2!1sen!2sin"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Branch 1 Location"
                className="grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              />
            </div>

            <a href="https://maps.google.com/?q=Dr+Rohit+Dental+Clinic,Shaheedi+Chowk,Kathua" target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-2xl bg-white border-2 border-primary/10 hover:border-primary hover:bg-primary hover:text-white text-primary font-bold text-center transition-all duration-300 flex items-center justify-center gap-2">
              <Navigation size={18} /> Get Directions
            </a>
          </div>

          {/* Branch 2 */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col h-full relative overflow-hidden group transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,119,182,0.08)] hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent opacity-80 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start gap-5 mb-8">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
                <MapPin size={28} />
              </div>
              <div className="pt-1">
                <h3 className="text-3xl font-bold text-slate-900 mb-1">Branch 2</h3>
                <p className="text-primary font-bold text-xs sm:text-sm tracking-wide uppercase">Dr. Rohit Dental Clinic braces and implant centre</p>
              </div>
            </div>

            <p className="text-slate-600 mb-8 flex-grow text-lg leading-relaxed">
              Near Old Bus Stand, Ambedkar Bridge, Kali Mata Mandir Road, Kathua
            </p>

            {/* Working Hours */}
            <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
              <div className="flex items-center gap-3 mb-5">
                 <Clock size={22} className="text-primary" />
                 <h4 className="font-bold text-slate-900 text-lg">Working Hours</h4>
              </div>
              <ul className="space-y-4">
                <li className="flex justify-between items-start">
                  <span className="text-slate-500 font-medium pt-1">Mon – Sat</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">10:00 AM – 2:00 PM</span>
                    <span className="font-bold text-slate-900 block mt-1">4:30 PM – 7:30 PM</span>
                  </div>
                </li>
                <li className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Sunday</span>
                  <span className="text-primary font-bold uppercase tracking-widest text-xs bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">Closed</span>
                </li>
              </ul>
            </div>

            {/* Map Embed */}
            <div className="w-full aspect-video rounded-3xl overflow-hidden mb-6 relative border border-slate-200 shadow-inner group-hover:border-primary/20 transition-colors">
              <iframe 
                src="https://maps.google.com/maps?q=32%C2%B022'17.4%22N%2075%C2%B031'44.7%22E&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Branch 2 Location"
                className="grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              />
            </div>

            <a href="https://maps.app.goo.gl/w9JYzWsPWuvSAkte9" target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-2xl bg-white border-2 border-primary/10 hover:border-primary hover:bg-primary hover:text-white text-primary font-bold text-center transition-all duration-300 flex items-center justify-center gap-2">
              <Navigation size={18} /> Get Directions
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
