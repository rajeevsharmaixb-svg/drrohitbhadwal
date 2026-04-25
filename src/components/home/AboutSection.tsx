'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Shield, CheckCircle, Award } from 'lucide-react';
import Image from 'next/image';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;
          
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 16);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <div ref={ref} className="text-3xl font-black text-slate-900 mb-1">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function AboutSection() {
  const [stats, setStats] = useState({
    experience: 15,
    patients: 25000,
    equipment: 'State of Art',
  });



  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['experience_years', 'happy_patients', 'equipment_label', 'established']);

      if (!error && data) {
        const map: Record<string, string> = {};
        data.forEach((item: any) => { map[item.key] = item.value; });

        const established = parseInt(map['established'] || '2011');
        const calculatedExp = new Date().getFullYear() - established;

        setStats({
          experience: parseInt(map['experience_years'] || String(calculatedExp)),
          patients: parseInt(map['happy_patients'] || '25000'),
          equipment: map['equipment_label'] || 'State of Art',
        });
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Years of Experience', value: stats.experience, suffix: '+', icon: Award },
    { label: 'Happy Patients', value: stats.patients, suffix: '+', icon: CheckCircle },
    { label: 'Modern Equipment', displayValue: stats.equipment, icon: Shield },
  ];

  return (
    <section id="about" className="py-24 bg-premium-gradient overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16 anim-group">
          {/* Image Side */}
          <div className="flex-1 relative anim-item">
            <div className="relative z-10 rounded-[3.5rem] overflow-hidden shadow-2xl shadow-primary/20 aspect-[4/5] border-8 border-white">
              <Image 
                src="/images/doctors/doctor4.jpg" 
                alt="Dr. Rohit Bhadwal" 
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 rounded-full blur-3xl -z-10 opacity-60" />
          </div>

          {/* Text Side */}
          <div className="flex-1">
            <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4 anim-item">Our Legacy</h2>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight anim-item">
              A Decade of Excellence in <span className="text-primary italic">Dental Healthcare</span>
            </h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed anim-item font-medium">
              Welcome to <span className="text-primary font-bold">Dr Rohit Dental Clinic Braces & Implant Centre</span>. Established in 2011, we have been a pioneer in advanced dentistry in Kathua, Jammu. Led by Dr. Rohit Bhadwal, our multi-speciality team is committed to providing compassionate care using the latest technologies in orthodontics and implantology.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {statCards.map((stat, i) => (
                <div 
                  key={i} 
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:border-blue-200 hover:bg-blue-50/50 anim-item"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <stat.icon className="w-8 h-8 text-primary mb-4" />
                  {stat.displayValue ? (
                    <div className="text-2xl font-bold text-slate-900 mb-1">{stat.displayValue}</div>
                  ) : (
                    <AnimatedCounter target={stat.value!} suffix={stat.suffix} />
                  )}
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
