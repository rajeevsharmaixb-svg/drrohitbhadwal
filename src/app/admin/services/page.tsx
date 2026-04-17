'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, Search, Filter, Edit, Trash2, Save, 
  RotateCcw, Check, AlertTriangle, Briefcase, 
  Clock, IndianRupee, Layers, CheckCircle2, ChevronDown 
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

export default function AdminServicesPage() {
  const supabase = createClient();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Pending changes state
  const [modifiedIds, setModifiedIds] = useState<Set<string>>(new Set());
  const [pendingServices, setPendingServices] = useState<Record<string, any>>({});
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New service state
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price_range: '',
    duration_minutes: 30,
    category: 'general',
    is_active: true
  });

  const fetchServices = useCallback(async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      toast.error('Failed to resolve clinic catalog');
    } else {
      setServices(data || []);
      setModifiedIds(new Set());
      setPendingServices({});
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleInputChange = (id: string, field: string, value: any) => {
    setModifiedIds(prev => new Set(prev).add(id));
    setPendingServices(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || services.find(s => s.id === id)),
        [field]: value
      }
    }));
  };

  const getServiceValue = (id: string, field: string) => {
    if (pendingServices[id] && pendingServices[id][field] !== undefined) {
      return pendingServices[id][field];
    }
    return services.find(s => s.id === id)?.[field];
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase
      .from('services')
      .insert([newService]);

    if (error) {
      toast.error('Failed to launch new service');
    } else {
      toast.success('Clinical service added to catalog');
      setIsAddOpen(false);
      setNewService({
        name: '',
        description: '',
        price_range: '',
        duration_minutes: 30,
        category: 'general',
        is_active: true
      });
      fetchServices();
    }
    setIsSubmitting(false);
  };

  const handleSaveBulk = async () => {
    setIsSubmitting(true);
    const updates = Array.from(modifiedIds).map(id => ({
      id,
      ...pendingServices[id]
    }));

    try {
      for (const update of updates) {
        const { id, ...data } = update;
        const { error } = await supabase
          .from('services')
          .update(data)
          .eq('id', id);
        if (error) throw error;
      }
      toast.success('Service catalog synchronized successfully');
      setModifiedIds(new Set());
      setPendingServices({});
      setIsSaveOpen(false);
      fetchServices();
    } catch (error: any) {
      toast.error(error.message || 'Synchronization failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    setIsSubmitting(true);
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', selectedService.id);

    if (error) {
      toast.error('Deletion operation failed');
    } else {
      toast.success('Service purged from catalog');
      setIsDeleteOpen(false);
      fetchServices();
    }
    setIsSubmitting(false);
  };

  const categories = Array.from(new Set(services.map(s => s.category))).filter(Boolean);

  const filtered = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                         (s.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-16 bg-white rounded-2xl" />
        <div className="h-[600px] bg-white rounded-[2.5rem]" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Layers size={28} className="text-primary" />
            Service Catalog
          </h1>
          <p className="text-slate-500 text-sm">Configure treatments, pricing architectures, and service durations.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          {modifiedIds.size > 0 && (
            <Button 
                variant="outline" 
                className="rounded-xl border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center gap-2 font-bold px-6"
                onClick={() => setIsSaveOpen(true)}
            >
                <Save size={18} /> Save {modifiedIds.size} Changes
            </Button>
          )}
          <Button 
            className="rounded-xl h-12 shadow-xl shadow-primary/20 flex items-center gap-2"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus size={18} /> New Clinical Service
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-slate-900 text-white p-8 border-b border-white/5">
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 max-w-md relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors" size={18} />
                    <Input 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Filter clinical treatments..." 
                        className="pl-11 rounded-xl h-11 bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus:ring-amber-500/20"
                    />
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <button 
                        onClick={() => setCategoryFilter('all')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${categoryFilter === 'all' ? 'bg-amber-500 text-slate-900' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        All Categories
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${categoryFilter === cat ? 'bg-amber-500 text-slate-900' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-100">
              <TableRow className="border-none">
                <TableHead>Treatment Definition</TableHead>
                <TableHead>Path Hierarchy</TableHead>
                <TableHead>Expected Duration</TableHead>
                <TableHead>Investment (INR)</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right pr-12">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Layers size={48} className="mb-4 opacity-10" />
                      <p className="text-sm font-bold">No clinical services found in this segment.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((s) => (
                  <TableRow key={s.id} className={`${modifiedIds.has(s.id) ? 'bg-amber-50/30' : ''} group`}>
                    <TableCell className="max-w-xs">
                        <div className="relative">
                            <Input 
                                value={getServiceValue(s.id, 'name')}
                                onChange={(e) => handleInputChange(s.id, 'name', e.target.value)}
                                className="border-none bg-transparent h-auto p-0 text-base font-black text-slate-950 focus:ring-0 shadow-none group-hover:text-primary transition-colors"
                            />
                            <Input 
                                value={getServiceValue(s.id, 'description') || ''}
                                onChange={(e) => handleInputChange(s.id, 'description', e.target.value)}
                                className="border-none bg-transparent h-auto p-0 text-xs text-slate-600 font-bold focus:ring-0 shadow-none mt-1"
                            />
                        </div>
                    </TableCell>
                    <TableCell>
                         <Select 
                            value={getServiceValue(s.id, 'category')}
                            onChange={(e) => handleInputChange(s.id, 'category', e.target.value)}
                            className="bg-transparent border-none h-8 p-0 text-xs font-bold text-slate-500 uppercase tracking-widest focus:ring-0 shadow-none"
                         >
                             <option value="general">General</option>
                             <option value="orthodontics">Orthodontics</option>
                             <option value="implants">Implants</option>
                             <option value="surgery">Surgery</option>
                             <option value="cosmetic">Cosmetic</option>
                         </Select>
                    </TableCell>
                    <TableCell>
                         <div className="flex items-center gap-2">
                             <Clock size={14} className="text-slate-300" />
                             <Input 
                                type="number"
                                value={getServiceValue(s.id, 'duration_minutes')}
                                onChange={(e) => handleInputChange(s.id, 'duration_minutes', parseInt(e.target.value))}
                                className="w-20 border border-slate-200 bg-white h-9 px-3 text-sm font-black text-slate-900 focus:ring-1 focus:ring-primary focus:border-primary shadow-sm rounded-lg transition-all"
                             />
                             <span className="text-[10px] font-black text-slate-300 uppercase">Min</span>
                         </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1">
                             <IndianRupee size={12} className="text-emerald-500" />
                             <Input 
                                value={getServiceValue(s.id, 'price_range')}
                                onChange={(e) => handleInputChange(s.id, 'price_range', e.target.value)}
                                className="w-full border border-slate-200 bg-white h-9 px-3 text-sm font-black text-slate-900 focus:ring-1 focus:ring-primary focus:border-primary shadow-sm rounded-lg transition-all"
                             />
                        </div>
                    </TableCell>
                    <TableCell className="text-center">
                        <button 
                            onClick={() => handleInputChange(s.id, 'is_active', !getServiceValue(s.id, 'is_active'))}
                            className={`w-12 h-6 rounded-full p-1 transition-all ${getServiceValue(s.id, 'is_active') ? 'bg-emerald-500' : 'bg-slate-200'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-all ${getServiceValue(s.id, 'is_active') ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </TableCell>
                    <TableCell className="text-right pr-12">
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                            onClick={() => {
                                setSelectedService(s);
                                setIsDeleteOpen(true);
                            }}
                         >
                             <Trash2 size={18} />
                         </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Service Dialog */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Deploy New Treatment"
        description="Expand the clinical catalog with advanced dental procedures."
        className="max-w-xl"
      >
        <form onSubmit={handleAddService} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 col-span-full">
              <label className="text-sm font-bold text-slate-700 ml-1">Treatment Designation</label>
              <Input 
                value={newService.name} 
                onChange={(e) => setNewService({...newService, name: e.target.value})} 
                placeholder="e.g. Invisible Orthodontic Braces" 
                required 
                className="rounded-2xl h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Medical Category</label>
              <Select 
                value={newService.category} 
                onChange={(e) => setNewService({...newService, category: e.target.value})}
                className="rounded-2xl h-12"
              >
                <option value="general">General Dentistry</option>
                <option value="orthodontics">Orthodontics</option>
                <option value="implants">Implants</option>
                <option value="surgery">Surgery</option>
                <option value="cosmetic">Cosmetic</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Expected Duration (Min)</label>
              <Input 
                type="number"
                value={newService.duration_minutes} 
                onChange={(e) => setNewService({...newService, duration_minutes: parseInt(e.target.value)})} 
                required 
                className="rounded-2xl h-12"
              />
            </div>
            <div className="space-y-2 col-span-full">
              <label className="text-sm font-bold text-slate-700 ml-1">Pricing Definition (INR)</label>
              <Input 
                value={newService.price_range} 
                onChange={(e) => setNewService({...newService, price_range: e.target.value})} 
                placeholder="e.g. ₹15,000 - ₹25,000" 
                required 
                className="rounded-2xl h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Clinical Description</label>
            <textarea 
              value={newService.description} 
              onChange={(e) => setNewService({...newService, description: e.target.value})} 
              className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Detailed treatment summary for patients..."
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="flex-1 h-12 rounded-2xl">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 h-12 rounded-2xl shadow-xl shadow-primary/20">
              {isSubmitting ? 'Integrating...' : 'Register Treatment'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Bulk Save Confirmation */}
      <Dialog
        isOpen={isSaveOpen}
        onClose={() => setIsSaveOpen(false)}
        title="Synchronize Catalog Modifications"
        description={`You have ${modifiedIds.size} pending modifications within the service catalog. Proceed with live update?`}
      >
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setIsSaveOpen(false)} className="flex-1 h-12 rounded-2xl">Revert</Button>
          <Button 
            disabled={isSubmitting} 
            className="flex-1 h-12 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            onClick={handleSaveBulk}
          >
            {isSubmitting ? 'Syncing...' : (
              <><CheckCircle2 size={18} /> Confirm Batch Update</>
            )}
          </Button>
        </div>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Purge Clinical Service"
        description="Are you sure you want to remove this treatment from the clinical catalog? This might affect existing appointment links."
      >
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="flex-1 h-12 rounded-2xl">Cancel</Button>
          <Button 
            disabled={isSubmitting} 
            className="flex-1 h-12 rounded-2xl bg-red-600 hover:bg-red-700 shadow-xl shadow-red-200"
            onClick={handleDelete}
          >
            {isSubmitting ? 'Purging...' : 'Confirm Destruction'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
