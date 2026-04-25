'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Calendar, User } from 'lucide-react';
import TreatmentsOnlyModal from '../TreatmentsOnlyModal';
import TreatmentsModal from '../TreatmentsModal';
import { Button } from '../ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTreatmentsModalOpen, setIsTreatmentsModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Treatments', action: () => setIsTreatmentsModalOpen(true) },
    { name: 'Pricing', action: () => setIsPricingModalOpen(true) },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const isHomePage = pathname === '/';

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-md py-3' 
          : isHomePage 
            ? 'bg-transparent py-5 text-white' 
            : 'bg-white shadow-sm py-4'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-xl shadow-sm transition-transform group-hover:scale-105">
            <Image
              src="/images/logo.jpg"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className={`text-lg md:text-xl font-bold leading-tight transition-colors ${!isScrolled && isHomePage ? 'text-white' : 'text-slate-900'}`}>Dr Rohit Dental Clinic</h1>
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] leading-tight transition-colors ${!isScrolled && isHomePage ? 'text-white/80' : 'text-primary'}`}>Braces & Implant Centre</p>
          </div>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {links.map((link) => (
              <li key={link.name}>
                {link.path ? (
                  <Link 
                    href={link.path}
                    className={`text-sm font-semibold transition-colors hover:text-primary ${
                      pathname === link.path 
                        ? 'text-primary' 
                        : (!isScrolled && isHomePage ? 'text-white hover:text-white/80' : 'text-slate-600')
                    }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <button
                    onClick={link.action}
                    className={`text-sm font-semibold transition-colors hover:text-primary ${
                      !isScrolled && isHomePage ? 'text-white hover:text-white/80' : 'text-slate-600'
                    }`}
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
                <Button variant={!isScrolled && isHomePage ? "secondary" : "outline"} size="sm" className="flex items-center gap-2 rounded-xl">
                  <User size={16} /> Dashboard
                </Button>
              </Link>
            ) : null}
            <Link href="/book">
              <Button size="sm" className={`flex items-center gap-2 rounded-full px-6 shadow-lg transition-all ${!isScrolled && isHomePage ? 'bg-white text-primary hover:bg-white/90 shadow-white/10' : 'shadow-primary/20'}`}>
                <Calendar size={16} /> Book Appointment
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Link href="/book">
            <Button size="sm" className={`rounded-full px-4 text-xs ${!isScrolled && isHomePage ? 'bg-white text-primary' : ''}`}>
              Book
            </Button>
          </Link>
          <button 
            className={`p-2 rounded-xl transition-colors shadow-sm ${!isScrolled && isHomePage ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-50 text-slate-900 hover:bg-slate-100'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div 
        className={`lg:hidden fixed inset-x-0 top-[72px] bg-white border-t border-slate-100 shadow-2xl transition-all duration-300 ease-in-out transform ${
          mobileOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible'
        }`}
      >
        <div className="container mx-auto px-4 py-8 space-y-3">
          {links.map((link) => (
            link.path ? (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-5 py-4 rounded-2xl text-base font-bold transition-all ${
                  pathname === link.path 
                    ? 'bg-blue-50 text-primary translate-x-2' 
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
                className="w-full text-left block px-5 py-4 rounded-2xl text-base font-bold transition-all text-slate-600 hover:bg-slate-50"
              >
                {link.name}
              </button>
            )
          ))}
          
          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 gap-4">
            {!loading && user && (
              <Link href="/patient/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-bold">
                  <User size={20} /> My Dashboard
                </Button>
              </Link>
            )}
            <Link href="/book" onClick={() => setMobileOpen(false)}>
              <Button className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg shadow-xl shadow-primary/30">
                <Calendar size={20} /> Reserve Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <TreatmentsOnlyModal 
        isOpen={isTreatmentsModalOpen} 
        onClose={() => setIsTreatmentsModalOpen(false)} 
      />
      <TreatmentsModal 
        isOpen={isPricingModalOpen} 
        onClose={() => setIsPricingModalOpen(false)} 
      />
    </nav>
  );
}