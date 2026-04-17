'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Stethoscope, UserPlus, LogIn, Users, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          phone: formData.phone,
          role: 'patient',
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // If email confirmation is disabled, user is auto-signed-in
    if (data.session) {
      toast.success('Account created successfully!');
      router.push('/patient/dashboard');
      router.refresh();
    } else {
      // Email confirmation required
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 mb-6">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
            <p className="text-slate-600 text-sm mb-6">
              Please check your email to confirm your account. Once confirmed, you can log in.
            </p>
            <Link href="/login">
              <Button className="w-full h-12 rounded-xl">Go to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-primary p-2 rounded-full text-white shadow-lg">
              <Stethoscope size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Dr Rohit Dental Clinic</h1>
          </Link>
          <p className="text-slate-500 font-medium">Create Secure Patient Account</p>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-900 text-white p-8">
            <CardTitle className="text-xl flex items-center gap-2">
              <UserPlus size={20} className="text-emerald-400" /> Sign Up
            </CardTitle>
            <CardDescription className="text-slate-400">
              Register to track treatment plans and book priority slots.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91..."
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••  (min 6 characters)"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Confirm Password</label>
                <Input
                  type="password"
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-12 rounded-xl text-md font-bold transition-all hover:shadow-lg" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-bold uppercase">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Guest Booking */}
            <Link href="/guest-book" className="block">
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                <Users size={18} />
                Book as Guest (No Account Needed)
              </Button>
            </Link>
          </CardContent>

          <CardFooter className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline flex items-center justify-center gap-1 mt-1">
                <LogIn size={14} /> Back to Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-widest font-bold">
          SECURE PATIENT REGISTRATION
        </p>
      </div>
    </div>
  );
}
