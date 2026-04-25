'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Users, Calendar, Clock, IndianRupee, TrendingUp, 
  ArrowUpRight, ArrowDownRight, CheckCircle2, 
  AlertCircle, ChevronRight, Activity, Stethoscope, Briefcase,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    confirmedToday: 0,
    pendingApproval: 0,
    estimatedRevenue: 0,
    newPatients: 0
  });
  const [recentAppts, setRecentAppts] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'operations' | 'intelligence'>('operations');

  const fetchDashboardData = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Fetch stats & recent data in parallel
    const [apptRes, doctorRes, patientRes, settingsRes] = await Promise.all([
      supabase.from('appointments').select('*, services(price_range)'),
      supabase.from('doctors').select('*').order('display_order', { ascending: true }).limit(3),
      supabase.from('users').select('id', { count: 'exact' }).eq('role', 'patient'),
      supabase.from('clinic_settings').select('consultation_fee').single()
    ]);

    if (!apptRes.error) {
      const all = apptRes.data || [];
      const todayAppts = all.filter(a => a.preferred_date === today);
      const confirmed = todayAppts.filter(a => a.status === 'confirmed').length;
      const pending = all.filter(a => a.status === 'pending').length;
      
      // Rough revenue estimate: confirmed today * fee + base 
      const fee = settingsRes.data?.consultation_fee || 200;
      const revenue = confirmed * fee;

      setStats({
        totalAppointments: all.length,
        confirmedToday: confirmed,
        pendingApproval: pending,
        estimatedRevenue: revenue,
        newPatients: patientRes.count || 0
      });
      setRecentAppts(todayAppts.slice(0, 5));
    }

    if (!doctorRes.error) {
      setDoctors(doctorRes.data || []);
    }

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchDashboardData();

    // Subscribe to changes
    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchDashboardData]);

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-[400px] rounded-[3rem]" />
          <Skeleton className="h-[400px] rounded-[3rem]" />
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Appointments Today', value: stats.confirmedToday, icon: Calendar, color: 'text-primary', bg: 'bg-primary/10', trend: '+12%', up: true },
    { title: 'Pending Approval', value: stats.pendingApproval, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100/10', trend: 'Needs review', warning: true },
    { title: 'Clinical Revenue', value: `₹${stats.estimatedRevenue}`, icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-100/10', trend: 'Live estimation', up: true },
    { title: 'Total Patients', value: stats.newPatients, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100/10', trend: 'Lifetime total' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="text-primary animate-pulse" size={32} />
            Clinical Intelligence
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Real-time operational overview for Dr. Rohit Bhadwal&apos;s Dental & Implant Centre.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
             <button 
                onClick={() => setView('operations')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${view === 'operations' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-primary bg-transparent'}`}
             >
                Operations
             </button>
            <button 
                onClick={() => setView('intelligence')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${view === 'intelligence' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-primary bg-transparent'}`}
            >
                Intelligence
            </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
          >
            <Card className="border-none bg-white border border-slate-100 shadow-xl relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full -mr-8 -mt-8 opacity-20 group-hover:scale-150 transition-transform duration-700`} />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-inner`}>
                    <stat.icon size={24} />
                  </div>
                  {stat.trend && (
                    <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${stat.up ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {stat.up ? <ArrowUpRight size={12} /> : (stat.warning ? <AlertCircle size={12} /> : null)}
                      {stat.trend}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors uppercase">{stat.title}</p>
                  <h3 className="text-4xl font-black text-slate-900">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Timeline */}
        <Card className="lg:col-span-2 border-none bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl">
          <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl text-slate-900">Biological Timeline</CardTitle>
              <CardDescription>Real-time slot tracking for confirmed procedures today.</CardDescription>
            </div>
            <Link href="/admin/appointments">
                <Button variant="outline" size="sm" className="rounded-xl border-white/10 text-slate-400 hover:text-white h-9 px-4 text-xs font-black uppercase">Full Log</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-white/5">
                {recentAppts.length === 0 ? (
                    <div className="p-20 text-center">
                        <Calendar className="mx-auto text-white/5 mb-4" size={64} />
                        <p className="text-slate-500 font-bold">No confirmed clinical slots for the remainder of today.</p>
                    </div>
                ) : (
                    recentAppts.map((appt, i) => (
                        <div key={i} className="group p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50 transition-all cursor-default border-b border-slate-50 last:border-none">
                             <div className="flex items-center gap-5 w-full md:w-auto">
                                <div className="text-center w-16">
                                    <p className="text-lg font-black text-slate-900">{appt.preferred_time.split(' ')[0]}</p>
                                    <p className="text-[9px] font-black uppercase tracking-tight text-primary">Confirmed</p>
                                </div>
                                <div className="h-10 w-px bg-slate-100 hidden md:block" />
                                <div>
                                    <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{appt.patient_name}</h4>
                                    <p className="text-xs text-slate-500 font-medium">{appt.services?.name || 'General Treatment'}</p>
                                </div>
                             </div>

                             <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Stethoscope size={14} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-500">Dr. {doctors[0]?.full_name || 'Assigned'}</p>
                                </div>
                                <ChevronRight className="text-slate-300 group-hover:text-primary transition-all transform group-hover:translate-x-1" size={20} />
                             </div>
                        </div>
                    ))
                )}
             </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Team */}
        <div className="space-y-8">
            <Card className="border-none bg-primary shadow-2xl shadow-primary/20 rounded-[3rem] p-8 text-white relative overflow-hidden">
                <TrendingUp className="absolute bottom-0 right-0 text-white/10 -mb-8 -mr-8" size={200} />
                <div className="relative z-10 space-y-6">
                    <h3 className="text-xl font-black">Strategic Actions</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <Link href="/admin/doctors">
                            <button className="w-full h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-between px-6 transition-all group border border-white/20">
                                <span className="text-xs font-black uppercase tracking-widest">Enlist Specialist</span>
                                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </Link>
                        <Link href="/admin/services">
                            <button className="w-full h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-between px-6 transition-all group border border-white/20">
                                <span className="text-xs font-black uppercase tracking-widest">Update Catalog</span>
                                <Briefcase size={18} />
                            </button>
                        </Link>
                    </div>
                </div>
            </Card>

            <Card className="border-none bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl">
                <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-lg text-slate-900">Active Surgeons</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                    {doctors.map((doc, idx) => {
                        const localFallbacks = ['/images/doctors/doctor3.jpg', '/images/doctors/doctor1.jpg', '/images/doctors/doctor2.jpg', '/images/doctors/doctor4.jpg'];
                        const displayPhoto = doc.photo_url || localFallbacks[idx % localFallbacks.length];
                        
                        return (
                        <div key={idx} className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
                                <img src={displayPhoto} className="w-full h-full object-cover transition-all duration-300" />
                            </div>
                            <div className="flex-1">
                                <h5 className="text-sm font-bold text-slate-900">Dr. {doc.full_name}</h5>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{doc.specialization}</p>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                        </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

