'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  MessageSquare, Plus, Search, Filter, Edit, 
  Trash2, Video, FileText, CheckCircle2, XCircle, 
  Star, Image as ImageIcon, ExternalLink, Save, 
  RotateCcw, Trash, Check, MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from '@/components/ui/Table';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminTestimonialsPage() {
  const supabase = createClient();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'draft'>('all');
  
  // Pending changes state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);

  // New testimonial state
  const [newTestimonial, setNewTestimonial] = useState({
    patient_name: '',
    review_text: '',
    rating: 5,
    treatment: '',
    video_url: '',
    patient_photo_url: '',
    is_video: false,
    is_live: false
  });

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to retrieve clinical feedback');
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase
      .from('testimonials')
      .insert([newTestimonial]);

    if (error) {
      toast.error('Failed to register testimonial');
    } else {
      toast.success('Patient feedback successfully recorded');
      setIsAddOpen(false);
      setNewTestimonial({
        patient_name: '',
        review_text: '',
        rating: 5,
        treatment: '',
        video_url: '',
        patient_photo_url: '',
        is_video: false,
        is_live: false
      });
      fetchTestimonials();
    }
    setIsSubmitting(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_live: !currentStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update visibility status');
    } else {
      toast.success(`Testimonial is now ${!currentStatus ? 'LIVE' : 'DRAFT'}`);
      fetchTestimonials();
    }
  };

  const handleDelete = async () => {
    if (!selectedTestimonial) return;
    setIsSubmitting(true);
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', selectedTestimonial.id);

    if (error) {
      toast.error('Purge operation failed');
    } else {
      toast.success('Feedback purged from system');
      setIsDeleteOpen(false);
      fetchTestimonials();
    }
    setIsSubmitting(false);
  };

  const filtered = testimonials.filter(t => {
    const matchesSearch = t.patient_name.toLowerCase().includes(search.toLowerCase()) ||
                         (t.review_text || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'live' ? t.is_live : !t.is_live);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-16 bg-white/5 rounded-2xl" />
        <div className="h-[600px] bg-white/5 rounded-[2.5rem]" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <MessageSquare size={32} className="text-primary" />
            Social Proof Vault
          </h1>
          <p className="text-slate-400 text-sm font-medium">Curate and manage patient testimonials for homepage visibility.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <Button 
            className="rounded-xl h-12 shadow-xl shadow-primary/20 flex items-center gap-2 px-8 font-black uppercase tracking-widest text-xs"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus size={18} /> New Testimonial
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-white/5 p-8 border-b border-white/5">
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 max-w-md relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <Input 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search patient feedback..." 
                        className="pl-11 rounded-xl h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:ring-primary/20"
                    />
                </div>
                <div className="flex gap-4">
                    {(['all', 'live', 'draft'] as const).map(status => (
                        <button 
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-primary text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5 border-none">
              <TableRow className="border-b border-white/5 hover:bg-transparent">
                <TableHead className="text-slate-400 uppercase text-[10px] font-black tracking-widest pl-8">Patient Profile</TableHead>
                <TableHead className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Type</TableHead>
                <TableHead className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Rating</TableHead>
                <TableHead className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Status</TableHead>
                <TableHead className="text-slate-400 uppercase text-[10px] font-black tracking-widest text-right pr-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <MessageSquare size={48} className="mb-4 opacity-10" />
                      <p className="text-sm font-bold">No clinical feedback found in this segment.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((t) => (
                  <TableRow key={t.id} className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                    <TableCell className="pl-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 overflow-hidden flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-all">
                                {t.patient_photo_url ? (
                                    <img src={t.patient_photo_url} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-lg font-black text-slate-500">{t.patient_name[0]}</span>
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{t.patient_name}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{t.treatment || 'General Patient'}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                         <div className="flex items-center gap-2">
                             {t.is_video ? (
                                 <Badge className="bg-primary/20 text-primary border-none rounded-lg px-2 py-1 text-[9px] font-black uppercase flex items-center gap-1.5">
                                     <Video size={10} /> Video
                                 </Badge>
                             ) : (
                                 <Badge className="bg-slate-800 text-slate-400 border-none rounded-lg px-2 py-1 text-[9px] font-black uppercase flex items-center gap-1.5">
                                     <FileText size={10} /> Text
                                 </Badge>
                             )}
                         </div>
                    </TableCell>
                    <TableCell>
                         <div className="flex items-center gap-0.5">
                             {[...Array(5)].map((_, i) => (
                                 <Star key={i} size={12} className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'} />
                             ))}
                         </div>
                    </TableCell>
                    <TableCell>
                        <button 
                            onClick={() => handleToggleStatus(t.id, t.is_live)}
                            className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${t.is_live ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-500/5' : 'bg-slate-800 text-slate-400 border-white/5'}`}
                        >
                            {t.is_live ? 'Live' : 'Draft'}
                        </button>
                    </TableCell>
                    <TableCell className="text-right pr-12">
                         <div className="flex items-center justify-end gap-2">
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                                onClick={() => {
                                    setSelectedTestimonial(t);
                                    // TODO: Implement Edit
                                }}
                             >
                                 <Edit size={16} />
                             </Button>
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                onClick={() => {
                                    setSelectedTestimonial(t);
                                    setIsDeleteOpen(true);
                                }}
                             >
                                 <Trash2 size={16} />
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

      {/* Add Testimonial Dialog */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Deploy New Social Proof"
        description="Register a new patient testimonial to enhance clinic credibility."
        className="max-w-2xl bg-slate-900 border border-white/10 text-white"
      >
        <form onSubmit={handleAddTestimonial} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Patient Designation</label>
              <Input 
                value={newTestimonial.patient_name} 
                onChange={(e) => setNewTestimonial({...newTestimonial, patient_name: e.target.value})} 
                placeholder="e.g. S. Sharma" 
                required 
                className="rounded-2xl h-12 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Performed Treatment</label>
              <Input 
                value={newTestimonial.treatment} 
                onChange={(e) => setNewTestimonial({...newTestimonial, treatment: e.target.value})} 
                placeholder="e.g. Invisible Aligners"
                className="rounded-2xl h-12 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Content Type</label>
              <div className="flex gap-4 p-1 bg-white/5 rounded-2xl">
                 <button 
                  type="button"
                  onClick={() => setNewTestimonial({...newTestimonial, is_video: false})}
                  className={`flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${!newTestimonial.is_video ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                 >
                   Text Only
                 </button>
                 <button 
                  type="button"
                  onClick={() => setNewTestimonial({...newTestimonial, is_video: true})}
                  className={`flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${newTestimonial.is_video ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                 >
                   Video Asset
                 </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Clinical Rating</label>
              <div className="flex items-center gap-4 h-12 px-6 bg-white/5 rounded-2xl border border-white/10">
                 {[1,2,3,4,5].map((star) => (
                   <button 
                    key={star}
                    type="button"
                    onClick={() => setNewTestimonial({...newTestimonial, rating: star})}
                    className="transition-all hover:scale-125"
                   >
                     <Star size={20} className={star <= newTestimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'} />
                   </button>
                 ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Patient Photo/Avatar URL</label>
            <Input 
              value={newTestimonial.patient_photo_url} 
              onChange={(e) => setNewTestimonial({...newTestimonial, patient_photo_url: e.target.value})} 
              placeholder="https://..." 
              className="rounded-2xl h-12 bg-white/5 border-white/10 text-white"
            />
          </div>

          {newTestimonial.is_video && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black uppercase text-primary tracking-widest ml-1 flex items-center gap-2">
                <Video size={12} /> Video Asset URL (MP4 / YouTube)
              </label>
              <Input 
                value={newTestimonial.video_url} 
                onChange={(e) => setNewTestimonial({...newTestimonial, video_url: e.target.value})} 
                placeholder="https://video-link.com/asset.mp4" 
                required={newTestimonial.is_video}
                className="rounded-2xl h-12 bg-white/5 border-white/10 text-white focus:border-primary/50"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Feedback Quote</label>
            <textarea 
              value={newTestimonial.review_text} 
              onChange={(e) => setNewTestimonial({...newTestimonial, review_text: e.target.value})} 
              className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-600"
              placeholder="Enter the patient's full testimonial content..."
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)} className="flex-1 h-12 rounded-2xl border-white/10 text-slate-400 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px]">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 h-12 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-[10px]">
              {isSubmitting ? 'Syncing...' : 'Confirm Registration'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Purge Clinical Feedback"
        description="Are you sure you want to permanently delete this testimonial? This action cannot be undone."
        className="bg-slate-900 border border-white/10 text-white"
      >
        <div className="flex gap-4 p-2">
          <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="flex-1 h-12 rounded-2xl border-white/10 text-slate-400 hover:text-white font-black uppercase tracking-widest text-[10px]">Decline</Button>
          <Button 
            disabled={isSubmitting} 
            className="flex-1 h-12 rounded-2xl bg-red-600 hover:bg-red-700 shadow-xl shadow-red-900/20 font-black uppercase tracking-widest text-[10px]"
            onClick={handleDelete}
          >
            {isSubmitting ? 'Purging...' : 'Confirm Purge'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
