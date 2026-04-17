'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Calendar, User } from 'lucide-react';
import TreatmentsModal from '../TreatmentsModal';
import { Button } from '../ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTreatmentsModalOpen, setIsTreatmentsModalOpen] = useState(false);
  const { user, loading } = useAuth();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Treatments', action: () => setIsTreatmentsModalOpen(true) },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-2xl shadow-sm text-white">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s-4-1-4-5V7c0-2.2 1.8-4 4-4s4 1.8 4 4v10c0 4-4 5-4 5z"/>
              <path d="M8 12h8"/>
              <path d="M12 8v8"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-[800] text-slate-900 m-0 leading-tight">Dr. Rohit&apos;s</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest leading-tight">Dental & Implant Centre</p>
          </div>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {links.map((link) => (
              <li key={link.name}>
                {link.path ? (
                  <Link 
                    href={link.path}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === link.path ? 'text-primary border-b-2 border-primary pb-1' : 'text-slate-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <button
                    onClick={link.action}
                    className="text-sm font-medium transition-colors hover:text-primary text-slate-600"
                  >
                    {link.name}
                  </button>
                )}
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-3">
            {!loading && user ? (
              <Link href="/patient/dashboard">
                <Button variant="outline" className="flex items-center gap-2 rounded-xl">
                  <User size={16} /> Dashboard
                </Button>
              </Link>
            ) : null}
            <Link href="/book">
              <Button className="flex items-center gap-2">
                <Calendar size={16} /> Book Appointment
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg animate-fade-in-up">
          <div className="container mx-auto px-4 py-6 space-y-2">
            {links.map((link) => (
              link.path ? (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === link.path 
                      ? 'bg-blue-50 text-primary font-bold' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={() => {
                    link.action?.();
                    setMobileOpen(false);
                  }}
                  className="w-full text-left block px-4 py-3 rounded-xl text-sm font-medium transition-colors text-slate-600 hover:bg-slate-50"
                >
                  {link.name}
                </button>
              )
            ))}
            
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {!loading && user ? (
                <Link href="/patient/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full h-12 rounded-xl flex items-center justify-center gap-2">
                    <User size={16} /> My Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full h-12 rounded-xl flex items-center justify-center gap-2">
                    <User size={16} /> Login
                  </Button>
                </Link>
              )}
              <Link href="/book" onClick={() => setMobileOpen(false)}>
                <Button className="w-full h-12 rounded-xl flex items-center justify-center gap-2 mt-3">
                  <Calendar size={16} /> Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <TreatmentsModal 
        isOpen={isTreatmentsModalOpen} 
        onClose={() => setIsTreatmentsModalOpen(false)} 
      />
    </nav>
  );
}