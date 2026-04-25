'use client';

import Image from 'next/image';
import { Shield, Zap, Sparkles, Activity, Search } from 'lucide-react';

export default function EquipmentSection() {
  const tools = [
    {
      title: "Digital X-Ray (Alerio)",
      description: "Ultra-low radiation imaging for precise diagnostics and immediate results.",
      image: "/images/tools/alerio-xray.jpg",
      icon: Search
    },
    {
      title: "BioSonic Cleaning",
      description: "Advanced ultrasonic technology for thorough, gentle instrument sterilization.",
      image: "/images/tools/biosonic-close.jpg",
      icon: Shield
    },
    {
      title: "Piezo Surgery",
      description: "Precision bone surgery using ultrasonic micro-vibrations for faster healing.",
      image: "/images/tools/piezo-surgery.jpg",
      icon: Zap
    },
    {
      title: "Modern Sterilization",
      description: "World-class autoclave systems ensuring 100% patient safety and hygiene.",
      image: "/images/tools/shelf-overview.jpg",
      icon: Sparkles
    },
    {
      title: "Advanced Diagnostics",
      description: "High-magnification intraoral cameras for comprehensive oral health mapping.",
      image: "/images/tools/tools-composite.jpg",
      icon: Activity
    }
  ];

  return (
    <section id="equipment" className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8 anim-group">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4 anim-item">Precision Technology</h2>
            <h3 className="text-4xl md:text-6xl font-serif font-[800] text-slate-900 leading-tight tracking-tight anim-item">
              Advanced Clinical <span className="text-primary">Equipment</span>
            </h3>
          </div>
          <p className="text-xl text-slate-500 max-w-md anim-item font-medium leading-relaxed">
            Investing in the world's most advanced dental technology to ensure your treatments are faster, safer, and completely painless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 anim-group">
          {tools.map((tool, index) => (
            <div 
              key={index}
              className="group relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl anim-item border border-slate-100"
            >
              <Image 
                src={tool.image} 
                alt={tool.title} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-500 shadow-xl">
                  <tool.icon size={28} />
                </div>
                <h4 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{tool.title}</h4>
                <p className="text-sm text-white/70 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 leading-relaxed font-medium">
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
