'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Video, Play } from 'lucide-react';

export default function TestimonialsCarousel() {
  const supabase = createClient();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_live', true)
        .order('created_at', { ascending: false });
      
      setTestimonials(data || []);
      setLoading(false);
    }
    fetchTestimonials();
  }, [supabase]);

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  if (loading || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mb-4">Patient Voices</h2>
          <div className="w-24 h-1 bg-[#14B8A6] mx-auto rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-slate-50 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-slate-200"
              >
                {/* Visual Side */}
                <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-200 shadow-xl group">
                  {testimonials[activeIndex].is_video ? (
                    <div className="w-full h-full relative cursor-pointer" onClick={() => window.open(testimonials[activeIndex].video_url, '_blank')}>
                      {/* Placeholder for video thumbnail/preview */}
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center group-hover:bg-slate-900/20 transition-all">
                        <div className="w-20 h-20 bg-[#14B8A6] rounded-full flex items-center justify-center text-white shadow-2xl scale-95 group-hover:scale-110 transition-transform">
                          <Play size={32} className="ml-1" />
                        </div>
                      </div>
                      {testimonials[activeIndex].patient_photo_url && (
                        <img src={testimonials[activeIndex].patient_photo_url} className="w-full h-full object-cover" alt="Patient Thumbnail" />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0F766E] to-[#14B8A6] p-12 text-white">
                      <Quote size={80} className="opacity-20 absolute top-8 left-8" />
                      <p className="text-2xl font-serif italic text-center relative z-10 leading-relaxed">
                        "{testimonials[activeIndex].review_text.substring(0, 150)}..."
                      </p>
                    </div>
                  )}
                </div>

                {/* Content Side */}
                <div className="space-y-6">
                  <div className="flex gap-1 text-[#14B8A6]">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => <Star key={i} size={20} fill="#14B8A6" />)}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif text-slate-800 leading-tight">
                    "{testimonials[activeIndex].review_text}"
                  </h3>
                  <div className="flex items-center gap-4 pt-6">
                    <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden shadow-md">
                      {testimonials[activeIndex].patient_photo_url ? (
                        <img src={testimonials[activeIndex].patient_photo_url} className="w-full h-full object-cover" alt={testimonials[activeIndex].patient_name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#14B8A6] font-black text-xl">
                          {testimonials[activeIndex].patient_name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 uppercase tracking-widest">{testimonials[activeIndex].patient_name}</p>
                      <p className="text-sm font-bold text-[#14B8A6] uppercase tracking-tighter">{testimonials[activeIndex].treatment || 'Verified Patient'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-4 mt-12">
              <button 
                onClick={prev}
                className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#14B8A6] hover:text-[#14B8A6] transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={next}
                className="w-14 h-14 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#14B8A6] hover:text-[#14B8A6] transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
