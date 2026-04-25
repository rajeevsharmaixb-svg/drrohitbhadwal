// src/components/gallery/EquipmentShowcase.tsx
'use client';

import React from 'react';
import Image from 'next/image';

const equipmentImages = [
  { src: '/images/tools/ALERIO DC X-ray SYSTEM.webp', alt: 'ALERIO DC X-ray SYSTEM' },
  { src: '/images/tools/LIGHT CURE.webp', alt: 'LIGHT CURE' },
  { src: '/images/tools/PIEZO SURGERY.webp', alt: 'PIEZO SURGERY' },
  { src: '/images/tools/TISSUE CONTOURING SYSTEM.webp', alt: 'TISSUE CONTOURING SYSTEM' },
  { src: '/images/tools/ULTRASONIC CLEANER.webp', alt: 'ULTRASONIC CLEANER' },
  { src: '/images/tools/WORLD CLASS STERILIZATION AUTOCLAVE.webp', alt: 'WORLD CLASS STERILIZATION AUTOCLAVE' },
  { src: '/images/tools/biosonic-close.jpg', alt: 'Biosonic Cleaner' },
  { src: '/images/tools/IMG-20260404-WA0002.jpg', alt: 'Specialist Tools' },
  { src: '/images/tools/IMG-20260404-WA0003.jpg', alt: 'Dental Chair' },
];

export default function EquipmentShowcase() {
  return (
    <div className="mb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4 tracking-tight">Equipment Showcase</h2>
        <div className="w-24 h-1 bg-primary/30 mx-auto rounded-full mb-6" />
        <p className="text-slate-500 max-w-xl mx-auto">
          We use only the highest quality, modern medical devices and sterilization equipment to ensure maximum safety and precision.
        </p>
      </div>

      {/* CSS Masonry Layout */}
      <div className="masonry-grid">
        {equipmentImages.map((img, idx) => (
          <div key={idx} className="masonry-item group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 bg-white border border-slate-50">
            {/* Using img tag here to let browser determine natural height for masonry, 
                since next/image requires fixed width/height or layout fill. */}
            <img 
              src={img.src} 
              alt={img.alt} 
              className="w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl transition-colors duration-500 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
