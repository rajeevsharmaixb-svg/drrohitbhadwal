'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { HelpCircle, ChevronDown, Calendar, Phone } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/Button';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  action?: string | null;
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchFAQs() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('faq')
        .select('id, question, answer, action')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data) {
        setFaqs(data);
      }
      setLoading(false);
    }
    fetchFAQs();
  }, []);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-premium-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 anim-heading fade-out-on-exit">
          <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">Common Questions</h2>
          <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-lg text-slate-600 leading-relaxed">
            Find quick answers to common dental queries. Can&apos;t find what you need? Contact our team directly for personalized assistance.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white h-20 rounded-2xl animate-pulse shadow-sm" />
              ))}
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
              <HelpCircle size={40} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 font-bold">No FAQs available yet.</p>
              <p className="text-slate-400 text-sm mt-1">Contact us directly for any questions.</p>
            </div>
          ) : (
            <div className="space-y-4 anim-group">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow anim-card"
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                        activeIndex === index ? 'bg-primary text-white' : 'bg-blue-50 text-primary'
                      }`}>
                        <HelpCircle size={20} />
                      </div>
                      <h4 className="font-bold text-slate-800 text-left leading-relaxed">
                        {faq.question}
                      </h4>
                    </div>
                    <ChevronDown 
                      size={20} 
                      className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                        activeIndex === index ? 'rotate-180 text-primary' : ''
                      }`} 
                    />
                  </button>

                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      activeIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 ml-14">
                        <p className="text-slate-600 leading-relaxed mb-4">{faq.answer}</p>
                        
                        {faq.action && faq.action !== 'none' && (
                          <div className="flex gap-3">
                            {faq.action === 'book' && (
                              <Link href="/book">
                                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs h-9 px-4 rounded-xl">
                                  <Calendar size={14} className="mr-1.5" /> Book Appointment
                                </Button>
                              </Link>
                            )}
                            {faq.action === 'whatsapp' && (
                              <a href="https://wa.me/919018464914" target="_blank" rel="noreferrer">
                                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white text-xs h-9 px-4 rounded-xl">
                                  <Phone size={14} className="mr-1.5" /> WhatsApp
                                </Button>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
