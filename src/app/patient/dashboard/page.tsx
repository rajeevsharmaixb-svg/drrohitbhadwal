'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/Card';
import { format } from 'date-fns';
import { Calendar, Clock, Stethoscope, Activity, Phone, Plus, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function PatientDashboard() {
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchData() {
      const [apptRes, settingsRes] = await Promise.all([
        supabase
          .from('appointments')
          .select(`
            *,
            doctors (full_name, specialization),
            services (name),
            packages (name)
          `)
          .eq('patient_id', user!.id)
          .order('preferred_date', { ascending: true }),
        supabase.from('clinic_settings').select('consultation_fee').single()
      ]);

      setAppointments(apptRes.data || []);
      setSettings(settingsRes.data);
      setLoading(false);
    }

    fetchData();
  }, [user, authLoading]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'rescheduled': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'completed': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const upcoming = appointments.filter(a => ['new', 'pending', 'confirmed', 'rescheduled'].includes((a.status || 'pending').toLowerCase()));
  const history = appointments.filter(a => ['completed', 'cancelled', 'no show'].includes((a.status || 'pending').toLowerCase()));

  if (authLoading || loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-bold text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 shadow-inner">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Patient Dashboard</h1>
            <p className="text-slate-500 mt-2 text-lg">Welcome back, <span className="text-primary font-extrabold">{user?.user_metadata?.full_name || 'Patient'}</span></p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/');
              }} 
              className="w-full md:w-auto h-12 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Logout
            </Button>
            <Link href="/book" className="flex-1 md:flex-none">
              <Button className="w-full h-12 rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-2">
                <Plus size={20} /> New Appointment
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Active Appointments */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
              <div className="bg-slate-900 p-6 md:p-8 flex justify-between items-center text-white">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <Calendar className="text-blue-400" size={24} />
                  Active Visits
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{upcoming.length} Scheduled</span>
              </div>
              <CardContent className="p-6 md:p-8">
                {upcoming.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold">No active appointments found.</p>
                    <p className="text-slate-400 text-xs mt-1">Book your next visit to get started.</p>
                    <Link href="/book">
                      <Button className="mt-6 rounded-xl">Book Now</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {upcoming.map((app: any) => (
                      <div key={app.id} className="group relative p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div className="flex items-start gap-5">
                            <div className="text-center bg-blue-50 px-5 py-3 rounded-2xl border border-blue-100 flex flex-col justify-center min-w-[80px]">
                              <span className="block text-[10px] font-bold text-primary uppercase tracking-tighter">{format(new Date(app.preferred_date), 'MMM')}</span>
                              <span className="block text-3xl font-black text-primary leading-none">{format(new Date(app.preferred_date), 'dd')}</span>
                            </div>
                            <div className="pt-1">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(app.status)} mb-3 inline-block`}>
                                {app.status}
                              </span>
                              <h3 className="font-bold text-slate-900 text-xl leading-tight">
                                {app.services?.name || app.packages?.name || 'General Consultation'}
                              </h3>
                              <div className="flex flex-wrap gap-4 mt-3 text-xs font-bold text-slate-500">
                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                  <Clock size={14} className="text-slate-400" />
                                  {app.preferred_time}
                                </div>
                                {app.doctors && (
                                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <Stethoscope size={14} className="text-slate-400" />
                                    Dr. {app.doctors.full_name}
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 text-emerald-700">
                                  <IndianRupee size={14} />
                                  Fee: ₹{settings?.consultation_fee || 200}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
              <div className="p-8 border-b border-slate-50">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                  <Activity className="text-slate-400" size={20} />
                  Medical History
                </h2>
              </div>
              <CardContent className="p-8">
                {history.length === 0 ? (
                  <div className="text-center py-10 text-slate-300 text-sm italic font-medium">
                    No past visits found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((app: any) => (
                      <div key={app.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300">
                        <div className="space-y-1">
                          <span className="block text-sm font-bold text-slate-800">{format(new Date(app.preferred_date), 'MMM dd, yyyy')}</span>
                          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.services?.name || 'Treatment'}</span>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider border ${
                          app.status?.toLowerCase() === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emergency Card */}
            <div className="bg-gradient-to-br from-primary to-blue-700 text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-primary/30 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:scale-150 transition-transform duration-1000">
                <Stethoscope size={200} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Clinical Emergency?</h3>
                <p className="text-white/70 text-sm mb-8 font-medium leading-relaxed">Experiencing severe pain or injury? Call our medical response line directly.</p>
                <a 
                  href="tel:+919018464914" 
                  className="flex items-center justify-center gap-3 bg-white text-primary px-8 py-4 rounded-2xl font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all w-full"
                >
                  <Phone size={20} />
                  +91 90184 64914
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
