'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Stethoscope, Star, GraduationCap, Briefcase, 
  ChevronRight, Calendar, User, Search
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function DoctorsPage() {
  const supabase = createClient();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchDoctors() {
      const { data } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      setDoctors(data || []);
      setLoading(false);
    }
    fetchDoctors();
  }, [supabase]);

  const filtered = doctors.filter(d => 
    d.full_name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto py-32 px-4 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin mb-6" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Assembling Medical Team...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Header */}
      <section className="bg-[#0F766E] pt-32 pb-20 px-4">
        <div className="container mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
          >
            <Stethoscope size={16} className="text-[#14B8A6]" />
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Our Clinical Experts</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-serif text-white leading-tight"
          >
            Meet the Specialists at <br />
            <span className="text-[#14B8A6]">Rohit Dental Clinic</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto relative group mt-12"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#14B8A6] transition-colors" size={24} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or specialization..."
              className="w-full h-16 pl-16 pr-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 text-white placeholder:text-white/40 focus:ring-4 focus:ring-[#14B8A6]/20 outline-none transition-all text-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12">
          {filtered.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold">No specialists found matching your search.</p>
            </div>
          ) : (
            filtered.map((doc, i) => (
              <motion.div 
                key={doc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 group hover:shadow-primary/5 transition-all duration-700"
              >
                <div className="flex flex-col lg:flex-row h-full">
                  {/* Image Side */}
                  <div className="lg:w-1/3 relative h-[400px] lg:h-auto overflow-hidden">
                    {doc.photo_url ? (
                      <img src={doc.photo_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={doc.full_name} />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <User size={80} className="text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Content Side */}
                  <div className="lg:w-2/3 p-8 md:p-16 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <Badge className="bg-[#14B8A6]/10 text-[#14B8A6] border-none rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest mb-3">
                            {doc.specialization}
                          </Badge>
                          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight">Dr. {doc.full_name}</h2>
                          <p className="text-slate-400 font-bold text-sm">{doc.qualification}</p>
                        </div>
                        <div className="flex bg-slate-50 px-4 py-2 rounded-2xl items-center gap-2">
                           <Star size={18} className="text-amber-400 fill-amber-400" />
                           <span className="font-black text-slate-900">4.9</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-slate-100">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#14B8A6]">
                            <Briefcase size={24} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                            <p className="text-slate-900 font-bold">{doc.experience_years} Years Professional Practice</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#14B8A6]">
                            <Calendar size={24} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability</p>
                            <p className="text-slate-900 font-bold">{doc.availability || 'Daily Clinical Hours'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6">
                        <h4 className="text-[10px] font-black text-[#14B8A6] uppercase tracking-[0.2em] mb-4">Professional Expertise</h4>
                        <p className="text-slate-600 leading-relaxed text-lg italic">
                          "{doc.experience_description || doc.short_bio || 'Dedicated to providing precision dental care and aesthetic excellence.'}"
                        </p>
                      </div>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row gap-6">
                      <Link href={`/book?doctor=${doc.id}`} className="flex-1">
                        <Button className="w-full h-16 rounded-2xl shadow-xl shadow-primary/20 bg-[#14B8A6] hover:bg-[#0F766E] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                          Book Visit with Dr. {doc.full_name.split(' ')[0]} <ChevronRight size={18} />
                        </Button>
                      </Link>
                      <Button variant="outline" className="flex-1 h-16 rounded-2xl border-slate-200 text-slate-900 font-black uppercase tracking-widest text-sm">
                        View Full Clinical Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
