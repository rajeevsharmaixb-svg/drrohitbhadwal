"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, Stethoscope } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function TreatmentsOnlyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchTreatments() {
      setLoading(true);
      const { data, error } = await supabase
        .from("treatments")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error && data) {
        setTreatments(data);
      }
      setLoading(false);
    }

    fetchTreatments();
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = treatments.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase()),
  );

  // Group by category
  const grouped = filtered.reduce((acc: Record<string, any[]>, t) => {
    const cat = t.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-primary/5 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-serif font-[800] text-slate-900">
                Our Treatments
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Explore the clinical procedures we offer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-full transition-colors shadow-sm"
          >
            <X size={22} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search treatments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-slate-50 p-4 rounded-xl h-12 animate-pulse"
                />
              ))}
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p>No treatments found matching &quot;{search}&quot;</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3 px-1">
                    {category}
                  </h3>
                  <div className="space-y-1.5">
                    {items.map((t: any) => (
                      <div
                        key={t.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50/60 transition-colors group"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors shrink-0" />
                        <span className="font-medium text-slate-800 group-hover:text-primary transition-colors">
                          {t.name}
                        </span>
                        {t.description && (
                          <span className="text-xs text-slate-400 ml-auto hidden sm:block truncate max-w-[200px]">
                            {t.description}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return modalContent;
  return createPortal(modalContent, document.body);
}
