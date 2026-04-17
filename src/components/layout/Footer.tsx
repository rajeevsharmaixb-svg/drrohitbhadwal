import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
             <div className="bg-gradient-to-br from-primary to-accent p-1.5 rounded-xl shadow-sm text-white inline-block">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s-4-1-4-5V7c0-2.2 1.8-4 4-4s4 1.8 4 4v10c0 4-4 5-4 5z"/>
                <path d="M8 12h8"/>
                <path d="M12 8v8"/>
              </svg>
            </div>
            <h2 className="text-2xl font-serif font-[800] text-white">Dr. Rohit&apos;s<br/>Dental & Implant Centre</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6 max-w-xs">
            Your smile is our priority. We provide world-class dental care in a comfortable, modern environment in Kathua, J&K.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">Quick Links</h3>
          <ul className="flex flex-col gap-3">
            <li><Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About Dr. Rohit</Link></li>
            <li><Link href="/services" className="text-slate-400 hover:text-white transition-colors">Treatments</Link></li>
            <li><Link href="/gallery" className="text-slate-400 hover:text-white transition-colors">Smile Gallery</Link></li>
            <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/guest-book" className="text-slate-400 hover:text-white transition-colors">Quick Book</Link></li>
          </ul>
        </div>

        {/* Contact — REAL clinic data */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">Contact</h3>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3 text-slate-400">
              <MapPin size={20} className="text-primary mt-1 shrink-0" />
              <span>9GFF+Q72 Shaheedi Smarak, CHOWK,<br/>College Rd, Urliwand,<br/>Kathua, J&K 184101</span>
            </li>
            <li className="flex items-center gap-3 text-slate-400">
              <Phone size={20} className="text-primary shrink-0" />
              <span>+91 90184 64914</span>
            </li>
            <li className="flex items-center gap-3 text-slate-400">
              <Mail size={20} className="text-primary shrink-0" />
              <span>drrohitbhadwal@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">Working Hours</h3>
          <ul className="flex flex-col gap-3">
            <li className="flex items-start gap-3 text-slate-400">
              <Clock size={20} className="text-primary mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-white">Mon - Sat</p>
                <p>9:00 AM - 1:00 PM</p>
                <p>5:00 PM - 8:00 PM</p>
              </div>
            </li>
            <li className="flex items-start gap-3 text-slate-400">
              <Clock size={20} className="text-primary mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-white">Sunday</p>
                <p>Closed (Emergency Only)</p>
              </div>
            </li>
          </ul>
        </div>

      </div>

      <div className="container mx-auto px-4 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Dr. Rohit&apos;s Dental & Implant Centre. All Rights Reserved.</p>
      </div>
    </footer>
  );
}