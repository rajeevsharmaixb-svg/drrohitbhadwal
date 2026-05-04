'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { format, addDays } from 'date-fns';
import {
  Clock, Calendar, CheckCircle, XCircle, RefreshCw,
  ChevronLeft, ChevronRight, Loader2, Users, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

type Slot = {
  id: string;
  doctor_id: string | null;
  slot_date: string;
  start_time: string;
  end_time: string;
  shift: string;
  is_available: boolean | null;
  doctors?: { full_name: string } | null;
};

function formatTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export default function AdminSlotsPage() {
  const supabase = createClient();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('time_slots')
      .select('*, doctors(full_name)')
      .eq('slot_date', selectedDate)
      .order('start_time', { ascending: true });

    if (!error) setSlots(data || []);
    else toast.error('Failed to load slots');
    setLoading(false);
  }, [selectedDate, supabase]);

  const fetchDoctors = useCallback(async () => {
    const { data } = await supabase
      .from('doctors')
      .select('id, full_name')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    setDoctors(data || []);
  }, [supabase]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const toggleSlot = async (slot: Slot) => {
    setToggling(slot.id);
    const { error } = await supabase
      .from('time_slots')
      .update({ is_available: !slot.is_available })
      .eq('id', slot.id);

    if (error) {
      toast.error('Failed to update slot');
    } else {
      toast.success(slot.is_available ? 'Slot blocked' : 'Slot unblocked');
      setSlots(prev =>
        prev.map(s => s.id === slot.id ? { ...s, is_available: !(s.is_available ?? true) } : s)
      );
    }
    setToggling(null);
  };

  const blockAllForDate = async () => {
    const confirm = window.confirm(`Block ALL available slots on ${format(new Date(selectedDate + 'T00:00:00'), 'MMM dd, yyyy')}?`);
    if (!confirm) return;

    const ids = filteredSlots.filter(s => s.is_available ?? false).map(s => s.id);
    if (ids.length === 0) { toast('No available slots to block'); return; }

    const { error } = await supabase
      .from('time_slots')
      .update({ is_available: false })
      .in('id', ids);

    if (error) toast.error('Failed to block slots');
    else { toast.success(`${ids.length} slots blocked`); fetchSlots(); }
  };

  const generateForDate = async () => {
    setGenerating(true);
    const dayOfWeek = new Date(selectedDate + 'T00:00:00').getDay();
    if (dayOfWeek === 0) {
      toast.error('Cannot generate slots — clinic is closed on Sundays');
      setGenerating(false);
      return;
    }

    const times = [
      { start: '10:00', end: '10:30', shift: 'morning' },
      { start: '10:30', end: '11:00', shift: 'morning' },
      { start: '11:00', end: '11:30', shift: 'morning' },
      { start: '11:30', end: '12:00', shift: 'morning' },
      { start: '12:00', end: '12:30', shift: 'morning' },
      { start: '12:30', end: '13:00', shift: 'morning' },
      { start: '16:00', end: '16:30', shift: 'evening' },
      { start: '16:30', end: '17:00', shift: 'evening' },
      { start: '17:00', end: '17:30', shift: 'evening' },
      { start: '17:30', end: '18:00', shift: 'evening' },
      { start: '18:00', end: '18:30', shift: 'evening' },
      { start: '18:30', end: '19:00', shift: 'evening' },
      { start: '19:00', end: '19:30', shift: 'evening' },
      { start: '19:30', end: '20:00', shift: 'evening' },
    ];

    const rows: any[] = [];
    for (const doc of doctors) {
      for (const t of times) {
        const exists = slots.some(s => s.doctor_id === doc.id && s.start_time.substring(0, 5) === t.start);
        if (!exists) {
          rows.push({
            doctor_id: doc.id,
            slot_date: selectedDate,
            start_time: t.start,
            end_time: t.end,
            shift: t.shift,
            is_available: true,
          });
        }
      }
    }

    if (rows.length === 0) {
      toast('All slots already exist for this date');
      setGenerating(false);
      return;
    }

    const { error } = await supabase.from('time_slots').insert(rows);
    if (error) toast.error('Generation failed: ' + error.message);
    else { toast.success(`${rows.length} new slots generated`); fetchSlots(); }
    setGenerating(false);
  };

  const filteredSlots = selectedDoctor === 'all'
    ? slots
    : slots.filter(s => (s.doctor_id ?? '') === selectedDoctor);

  const morningSlots = filteredSlots.filter(s => s.shift === 'morning');
  const eveningSlots = filteredSlots.filter(s => s.shift === 'evening');
  const availableCount = filteredSlots.filter(s => s.is_available ?? false).length;
  const blockedCount = filteredSlots.filter(s => !(s.is_available ?? true)).length;
  const dayOfWeek = new Date(selectedDate + 'T00:00:00').getDay();
  const isSunday = dayOfWeek === 0;

  const SlotGrid = ({ slotList, label }: { slotList: Slot[]; label: string }) => (
    <div className="space-y-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      {slotList.length === 0 ? (
        <p className="text-xs text-slate-300 italic">No slots</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {slotList.map(slot => (
            <button
              key={slot.id}
              onClick={() => toggleSlot(slot)}
              disabled={toggling === slot.id}
              title={slot.doctors?.full_name || ''}
              className={`relative p-3 rounded-xl border-2 text-left transition-all group ${
                (slot.is_available ?? false)
                  ? 'border-emerald-200 bg-emerald-50 hover:border-red-300 hover:bg-red-50'
                  : 'border-red-200 bg-red-50/60 hover:border-emerald-300 hover:bg-emerald-50'
              }`}
            >
              {toggling === slot.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
                  <Loader2 size={14} className="animate-spin text-slate-400" />
                </div>
              )}
              <p className="text-xs font-bold text-slate-800">
                {formatTime(slot.start_time.substring(0, 5))}
              </p>
              <p className="text-[9px] text-slate-400 truncate mt-0.5">
                {slot.doctors?.full_name?.replace('Dr ', '') || '—'}
              </p>
              <div className={`mt-1.5 w-full h-1 rounded-full ${(slot.is_available ?? false) ? 'bg-emerald-400' : 'bg-red-400'}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Clock size={28} className="text-primary" />
            Slot Management
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            View, block, or generate appointment slots by date.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-xl border-slate-200 text-slate-600 font-bold text-xs"
            onClick={generateForDate}
            disabled={generating || isSunday}
          >
            {generating ? <Loader2 size={14} className="animate-spin mr-2" /> : <Plus size={14} className="mr-2" />}
            Generate Slots
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-xl border-red-200 text-red-600 font-bold text-xs hover:bg-red-50"
            onClick={blockAllForDate}
            disabled={loading || availableCount === 0}
          >
            <XCircle size={14} className="mr-2" />
            Block All ({availableCount})
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl"
            onClick={fetchSlots}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      {/* Date + Doctor Filter */}
      <Card className="border-none shadow-xl rounded-3xl bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Date Navigator */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl border-slate-200"
                onClick={() => setSelectedDate(format(addDays(new Date(selectedDate + 'T00:00:00'), -1), 'yyyy-MM-dd'))}
              >
                <ChevronLeft size={16} />
              </Button>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-xl border-slate-200"
                onClick={() => setSelectedDate(format(addDays(new Date(selectedDate + 'T00:00:00'), 1), 'yyyy-MM-dd'))}
              >
                <ChevronRight size={16} />
              </Button>
            </div>

            {/* Doctor Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Users size={14} className="text-slate-400" />
              <button
                onClick={() => setSelectedDoctor('all')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border transition-all ${
                  selectedDoctor === 'all'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                All Doctors
              </button>
              {doctors.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border transition-all ${
                    selectedDoctor === doc.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {doc.full_name.replace('Dr ', '')}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Slots', value: filteredSlots.length, color: 'text-slate-900', bg: 'bg-slate-50' },
          { label: 'Available', value: availableCount, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Blocked', value: blockedCount, color: 'text-red-500', bg: 'bg-red-50' },
        ].map(stat => (
          <Card key={stat.label} className="border-none shadow-lg rounded-2xl">
            <CardContent className={`p-5 ${stat.bg}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
              <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Slot Grid */}
      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] bg-white">
        <CardHeader className="p-8 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-slate-900">
                {format(new Date(selectedDate + 'T00:00:00'), 'EEEE, MMMM dd yyyy')}
              </CardTitle>
              <CardDescription>Click any slot to toggle availability. Green = open, Red = blocked.</CardDescription>
            </div>
            {isSunday && (
              <Badge variant="error">Clinic Closed</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : isSunday ? (
            <div className="text-center py-16 text-slate-400">
              <XCircle size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">Sunday — Clinic Closed</p>
              <p className="text-sm mt-1">No slots are generated for Sundays.</p>
            </div>
          ) : filteredSlots.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Clock size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">No slots found for this date</p>
              <p className="text-sm mt-2">Click <strong>Generate Slots</strong> above to create them.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <SlotGrid slotList={morningSlots} label="🌅 Morning — 10:00 AM to 1:00 PM" />
              <SlotGrid slotList={eveningSlots} label="🌆 Evening — 4:00 PM to 8:00 PM" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400" /> Available — patients can book
        </span>
        <span className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" /> Blocked — hidden from booking
        </span>
        <span className="flex items-center gap-2 text-slate-400 italic">
          Hover a slot to see doctor name · Click to toggle
        </span>
      </div>
    </div>
  );
}
