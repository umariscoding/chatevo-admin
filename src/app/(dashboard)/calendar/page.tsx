"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
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

interface Schedule { day_of_week: number; start_time: string; end_time: string; is_active: boolean; }

type ViewMode = "week" | "month";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6);
const HOUR_H = 56;
const DAYS_S = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const STATUS: Record<string, { bg: string; border: string; text: string }> = {
  confirmed: { bg: "bg-primary-500", border: "border-l-primary-600", text: "text-white" },
  completed: { bg: "bg-emerald-500", border: "border-l-emerald-600", text: "text-white" },
  cancelled: { bg: "bg-neutral-200", border: "border-l-neutral-300", text: "text-neutral-500" },
  no_show: { bg: "bg-red-400", border: "border-l-red-500", text: "text-white" },
};

function fmt(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function weekOf(d: Date) { const s = new Date(d); s.setDate(s.getDate() - s.getDay()); return Array.from({ length: 7 }, (_, i) => { const c = new Date(s); c.setDate(s.getDate() + i); return c; }); }
function toMin(t: string) { const [h, m] = t.split(":").map(Number); return h * 60 + (m || 0); }
function fmtHr(h: number) { if (h === 0) return "12 AM"; if (h === 12) return "12 PM"; return h > 12 ? `${h - 12} PM` : `${h} AM`; }

export default function CalendarPage() {
  const [cur, setCur] = useState(new Date());
  const [view, setView] = useState<ViewMode>("week");
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [sched, setSched] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState<Appointment | null>(null);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const [showAdd, setShowAdd] = useState(false);
  const [addDate, setAddDate] = useState("");
  const [addTime, setAddTime] = useState("09:00");
  const [addName, setAddName] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addService, setAddService] = useState("");
  const [addNotes, setAddNotes] = useState("");
  const [addDur, setAddDur] = useState(30);
  const [addSaving, setAddSaving] = useState(false);

  const todayStr = fmt(new Date());

  const range = useMemo(() => {
    if (view === "week") { const w = weekOf(cur); return { from: fmt(w[0]), to: fmt(w[6]) }; }
    const y = cur.getFullYear(), m = cur.getMonth();
    const s = new Date(y, m, -6), e = new Date(y, m + 1, 7);
    return { from: fmt(s), to: fmt(e) };
  }, [cur, view]);

  const fetchData = useCallback(async () => {
    try {
      const [a, s] = await Promise.all([
        companyApi.get("/appointments", { params: { from_date: range.from, to_date: range.to } }),
        companyApi.get("/availability/schedule"),
      ]);
      setAppts(a.data.appointments || []);
      setSched(s.data.schedules || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [range]);

  useEffect(() => { setLoading(true); fetchData(); }, [fetchData]);
  useEffect(() => { if (scrollRef.current && view === "week") scrollRef.current.scrollTop = HOUR_H; }, [view, loading]);

  const byDate = useMemo(() => {
    const m: Record<string, Appointment[]> = {};
    appts.forEach((a) => { (m[a.scheduled_date] ||= []).push(a); });
    Object.values(m).forEach((arr) => arr.sort((a, b) => a.start_time.localeCompare(b.start_time)));
    return m;
  }, [appts]);

  const schedByDay = useMemo(() => {
    const m: Record<number, Schedule[]> = {};
    sched.filter((s) => s.is_active).forEach((s) => { (m[s.day_of_week] ||= []).push(s); });
    return m;
  }, [sched]);

  const isAvail = useCallback((dow: number, hour: number) => {
    const slots = schedByDay[dow];
    if (!slots) return false;
    return slots.some((s) => { const sh = toMin(s.start_time) / 60, eh = toMin(s.end_time) / 60; return hour >= sh && hour < eh; });
  }, [schedByDay]);

  const nav = (dir: number) => { const d = new Date(cur); view === "month" ? d.setMonth(d.getMonth() + dir) : d.setDate(d.getDate() + dir * 7); setCur(d); };

  const updateStatus = async (id: string, status: string) => {
    try { await companyApi.put(`/appointments/${id}`, { status }); setAppts((p) => p.map((a) => a.appointment_id === id ? { ...a, status: status as Appointment["status"] } : a)); if (sel?.appointment_id === id) setSel((p) => p ? { ...p, status: status as Appointment["status"] } : null); } catch (e) { console.error(e); }
  };

  const deleteAppt = async (id: string) => {
    try { await companyApi.delete(`/appointments/${id}`); setAppts((p) => p.filter((a) => a.appointment_id !== id)); setSel(null); } catch (e) { console.error(e); }
  };

  const addAppt = async () => {
    if (!addDate || !addTime || !addName) return;
    setAddSaving(true);
    try {
      const r = await companyApi.post("/appointments", { scheduled_date: addDate, start_time: addTime, duration_min: addDur, caller_name: addName, caller_phone: addPhone || null, service_type: addService || null, notes: addNotes || null, source: "manual" });
      setAppts((p) => [...p, r.data]); setShowAdd(false); setAddName(""); setAddPhone(""); setAddService(""); setAddNotes("");
    } catch (e: any) { alert(e.response?.data?.detail || "Failed"); }
    finally { setAddSaving(false); }
  };

  const headerLabel = view === "month"
    ? cur.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : (() => { const w = weekOf(cur); return `${w[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${w[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`; })();

  const stats = useMemo(() => ({
    confirmed: appts.filter((a) => a.status === "confirmed").length,
    phone: appts.filter((a) => a.source === "voice_agent").length,
  }), [appts]);

  // ─── Week View ─────────────────────────────────────────────
  const renderWeek = () => {
    const week = weekOf(cur);
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    return (
      <div className="flex flex-col" style={{ height: "calc(100vh - 260px)", minHeight: 480 }}>
        <div className="flex border-b border-neutral-200 flex-shrink-0">
          <div className="w-14 flex-shrink-0" />
          {week.map((d) => {
            const ds = fmt(d), isToday = ds === todayStr;
            return (
              <div key={ds} className="flex-1 text-center py-2.5 border-l border-neutral-100">
                <p className={`text-[10px] font-bold tracking-widest ${isToday ? "text-primary-600" : "text-neutral-400"}`}>{DAYS_S[d.getDay()]}</p>
                {isToday ? (
                  <span className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center mx-auto text-sm font-bold mt-0.5">{d.getDate()}</span>
                ) : (
                  <p className="text-lg font-bold mt-0.5 text-neutral-800">{d.getDate()}</p>
                )}
              </div>
            );
          })}
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto relative">
          <div className="flex" style={{ minHeight: HOURS.length * HOUR_H }}>
            <div className="w-14 flex-shrink-0 relative">
              {HOURS.map((h) => (
                <div key={h} className="absolute right-2 -translate-y-1/2" style={{ top: (h - HOURS[0]) * HOUR_H }}>
                  <span className="text-[10px] font-medium text-neutral-400">{fmtHr(h)}</span>
                </div>
              ))}
            </div>

            {week.map((d) => {
              const ds = fmt(d), isToday = ds === todayStr, dayAppts = byDate[ds] || [], dow = d.getDay();
              return (
                <div key={ds} className="flex-1 relative border-l border-neutral-100">
                  {HOURS.map((h) => {
                    const avail = isAvail(dow, h);
                    return (
                      <div key={h} className="absolute w-full border-b border-neutral-100 cursor-pointer hover:bg-primary-50/20 transition-colors"
                        style={{ top: (h - HOURS[0]) * HOUR_H, height: HOUR_H }}
                        onClick={() => { if (avail) { setAddDate(ds); setAddTime(`${String(h).padStart(2, "0")}:00`); setShowAdd(true); } }}>
                        {!avail && <div className="absolute inset-0 bg-neutral-50" style={{ backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.03) 4px, rgba(0,0,0,0.03) 5px)" }} />}
                        <div className="absolute left-0 right-0 border-b border-dashed border-neutral-100/60" style={{ top: HOUR_H / 2 }} />
                      </div>
                    );
                  })}

                  {dayAppts.filter((a) => a.status !== "cancelled").map((appt) => {
                    const top = ((toMin(appt.start_time) / 60) - HOURS[0]) * HOUR_H;
                    const height = Math.max(((toMin(appt.end_time) - toMin(appt.start_time)) / 60) * HOUR_H, 22);
                    const s = STATUS[appt.status] || STATUS.confirmed;
                    return (
                      <button key={appt.appointment_id} onClick={(e) => { e.stopPropagation(); setSel(appt); }}
                        className={`absolute left-0.5 right-0.5 rounded-md px-2 py-1 border-l-[3px] overflow-hidden hover:brightness-110 transition-all ${s.bg} ${s.border} ${s.text}`}
                        style={{ top, height, zIndex: 10 }}>
                        <p className="text-[11px] font-semibold truncate leading-tight">{appt.caller_name || "—"}</p>
                        {height > 28 && <p className="text-[10px] opacity-80 truncate">{appt.start_time.slice(0, 5)}–{appt.end_time.slice(0, 5)}</p>}
                      </button>
                    );
                  })}

                  {isToday && nowMin >= HOURS[0] * 60 && nowMin <= HOURS[HOURS.length - 1] * 60 && (
                    <div className="absolute left-0 right-0 z-20 pointer-events-none flex items-center" style={{ top: ((nowMin / 60) - HOURS[0]) * HOUR_H }}>
                      <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
                      <div className="flex-1 h-[2px] bg-red-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 py-2 border-t border-neutral-100">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-neutral-100 border border-neutral-200" style={{ backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 3px)" }} /><span className="text-[10px] text-neutral-400">Closed</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-primary-500" /><span className="text-[10px] text-neutral-400">Confirmed</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /><span className="text-[10px] text-neutral-400">Completed</span></div>
        </div>
      </div>
    );
  };

  // ─── Month View ────────────────────────────────────────────
  const renderMonth = () => {
    const y = cur.getFullYear(), m = cur.getMonth();
    const days = new Date(y, m + 1, 0).getDate(), first = new Date(y, m, 1).getDay(), prev = new Date(y, m, 0).getDate();
    const cells: { date: Date; curr: boolean }[] = [];
    for (let i = first - 1; i >= 0; i--) cells.push({ date: new Date(y, m - 1, prev - i), curr: false });
    for (let d = 1; d <= days; d++) cells.push({ date: new Date(y, m, d), curr: true });
    while (cells.length < 42) cells.push({ date: new Date(y, m + 1, cells.length - first - days + 1), curr: false });

    return (
      <div>
        <div className="grid grid-cols-7">
          {DAYS_S.map((d) => <div key={d} className="py-2 text-center text-[10px] font-bold tracking-widest text-neutral-400 border-b border-neutral-100">{d}</div>)}
          {cells.map((c, i) => {
            const ds = fmt(c.date), isToday = ds === todayStr, da = byDate[ds] || [], hasAvail = (schedByDay[c.date.getDay()] || []).length > 0;
            return (
              <div key={i} className={`min-h-[90px] border-b border-r border-neutral-100 p-1.5 cursor-pointer transition-colors ${c.curr ? (hasAvail ? "bg-white hover:bg-neutral-50" : "bg-neutral-50/60") : "bg-neutral-50/30"} ${i % 7 === 0 ? "border-l" : ""}`}
                onClick={() => { setAddDate(ds); setShowAdd(true); }}>
                <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-primary-600 text-white" : c.curr ? "text-neutral-700" : "text-neutral-300"}`}>{c.date.getDate()}</span>
                <div className="mt-0.5 space-y-0.5">
                  {da.slice(0, 2).map((a) => {
                    const s = STATUS[a.status] || STATUS.confirmed;
                    return <button key={a.appointment_id} onClick={(e) => { e.stopPropagation(); setSel(a); }}
                      className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate ${s.bg} ${s.text} hover:brightness-110`}>
                      {a.start_time.slice(0, 5)} {a.caller_name || "—"}
                    </button>;
                  })}
                  {da.length > 2 && <p className="text-[10px] text-neutral-400 pl-1">+{da.length - 2}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── Detail Modal ──────────────────────────────────────────
  const renderDetail = () => {
    if (!sel) return null;
    const s = STATUS[sel.status] || STATUS.confirmed;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]" onClick={() => setSel(null)}>
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl w-full max-w-sm mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className={`h-1 ${s.bg}`} />
          <div className="px-5 py-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900">{sel.caller_name || "Unknown"}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{new Date(sel.scheduled_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
              </div>
              <button onClick={() => setSel(null)} className="p-1 hover:bg-neutral-100 rounded-lg"><Icons.Close className="h-4 w-4 text-neutral-400" /></button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2.5"><Icons.Clock className="h-3.5 w-3.5 text-neutral-400" /><span className="text-neutral-700">{sel.start_time.slice(0, 5)} – {sel.end_time.slice(0, 5)} ({sel.duration_min}min)</span></div>
              {sel.caller_phone && <div className="flex items-center gap-2.5"><Icons.Phone className="h-3.5 w-3.5 text-neutral-400" /><span className="text-neutral-700">{sel.caller_phone}</span></div>}
              {sel.service_type && <div className="flex items-center gap-2.5"><Icons.Briefcase className="h-3.5 w-3.5 text-neutral-400" /><span className="text-neutral-700">{sel.service_type}</span></div>}
              {sel.notes && <div className="flex items-start gap-2.5"><Icons.FileText className="h-3.5 w-3.5 text-neutral-400 mt-0.5" /><span className="text-neutral-600">{sel.notes}</span></div>}
              <div className="flex items-center gap-2.5">
                <Icons.Zap className="h-3.5 w-3.5 text-neutral-400" />
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${s.bg} ${s.text}`}>{sel.status}</span>
                <span className="text-xs text-neutral-400">via {sel.source === "voice_agent" ? "Phone" : sel.source}</span>
              </div>
            </div>
          </div>
          <div className="px-5 pb-4 flex items-center gap-2">
            {sel.status === "confirmed" && <>
              <Button size="sm" onClick={() => updateStatus(sel.appointment_id, "completed")}><Icons.Check className="h-3.5 w-3.5" /> Done</Button>
              <Button size="sm" variant="secondary" onClick={() => updateStatus(sel.appointment_id, "no_show")}>No Show</Button>
              <Button size="sm" variant="outline" onClick={() => updateStatus(sel.appointment_id, "cancelled")}>Cancel</Button>
            </>}
            <div className="flex-1" />
            <button onClick={() => deleteAppt(sel.appointment_id)} className="p-2 hover:bg-red-50 rounded-lg group">
              <Icons.Trash className="h-3.5 w-3.5 text-neutral-300 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Add Modal ─────────────────────────────────────────────
  const renderAdd = () => {
    if (!showAdd) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]" onClick={() => setShowAdd(false)}>
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="px-5 py-4 flex items-center justify-between border-b border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-900">New Appointment</h3>
            <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-neutral-100 rounded-lg"><Icons.Close className="h-4 w-4 text-neutral-400" /></button>
          </div>
          <div className="px-5 py-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">Name *</label>
              <input type="text" value={addName} onChange={(e) => setAddName(e.target.value)} placeholder="Customer name"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-neutral-600 mb-1.5 block">Date *</label><input type="date" value={addDate} onChange={(e) => setAddDate(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all" /></div>
              <div><label className="text-xs font-semibold text-neutral-600 mb-1.5 block">Time *</label><input type="time" value={addTime} onChange={(e) => setAddTime(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-neutral-600 mb-1.5 block">Phone</label><input type="tel" value={addPhone} onChange={(e) => setAddPhone(e.target.value)} placeholder="+1..." className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all" /></div>
              <div><label className="text-xs font-semibold text-neutral-600 mb-1.5 block">Duration</label><select value={addDur} onChange={(e) => setAddDur(parseInt(e.target.value))} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all">{[15, 30, 45, 60, 90, 120].map((d) => <option key={d} value={d}>{d} min</option>)}</select></div>
            </div>
            <div><label className="text-xs font-semibold text-neutral-600 mb-1.5 block">Service</label><input type="text" value={addService} onChange={(e) => setAddService(e.target.value)} placeholder="e.g., Pipe repair" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all" /></div>
            <div><label className="text-xs font-semibold text-neutral-600 mb-1.5 block">Notes</label><textarea value={addNotes} onChange={(e) => setAddNotes(e.target.value)} rows={2} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all resize-none" /></div>
          </div>
          <div className="px-5 pb-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button size="sm" onClick={addAppt} loading={addSaving}>Add</Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-5 pt-1">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Calendar</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {stats.confirmed} upcoming{stats.phone > 0 && <span className="text-primary-600 font-medium"> &middot; {stats.phone} via phone</span>}
          </p>
        </div>
        <button onClick={() => { setAddDate(fmt(new Date())); setShowAdd(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-all active:scale-[0.97]">
          <Icons.Plus className="h-3.5 w-3.5" /> New
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
          <div className="flex items-center gap-1">
            <button onClick={() => setCur(new Date())} className="px-3 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">Today</button>
            <button onClick={() => nav(-1)} className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"><Icons.ChevronLeft className="h-4 w-4 text-neutral-500" /></button>
            <button onClick={() => nav(1)} className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"><Icons.ChevronRight className="h-4 w-4 text-neutral-500" /></button>
            <span className="text-sm font-bold text-neutral-800 ml-2">{headerLabel}</span>
          </div>
          <div className="flex items-center border border-neutral-200 rounded-full p-0.5 gap-0.5">
            {(["week", "month"] as ViewMode[]).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all capitalize ${view === v ? "bg-primary-600 text-white shadow-sm shadow-primary-600/25" : "text-neutral-500 hover:text-neutral-800"}`}>{v}</button>
            ))}
          </div>
        </div>

        {loading ? <div className="flex items-center justify-center h-64"><div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>
          : view === "week" ? renderWeek() : renderMonth()}
      </div>

      {mounted && sel && createPortal(renderDetail(), document.body)}
      {mounted && showAdd && createPortal(renderAdd(), document.body)}
    </div>
  );
}
