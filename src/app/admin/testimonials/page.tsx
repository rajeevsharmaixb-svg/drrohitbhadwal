'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  MessageSquare, Plus, Search, Edit, 
  Trash2, Video, FileText, 
  Star, Image as ImageIcon, Save, 
  Trash, Play, X, Upload, Loader2,
  ChevronRight, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from '@/components/ui/Table';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE_BYTES = 1.5 * 1024 * 1024; // 1.5 MB [TEST-ADMIN-002]

export default function AdminTestimonialsPage() {
  const supabase = createClient();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'draft'>('all');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [mode, setMode] = useState<'add' | 'edit'>('add');

  // Form state
  const [formData, setFormData] = useState({
    patient_name: '',
    review_text: '',
    rating: 5,
    treatment: '',
    video_url: '',
    patient_photo_url: '',
    before_photo_url: '',
    after_photo_url: '',
    is_video: false,
    is_live: false,
    is_featured: false
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

  const validateImage = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error(`File "${file.name}" is ${sizeMB} MB. Maximum allowed: 1.5 MB.`);
      return false;
    }
    if (!validTypes.includes(file.type)) {
      toast.error(`Unsupported format "${file.type}". Use JPEG, PNG, or WebP.`);
      return false;
    }
    return true;
  };

  const handleFileUpload = async (file: File, type: 'before' | 'after' | 'portrait') => {
    if (!validateImage(file)) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `testimonials/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('testimonial-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('testimonial-media')
        .getPublicUrl(filePath);

      if (type === 'before') setFormData(prev => ({ ...prev, before_photo_url: publicUrl }));
      else if (type === 'after') setFormData(prev => ({ ...prev, after_photo_url: publicUrl }));
      else setFormData(prev => ({ ...prev, patient_photo_url: publicUrl }));
      
      toast.success('Media uploaded successfully');
    } catch (err) {
      toast.error('Sync failed for media asset');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { ...formData };

    if (mode === 'add') {
      // Check for 100 reviews limit
      if (testimonials.length >= 100) {
        toast.error('Review capacity reached (Max 100). Please delete old reviews to add new ones.');
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.from('testimonials').insert([payload]);
      if (error) toast.error('Failed to register testimonial');
      else {
        toast.success('Patient feedback recorded');
        setIsFormOpen(false);
        fetchTestimonials();
      }
    } else {
      const { error } = await supabase
        .from('testimonials')
        .update(payload)
        .eq('id', selectedTestimonial.id);
      
      if (error) toast.error('Failed to update clinical record');
      else {
        toast.success('Testimonial updated successfully');
        setIsFormOpen(false);
        fetchTestimonials();
      }
    }
    setIsSubmitting(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_live: !currentStatus })
      .eq('id', id);

    if (error) toast.error('Visibility sync failed');
    else {
      toast.success(`Marked as ${!currentStatus ? 'LIVE' : 'DRAFT'}`);
      fetchTestimonials();
    }
  };

  const handleDelete = async () => {
    if (!selectedTestimonial) return;
    setIsSubmitting(true);
    const { error } = await supabase.from('testimonials').delete().eq('id', selectedTestimonial.id);

    if (error) toast.error('Purge operation failed');
    else {
      toast.success('Feedback purged from system');
      setIsDeleteOpen(false);
      fetchTestimonials();
    }
    setIsSubmitting(false);
  };

  const openForm = (t?: any) => {
    if (t) {
      setMode('edit');
      setSelectedTestimonial(t);
      setFormData({
        patient_name: t.patient_name || '',
        review_text: t.review_text || '',
        rating: t.rating || 5,
        treatment: t.treatment || '',
        video_url: t.video_url || '',
        patient_photo_url: t.patient_photo_url || '',
        before_photo_url: t.before_photo_url || '',
        after_photo_url: t.after_photo_url || '',
        is_video: t.is_video ?? false,
        is_live: t.is_live ?? false,
        is_featured: t.is_featured ?? false
      });
    } else {
      setMode('add');
      setFormData({
        patient_name: '',
        review_text: '',
        rating: 5,
        treatment: '',
        video_url: '',
        patient_photo_url: '',
        before_photo_url: '',
        after_photo_url: '',
        is_video: false,
        is_live: false,
        is_featured: false
      });
    }
    setIsFormOpen(true);
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
      <div className="space-y-8 animate-pulse p-8">
        <div className="h-16 bg-white/5 rounded-2xl" />
        <div className="h-[600px] bg-white/5 rounded-[2.5rem]" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <MessageSquare size={32} className="text-primary" />
            Social Proof Console
          </h1>
          <p className="text-slate-500 text-sm font-medium">Manage clinical transformations and patient feedback with professional oversight.</p>
        </div>
        
        <Button 
          className="rounded-xl h-12 shadow-xl shadow-primary/20 flex items-center gap-2 px-8 font-black uppercase tracking-widest text-xs"
          onClick={() => openForm()}
        >
          <Plus size={18} /> New Transformation
        </Button>
      </div>

      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden border border-slate-100">
        <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 max-w-md relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <Input 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search patient names or reviews..." 
                        className="pl-11 rounded-xl h-11 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-primary/20"
                    />
                </div>
                <div className="flex gap-4">
                    {(['all', 'live', 'draft'] as const).map(status => (
                        <button 
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 border-none">
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="text-slate-400 uppercase text-[10px] font-black tracking-widest pl-8">Patient Profile</TableHead>
                <TableHead className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Type</TableHead>
                <TableHead className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Social Meta</TableHead>
                <TableHead className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Status</TableHead>
                <TableHead className="text-slate-400 uppercase text-[10px] font-black tracking-widest text-right pr-12">Controls</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <MessageSquare size={48} className="mb-4 opacity-10" />
                      <p className="text-sm font-bold">No records found matching filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((t) => (
                  <TableRow key={t.id} className="border-b border-slate-50 group hover:bg-slate-50 transition-colors">
                    <TableCell className="pl-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 group-hover:border-primary/30 transition-all shadow-sm">
                                {t.patient_photo_url ? (
                                    <img src={t.patient_photo_url} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-lg font-black text-slate-400">{t.patient_name?.charAt(0) || 'P'}</span>
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{t.patient_name}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{t.treatment || 'Verified Patient'}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                         <div className="flex items-center gap-2">
                             {t.is_video ? (
                                 <Badge className="bg-primary/20 text-primary border-none rounded-lg px-2 py-1 text-[9px] font-black uppercase flex items-center gap-1.5 ring-1 ring-primary/30">
                                     <Video size={10} /> Video Reel
                                 </Badge>
                             ) : (
                                 <Badge className="bg-slate-800 text-slate-400 border-none rounded-lg px-2 py-1 text-[9px] font-black uppercase flex items-center gap-1.5 ring-1 ring-white/5">
                                     <FileText size={10} /> Text Feed
                                 </Badge>
                             )}
                         </div>
                    </TableCell>
                    <TableCell>
                         <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={10} className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                                ))}
                            </div>
                            {t.before_photo_url && (
                                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                    <ImageIcon size={8} /> B/A Photos Linked
                                </span>
                            )}
                         </div>
                    </TableCell>
                    <TableCell>
                        <button 
                            onClick={() => handleToggleStatus(t.id, t.is_live)}
                            className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${t.is_live ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'}`}
                        >
                            {t.is_live ? 'Sync Live' : 'In Draft'}
                        </button>
                    </TableCell>
                    <TableCell className="text-right pr-12">
                         <div className="flex items-center justify-end gap-2">
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-100 transition-all"
                                onClick={() => openForm(t)}
                             >
                                 <Edit size={16} />
                             </Button>
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/10"
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

      {/* Unified Add/Edit Dialog with Sticky Footer [TEST-ADMIN-001, 002, 003] */}
      <Dialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={mode === 'add' ? "Deploy High-Impact Social Proof" : `Refining Feedback: ${formData.patient_name}`}
        description="Configure patient transformation data and clinical assets."
        noPadding
        className="max-w-4xl bg-white border border-slate-200 text-slate-900 overflow-hidden flex flex-col max-h-[90vh] rounded-[2.5rem]"
      >
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Patient Identity</label>
                <Input 
                  value={formData.patient_name} 
                  onChange={(e) => setFormData({...formData, patient_name: e.target.value})} 
                  placeholder="e.g. Rajat Kumar" 
                  required 
                  className="rounded-2xl h-12 bg-slate-50 border-slate-200 text-slate-900 focus:ring-primary/20 placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Clinical Procedure</label>
                <Input 
                  value={formData.treatment} 
                  onChange={(e) => setFormData({...formData, treatment: e.target.value})} 
                  placeholder="e.g. Full Mouth Restoration"
                  className="rounded-2xl h-12 bg-slate-50 border-slate-200 text-slate-900 focus:ring-primary/20 placeholder:text-slate-400"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Asset Pipeline</label>
                    <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, is_video: false})}
                            className={`flex-1 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${!formData.is_video ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}
                        >
                            Text
                        </button>
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, is_video: true})}
                            className={`flex-1 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${formData.is_video ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}
                        >
                            Video
                        </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Star Rating</label>
                    <div className="flex items-center justify-center gap-2 h-12 bg-white/5 rounded-2xl border border-white/5">
                        {[1,2,3,4,5].map((star) => (
                        <button 
                            key={star}
                            type="button"
                            onClick={() => setFormData({...formData, rating: star})}
                            className="transition-all hover:scale-125 hover:text-amber-400 active:scale-95"
                        >
                            <Star size={18} className={star <= formData.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} />
                        </button>
                        ))}
                    </div>
                  </div>
              </div>

              {formData.is_video && (
                <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
                    <label className="text-[10px] font-black uppercase text-primary tracking-widest ml-1 flex items-center gap-2">
                        <Video size={12} /> Video Asset Endpoint (MP4/CDN)
                    </label>
                    <Input 
                        value={formData.video_url} 
                        onChange={(e) => setFormData({...formData, video_url: e.target.value})} 
                        placeholder="https://clinical-cdn.com/reel.mp4" 
                        required={formData.is_video}
                        className="rounded-2xl h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                    />
                </div>
              )}
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Transformation Assets (B/A)</label>
                   <div className="grid grid-cols-2 gap-4">
                        {/* Before Photo [TEST-ADMIN-002] */}
                        <div className="relative group">
                            <input 
                                type="file" 
                                id="before-up" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'before')} 
                            />
                            <label 
                                htmlFor="before-up"
                                className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden"
                            >
                                {formData.before_photo_url ? (
                                    <img src={formData.before_photo_url} className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Upload size={24} className="text-slate-400 mb-2" />
                                        <span className="text-[10px] font-black uppercase text-slate-400">Before</span>
                                    </>
                                )}
                            </label>
                        </div>
                        {/* After Photo [TEST-ADMIN-002] */}
                        <div className="relative group">
                            <input 
                                type="file" 
                                id="after-up" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'after')} 
                            />
                            <label 
                                htmlFor="after-up"
                                className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden"
                            >
                                {formData.after_photo_url ? (
                                    <img src={formData.after_photo_url} className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <Upload size={24} className="text-slate-400 mb-2" />
                                        <span className="text-[10px] font-black uppercase text-slate-400">After</span>
                                    </>
                                )}
                            </label>
                        </div>
                   </div>
                   <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                        <AlertCircle size={16} className="text-primary shrink-0 mt-0.5" />
                        <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
                            Upload high-fidelity transformation photos. Max <span className="text-white font-black">1.5MB</span> per image. Supported: JPEG, PNG, WebP.
                        </p>
                   </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Avatar/Portrait Upload</label>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 overflow-hidden shrink-0 border border-white/5 shadow-2xl">
                             {formData.patient_photo_url ? (
                                 <img src={formData.patient_photo_url} className="w-full h-full object-cover" />
                             ) : (
                                 <div className="w-full h-full flex items-center justify-center text-slate-600"><ImageIcon size={24}/></div>
                             )}
                        </div>
                        <input 
                            type="file" 
                            id="portrait-up" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'portrait')} 
                        />
                        <label 
                            htmlFor="portrait-up"
                            className="flex-1 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-all font-black uppercase text-[10px] tracking-widest text-slate-400"
                        >
                            <Upload size={14} /> Replace Portrait
                        </label>
                    </div>
                </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Clinical Narrative</label>
                <span className={`text-[9px] font-black uppercase tracking-widest ${formData.review_text.length > 500 ? 'text-amber-400' : 'text-slate-600'}`}>
                    {formData.review_text.length} Character Count
                </span>
            </div>
            <textarea 
              value={formData.review_text} 
              onChange={(e) => setFormData({...formData, review_text: e.target.value})} 
              className="w-full h-40 bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 resize-none"
              placeholder="Inject the patient's organic transformation story here..."
              required
            />
          </div>
        </div>

        {/* STICKY FOOTER [TEST-ADMIN-003] */}
        <div className="sticky bottom-0 bg-slate-50/90 backdrop-blur-3xl p-6 border-t border-slate-100 flex gap-4 z-50">
           <Button 
                variant="outline" 
                type="button" 
                onClick={() => setIsFormOpen(false)} 
                className="flex-1 h-12 rounded-2xl border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white font-black uppercase tracking-widest text-[10px]"
           >
               Abort Changes
           </Button>
           <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting} 
                className="flex-[2] h-12 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-[10px] group"
           >
               {isSubmitting ? (
                   <Loader2 className="animate-spin mr-2" size={16} />
               ) : (
                   <Save className="mr-2 group-hover:scale-110 transition-transform" size={16} />
               )}
               {mode === 'add' ? 'Commit to Vault' : 'Sync Updates'}
           </Button>
        </div>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Sanitize Record Pipeline"
        description="This will permanently purge the selected clinical feedback from the social proof engine. This action is immutable."
        className="bg-white border border-slate-200 text-slate-900 max-w-md p-8 rounded-[2.5rem]"
      >
        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-400 hover:text-slate-900 font-black uppercase tracking-widest text-[10px]">Decline</Button>
          <Button 
            disabled={isSubmitting} 
            className="flex-1 h-14 rounded-2xl bg-red-600 hover:bg-red-700 shadow-xl shadow-red-900/20 font-black uppercase tracking-widest text-[10px]"
            onClick={handleDelete}
          >
            {isSubmitting ? 'Purging...' : 'Confirm Purge'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
