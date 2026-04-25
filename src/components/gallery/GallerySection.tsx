// src/components/gallery/GallerySection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import ClinicTour from '@/components/gallery/ClinicTour';
import EquipmentShowcase from '@/components/gallery/EquipmentShowcase';

/**
 * Premium Gallery Section for the dental clinic website.
 * Includes:
 *  1. Hero area with a fixed‑position PNG background that has a subtle metallic shine animation.
 *  2. "Clinic Tour" highlight grid showcasing interior photos.
 *  3. Equipment showcase with a responsive masonry layout.
 */
export default function GallerySection() {
  const [showBackground, setShowBackground] = useState(true);

  // Fade the background PNG out when the user scrolls past a threshold.
  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.6;
      const scrolled = window.scrollY;
      setShowBackground(scrolled < threshold);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="gallery-section">
      {/* Fixed PNG background with smooth transition */}
      <div 
        className={`gallery-bg ${!showBackground ? 'opacity-0' : 'opacity-15'}`} 
        aria-hidden="true" 
      />
      <div className="gallery-content container mx-auto px-4 py-24">
        <h1 className="gallery-title">Gallery</h1>
        <p className="gallery-subtitle text-center max-w-2xl mx-auto mb-12">
          Explore our state‑of‑the‑art facilities, elegant interiors, and cutting‑edge equipment.
        </p>
        {/* Equipment Showcase Masonry */}
        <EquipmentShowcase />
        {/* Clinic Tour Grid */}
        <ClinicTour />
      </div>
    </section>
  );
}
