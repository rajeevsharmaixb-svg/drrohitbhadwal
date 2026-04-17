'use client';

import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const WHATSAPP_NUMBER = '+919018464914';
  const MESSAGE = encodeURIComponent("Hello Dr. Rohit, I'd like to inquire about a dental treatment.");
  const URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`;

  return (
    <a 
      href={URL} 
      target="_blank" 
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      aria-label="Contact on WhatsApp"
    >
      <div className="relative">
        <MessageCircle size={28} />
        <span className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full border-2 border-[#25D366] animate-ping"></span>
      </div>
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 bg-white text-slate-800 px-4 py-2 rounded-xl shadow-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-100 translate-x-2 group-hover:translate-x-0">
        Chat with us
      </div>
    </a>
  );
}
