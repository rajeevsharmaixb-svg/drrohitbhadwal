'use client';

import { Suspense, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ShieldCheck, Lock, AlertTriangle, Mail, Phone, MapPin } from 'lucide-react';

// Configuration - Update this with your admin details
const ADMIN_EMAILS = [
  'drrohitbhadwal@gmail.com',
  'ajeev369@gmail.com',
  'rajeevsharma.ixb@gmail.com',
];

const ADMIN_CONFIG = {
  email: 'drrohitbhadwal@gmail.com',
  clinicName: 'Dr. Rohit Bhadwal\'s Dental & Implant Centre',
  supportPhone: '+91 90184 64914',
  supportEmail: 'drrohitbhadwal@gmail.com',
  address: '9GFF+Q72 Shaheedi Smarak, CHOWK, College Rd, Urliwand, Kathua, J&K 184101',
};

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const recordFailure = () => {
    const next = failedAttempts + 1;
    setFailedAttempts(next);
    if (next >= MAX_ATTEMPTS) {
      setLockoutUntil(Date.now() + LOCKOUT_SECONDS * 1000);
      setError(`Too many failed attempts. Please wait ${LOCKOUT_SECONDS} seconds.`);
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Brute-force protection
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setError(`Account locked. Please wait ${remaining} seconds.`);
      return;
    }

    setLoading(true);

    // Verify email is in the authorized admin list
    if (!ADMIN_EMAILS.some(e => e.toLowerCase() === email.toLowerCase())) {
      recordFailure();
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      recordFailure();
      setLoading(false);
      return;
    }

    // Verify admin role
    const role = data.user?.user_metadata?.role;
    if (role !== 'admin') {
      await supabase.auth.signOut();
      recordFailure();
      setLoading(false);
      return;
    }

    // Reset on success
    setFailedAttempts(0);
    setLockoutUntil(null);
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
        <form onSubmit={handleAdminLogin} className="space-y-5" autoComplete="off">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Administrator Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="off"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
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
            disabled={loading || !!(lockoutUntil && Date.now() < lockoutUntil)}
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
    <Card className="border-none shadow-xl rounded-2xl bg-white mt-6 border border-slate-100 hover:shadow-2xl transition-all duration-300">
      <CardContent className="p-6">
        <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-xs uppercase tracking-widest">
          <Mail size={16} className="text-amber-500" />
          Technical Support Info
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/10 p-2 rounded-lg">
              <Mail size={16} className="text-amber-400 shrink-0" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Mail</p>
              <a
                href={`mailto:${ADMIN_CONFIG.supportEmail}`}
                className="text-primary text-sm font-bold hover:underline transition-colors"
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
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hotline</p>
              <a
                href={`tel:${ADMIN_CONFIG.supportPhone.replace(/[^0-9+]/g, '')}`}
                className="text-primary text-sm font-bold hover:underline transition-colors"
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
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinic Identity</p>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">{ADMIN_CONFIG.address}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-500/30">
              <Image
                src="/images/logo.jpg"
                alt="Logo"
                width={64}
                height={64}
              />
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Dr. Rohit Bhadwal&apos;s</h1>
          <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mt-2">Clinical Admin Console</p>
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