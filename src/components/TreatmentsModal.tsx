"use client";

import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function TreatmentsModal({
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
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-[800] text-slate-900">
              Treatments & Pricing
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore our clinical procedures and transparent cost estimates.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-full transition-colors shadow-sm"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search treatments (e.g., braces, whitening)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary shadow-inner"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl h-32 animate-pulse border border-slate-100 shadow-sm"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p>No treatments found matching "{search}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {t.name}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-blue-50 px-2 py-1 rounded-md shrink-0">
                      {t.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-1">
                    {t.description}
                  </p>
                  <p className="text-lg font-black text-slate-800">
                    {t.price_range}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
