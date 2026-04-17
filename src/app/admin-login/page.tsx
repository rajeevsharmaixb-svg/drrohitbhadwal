'use client';

import { Suspense, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ShieldCheck, Lock, AlertTriangle, Mail, Phone, MapPin } from 'lucide-react';

// Configuration - Update this with your admin details
const ADMIN_CONFIG = {
  email: 'ajeev369@gmail.com',
  clinicName: 'Dr Rohit Dental Clinic',
  supportPhone: '+91 90184 64914',
  supportEmail: 'drrohitdentalclinic@gmail.com',
  address: '9GFF+Q72 Shaheedi Smarak, CHOWK, College Rd, Urliwand, Kathua, J&K 184101',
};

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Verify email matches admin email
    if (email.toLowerCase() !== ADMIN_CONFIG.email.toLowerCase()) {
      setError('Invalid admin email. Please use the authorized administrator email.');
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Verify admin role
    const role = data.user?.user_metadata?.role;
    if (role !== 'admin') {
      await supabase.auth.signOut();
      setError('Access Denied. This portal is restricted to authorized administrators only.');
      setLoading(false);
      return;
    }

    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-amber-500/20 p-2 rounded-xl">
            <ShieldCheck size={24} className="text-amber-400" />
          </div>
          <div>
            <CardTitle className="text-xl text-white">Administration Console</CardTitle>
            <CardDescription className="text-slate-400">
              Restricted access — Authorized personnel only
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Administrator Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={ADMIN_CONFIG.email}
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Authorized admin email: {ADMIN_CONFIG.email}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-3">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-md font-bold bg-amber-600 hover:bg-amber-700 transition-all hover:shadow-lg"
            disabled={loading}
          >
            <Lock size={16} className="mr-2" />
            {loading ? 'Verifying Credentials...' : 'Access Admin Console'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            🔒 This page is monitored. Unauthorized access attempts are logged.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminInfoCard() {
  return (
    <Card className="border-none shadow-lg rounded-2xl bg-white/5 backdrop-blur-sm mt-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardContent className="p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
          <Mail size={18} className="text-amber-400" />
          Admin Contact Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/10 p-2 rounded-lg">
              <Mail size={16} className="text-amber-400 shrink-0" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Email</p>
              <a
                href={`mailto:${ADMIN_CONFIG.supportEmail}`}
                className="text-white text-sm font-medium hover:text-amber-400 transition-colors"
              >
                {ADMIN_CONFIG.supportEmail}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-amber-500/10 p-2 rounded-lg">
              <Phone size={16} className="text-amber-400 shrink-0" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Phone</p>
              <a
                href={`tel:${ADMIN_CONFIG.supportPhone.replace(/[^0-9+]/g, '')}`}
                className="text-white text-sm font-medium hover:text-amber-400 transition-colors"
              >
                {ADMIN_CONFIG.supportPhone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-amber-500/10 p-2 rounded-lg">
              <MapPin size={16} className="text-amber-400 shrink-0" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinic Address</p>
              <p className="text-white text-sm font-medium leading-relaxed">{ADMIN_CONFIG.address}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-amber-500/20 p-3 rounded-full border border-amber-500/30">
              <ShieldCheck size={32} className="text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">{ADMIN_CONFIG.clinicName}</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Admin Control Panel</p>
        </div>

        <Suspense fallback={
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden animate-pulse">
            <div className="bg-slate-800 h-28 w-full" />
            <div className="p-8 space-y-4">
              <div className="bg-slate-100 h-10 w-full rounded-xl" />
              <div className="bg-slate-100 h-10 w-full rounded-xl" />
              <div className="bg-slate-100 h-12 w-full rounded-xl" />
            </div>
          </Card>
        }>
          <AdminLoginForm />
          <AdminInfoCard />
        </Suspense>
      </div>
    </div>
  );
}