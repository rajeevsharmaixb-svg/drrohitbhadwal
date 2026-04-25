'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Star, Quote, Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function ReviewsPage() {
  const supabase = createClient();
  const [testimonials, setTestimonials] = useState<any[]>([]);
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

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <Link href="/" className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest mb-6 hover:gap-3 transition-all">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6">Patient Reviews</h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              Read honest experiences from our patients. We take pride in delivering exceptional dental care and building long-term relationships with our community.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-[2rem] p-8 h-64 animate-pulse border border-slate-100 shadow-sm" />
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((review) => (
                <div 
                  key={review.id} 
                  className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                        />
                      ))}
                    <Quote className="text-slate-100 group-hover:text-primary/20 transition-colors" size={32} />
                  </div>

                  <div className="mb-8">
                    <p className="text-sm text-slate-600 leading-relaxed italic line-clamp-6 group-hover:line-clamp-none transition-all">
                      "{review.review_text}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                    <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                      {review.patient_photo_url ? (
                        <img src={review.patient_photo_url} className="w-full h-full object-cover" alt={review.patient_name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary font-black text-lg bg-blue-50">
                          {review.patient_name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">{review.patient_name}</p>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{review.treatment || 'Verified Patient'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <p className="text-xl text-slate-400">No reviews found yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-8">Share Your Experience</h2>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary px-10 rounded-full font-bold">
              Write a Review
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
