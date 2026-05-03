'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { format, subMonths, isAfter, startOfDay } from 'date-fns';
import { 
  Calendar, Search, Filter, Phone, Mail, MoreHorizontal, 
  CheckCircle, XCircle, Clock, Eye, Edit2, AlertCircle, 
  ChevronRight, ArrowRight, MessageSquare, Download, FileText,
  Loader2, Printer
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
// jsPDF + autoTable are dynamically imported inside generatePDF to avoid SSR issues

// Extend jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

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
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportRange, setExportRange] = useState('1');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const generatePDF = async () => {
    setIsExporting(true);
    try {
      // jsPDF v4: named export, not default
      const { jsPDF } = await import('jspdf');
      // jspdf-autotable v5: must explicitly register the plugin
      const { applyPlugin } = await import('jspdf-autotable');
      applyPlugin(jsPDF);

      const doc = new jsPDF();
      const months = parseInt(exportRange);
      const cutoffDate = subMonths(new Date(), months);
      
      const filteredData = appointments.filter(app => {
        const appDate = new Date(app.preferred_date);
        return isAfter(appDate, cutoffDate);
      });

      const stats = {
        total: filteredData.length,
        confirmed: filteredData.filter(a => a.status === 'confirmed').length,
        completed: filteredData.filter(a => a.status === 'completed').length,
        rejected: filteredData.filter(a => a.status === 'rejected').length,
        pending: filteredData.filter(a => a.status === 'pending').length,
      };

      // Header [APPT-REPORT-002]
      doc.setFillColor(11, 27, 61); // Night Blue
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('times', 'bold');
      doc.text("Dr. Rohit's Dental & Implant Centre", 15, 25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text("CLINICAL RESERVATION STATUS REPORT", 15, 33);
      doc.text(`DATE GENERATED: ${format(new Date(), 'PPP')}`, 140, 33);

      // Range Info
      doc.setTextColor(11, 27, 61);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Reporting Period: Last ${months} Month(s)`, 15, 55);
      doc.text(`Interval: ${format(cutoffDate, 'MMM yyyy')} - ${format(new Date(), 'MMM yyyy')}`, 15, 62);

      // Summary Stats
      doc.autoTable({
        startY: 75,
        head: [['Metric', 'Quantity', 'System Health']],
        body: [
          ['Total Reservations', String(stats.total), '100% Pipeline'],
          ['Completed Cycles', String(stats.completed), `${stats.total > 0 ? ((stats.completed/stats.total)*100).toFixed(1) : 0}% Success`],
          ['Live Confirmations', String(stats.confirmed), `${stats.total > 0 ? ((stats.confirmed/stats.total)*100).toFixed(1) : 0}% Active`],
          ['Rejected/Cancelled', String(stats.rejected), 'Clinical Drift'],
          ['Pending Review', String(stats.pending), 'Queue Depth']
        ],
        theme: 'grid',
        headStyles: { fillColor: [20, 184, 166], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 4 }
      });

      // Detailed Table
      doc.autoTable({
        startY: ((doc as any).lastAutoTable?.finalY ?? 140) + 15,
        head: [['Date', 'Patient', 'Treatment', 'Doctor', 'Status']],
        body: filteredData.map(app => [
          format(new Date(app.preferred_date), 'dd/MM/yy'),
          app.patient_name || 'Unknown',
          app.services?.name || 'Checkup',
          app.doctors?.full_name || 'N/A',
          (app.status || 'PENDING').toUpperCase()
        ]),
        headStyles: { fillColor: [11, 27, 61], textColor: 255 },
        styles: { fontSize: 8 },
        columnStyles: {
            4: { fontStyle: 'bold' }
        }
      });

      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(`Generated by Admin Console System | Page ${i} of ${pageCount}`, 15, 285);
          doc.text("Strictly Confidential - For Internal Clinical Use Only", 140, 285);
      }

      const dataUri = doc.output('datauristring');
      const base64Pdf = dataUri.split(',')[1];
      const filename = `clinical-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      
      // Submit to the server route to ensure proper Content-Disposition headers
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/api/export-pdf';
      form.style.display = 'none';
      
      const pdfInput = document.createElement('input');
      pdfInput.type = 'hidden';
      pdfInput.name = 'pdfBase64';
      pdfInput.value = base64Pdf;
      form.appendChild(pdfInput);
      
      const filenameInput = document.createElement('input');
      filenameInput.type = 'hidden';
      filenameInput.name = 'filename';
      filenameInput.value = filename;
      form.appendChild(filenameInput);
      
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      toast.success('Professional Report Downloaded');
      setIsExportOpen(false);
    } catch (err: any) {
      console.error('[PDF Engine] Generation failed:', err);
      toast.error(`PDF Engine error: ${err?.message || 'Unknown failure'}`);
    }
    setIsExporting(false);
  };

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
          <p className="text-slate-500 text-sm font-medium">Manage, confirm, and track patient clinical visits with precision.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Button 
                variant="outline" 
                className="h-12 rounded-xl flex items-center gap-2 border-slate-200 text-slate-600 px-6 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50"
                onClick={() => setIsExportOpen(true)}
            >
                <Download size={16} /> Export Reports
            </Button>
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
                  <TableRow key={app.id} className="group transition-colors hover:bg-slate-50 border-slate-100">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs shadow-inner">
                          {app.patient_name?.substring(0, 2).toUpperCase() || 'P'}
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

      {/* Export Selection Modal [APPT-REPORT-001] */}
      <Dialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Generate Clinical Analytics Report"
        description="Select clinical date range for professional PDF export."
        className="max-w-md bg-white p-8 rounded-[2.5rem]"
      >
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4">
                {[
                    { val: '1', label: 'Last 1 Month', desc: 'Short-term clinical flow' },
                    { val: '3', label: 'Last 3 Months', desc: 'Quarterly performance analysis' },
                    { val: '6', label: 'Last 6 Months', desc: 'Extended health audit' }
                ].map((range) => (
                    <button
                        key={range.val}
                        onClick={() => setExportRange(range.val)}
                        className={`p-5 rounded-3xl border-2 text-left transition-all flex items-center justify-between ${exportRange === range.val ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                        <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">{range.label}</p>
                            <p className="text-xs text-slate-500 font-medium">{range.desc}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${exportRange === range.val ? 'border-primary bg-primary text-white' : 'border-slate-200'}`}>
                            {exportRange === range.val && <CheckCircle size={14} className="fill-white text-primary" />}
                        </div>
                    </button>
                ))}
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                <FileText size={20} className="text-slate-400 shrink-0 mt-1" />
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase">
                    The report will include clinical summaries, medical officer assignments, and success rate analytics for the chosen period.
                </p>
            </div>

            <div className="flex gap-4">
                <Button variant="outline" className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-500 font-black" onClick={() => setIsExportOpen(false)}>Abort</Button>
                <Button 
                    className="flex-[2] h-14 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs"
                    onClick={generatePDF}
                    disabled={isExporting}
                >
                    {isExporting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Printer className="mr-2" size={18} />}
                    {isExporting ? 'Generating...' : 'Confirm Export'}
                </Button>
            </div>
        </div>
      </Dialog>

      {/* Rejection Reason Modal */}
      <Dialog
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="Decline Reservation"
        description="Please provide a constructive reason for rejecting this visit."
        className="bg-white max-w-md p-8 rounded-[2.5rem]"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Reason for Rejection</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full h-32 bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 resize-none shadow-inner"
              placeholder="e.g. Clinical conflict, medical officer unavailable..."
            />
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-500 font-black"
              onClick={() => setIsRejectOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 h-14 rounded-2xl bg-red-600 hover:bg-red-700 shadow-xl shadow-red-200 font-black uppercase tracking-widest text-xs"
              onClick={() => updateStatus(selectedAppt.id, 'rejected', rejectionReason)}
              disabled={isSubmitting || !rejectionReason.trim()}
            >
              {isSubmitting ? 'Processing...' : 'Reject'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
