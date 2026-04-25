import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/images/logo.jpg"
              alt="Dr. Rohit's Dental & Implant Centre"
              width={40}
              height={40}
              className="rounded-xl shadow-sm"
            />
            <h2 className="text-xl font-serif font-[800] text-white">Dr Rohit Dental Clinic<br/>Braces & Implant Centre</h2>
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
            <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About Dr. Rohit Bhadwal</Link></li>
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
        <p>&copy; {new Date().getFullYear()} Dr Rohit Dental Clinic Braces & Implant Centre. All Rights Reserved.</p>
      </div>
    </footer>
  );
}