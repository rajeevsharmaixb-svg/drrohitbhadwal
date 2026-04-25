'use client';

import { Button } from '../ui/Button';
import Link from 'next/link';
import { Clock } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden bg-primary">
      <div className="absolute inset-0 bg-blue-600" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl p-12 md:p-20 rounded-[3rem] border border-white/20 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 w-20 h-20">
              <img 
                src="/images/logo.jpg" 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8 tracking-tight">Ready for your transformation?</h2>
          <p className="text-xl text-blue-50 mb-12 opacity-90 mx-auto max-w-2xl leading-relaxed">
            Join thousands of happy patients. Secure your appointment with Dr. Rohit Bhadwal and our expert team today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/book">
              <Button size="lg" className="bg-white text-primary hover:bg-blue-50 px-12 py-7 text-lg rounded-full font-bold shadow-xl shadow-black/20 group transform transition-all hover:scale-105">
                Book Now <Clock className="w-5 h-5 ml-3 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
            <a href="tel:+919018464914">
              <Button size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10 px-12 py-7 text-lg rounded-full font-bold transition-all transform hover:scale-105">
                Call Clinic
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
