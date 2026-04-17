'use client';

import { Suspense, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Stethoscope, LogIn, UserPlus, Users } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/patient/dashboard';
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(returnTo);
      router.refresh();
    }
  };

  return (
    <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-slate-900 text-white p-8">
        <CardTitle className="text-xl flex items-center gap-2">
          <LogIn size={20} className="text-blue-400" /> Member Login
        </CardTitle>
        <CardDescription className="text-slate-400">
          Access your medical history and clinical appointments.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Email Address</label>
            <Input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patient@email.com" 
              required 
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Password</label>
            </div>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Authenticating...' : 'Sign In'}
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
          New to our clinic?{' '}
          <Link href="/register" className="text-primary font-bold hover:underline flex items-center justify-center gap-1 mt-1">
            <UserPlus size={14} /> Create Patient Account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-primary p-2 rounded-full text-white shadow-lg">
              <Stethoscope size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Dr Rohit Dental Clinic</h1>
          </Link>
          <p className="text-slate-500 font-medium">Digital Patient Portal Access</p>
        </div>

        <Suspense fallback={
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden animate-pulse">
            <div className="bg-slate-200 h-24 w-full" />
            <div className="p-8 space-y-4">
              <div className="bg-slate-100 h-10 w-full rounded-xl" />
              <div className="bg-slate-100 h-10 w-full rounded-xl" />
              <div className="bg-slate-100 h-12 w-full rounded-xl" />
            </div>
          </Card>
        }>
          <LoginForm />
        </Suspense>
        
        <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-widest font-bold">
          SECURE ENCRYPTED ACCESS
        </p>
      </div>
    </div>
  );
}
