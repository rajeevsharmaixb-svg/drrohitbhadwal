'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronRight, ChevronLeft, Calendar, Stethoscope, Package, User, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { Database } from '@/lib/types';
import { format } from 'date-fns';

type Doctor = Database['public']['Tables']['doctors']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type Package = Database['public']['Tables']['packages']['Row'];
type TimeSlot = Database['public']['Tables']['time_slots']['Row'];

const formSchema = z.object({
  patient_name: z.string().min(2, 'Name is required'),
  patient_phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  patient_email: z.string().email('Invalid email').optional().or(z.literal('')),
  patient_address: z.string().min(5, 'Home address is required'),
  service_id: z.string().optional().nullable(),
  package_id: z.string().optional().nullable(),
  doctor_id: z.string().optional().nullable(),
  slot_id: z.string().min(1, 'Please select a time slot'),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof formSchema>;

interface BookingWizardProps {
  initialDoctors: Doctor[];
  initialServices: Service[];
  initialPackages: Package[];
  user: any;
  consultationFee: number;
}

export default function BookingWizard({ initialDoctors, initialServices, initialPackages, user, consultationFee }: BookingWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      patient_name: user?.user_metadata?.full_name || '',
      patient_phone: user?.user_metadata?.phone || '',
      patient_email: user?.email || '',
      patient_address: '',
      service_id: null,
      package_id: null,
      doctor_id: null,
    }
  });

  const selectedDoctorId = watch('doctor_id');

  // Fetch slots based on date and doctor
  useEffect(() => {
    async function fetchSlots() {
      let query = supabase
        .from('time_slots')
        .select('*')
        .eq('slot_date', selectedDate)
        .eq('is_available', true);
      
      if (selectedDoctorId) {
        query = query.eq('doctor_id', selectedDoctorId);
      }

      const { data, error } = await query;
      if (!error && data) setAvailableSlots(data);
    }
    fetchSlots();
  }, [selectedDate, selectedDoctorId, supabase]);

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['patient_name', 'patient_phone', 'patient_address'];
    if (step === 2) fieldsToValidate = ['slot_id'];
    
    const isValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate as any) : true;
    if (isValid) setStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      const selectedSlot = availableSlots.find(s => s.id === data.slot_id);
      
      const payload = {
        patient_id: user.id,
        patient_name: data.patient_name,
        patient_phone: data.patient_phone,
        patient_email: data.patient_email,
        patient_address: data.patient_address,
        service_id: null,
        package_id: null,
        doctor_id: null,
        slot_id: data.slot_id,
        preferred_date: selectedDate,
        preferred_time: selectedSlot ? `${selectedSlot.start_time} - ${selectedSlot.end_time} (${selectedSlot.shift})` : 'TBD',
        notes: data.notes,
        status: 'pending'
      };

      const { error } = await supabase.from('appointments').insert([payload]);
      if (error) throw error;

      // Update slot availability
      await supabase.from('time_slots').update({ is_available: false }).eq('id', data.slot_id);

      router.push('/patient/dashboard?booking=success');
    } catch (err) {
      console.error(err);
      alert('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center relative">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center z-10 w-1/3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                step >= s ? 'bg-primary border-primary text-white' : 'bg-white border-slate-200 text-slate-400'
              }`}>
                {step > s ? <CheckCircle2 size={20} /> : s}
              </div>
              <span className={`text-[10px] mt-2 font-bold uppercase tracking-widest text-center ${step >= s ? 'text-primary' : 'text-slate-400'}`}>
                {s === 1 ? 'Profile' : s === 2 ? 'Time' : 'Review'}
              </span>
            </div>
          ))}
          {/* Progress Line */}
          <div className="absolute top-5 left-[16.66%] right-[16.66%] h-[2px] bg-slate-200 -z-0"></div>
          <div 
            className="absolute top-5 left-[16.66%] h-[2px] bg-primary transition-all duration-500 -z-0" 
            style={{ width: `${((step - 1) / 2) * 66.66}%` }}
          ></div>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white p-8 border-b border-white/10">
          <CardTitle className="text-2xl flex items-center gap-3">
            {step === 1 && <><User size={24} className="text-blue-400" /> Patient Information</>}
            {step === 2 && <><Clock size={24} className="text-amber-400" /> Select Date & Time</>}
            {step === 3 && <><CheckCircle2 size={24} className="text-green-400" /> Final Review</>}
          </CardTitle>
          <CardDescription className="text-slate-400">
            Step {step} of 3 — {step === 3 ? 'Confirm your clinical visit details.' : 'Please provide accurate details for coordination.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-500">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <Input {...register('patient_name')} placeholder="Enter your official name" />
                {errors.patient_name && <p className="text-xs text-red-500 font-medium">{errors.patient_name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Phone Number</label>
                <Input {...register('patient_phone')} placeholder="+91" />
                {errors.patient_phone && <p className="text-xs text-red-500 font-medium">{errors.patient_phone.message}</p>}
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Home Address</label>
                <textarea 
                  {...register('patient_address')}
                  placeholder="Enter your full residential address"
                  className="w-full h-20 bg-white text-slate-900 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm transition-colors"
                />
                {errors.patient_address && <p className="text-xs text-red-500 font-medium">{errors.patient_address.message}</p>}
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address (Optional)</label>
                <Input {...register('patient_email')} placeholder="email@example.com" />
              </div>
            </div>
          )}

          {step === 2 && (

            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calendar size={18} className="text-primary" /> Select Date
                  </label>
                  <Input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="h-12 text-lg text-center"
                  />
                </div>
                
                <div className="flex-[2] space-y-4">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Clock size={18} className="text-primary" /> Select Available Slot
                  </label>
                  {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availableSlots.map((slot) => (
                        <div 
                          key={slot.id}
                          onClick={() => setValue('slot_id', slot.id)}
                          className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all ${
                            watch('slot_id') === slot.id ? 'border-primary bg-blue-50 text-primary font-bold' : 'border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <p className="text-sm">{slot.start_time.substring(0, 5)}</p>
                          <p className="text-[9px] uppercase opacity-70">{slot.shift}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl text-center">
                      <p className="text-amber-800 text-sm font-medium">No slots found for this date/doctor.</p>
                      <p className="text-amber-600 text-[10px] mt-1">Please try a different date or select 'Any Doctor'.</p>
                    </div>
                  )}
                  {errors.slot_id && <p className="text-xs text-red-500 font-medium">{errors.slot_id.message}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-slate-50 p-8 rounded-3xl space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Patient Account</h5>
                    <p className="font-bold text-slate-800">{watch('patient_name')}</p>
                    <p className="text-sm text-slate-500">{watch('patient_phone')}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Clinical Appointment</h5>
                    <p className="font-bold text-slate-800">{format(new Date(selectedDate), 'MMMM dd, yyyy')}</p>
                    <p className="text-sm text-primary font-bold">Slot: {availableSlots.find(s => s.id === watch('slot_id'))?.start_time.substring(0, 5) || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 pt-6">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Treatment Plan</h5>
                  <p className="font-bold text-slate-800">
                    General Consultation
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Care by: Next Available Doctor
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Special Notes / Symptoms</label>
                  <textarea 
                    {...register('notes')}
                    placeholder="Describe your symptoms or medical history..."
                    className="w-full h-32 bg-white text-slate-900 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm transition-colors"
                  />
                </div>
                
                <div className="border-t border-slate-200 pt-6">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Payment Options</h5>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href={`https://wa.me/919018464914?text=Hi, I would like to pay the consultation fee for my appointment on ${selectedDate}. Patient Name: ${watch('patient_name')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                      Pay via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-8 bg-slate-50 flex justify-between sticky bottom-0 z-10 border-t border-slate-100/50 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
          <Button 
            variant="outline" 
            onClick={() => step === 1 ? router.push('/book') : prevStep()} 
            disabled={isSubmitting}
            className="rounded-xl flex-1 max-w-[120px] md:max-w-none text-sm md:text-base mr-4"
          >
            <ChevronLeft size={20} className="mr-1 md:mr-2 shrink-0" /> Back
          </Button>

          {step < 3 ? (
            <Button onClick={nextStep} className="rounded-xl flex-1 md:px-8 text-sm md:text-base">
              Next Step <ChevronRight size={20} className="ml-1 md:ml-2 shrink-0" />
            </Button>
          ) : (
            <div className="flex gap-2 flex-1 md:justify-end">
              <Button onClick={handleSubmit(onSubmit)} variant="outline" className="rounded-xl flex-1 md:flex-none text-sm border-2" disabled={isSubmitting}>
                Skip Payment
              </Button>
              <Button onClick={handleSubmit(onSubmit)} className="rounded-xl flex-[2] md:flex-none md:px-10 bg-primary hover:bg-primary/90 text-sm md:text-base whitespace-nowrap px-2" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Confirm'}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
      
      <p className="text-center text-slate-400 text-[10px] mt-8">
        By continuing, you agree to Dr Rohit Dental Clinic's digital privacy policy and clinical attendance protocols.
      </p>
    </div>
  );
}
