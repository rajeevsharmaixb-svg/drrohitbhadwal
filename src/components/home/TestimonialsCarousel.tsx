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
        <div className="text-center mb-16 anim-group">
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4 anim-item">Reviews</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full anim-item" />
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
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-slate-50 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200"
              >
                {/* Visual Side */}
                <div className="relative aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-200 shadow-xl group">
                  {testimonials[activeIndex].is_video ? (
                    <div className="w-full h-full relative cursor-pointer" onClick={() => window.open(testimonials[activeIndex].video_url, '_blank')}>
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center group-hover:bg-slate-900/20 transition-all z-20">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl scale-95 group-hover:scale-110 transition-transform">
                          <Play size={24} className="ml-1" />
                        </div>
                      </div>
                      {testimonials[activeIndex].patient_photo_url && (
                        <img src={testimonials[activeIndex].patient_photo_url} className="w-full h-full object-cover" alt="Patient Thumbnail" />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      {testimonials[activeIndex].patient_photo_url ? (
                        <img src={testimonials[activeIndex].patient_photo_url} className="w-full h-full object-cover" alt={testimonials[activeIndex].patient_name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-blue-600 p-12 text-white">
                          <Quote size={60} className="opacity-20 absolute top-8 left-8" />
                          <p className="text-xl font-serif italic text-center relative z-10 leading-relaxed">
                            "{testimonials[activeIndex].review_text.substring(0, 150)}..."
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Content Side */}
                <div className="space-y-6">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif text-slate-800 leading-relaxed italic">
                    "{testimonials[activeIndex].review_text}"
                  </h3>
                  <div className="flex items-center gap-5 pt-8 border-t border-slate-200">
                    <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden shadow-lg p-1">
                      <div className="w-full h-full rounded-xl overflow-hidden bg-slate-100">
                        {testimonials[activeIndex].patient_photo_url ? (
                          <img src={testimonials[activeIndex].patient_photo_url} className="w-full h-full object-cover" alt={testimonials[activeIndex].patient_name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary font-black text-2xl">
                            {testimonials[activeIndex].patient_name[0]}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 uppercase tracking-widest leading-tight">{testimonials[activeIndex].patient_name}</p>
                      <p className="text-sm font-bold text-primary uppercase tracking-normal mt-1">{testimonials[activeIndex].treatment || 'Verified Patient'}</p>
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
