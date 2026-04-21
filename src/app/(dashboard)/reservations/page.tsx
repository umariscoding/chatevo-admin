"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { companyApi } from "@/utils/company/api";
import Button from "@/components/ui/Button";
import { Icons } from "@/components/ui";

interface Appointment {
  appointment_id: string;
  caller_name: string | null;
  caller_phone: string | null;
  caller_email: string | null;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  duration_min: number;
  service_type: string | null;
  notes: string | null;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
  source: "voice_agent" | "manual" | "web";
  created_at: string;
}

type Filter = "all" | "confirmed" | "completed" | "cancelled" | "no_show";

const STATUS_BADGE: Record<string, string> = {
  confirmed: "bg-primary-100 text-primary-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-neutral-100 text-neutral-500",
  no_show: "bg-red-100 text-red-700",
};

export default function ReservationsPage() {
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const fetch = useCallback(async () => {
    try {
      const res = await companyApi.get("/appointments");
      setAppts(res.data.appointments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = useMemo(() => {
    let list = appts;
    if (filter !== "all") list = list.filter((a) => a.status === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((a) =>
        (a.caller_name || "").toLowerCase().includes(q) ||
        (a.caller_phone || "").includes(q) ||
        (a.service_type || "").toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => `${b.scheduled_date}${b.start_time}`.localeCompare(`${a.scheduled_date}${a.start_time}`));
  }, [appts, filter, search]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await companyApi.put(`/appointments/${id}`, { status });
      setAppts((p) => p.map((a) => a.appointment_id === id ? { ...a, status: status as Appointment["status"] } : a));
    } catch (err) { console.error(err); }
  };

  const deleteAppt = async (id: string) => {
    if (!confirm("Delete this reservation?")) return;
    try {
      await companyApi.delete(`/appointments/${id}`);
      setAppts((p) => p.filter((a) => a.appointment_id !== id));
    } catch (err) { console.error(err); }
  };

  const counts = useMemo(() => ({
    all: appts.length,
    confirmed: appts.filter((a) => a.status === "confirmed").length,
    completed: appts.filter((a) => a.status === "completed").length,
    cancelled: appts.filter((a) => a.status === "cancelled").length,
    no_show: appts.filter((a) => a.status === "no_show").length,
  }), [appts]);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "confirmed", label: "Confirmed" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
    { key: "no_show", label: "No Show" },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Reservations</h1>
          <p className="text-sm text-neutral-500 mt-1">{appts.length} total appointments</p>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex items-center border border-neutral-200 bg-white rounded-full p-1 gap-0.5">
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                filter === f.key ? "bg-primary-600 text-white shadow-sm shadow-primary-600/25" : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
              }`}>
              {f.label} {counts[f.key] > 0 && <span className="ml-1 opacity-70">({counts[f.key]})</span>}
            </button>
          ))}
        </div>

        <div className="relative">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, service..."
            className="pl-9 pr-4 py-2 rounded-lg border border-neutral-200 bg-white text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all w-64" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Date & Time</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Service</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Source</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-neutral-400">
                    {search ? "No results found" : "No reservations yet"}
                  </td>
                </tr>
              ) : filtered.map((a) => (
                <tr key={a.appointment_id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-neutral-900">{a.caller_name || "—"}</p>
                    {a.caller_phone && <p className="text-xs text-neutral-500">{a.caller_phone}</p>}
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-neutral-900">
                      {new Date(a.scheduled_date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    <p className="text-xs text-neutral-500">{a.start_time.slice(0, 5)} – {a.end_time.slice(0, 5)}</p>
                  </td>
                  <td className="px-5 py-3 text-neutral-700">{a.service_type || "—"}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-neutral-500">{a.source === "voice_agent" ? "Phone" : a.source}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${STATUS_BADGE[a.status] || ""}`}>
                      {a.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {a.status === "confirmed" && (
                        <>
                          <button onClick={() => updateStatus(a.appointment_id, "completed")}
                            className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark complete">
                            <Icons.Check className="h-3.5 w-3.5 text-emerald-500" />
                          </button>
                          <button onClick={() => updateStatus(a.appointment_id, "no_show")}
                            className="p-1.5 hover:bg-amber-50 rounded-lg transition-colors" title="No show">
                            <Icons.UserX className="h-3.5 w-3.5 text-amber-500" />
                          </button>
                          <button onClick={() => updateStatus(a.appointment_id, "cancelled")}
                            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors" title="Cancel">
                            <Icons.Close className="h-3.5 w-3.5 text-neutral-400" />
                          </button>
                        </>
                      )}
                      <button onClick={() => deleteAppt(a.appointment_id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Icons.Trash className="h-3.5 w-3.5 text-neutral-300 hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
