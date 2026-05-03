"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, Tag, Save, X, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminTreatmentsPage() {
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const supabase = createClient();

  useEffect(() => {
    fetchTreatments();
  }, []);

  async function fetchTreatments() {
    setLoading(true);
    const { data, error } = await supabase
      .from("treatments")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) setTreatments(data);
    setLoading(false);
  }

  const handleSave = async (id: string | null) => {
    const payload = {
      name: editForm.name,
      description: editForm.description,
      price_range: editForm.price_range,
      category: editForm.category,
      is_active: editForm.is_active,
      sort_order: editForm.sort_order || 0,
      duration_minutes: editForm.duration_minutes || 30,
    };

    if (id === "new") {
      const { error } = await supabase.from("treatments").insert([payload]);
      if (error) {
        toast.error("Failed to add treatment");
        return;
      }
      toast.success("Treatment added");
    } else {
      const { data, error } = await supabase
        .from("treatments")
        .update(payload)
        .eq("id", id as string)
        .select();
      if (error) {
        toast.error("Failed to update treatment");
        return;
      }
      if (!data || data.length === 0) {
        toast.error("Update failed — no rows affected. Check permissions.");
        return;
      }
      toast.success("Treatment updated");
    }

    setIsEditing(null);
    setEditForm({});
    fetchTreatments();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this treatment?")) return;
    const { error } = await supabase.from("treatments").delete().eq("id", id);
    if (!error) {
      toast.success("Treatment deleted");
      fetchTreatments();
    }
  };

  const startEdit = (t: any) => {
    setIsEditing(t.id);
    setEditForm({ ...t });
  };

  const addNew = () => {
    setIsEditing("new");
    setEditForm({ is_active: true, sort_order: treatments.length + 1, duration_minutes: 30 });
  };

  // Shared input class for consistent Clinical White theme
  const inputClass = "bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:ring-1 focus:ring-primary outline-none";

  // Helper to format duration for display
  const formatDuration = (mins: number | null | undefined) => {
    if (!mins) return null;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const rem = mins % 60;
      return rem > 0 ? `${hrs}h ${rem}m` : `${hrs} Hour${hrs > 1 ? 's' : ''}`;
    }
    return `${mins} min`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Tag className="text-primary" size={32} />
            Treatments & Pricing
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Manage clinical procedures, pricing, and treatment durations
          </p>
        </div>
        <button
          onClick={addNew}
          disabled={isEditing !== null}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
        >
          <Plus size={20} /> Add Treatment
        </button>
      </div>

      <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl">
        {loading ? (
          <div className="text-center py-10 text-slate-400">
            Loading treatments...
          </div>
        ) : (
          <div className="space-y-4">
            {isEditing === "new" && (
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-primary/30 flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <input
                    type="text"
                    placeholder="Name"
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={editForm.category || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Price Range (e.g. ₹3,000 - ₹6,000)"
                    value={editForm.price_range || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price_range: e.target.value })
                    }
                    className={inputClass}
                  />
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-slate-50 px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Treatment Duration (min)</label>
                    <input
                      type="number"
                      placeholder="e.g. 30, 60, 90"
                      min="5"
                      step="5"
                      value={editForm.duration_minutes || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          duration_minutes: parseInt(e.target.value) || 0,
                        })
                      }
                      className={`${inputClass} pt-3`}
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="Sort Order"
                    value={editForm.sort_order || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        sort_order: parseInt(e.target.value),
                      })
                    }
                    className={inputClass}
                  />
                  <textarea
                    placeholder="Description"
                    value={editForm.description || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className={`${inputClass} md:col-span-2 h-20`}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave("new")}
                    className="p-3 bg-emerald-500/20 text-emerald-600 rounded-xl hover:bg-emerald-500/30"
                  >
                    <Save size={20} />
                  </button>
                  <button
                    onClick={() => setIsEditing(null)}
                    className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}

            {treatments.map((t) =>
              isEditing === t.id ? (
                <div
                  key={t.id}
                  className="bg-blue-50/50 p-6 rounded-2xl border border-primary/30 flex flex-col md:flex-row gap-4 items-start"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <input
                      type="text"
                      placeholder="Name"
                      value={editForm.name || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className={inputClass}
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={editForm.category || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, category: e.target.value })
                      }
                      className={inputClass}
                    />
                    <input
                      type="text"
                      placeholder="Price Range"
                      value={editForm.price_range || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          price_range: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                    <div className="relative">
                      <label className="absolute -top-2 left-3 bg-slate-50 px-1 text-[10px] font-bold text-primary uppercase tracking-wider">Treatment Duration (min)</label>
                      <input
                        type="number"
                        placeholder="e.g. 30, 60, 90"
                        min="5"
                        step="5"
                        value={editForm.duration_minutes || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            duration_minutes: parseInt(e.target.value) || 0,
                          })
                        }
                        className={`${inputClass} pt-3`}
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="Sort Order"
                      value={editForm.sort_order || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          sort_order: parseInt(e.target.value),
                        })
                      }
                      className={inputClass}
                    />
                    <textarea
                      placeholder="Description"
                      value={editForm.description || ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      className={`${inputClass} md:col-span-2 h-20`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(t.id)}
                      className="p-3 bg-emerald-500/20 text-emerald-600 rounded-xl hover:bg-emerald-500/30"
                    >
                      <Save size={20} />
                    </button>
                    <button
                      onClick={() => setIsEditing(null)}
                      className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={t.id}
                  className="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 hover:border-primary/30 transition-colors shadow-sm"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-slate-900 text-lg">{t.name}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md">
                        {t.category}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1 mb-2">
                      {t.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <p className="text-emerald-500 font-bold">
                        {t.price_range}
                      </p>
                      {t.duration_minutes && (
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                          <Clock size={14} className="text-primary" />
                          {formatDuration(t.duration_minutes)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(t)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-primary hover:text-white text-slate-400 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-red-500 hover:text-white text-slate-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ),
            )}

            {treatments.length === 0 && isEditing !== "new" && (
              <div className="text-center py-20 text-slate-500">
                No treatments configured yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
