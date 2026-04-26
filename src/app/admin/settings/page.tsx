'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Settings, Building2, MapPin, Phone, Mail, 
  Clock, Globe, Save, RotateCcw, ShieldCheck, 
  FileText, CreditCard, MessageSquare, AlertCircle,
  HelpCircle, ChevronRight, Check, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'brand', label: 'Clinical Identity', icon: Building2 },
  { id: 'operations', label: 'Operations & Slots', icon: Clock },
  { id: 'policies', label: 'Legal Policies', icon: FileText },
];

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState('brand');
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<any>(null);

  const fetchSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from('clinic_settings')
      .select('*')
      .single();

    if (error) {
      toast.error('Failed to resolve clinical configuration');
    } else {
      setSettings(data);
      setOriginalSettings(JSON.parse(JSON.stringify(data)));
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleUpdate = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleWorkingHoursUpdate = (day: string, shift: 'morning' | 'evening', data: any) => {
    const updatedHours = { ...settings.working_hours };
    updatedHours[day] = { ...updatedHours[day], [shift]: data };
    handleUpdate('working_hours', updatedHours);
  };

  const handleSocialUpdate = (platform: string, value: string) => {
    const updatedSocial = { ...settings.social_links };
    updatedSocial[platform] = value;
    handleUpdate('social_links', updatedSocial);
  };

  const saveSettings = async () => {
    setIsSubmitting(true);
    const { id, updated_at, ...payload } = settings;
    const { error } = await supabase
      .from('clinic_settings')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error(`Failed to save: ${error.message}`);
      console.error('Supabase update error:', error);
    } else {
      toast.success('Clinical parameters updated successfully');
      setOriginalSettings(JSON.parse(JSON.stringify(settings)));
    }
    setIsSubmitting(false);
  };

  const isChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  if (loading) {
      return (
          <div className="space-y-8 animate-pulse">
              <div className="flex gap-4">
                  <div className="h-10 w-32 bg-slate-100 rounded-xl" />
                  <div className="h-10 w-32 bg-slate-100 rounded-xl" />
                  <div className="h-10 w-32 bg-slate-100 rounded-xl" />
              </div>
              <div className="h-[500px] bg-white rounded-[2.5rem]" />
          </div>
      );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Settings size={28} className="text-primary" />
            Clinic Configuration
          </h1>
          <p className="text-slate-500 text-sm">Control master protocols, operational parameters, and high-level clinical identity.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
            {isChanged && (
                <Button 
                    variant="outline" 
                    className="rounded-xl border-slate-200 text-slate-500 flex items-center gap-2"
                    onClick={() => setSettings(JSON.parse(JSON.stringify(originalSettings)))}
                >
                    <RotateCcw size={18} /> Revert Modifications
                </Button>
            )}
            <Button 
                disabled={!isChanged || isSubmitting}
                className="rounded-xl h-12 shadow-xl shadow-primary/20 flex items-center gap-2 px-8"
                onClick={saveSettings}
            >
                <Save size={18} /> {isSubmitting ? 'Syncing...' : 'Synchronize Protocol'}
            </Button>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100/50 backdrop-blur-sm rounded-2xl w-fit">
        {TABS.map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <tab.icon size={16} />
                {tab.label}
            </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'brand' && (
            <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500"
            >
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                        <CardTitle className="text-lg text-slate-900">General Brand Identity</CardTitle>
                        <CardDescription className="text-slate-500">Essential clinic identifiers visible to patients.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                             <label className="text-sm font-bold text-slate-700 ml-1">Clinic Commercial Name</label>
                             <Input 
                                value={settings.clinic_name}
                                onChange={(e) => handleUpdate('clinic_name', e.target.value)}
                                className="rounded-2xl h-12"
                             />
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-bold text-slate-700 ml-1">Marketing Tagline</label>
                             <Input 
                                value={settings.tagline}
                                onChange={(e) => handleUpdate('tagline', e.target.value)}
                                className="rounded-2xl h-12"
                             />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2"><Phone size={14} className="text-slate-300" /> Phone</label>
                                <Input value={settings.phone} onChange={(e) => handleUpdate('phone', e.target.value)} className="rounded-2xl h-12" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2"><MessageSquare size={14} className="text-emerald-500" /> WhatsApp</label>
                                <Input value={settings.whatsapp} onChange={(e) => handleUpdate('whatsapp', e.target.value)} className="rounded-2xl h-12" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2"><Mail size={14} className="text-blue-500" /> Administrative Email</label>
                            <Input value={settings.email} onChange={(e) => handleUpdate('email', e.target.value)} className="rounded-2xl h-12" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2"><MapPin size={14} className="text-red-500" /> Physical Address</label>
                            <textarea 
                                value={settings.address}
                                onChange={(e) => handleUpdate('address', e.target.value)}
                                className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="bg-slate-900/5 p-8 border-b border-slate-100">
                        <CardTitle className="text-lg text-slate-900">Virtual Presence</CardTitle>
                        <CardDescription>Configure maps integration and digital social protocols.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-3 p-5 rounded-3xl bg-slate-50 border border-slate-100 mb-6">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                <MapPin size={12} /> Google Maps Embed URL
                            </label>
                            <Input 
                                value={settings.google_maps_embed}
                                onChange={(e) => handleUpdate('google_maps_embed', e.target.value)}
                                className="rounded-xl h-10 text-xs bg-white"
                                placeholder="<iframe>...</iframe>"
                            />
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Social Clinical Network</p>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-blue-100">
                                    <Globe size={20} className="text-blue-600" />
                                    <Input 
                                        value={settings.social_links?.facebook || ''} 
                                        onChange={(e) => handleSocialUpdate('facebook', e.target.value)} 
                                        className="border-none bg-transparent h-auto p-0 text-sm shadow-none focus:ring-0" 
                                        placeholder="Facebook Profile URL"
                                    />
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-pink-100">
                                    <Share2 size={20} className="text-pink-600" />
                                    <Input 
                                        value={settings.social_links?.instagram || ''} 
                                        onChange={(e) => handleSocialUpdate('instagram', e.target.value)} 
                                        className="border-none bg-transparent h-auto p-0 text-sm shadow-none focus:ring-0" 
                                        placeholder="Instagram Profile URL"
                                    />
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-red-100">
                                    <Globe size={20} className="text-red-600" />
                                    <Input 
                                        value={settings.social_links?.youtube || ''} 
                                        onChange={(e) => handleSocialUpdate('youtube', e.target.value)} 
                                        className="border-none bg-transparent h-auto p-0 text-sm shadow-none focus:ring-0" 
                                        placeholder="YouTube Channel URL"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}

        {activeTab === 'operations' && (
            <div
                className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500"
            >
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                        <CardTitle className="text-lg text-slate-900">Clinical Operational Hours</CardTitle>
                        <CardDescription className="text-slate-500">Define weekly clinical slots and break period intervals.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                         <div className="divide-y divide-slate-100">
                             {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                                 <div key={day} className="p-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                                     <div className="flex items-center gap-4 w-32">
                                         <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                             <Check size={18} />
                                         </div>
                                         <p className="font-black text-slate-900 uppercase tracking-widest text-xs">{day}</p>
                                     </div>
                                     
                                     <div className="flex items-center gap-4">
                                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Shift 01</p>
                                         <div className="flex items-center gap-2">
                                             <Input 
                                                value={settings.working_hours?.[day]?.morning?.open || '09:00'} 
                                                onChange={(e) => handleWorkingHoursUpdate(day, 'morning', { ...(settings.working_hours?.[day]?.morning || {}), open: e.target.value })}
                                                className="w-24 h-10 text-center rounded-xl bg-white border-slate-300 focus:ring-primary/20 font-bold" 
                                             />
                                             <ArrowRight size={14} className="text-slate-300" />
                                             <Input 
                                                value={settings.working_hours?.[day]?.morning?.close || '13:00'} 
                                                onChange={(e) => handleWorkingHoursUpdate(day, 'morning', { ...(settings.working_hours?.[day]?.morning || {}), close: e.target.value })}
                                                className="w-24 h-10 text-center rounded-xl bg-white border-slate-300 focus:ring-primary/20 font-bold" 
                                             />
                                         </div>
                                     </div>

                                     <div className="flex items-center gap-4">
                                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Shift 02</p>
                                         <div className="flex items-center gap-2">
                                             <Input 
                                                value={settings.working_hours?.[day]?.evening?.open || '16:00'} 
                                                onChange={(e) => handleWorkingHoursUpdate(day, 'evening', { ...(settings.working_hours?.[day]?.evening || {}), open: e.target.value })}
                                                className="w-24 h-10 text-center rounded-xl bg-white border-slate-300 focus:ring-primary/20 font-bold" 
                                             />
                                             <ArrowRight size={14} className="text-slate-300" />
                                             <Input 
                                                value={settings.working_hours?.[day]?.evening?.close || '20:00'} 
                                                onChange={(e) => handleWorkingHoursUpdate(day, 'evening', { ...(settings.working_hours?.[day]?.evening || {}), close: e.target.value })}
                                                className="w-24 h-10 text-center rounded-xl bg-white border-slate-300 focus:ring-primary/20 font-bold" 
                                             />
                                         </div>
                                     </div>

                                     <div>
                                         <button 
                                            onClick={() => {
                                                const updated = { ...settings.working_hours };
                                                if (!updated[day]) updated[day] = { morning: { open: '09:00', close: '13:00' }, evening: { open: '16:00', close: '20:00' }, closed: false };
                                                updated[day].closed = !updated[day].closed;
                                                handleUpdate('working_hours', updated);
                                            }}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border ${settings.working_hours?.[day]?.closed ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}
                                         >
                                             {settings.working_hours?.[day]?.closed ? 'Closed' : 'Active'}
                                         </button>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </CardContent>
                </Card>
            </div>
        )}

        {activeTab === 'policies' && (
            <div
                className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                            <CardTitle className="text-lg text-slate-900">Financial Protocol</CardTitle>
                            <CardDescription className="text-slate-500">Configure consultation fees and billing parameters.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Standard Consultation Fee (INR)</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">₹</div>
                                    <Input 
                                        type="number"
                                        value={settings.consultation_fee}
                                        onChange={(e) => handleUpdate('consultation_fee', parseFloat(e.target.value))}
                                        className="pl-8 rounded-2xl h-12"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 ml-1">This fee applies to all first-time clinical visits.</p>
                             </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="bg-slate-900/5 p-8 border-b border-slate-100">
                            <CardTitle className="text-lg text-slate-900">Legal Disclosures</CardTitle>
                            <CardDescription>Patient agreements and operational policies.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-primary" /> Cancellation Protocol
                                </p>
                                <textarea 
                                    value={settings.cancellation_policy || ''}
                                    onChange={(e) => handleUpdate('cancellation_policy', e.target.value)}
                                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="Patients must cancel 24 hours in advance..."
                                />
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                    <FileText size={14} className="text-primary" /> Terms & Service Summary
                                </p>
                                <textarea 
                                    value={settings.terms_of_service || ''}
                                    onChange={(e) => handleUpdate('terms_of_service', e.target.value)}
                                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="Standard medical terms of service..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )}
      </div>

      <div className="p-8 rounded-[3rem] bg-amber-50/50 border border-amber-100 border-dashed flex items-center justify-between">
          <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <AlertCircle size={24} />
              </div>
              <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Configuration Safety Protocol</h4>
                  <p className="text-xs text-slate-500 font-medium">Any changes made here affect the entire patient-facing clinical portal instantly.</p>
              </div>
          </div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Check size={14} /> Security Level: High
          </p>
      </div>
    </div>
  );
}

function ArrowRight({ size, className = "" }: { size: number, className?: string }) {
    return <ChevronRight size={size} className={className} />
}
