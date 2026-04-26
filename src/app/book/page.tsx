'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import BookingWizard from '@/components/booking/BookingWizard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Calendar, LogIn, Users } from 'lucide-react';

export default function BookPage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const [docRes, srvRes, pkgRes, setRes] = await Promise.all([
        supabase.from('doctors').select('*').eq('is_active', true).order('display_order', { ascending: true }),
        supabase.from('services').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
        supabase.from('packages').select('*').eq('is_active', true).order('created_at', { ascending: true }),
        supabase.from('clinic_settings').select('*').single()
      ]);

      setDoctors(docRes.data || []);
      setServices(srvRes.data || []);
      setPackages(pkgRes.data || []);
      setSettings(setRes.data);
      setLoading(false);
    }
    init();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 font-bold text-sm">Loading booking system...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Not logged in → show options
  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="bg-gradient-to-r from-primary to-blue-700 py-12 px-4 shadow-inner">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Book Your Visit</h1>
            <p className="text-slate-400 text-sm">Choose how you&apos;d like to proceed</p>
          </div>
        </div>

        <div className="container mx-auto max-w-2xl py-16 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Login Option */}
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100 hover:border-primary/30 transition-all hover:shadow-2xl group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <LogIn size={28} className="text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Patient Login</h3>
              <p className="text-slate-500 text-sm mb-6">Sign in to access the full booking wizard with treatment history.</p>
              <Link href="/login?returnTo=/book">
                <Button className="w-full h-12 rounded-xl">Sign In to Book</Button>
              </Link>
            </div>

            {/* Guest Option */}
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-2xl group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Users size={28} className="text-emerald-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Guest Booking</h3>
              <p className="text-slate-500 text-sm mb-6">No account needed. Quick book in under a minute.</p>
              <Link href="/guest-book">
                <Button variant="outline" className="w-full h-12 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50">Quick Book</Button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="bg-gradient-to-r from-primary to-blue-700 py-12 px-4 shadow-inner">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Digital Booking Centre</h1>
          <p className="text-slate-400 text-sm">Kathua&apos;s Advanced Dental Care — Official Reservation Portal</p>
        </div>
      </div>
      
      <BookingWizard 
        user={user}
        initialDoctors={doctors}
        initialServices={services}
        initialPackages={packages}
        consultationFee={settings?.consultation_fee || 200}
        workingHours={settings?.working_hours ?? undefined}
      />
      
      <Footer />
    </main>
  );
}
