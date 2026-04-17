'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { 
  Calendar, Search, Filter, Phone, Mail, MoreHorizontal, 
  CheckCircle, XCircle, Clock, Eye, Edit2, AlertCircle, 
  ChevronRight, ArrowRight, MessageSquare 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from '@/components/ui/Table';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminAppointmentsPage() {
  const supabase = createClient();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [syncing, setSyncing] = useState(false);

  // Modals state
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAppointments = useCallback(async (showSync = false) => {
    if (showSync) setSyncing(true);
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctors (full_name, specialization),
        services (name, duration_minutes)
      `)
      .order('preferred_date', { ascending: false });

    if (error) {
      toast.error('Failed to sync appointments');
    } else {
      setAppointments(data || []);
    }
    setLoading(false);
    if (showSync) setSyncing(false);
  }, [supabase]);

  useEffect(() => {
    fetchAppointments();

    // Real-time subscription
    const channel = supabase
      .channel('appointments-realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'appointments' 
      }, () => {
        fetchAppointments(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchAppointments]);

  const updateStatus = async (id: string, status: string, reason?: string) => {
    setIsSubmitting(true);
    const { error } = await supabase
      .from('appointments')
      .update({ status, rejection_reason: reason })
      .eq('id', id);

    if (error) {
      toast.error(`Failed to update to ${status}`);
    } else {
      toast.success(`Appointment ${status}`);
      setIsRejectOpen(false);
      setRejectionReason('');
    }
    setIsSubmitting(false);
  };

  const filtered = appointments.filter(app => {
    const matchesSearch = app.patient_name.toLowerCase().includes(search.toLowerCase()) ||
                         app.patient_phone.includes(search) ||
                         (app.patient_email || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'completed': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const AppointmentDetails = ({ appt }: { appt: any }) => (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Patient Identity</p>
          <div className="space-y-1">
            <p className="text-lg font-bold text-slate-900">{appt.patient_name}</p>
            <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Phone size={14} /> {appt.patient_phone}
            </p>
            {appt.patient_email && (
              <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Mail size={14} /> {appt.patient_email}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Medical Officer</p>
          <div className="space-y-1">
            <p className="text-lg font-bold text-slate-900">Dr. {appt.doctors?.full_name || 'Not Assigned'}</p>
            <p className="text-sm font-bold text-primary uppercase tracking-tight">{appt.doctors?.specialization || 'General'}</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Clinical Slot</p>
          <Badge variant={getStatusVariant(appt.status)}>{appt.status}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{format(new Date(appt.preferred_date), 'MMM dd, yyyy')}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{format(new Date(appt.preferred_date), 'EEEE')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{appt.preferred_time}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{appt.services?.duration_minutes} Minutes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Treatment Path</p>
        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare size={18} className="text-blue-500" />
            <span className="text-sm font-bold text-slate-700">{appt.services?.name || 'General Checkup'}</span>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest">Modify</Button>
        </div>
      </div>

      {appt.message && (
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Patient Message</p>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 italic text-sm text-slate-600 leading-relaxed shadow-inner">
            &quot;{appt.message}&quot;
          </div>
        </div>
      )}

      {appt.status === 'rejected' && appt.rejection_reason && (
        <div className="p-5 rounded-2xl bg-red-50 border border-red-100">
          <p className="text-[10px] font-black uppercase text-red-400 tracking-widest mb-2">Rejection Verdict</p>
          <p className="text-sm font-bold text-red-700">{appt.rejection_reason}</p>
        </div>
      )}

      <div className="pt-6 border-t border-slate-100 flex gap-3">
        {appt.status === 'pending' && (
          <Button 
            onClick={() => updateStatus(appt.id, 'confirmed')}
            className="flex-1 h-12 rounded-2xl shadow-xl shadow-primary/20"
            disabled={isSubmitting}
          >
            Confirm Reservation
          </Button>
        )}
        {appt.status === 'confirmed' && (
          <Button 
            onClick={() => updateStatus(appt.id, 'completed')}
            className="flex-1 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200"
            disabled={isSubmitting}
          >
            Mark as Completed
          </Button>
        )}
        <Button 
          variant="outline" 
          className="h-12 rounded-2xl border-slate-200 text-slate-600"
          onClick={() => {
            setSelectedAppt(appt);
            setIsRejectOpen(true);
          }}
          disabled={isSubmitting || appt.status === 'rejected'}
        >
          Reject
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-20 bg-white rounded-3xl" />
        <div className="h-[600px] bg-white rounded-[2.5rem]" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Calendar size={28} className="text-primary" />
              Clinical Reservations
            </h1>
            {syncing && (
              <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <Clock size={10} className="animate-spin" /> Live Sync
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm">Manage, confirm, and track all patient clinical visits in real-time.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient name..." 
                className="pl-11 rounded-xl h-12 shadow-sm border-slate-200"
              />
           </div>
           <Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-40 rounded-xl h-12 shadow-sm border-slate-200"
           >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
           </Select>
        </div>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead>Patient Details</TableHead>
                <TableHead>Treatment Path</TableHead>
                <TableHead>Clinical Slot</TableHead>
                <TableHead>Medical Officer</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search size={48} className="mb-4 opacity-20" />
                      <p className="text-sm font-bold">No appointments found matching your criteria.</p>
                      <button 
                        onClick={() => {setSearch(''); setStatusFilter('all');}} 
                        className="text-primary text-xs font-black uppercase mt-4 hover:underline"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((app: any) => (
                  <TableRow key={app.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs shadow-inner">
                          {app.patient_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{app.patient_name}</p>
                          <div className="flex gap-2 mt-1">
                            <a href={`tel:${app.patient_phone}`} className="text-[10px] text-slate-400 hover:text-primary flex items-center gap-1 font-bold"><Phone size={10} /> {app.patient_phone}</a>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-bold text-slate-600 truncate max-w-[150px]">
                        {app.services?.name || 'General Checkup'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-black text-slate-900">{format(new Date(app.preferred_date), 'MMM dd')}</p>
                      <p className="text-[10px] text-primary font-black uppercase tracking-tight">{app.preferred_time}</p>
                    </TableCell>
                    <TableCell>
                      {app.doctors ? (
                        <p className="text-sm font-black text-slate-700">Dr. {app.doctors.full_name}</p>
                      ) : (
                        <span className="text-xs text-slate-300 italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusVariant(app.status)}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {app.status === 'pending' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl text-emerald-600 hover:bg-emerald-50"
                            onClick={() => updateStatus(app.id, 'confirmed')}
                          >
                            <CheckCircle size={18} />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-50"
                          onClick={() => {
                            setSelectedAppt(app);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <Eye size={18} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-100"
                        >
                          <MoreHorizontal size={18} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Side Panel Logic via Dialog for now */}
      <Dialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Reservation Overview"
        description="Full clinical profile and scheduling details."
        className="max-w-2xl"
      >
        {selectedAppt && <AppointmentDetails appt={selectedAppt} />}
      </Dialog>

      {/* Rejection Reason Modal */}
      <Dialog
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="Decline Reservation"
        description="Please provide a constructive reason for rejecting this visit."
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700">Reason for Rejection</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="e.g. Doctor is unavailable, Clinical conflict..."
            />
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1 h-12 rounded-xl"
              onClick={() => setIsRejectOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 shadow-xl shadow-red-200"
              onClick={() => updateStatus(selectedAppt.id, 'rejected', rejectionReason)}
              disabled={isSubmitting || !rejectionReason.trim()}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Rejection'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
