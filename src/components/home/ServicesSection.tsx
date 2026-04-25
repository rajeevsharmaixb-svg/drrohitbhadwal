'use client';

import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { Stethoscope, Shield, Smile, PlusCircle, Columns, Baby, Scissors, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function ServicesSection() {
  const services = [
    {
      id: 1,
      name: 'Teeth Whitening',
      tag: 'Brighten Your Smile',
      description: 'Professional in-clinic whitening treatments that remove stains and discolouration, giving you a brighter, more confident smile in a single session.',
      icon: Smile,
      image: '/images/services/teeth_whitening.webp',
    },
    {
      id: 2,
      name: 'Dental Implants',
      tag: 'Permanent Solution',
      description: 'Titanium implants fused naturally with bone, providing a permanent, stable foundation that looks and functions exactly like natural teeth.',
      icon: Shield,
      image: '/images/services/root_canal.webp', // Fallback to root canal if implant img missing
    },
    {
      id: 3,
      name: 'Root Canal Treatment',
      tag: 'Painless & Safe',
      description: 'Modern, virtually painless RCT using rotary endodontics. Save your natural tooth and eliminate infection with minimal discomfort.',
      icon: Stethoscope,
      image: '/images/services/rct_action.webp',
    },
    {
      id: 4,
      name: 'Orthodontics (Braces)',
      tag: 'Perfect Alignment',
      description: 'Metal, ceramic, and clear aligner options — customised orthodontic plans to correct misaligned teeth and create a harmonious, confident smile.',
      icon: Columns,
      image: '/images/services/orthodontics.webp',
    },
    {
      id: 5,
      name: 'Laser Dentistry',
      tag: 'Advanced Technology',
      description: 'Precision laser treatments for gum reshaping, cavity detection, and painless soft-tissue procedures — faster healing, less discomfort.',
      icon: Sparkles,
      image: '/images/tools/biosonic-close.jpg',
    },
    {
      id: 6,
      name: 'Smile Design',
      tag: 'Complete Transformation',
      description: 'Full digital smile design combining veneers, whitening, and cosmetic bonding — artistically crafted to enhance your natural beauty.',
      icon: ArrowRight,
      image: '/images/services/aligners_close_up.webp',
    },
    {
      id: 7,
      name: 'General Checkup',
      tag: 'Preventive Care',
      description: 'Comprehensive dental exams to catch issues early and maintain optimal oral health.',
      icon: PlusCircle,
      image: '/images/services/general_checkup.webp',
    },
    {
      id: 8,
      name: 'Kids Dentistry',
      tag: 'Gentle & Fun',
      description: 'Specialized pediatric care focusing on building good habits and ensuring a stress-free experience for children.',
      icon: Baby,
      image: '/images/services/consultation.webp',
    },
    {
      id: 9,
      name: 'Oral Surgery',
      tag: 'Expert Procedures',
      description: 'Safe and precise surgical extractions including wisdom teeth removal under local anesthesia.',
      icon: Scissors,
      image: '/images/tools/PIEZO SURGERY.webp',
    }
  ];

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20 anim-group">
          <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4 anim-item">Our Expertise</h2>
          <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tight anim-item">Advanced Dental Care</h3>
          <p className="text-xl font-medium text-primary mb-4 anim-item">
            Painless Treatment and Modern Equipment with Expert Care.
          </p>
          <p className="text-lg text-black leading-relaxed anim-item">
            Experience the future of dentistry with our state-of-the-art diagnostic tools and patient-focused treatments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 anim-group">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Card
                key={service.id}
                className="group relative hover:-translate-y-2 transition-all duration-300 border-none shadow-sm hover:shadow-xl bg-white overflow-hidden anim-item"
              >
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 " />
                    <div className="absolute bottom-6 left-8 right-8">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                          {service.tag}
                        </span>
                      </div>
                      <h4 className="text-2xl font-bold text-white">
                        {service.name}
                      </h4>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <p className="leading-relaxed mb-6 line-clamp-3 text-black">
                      {service.description}
                    </p>

                    <Link href="/services" className="inline-flex items-center font-bold text-primary group-hover:gap-2 transition-all mt-auto">
                      Learn More <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-16 text-center anim-group">
          <Link href="/services" className="anim-item inline-block">
            <Button size="lg" variant="outline" className="px-10 border-blue-200 hover:border-primary transition-all rounded-full">
              View All Specialized Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
