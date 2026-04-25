'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Clock, GraduationCap } from 'lucide-react';

export default function DoctorsSection() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDoctors() {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (!error) setDoctors(data || []);
      setLoading(false);
    }
    fetchDoctors();
  }, [supabase]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>('[data-doctor-card]')?.offsetWidth || 340;
    el.scrollBy({ left: dir === 'right' ? cardWidth + 24 : -(cardWidth + 24), behavior: 'smooth' });
  };

  return (
    <section
      id="doctors"
      className="py-24 overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #ffedd5 100%)' }}
    >
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* ── Section Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs font-extrabold tracking-[0.35em] uppercase mb-3" style={{ color: '#1e40af' }}>
              Expert Medical Team
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
              Meet Our{' '}
              <span style={{ color: '#1e40af' }} className="italic">Specialists</span>
            </h2>
            <p className="mt-3 text-slate-500 text-base max-w-lg">
              Dedicated professionals committed to your best smile — powered by years of training and a passion for dental excellence.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="w-11 h-11 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center text-slate-500 hover:border-blue-700 hover:text-blue-700 transition-colors shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="w-11 h-11 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center text-slate-500 hover:border-blue-700 hover:text-blue-700 transition-colors shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
            <Link
              href="/doctors"
              className="ml-2 hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all shadow-md hover:shadow-lg hover:scale-105"
              style={{ background: '#1e40af' }}
            >
              View All <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* ── Carousel ── */}
        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="shrink-0 w-80 bg-white rounded-3xl animate-pulse shadow" style={{ height: 480 }} />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <p className="text-center py-16 text-slate-400 font-medium">
            No doctors found. Please add doctors from the admin panel.
          </p>
        ) : (
          <div
            ref={scrollRef}
            className="doctor-carousel flex gap-6 overflow-x-auto pb-6 -mx-4 px-4"
            style={{
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
            }}
          >
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                data-doctor-card
                className="shrink-0 rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                style={{
                  scrollSnapAlign: 'start',
                  width: '320px',
                  minWidth: '280px',
                  maxWidth: '340px',
                }}
              >
                {/* ── PHOTO AREA — completely separate from text ── */}
                <div className="relative w-full overflow-hidden" style={{ height: '340px', backgroundColor: '#f0f4ff' }}>
                  <img
                    src={doctor.photo_url || '/images/doctors/doctor4.jpg'}
                    alt={`Dr. ${doctor.full_name}`}
                    className="w-full h-full"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center 15%',
                    }}
                    loading="lazy"
                  />

                  {/* Rating badge — top right corner of photo */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow border border-white/60">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-black text-slate-800">{doctor.rating || '5.0'}</span>
                  </div>
                </div>

                {/* ── TEXT AREA — completely below the photo ── */}
                <div className="flex flex-col flex-1 p-5">
                  {/* Specialty tag */}
                  <span
                    className="inline-block self-start text-[10px] font-extrabold uppercase tracking-widest text-white px-3 py-1 rounded-lg mb-3"
                    style={{ background: '#1e40af' }}
                  >
                    {doctor.specialization || 'Dentist'}
                  </span>

                  {/* Name */}
                  <h3 className="text-xl font-extrabold text-slate-900 leading-snug mb-1">
                    {doctor.full_name}
                  </h3>

                  {/* Qualification */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <GraduationCap size={13} className="text-blue-500 shrink-0" />
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {doctor.qualification}
                    </p>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-2 text-slate-500 text-sm leading-snug mb-4 bg-slate-50 rounded-xl px-3 py-2.5">
                    <Clock size={14} className="shrink-0 text-blue-400" />
                    <span className="font-medium">{doctor.availability_hours || 'Available by Appointment'}</span>
                  </div>

                  {/* Spacer pushes button to bottom */}
                  <div className="flex-1" />

                  {/* CTA */}
                  <Link
                    href="/book"
                    className="block w-full text-center py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:shadow-md"
                    style={{
                      background: '#1e40af',
                      color: '#fff',
                    }}
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile "View All" link */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all shadow-md hover:shadow-lg"
            style={{ background: '#1e40af' }}
          >
            View All Doctors <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style>{`
        .doctor-carousel { -ms-overflow-style: none; scrollbar-width: none; }
        .doctor-carousel::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
