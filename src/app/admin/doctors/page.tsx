'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  User, Stethoscope, Trash2, Edit, Camera, 
  Search, UserPlus, Image as ImageIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminDoctorsPage() {
  const supabase = createClient();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    designation: '',
    specialization: '',
    qualification: '',
    experience_years: '',
    short_bio: '',
    photo_url: '',
    availability_hours: '',
    rating: '5.0',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast.error('Failed to load clinical staff');
    } else {
      setDoctors(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOpenForm = (doctor: any = null) => {
    if (doctor) {
      setSelectedDoctor(doctor);
      setFormData({
        full_name: doctor.full_name,
        designation: doctor.designation,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        experience_years: String(doctor.experience_years),
        short_bio: doctor.short_bio || '',
        photo_url: doctor.photo_url || '',
        availability_hours: doctor.availability_hours || '',
        rating: String(doctor.rating || '5.0'),
      });
      setImagePreview(doctor.photo_url);
    } else {
      setSelectedDoctor(null);
      setFormData({
        full_name: '',
        designation: '',
        specialization: '',
        qualification: '',
        experience_years: '',
        short_bio: '',
        photo_url: '',
        availability_hours: '',
        rating: '5.0',
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsFormOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `doctors/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('team-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('team-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let photo_url = formData.photo_url;

      if (imageFile) {
        photo_url = await uploadImage(imageFile);
      }

      const payload = {
        ...formData,
        experience_years: parseInt(formData.experience_years) || 0,
        rating: parseFloat(formData.rating) || 5.0,
        photo_url,
      };

      let error;
      if (selectedDoctor) {
        ({ error } = await supabase
          .from('doctors')
          .update(payload)
          .eq('id', selectedDoctor.id));
      } else {
        ({ error } = await supabase
          .from('doctors')
          .insert([payload]));
      }

      if (error) throw error;

      toast.success(selectedDoctor ? 'Doctor profile updated' : 'New doctor added');
      setIsFormOpen(false);
      fetchDoctors();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDoctor) return;
    setIsSubmitting(true);
    
    try {
      // If photo exists in storage, we could delete it, but let's keep it simple for now and just remove from DB
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', selectedDoctor.id);

      if (error) throw error;

      toast.success('Medical officer removed');
      setIsDeleteOpen(false);
      fetchDoctors();
    } catch (error: any) {
      toast.error(error.message || 'Deletion failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = doctors.filter(doc => 
    doc.full_name.toLowerCase().includes(search.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-96 rounded-3xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Stethoscope size={28} className="text-primary" />
            Medical Professionals
          </h1>
          <p className="text-slate-500 text-sm">Manage clinical staff, specializations, and availability profiles.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name or specialty..." 
              className="pl-11 rounded-xl h-12 shadow-sm border-slate-200"
            />
          </div>
          <Button 
            className="rounded-xl h-12 shadow-xl shadow-primary/20 flex items-center gap-2"
            onClick={() => handleOpenForm()}
          >
            <UserPlus size={18} /> Add Professional
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center pt-8">
        {filtered.length === 0 ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400 bg-white border border-dashed border-slate-200 rounded-[3rem] shadow-inner font-medium">
            <User size={64} className="opacity-10 mb-4" />
            <p className="text-lg font-bold">No clinical profiles found.</p>
            <Button variant="ghost" onClick={() => setSearch('')} className="mt-4 text-primary font-black uppercase text-[10px] tracking-widest hover:bg-slate-50">Clear Selection</Button>
          </div>
        ) : (
          filtered.map((doc, idx) => {
            const localFallbacks = ['/images/doctors/doctor3.jpg', '/images/doctors/doctor1.jpg', '/images/doctors/doctor2.jpg', '/images/doctors/doctor4.jpg'];
            const displayPhoto = doc.photo_url || localFallbacks[idx % localFallbacks.length];
            
            return (
            <div
              className="animate-in fade-in scale-95 duration-500"
              key={doc.id}
            >
              <Card className="group border-none shadow-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-[3rem] overflow-hidden bg-white hover:-translate-y-2">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img 
                      src={displayPhoto} 
                      alt={doc.full_name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                    />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="bg-white/90 backdrop-blur-md rounded-2xl h-10 w-10 shadow-lg text-slate-700 hover:text-primary"
                        onClick={() => handleOpenForm(doc)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="bg-red-50/90 backdrop-blur-md rounded-2xl h-10 w-10 shadow-lg text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-900/40 to-transparent" />
                  </div>

                  <div className="p-8 space-y-4 flex-1">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="info" className="text-[9px]">{doc.specialization}</Badge>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                          ★ {doc.rating || '5.0'}
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">{doc.full_name}</h3>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.15em] mt-1">{doc.designation}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Experience</p>
                        <p className="text-sm font-bold text-slate-700">{doc.experience_years} Years</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Qualification</p>
                        <p className="text-sm font-bold text-slate-700 truncate px-1">{doc.qualification}</p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed italic">
                      &quot;{doc.short_bio || 'Dedicated to providing high-quality dental healthcare and confident smiles.'}&quot;
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Form Dialog */}
      <Dialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedDoctor ? 'Refine Profile' : 'Register Specialist'}
        description="Fill in the professional credentials and upload a profile identification photo."
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden group-hover:shadow-primary/20 transition-all duration-500">
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Profile Image (optional)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Professional Full Name</label>
              <Input 
                value={formData.full_name} 
                onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
                placeholder="e.g. Rohit Bhadwal" 
                required 
                className="rounded-2xl h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Current Designation</label>
              <Input 
                value={formData.designation} 
                onChange={(e) => setFormData({...formData, designation: e.target.value})} 
                placeholder="e.g. Senior Consultant" 
                required 
                className="rounded-2xl h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Specialization Area</label>
              <Input 
                value={formData.specialization} 
                onChange={(e) => setFormData({...formData, specialization: e.target.value})} 
                placeholder="e.g. Orthodontics" 
                required 
                className="rounded-2xl h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Academic Qualification</label>
              <Input 
                value={formData.qualification} 
                onChange={(e) => setFormData({...formData, qualification: e.target.value})} 
                placeholder="e.g. MDS, BDS" 
                required 
                className="rounded-2xl h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Total Experience (Years)</label>
              <Input 
                type="number" 
                value={formData.experience_years} 
                onChange={(e) => setFormData({...formData, experience_years: e.target.value})} 
                placeholder="e.g. 15" 
                required 
                className="rounded-2xl h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Clinician Rating (0-5)</label>
              <Input 
                type="number" 
                step="0.1"
                min="0"
                max="5"
                value={formData.rating} 
                onChange={(e) => setFormData({...formData, rating: e.target.value})} 
                placeholder="e.g. 5.0" 
                required 
                className="rounded-2xl h-12"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Availability Hours</label>
              <Input 
                value={formData.availability_hours} 
                onChange={(e) => setFormData({...formData, availability_hours: e.target.value})} 
                placeholder="e.g. 10:00 AM - 2:00 PM, 4:30 PM - 7:30 PM" 
                required 
                className="rounded-2xl h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Short Clinical Bio</label>
            <textarea 
              value={formData.short_bio} 
              onChange={(e) => setFormData({...formData, short_bio: e.target.value})} 
              className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Briefly describe clinical expertise and patient approach..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsFormOpen(false)} 
              className="flex-1 h-12 rounded-2xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex-1 h-12 rounded-2xl shadow-xl shadow-primary/20"
            >
              {isSubmitting ? 'Syncing Profile...' : (selectedDoctor ? 'Update Profile' : 'Launch Profile')}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Revoke Professional Access"
        description="Are you absolutely sure you want to remove this medical professional? This action will permanently delete their clinical profile."
      >
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => setIsDeleteOpen(false)} 
            className="flex-1 h-12 rounded-2xl"
          >
            Preserve Profile
          </Button>
          <Button 
            disabled={isSubmitting} 
            className="flex-1 h-12 rounded-2xl bg-red-600 hover:bg-red-700 shadow-xl shadow-red-200 flex items-center justify-center gap-2"
            onClick={handleDelete}
          >
            {isSubmitting ? 'Removing...' : (
              <><Trash2 size={18} /> Confirm Deletion</>
            )}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
