'use client';

import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Stethoscope, Briefcase, Settings, LogOut, ShieldCheck, CalendarCheck, Menu, X, MessageSquare, Tag } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.user_metadata?.role !== 'admin') {
        router.push('/admin-login');
        return;
      }
      setUser(user);
      setLoading(false);
    }
    checkAdmin();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/admin/appointments', icon: CalendarCheck },
    { name: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Treatments', path: '/admin/treatments', icon: Tag },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-black uppercase tracking-widest animate-pulse">Verifying Clinical Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex selection:bg-primary/10">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white text-slate-900 flex flex-col fixed inset-y-0 border-r border-slate-200 z-50
        transition-transform duration-300 shadow-xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="rounded-xl overflow-hidden shadow-lg border-2 border-white/10 shrink-0">
            <Image 
              src="/images/logo.jpg" 
              alt="Logo" 
              width={36} 
              height={36} 
            />
          </div>
          <h1 className="text-xl font-black tracking-tight">Clinical Console</h1>
        </div>

        <nav className="flex-1 p-6 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group ${
                pathname === item.path 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-primary'
              }`}
            >
              <item.icon size={16} className={pathname === item.path ? 'text-white' : 'group-hover:text-primary transition-colors'} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="p-4 rounded-2xl mb-4 bg-white border border-slate-200 shadow-sm">
            <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-1">Authenticated Head</p>
            <p className="text-[10px] font-black text-slate-900 truncate">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
          >
            <LogOut size={16} /> Logout Console
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 bg-white border-b border-slate-100 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            <span className="font-black text-[10px] uppercase tracking-widest text-slate-900">Clinical Admin</span>
          </div>
          <div className="w-8" />
        </div>

        <main className="p-6 lg:p-10 min-h-screen bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
