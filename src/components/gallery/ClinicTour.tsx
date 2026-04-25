// src/components/gallery/ClinicTour.tsx - Updated
'use client';

import React from 'react';
import Image from 'next/image';

const tourImages = [
  {
    src: '/images/tools/IMG-20260423-WA0024.jpg',
    alt: 'Reception & Front Desk',
    title: 'Welcoming Reception'
  },
  {
    src: '/images/tools/IMG-20260423-WA0027.jpg',
    alt: 'Comfortable Waiting Area',
    title: 'Lounge Area'
  },
  {
    src: '/images/tools/IMG-20260423-WA0029.jpg',
    alt: 'Treatment Room Overview',
    title: 'Modern Treatment Rooms'
  },
  {
    src: '/images/tools/IMG-20260423-WA0030.jpg',
    alt: 'Clinic Interior',
    title: 'Elegant Interiors'
  },
  {
    src: '/images/tools/IMG-20260423-WA0031.jpg',
    alt: 'Patient Consultation Area',
    title: 'Consultation Area'
  },
  {
    src: '/images/tools/IMG-20260423-WA0033.jpg',
    alt: 'State-of-the-Art Operations',
    title: 'Advanced Operatory'
  }
];

export default function ClinicTour() {
  return (
    <div className="mb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4 tracking-tight">Clinic Tour</h2>
        <div className="w-24 h-1 bg-primary/30 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tourImages.map((img, idx) => (
          <div key={idx} className="group relative rounded-3xl overflow-hidden shadow-lg bg-slate-100 tour-card">
            {/* Aspect ratio container preserving natural image proportions somewhat, but grid enforces uniform sizing if we want, or we can use auto. 
                Using next/image fill with object-cover inside a fixed aspect-ratio container is usually best for grids. */}
            <div className="relative aspect-[4/3] w-full h-full overflow-hidden">
              <Image 
                src={img.src} 
                alt={img.alt} 
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <h3 className="text-white font-medium text-lg tracking-wide">{img.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
