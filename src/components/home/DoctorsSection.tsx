'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function DoctorsSection() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDoctors() {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(3);
      
      if (!error) setDoctors(data || []);
      setLoading(false);
    }
    fetchDoctors();
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">Meet the Experts</h2>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight tracking-tight">World-Class Specialists Dedicated to Your Smile</h3>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/doctors">
              <Button variant="link" className="text-primary font-bold p-0 text-lg flex items-center group">
                Full Team Bio <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-slate-50 h-96 rounded-3xl animate-pulse shadow-sm" />
            ))
          ) : (
            doctors.map((doctor, idx) => {
              const localFallbacks = ['/images/doctors/doctor3.jpg', '/images/doctors/doctor1.jpg', '/images/doctors/doctor2.jpg', '/images/doctors/doctor4.jpg'];
              const displayPhoto = doctor.photo_url || localFallbacks[idx % localFallbacks.length];
              
              return (
              <div key={doctor.id} className="group relative overflow-hidden rounded-3xl shadow-lg shadow-black/5 hover:shadow-2xl transition-all duration-500">
                <div className="aspect-[3/4] bg-blue-50 overflow-hidden">
                  <img 
                    src={displayPhoto} 
                    alt={doctor.full_name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform group-hover:translate-y-0 transition-transform duration-500">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">{doctor.specialization}</div>
                  <h4 className="text-2xl font-bold mb-1">{doctor.full_name}</h4>
                  <p className="text-sm opacity-90 mb-4">{doctor.qualification}</p>
                  <div className="h-0 group-hover:h-12 overflow-hidden transition-all duration-500 flex items-center">
                    <p className="text-sm italic text-blue-100">{doctor.experience_years || '10+'} Years Experience</p>
                  </div>
                </div>
              </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
