'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Calendar, User, Phone, Stethoscope, CheckCircle2, Clock, MessageSquare, ArrowRight, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function GuestBookPage() {
  const supabase = createClient();

  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    patient_email: '',
    preferred_date: format(new Date(), 'yyyy-MM-dd'),
    message: '',
    service_id: '',
  });

  const [services, setServices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch services and doctors on mount
  useEffect(() => {
    async function fetchData() {
      const [srvRes, docRes] = await Promise.all([
        supabase.from('services').select('id, name, price_range').eq('is_active', true).order('sort_order'),
        supabase.from('doctors').select('id, full_name, specialization').eq('is_active', true).order('display_order'),
      ]);
      if (srvRes.data) setServices(srvRes.data);
      if (docRes.data) setDoctors(docRes.data);
    }
    fetchData();
  }, []);

  // Fetch slots when date or doctor changes
  useEffect(() => {
    async function fetchSlots() {
      let query = supabase
        .from('time_slots')
        .select('*')
        .eq('slot_date', formData.preferred_date)
        .eq('is_available', true);

      if (selectedDoctor) {
        query = query.eq('doctor_id', selectedDoctor);
      }

      const { data } = await query;
      setSlots(data || []);
      setSelectedSlot('');
    }
    if (formData.preferred_date) fetchSlots();
  }, [formData.preferred_date, selectedDoctor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.patient_name || !formData.patient_phone) {
      setError('Please provide your name and phone number.');
      setLoading(false);
      return;
    }

    const selectedSlotData = slots.find(s => s.id === selectedSlot);

    const payload = {
      patient_name: formData.patient_name,
      patient_phone: formData.patient_phone,
      patient_email: formData.patient_email || null,
      preferred_date: formData.preferred_date,
      preferred_time: selectedSlotData
        ? `${selectedSlotData.start_time} - ${selectedSlotData.end_time} (${selectedSlotData.shift})`
        : 'To be confirmed',
      service_id: formData.service_id || null,
      doctor_id: selectedDoctor || null,
      slot_id: selectedSlot || null,
      message: formData.message || null,
      status: 'pending',
    };

    const { error: insertError } = await supabase.from('appointments').insert([payload]);

    if (insertError) {
      setError('Booking failed. Please try again or contact us via WhatsApp.');
      console.error(insertError);
      setLoading(false);
      return;
    }

    // Mark slot as unavailable if one was selected
    if (selectedSlot) {
      await supabase.from('time_slots').update({ is_available: false }).eq('id', selectedSlot);
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto max-w-lg py-20 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Booking Confirmed!</h2>
            <p className="text-slate-600 mb-2">
              Your appointment request for <strong>{format(new Date(formData.preferred_date), 'MMMM dd, yyyy')}</strong> has been submitted.
            </p>
            <p className="text-slate-500 text-sm mb-8">
              Our team will confirm your appointment via phone call. Please keep your phone reachable.
            </p>

            <div className="space-y-4">
              <a
                href={`https://wa.me/919018464914?text=Hi%20Dr.%20Rohit%2C%20I%20just%20booked%20an%20appointment%20for%20${formData.preferred_date}.%20My%20name%20is%20${encodeURIComponent(formData.patient_name)}.`}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2">
                  <MessageSquare size={18} /> Confirm via WhatsApp
                </Button>
              </a>
              <Link href="/">
                <Button variant="outline" className="w-full h-12 rounded-xl mt-3 flex items-center justify-center gap-2">
                  <ArrowRight size={16} /> Back to Home
                </Button>
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
        <div className="container mx-auto text-center relative max-w-3xl">
          <Link href="/book" className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 text-white/80 hover:text-white items-center font-medium transition-colors text-sm">
            <ChevronLeft size={18} className="mr-1" /> Back -
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Quick Guest Booking</h1>
          <p className="text-blue-200 text-sm">No account needed — Book your dental visit in 30 seconds</p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl py-10 px-4">
        <Card className="overflow-hidden border-none shadow-2xl rounded-3xl">
          <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white p-8 border-b border-white/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar size={22} className="text-blue-400" /> Your Appointment Details
            </CardTitle>
            <CardDescription className="text-slate-400">
              Fill in your details and we&apos;ll take care of the rest.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <User size={14} className="text-primary" /> Full Name *
                  </label>
                  <Input
                    value={formData.patient_name}
                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone size={14} className="text-primary" /> Phone *
                  </label>
                  <Input
                    value={formData.patient_phone}
                    onChange={(e) => setFormData({ ...formData, patient_phone: e.target.value })}
                    placeholder="+91..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email (Optional)</label>
                <Input
                  type="email"
                  value={formData.patient_email}
                  onChange={(e) => setFormData({ ...formData, patient_email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>

              {/* Treatment */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <Stethoscope size={14} className="text-primary" /> Treatment
                </label>
                <select
                  value={formData.service_id}
                  onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                  className="w-full h-12 bg-white text-slate-900 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-primary outline-none shadow-sm cursor-pointer"
                >
                  <option value="" className="text-slate-900 bg-white">General Consultation (₹200)</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id} className="text-slate-900 bg-white">{s.name} — {s.price_range}</option>
                  ))}
                </select>
              </div>

              {/* Doctor */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Preferred Doctor</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor('')}
                    className={`p-3 rounded-xl border-2 text-center text-sm transition-all ${!selectedDoctor ? 'border-primary bg-blue-50 text-primary font-bold' : 'border-slate-100 hover:border-slate-200'
                      }`}
                  >
                    Any Doctor
                  </button>
                  {doctors.map(d => (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => setSelectedDoctor(d.id)}
                      className={`p-3 rounded-xl border-2 text-center text-sm transition-all ${selectedDoctor === d.id ? 'border-primary bg-blue-50 text-primary font-bold' : 'border-slate-100 hover:border-slate-200'
                        }`}
                    >
                      Dr. {d.full_name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" /> Date
                  </label>
                  <Input
                    type="date"
                    value={formData.preferred_date}
                    onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="h-12 text-center"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock size={14} className="text-primary" /> Time Slot
                  </label>
                  {slots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                      {slots.map(slot => (
                        <button
                          type="button"
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.id)}
                          className={`p-2 rounded-lg border text-center text-xs transition-all ${selectedSlot === slot.id
                              ? 'border-primary bg-blue-50 text-primary font-bold'
                              : 'border-slate-100 hover:border-slate-200'
                            }`}
                        >
                          {slot.start_time.substring(0, 5)}
                          <span className="block text-[9px] opacity-60 uppercase">{slot.shift}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-center text-amber-700 text-sm">
                      No slots for this date. We&apos;ll call to confirm timing.
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Special Notes / Symptoms</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your symptoms or any medical history..."
                  className="w-full h-32 bg-white text-slate-900 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm transition-colors resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 rounded-xl text-lg font-bold transition-all hover:shadow-lg"
                disabled={loading}
              >
                {loading ? 'Submitting...' : '✓ Confirm Booking'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Want to track your appointments? <Link href="/register" className="text-primary font-bold hover:underline">Create a free account</Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      <Footer />
    </main>
  );
}
