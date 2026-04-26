'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function formatTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

function buildHoursSummary(workingHours: Record<string, any>): { label: string; hours: string; closed: boolean }[] {
  if (!workingHours) return [];
  const groups: { days: string[]; morning?: any; evening?: any; closed: boolean }[] = [];
  for (const day of DAYS_ORDER) {
    const info = workingHours[day] || {};
    const isClosed = !!info.closed;
    const morning = info.morning;
    const evening = info.evening;
    const last = groups[groups.length - 1];
    const sameSchedule =
      last &&
      last.closed === isClosed &&
      JSON.stringify(last.morning) === JSON.stringify(morning) &&
      JSON.stringify(last.evening) === JSON.stringify(evening);
    if (sameSchedule) {
      last.days.push(day);
    } else {
      groups.push({ days: [day], morning, evening, closed: isClosed });
    }
  }
  return groups.map((g) => {
    const first = g.days[0];
    const last = g.days[g.days.length - 1];
    const label =
      g.days.length === 1
        ? first.charAt(0).toUpperCase() + first.slice(1)
        : `${first.charAt(0).toUpperCase() + first.slice(1)} – ${last.charAt(0).toUpperCase() + last.slice(1)}`;
    if (g.closed) return { label, hours: 'Closed', closed: true };
    const parts: string[] = [];
    if (g.morning?.open && g.morning?.close)
      parts.push(`${formatTime(g.morning.open)} – ${formatTime(g.morning.close)}`);
    if (g.evening?.open && g.evening?.close)
      parts.push(`${formatTime(g.evening.open)} – ${formatTime(g.evening.close)}`);
    return { label, hours: parts.join(' & ') || 'Open', closed: false };
  });
}

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('clinic_settings')
      .select('clinic_name,tagline,phone,whatsapp,email,address,social_links,working_hours')
      .single()
      .then(({ data }) => { if (data) setSettings(data); });
  }, []);

  const clinicName  = settings?.clinic_name || 'Dr Rohit Dental Clinic';
  const tagline     = settings?.tagline     || 'Your smile is our priority.';
  const phone       = settings?.phone       || '+91 90184 64914';
  const email       = settings?.email       || 'drrohitbhadwal@gmail.com';
  const address     = settings?.address     || 'Shaheedi Chowk, College Rd, Kathua, J&K 184101';
  const social      = (settings?.social_links as Record<string, string>) || {};
  const hoursSummary = buildHoursSummary(settings?.working_hours || {});

  return (
    <footer className="bg-bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image src="/images/logo.jpg" alt={clinicName} width={40} height={40} className="rounded-xl shadow-sm" />
            <h2 className="text-xl font-serif font-[800] text-white">{clinicName}</h2>
          </div>
          <p className="text-slate-400 text-sm mb-6 max-w-xs">{tagline}</p>

          {/* Social Links */}
          <div className="flex gap-3">
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-blue-600 flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            )}
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-pink-600 flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            )}
            {social.youtube && (
              <a href={social.youtube} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-600 flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">Quick Links</h3>
          <ul className="flex flex-col gap-3">
            <li><Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About Dr. Rohit Bhadwal</Link></li>
            <li><Link href="/services" className="text-slate-400 hover:text-white transition-colors">Treatments</Link></li>
            <li><Link href="/gallery" className="text-slate-400 hover:text-white transition-colors">Smile Gallery</Link></li>
            <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/guest-book" className="text-slate-400 hover:text-white transition-colors">Quick Book</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">Contact</h3>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3 text-slate-400">
              <MapPin size={20} className="text-primary mt-1 shrink-0" />
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-3 text-slate-400">
              <Phone size={20} className="text-primary shrink-0" />
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">{phone}</a>
            </li>
            <li className="flex items-center gap-3 text-slate-400">
              <Mail size={20} className="text-primary shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
            </li>
          </ul>
        </div>

        {/* Working Hours — dynamic from admin settings */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">Working Hours</h3>
          {hoursSummary.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {hoursSummary.map((row, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-400">
                  <Clock size={18} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-white text-sm">{row.label}</p>
                    <p className={`text-sm ${row.closed ? 'text-red-400' : ''}`}>{row.hours}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3 text-slate-400">
                <Clock size={18} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white text-sm">Mon – Sat</p>
                  <p className="text-sm">9:00 AM – 1:00 PM &amp; 5:00 PM – 8:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <Clock size={18} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white text-sm">Sunday</p>
                  <p className="text-sm text-red-400">Closed</p>
                </div>
              </li>
            </ul>
          )}
        </div>

      </div>

      <div className="container mx-auto px-4 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} {clinicName}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}