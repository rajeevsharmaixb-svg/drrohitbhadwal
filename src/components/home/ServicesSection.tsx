'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { Stethoscope, Shield, Smile, PlusCircle, Columns, Baby, Scissors, Sparkles, Droplet, Hammer, Clock, ArrowRight } from 'lucide-react';

const iconMap: Record<string, any> = {
  'stethoscope': Stethoscope,
  'shield': Shield,
  'smile': Smile,
  'plus-circle': PlusCircle,
  'columns': Columns,
  'baby': Baby,
  'scalpel': Scissors,
  'sparkles': Sparkles,
  'droplet': Droplet,
  'hammer': Hammer,
  'clock': Clock,
};

export default function ServicesSection() {
  const services = [
    {
      id: 1,
      name: 'Teeth Whitening',
      tag: 'Brighten Your Smile',
      description: 'Professional in-clinic whitening treatments that remove stains and discolouration, giving you a brighter, more confident smile in a single session.',
      icon: Smile,
      caption: 'Before/after whitening results',
      gradient: 'from-blue-100 to-indigo-100',
      svg: (
        <svg className="w-full h-full text-indigo-500/20" viewBox="0 0 100 100">
          <path fill="currentColor" d="M50 20 C20 20 10 40 10 60 C10 80 30 90 40 90 C45 90 50 80 50 80 C50 80 55 90 60 90 C70 90 90 80 90 60 C90 40 80 20 50 20 Z" />
          <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white" d="M35 45 Q50 60 65 45" />
          <circle cx="70" cy="30" r="5" fill="#eab308" />
          <circle cx="85" cy="40" r="3" fill="#eab308" />
        </svg>
      )
    },
    {
      id: 2,
      name: 'Dental Implants',
      tag: 'Permanent Solution',
      description: 'Titanium implants fused naturally with bone, providing a permanent, stable foundation that looks and functions exactly like natural teeth.',
      icon: Shield,
      caption: 'Titanium implant cross-section',
      gradient: 'from-slate-100 to-slate-200',
      svg: (
        <svg className="w-full h-full text-slate-400" viewBox="0 0 100 100">
          <path fill="currentColor" d="M40 10 H60 V40 H40 Z" />
          <path fill="currentColor" d="M45 40 H55 V80 H45 Z" />
          <path fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-slate-300" d="M35 50 L65 50 M35 60 L65 60 M35 70 L65 70" />
        </svg>
      )
    },
    {
      id: 3,
      name: 'Root Canal Treatment',
      tag: 'Painless & Safe',
      description: 'Modern, virtually painless RCT using rotary endodontics. Save your natural tooth and eliminate infection with minimal discomfort.',
      icon: Stethoscope,
      caption: 'Step-by-step RCT procedure',
      gradient: 'from-red-50 to-rose-100',
      svg: (
        <svg className="w-full h-full text-rose-500/20" viewBox="0 0 100 100">
          <path fill="currentColor" d="M30 20 C30 10 70 10 70 20 C70 40 80 60 80 80 C80 95 65 95 60 90 C55 85 50 70 50 70 C50 70 45 85 40 90 C35 95 20 95 20 80 C20 60 30 40 30 20 Z" />
          <path fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-rose-400" d="M40 30 V80 M60 30 V80" />
        </svg>
      )
    },
    {
      id: 4,
      name: 'Orthodontics (Braces)',
      tag: 'Perfect Alignment',
      description: 'Metal, ceramic, and clear aligner options — customised orthodontic plans to correct misaligned teeth and create a harmonious, confident smile.',
      icon: Columns,
      caption: 'Metal & ceramic brace options',
      gradient: 'from-emerald-50 to-teal-100',
      svg: (
        <svg className="w-full h-full text-teal-500/20" viewBox="0 0 100 100">
          <path fill="currentColor" d="M20 30 Q50 60 80 30 V50 Q50 80 20 50 Z" />
          <circle cx="30" cy="45" r="5" fill="currentColor" className="text-teal-600" />
          <circle cx="70" cy="45" r="5" fill="currentColor" className="text-teal-600" />
          <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-400" d="M10 40 Q50 70 90 40" />
        </svg>
      )
    },
    {
      id: 5,
      name: 'Laser Dentistry',
      tag: 'Advanced Technology',
      description: 'Precision laser treatments for gum reshaping, cavity detection, and painless soft-tissue procedures — faster healing, less discomfort.',
      icon: Sparkles,
      caption: 'Precision laser gum reshaping',
      gradient: 'from-fuchsia-50 to-purple-100',
      svg: (
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path fill="currentColor" className="text-purple-500/20" d="M20 60 Q50 40 80 60 V90 Q50 70 20 90 Z" />
          <path fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-fuchsia-500" d="M50 10 L50 50" />
          <circle cx="50" cy="55" r="8" fill="currentColor" className="text-fuchsia-400 opacity-50" />
        </svg>
      )
    },
    {
      id: 6,
      name: 'Smile Design',
      tag: 'Complete Transformation',
      description: 'Full digital smile design combining veneers, whitening, and cosmetic bonding — artistically crafted to enhance your natural beauty.',
      icon: ArrowRight,
      caption: 'Digital smile design preview',
      gradient: 'from-amber-50 to-yellow-100',
      svg: (
        <svg className="w-full h-full text-amber-500/20" viewBox="0 0 100 100">
           <path fill="currentColor" d="M50 20 C20 20 10 40 10 60 C10 80 30 90 40 90 C45 90 50 80 50 80 C50 80 55 90 60 90 C70 90 90 80 90 60 C90 40 80 20 50 20 Z" />
           <path fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-amber-500" d="M25 50 Q50 70 75 50" />
           <path fill="currentColor" className="text-primary" d="M75 25 L80 15 L85 25 L95 30 L85 35 L80 45 L75 35 L65 30 Z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">Our Expertise</h2>
          <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tight">Advanced Dental Care</h3>
          <p className="text-xl font-medium text-primary mb-4">
            Painless Treatment and Modern Equipment with Expert Care.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Experience the future of dentistry with our state-of-the-art diagnostic tools and patient-focused treatments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Card 
                key={service.id} 
                className={`group relative hover:-translate-y-2 transition-all duration-300 border-none shadow-sm hover:shadow-xl bg-white overflow-hidden`}
              >
                <CardContent className={`p-10 flex flex-col justify-between h-full`}>
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-500 bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full shrink-0">
                        {service.tag}
                      </span>
                    </div>
                    
                    <h4 className={`text-2xl font-bold mb-4 text-slate-900 group-hover:text-primary transition-colors`}>
                      {service.name}
                    </h4>
                    
                    <p className={`leading-relaxed mb-6 line-clamp-3 text-slate-600`}>
                      {service.description}
                    </p>

                    <div className={`w-full h-32 rounded-xl mb-6 bg-gradient-to-br ${service.gradient} overflow-hidden p-4 relative`}>
                      {service.svg}
                      <p className="absolute bottom-2 right-4 text-[10px] italic text-slate-500/80 font-medium">
                        {service.caption}
                      </p>
                    </div>
                  </div>

                  <Link href={`/services`} className={`inline-flex items-center font-bold group-hover:gap-2 transition-all mt-auto text-primary`}>
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/services">
            <Button size="lg" variant="outline" className="px-10 border-blue-200 hover:border-primary transition-all rounded-full">
              View All Specialized Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
