'use client';

import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
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
      <div className="min-h-screen bg-[#0B1B3D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Verifying Clinical Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1B3D] flex selection:bg-primary/30">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-[#0A192F]/80 backdrop-blur-xl text-white flex flex-col fixed inset-y-0 border-r border-white/5 z-50
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl text-white shadow-lg">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tight">Admin Console</h1>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all group ${
                pathname === item.path 
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} className={pathname === item.path ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-slate-800/50 p-4 rounded-2xl mb-4">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Authenticated as</p>
            <p className="text-xs font-bold text-white truncate">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-red-400 font-bold text-sm hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} /> Exit Console
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 bg-[#0A192F] border-b border-white/5 z-30 px-4 py-3 flex items-center justify-between shadow-sm">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-white/5 text-white"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-primary" />
            <span className="font-bold text-sm text-white">Admin Console</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        <main className="p-6 lg:p-10 min-h-screen bg-gradient-to-br from-[#0B1B3D] via-[#0A192F] to-[#0B1B3D] dark">
          {children}
        </main>
      </div>
    </div>
  );
}
