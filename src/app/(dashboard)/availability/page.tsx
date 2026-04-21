"use client";

import React, { useState, useEffect, useCallback } from "react";
import { companyApi } from "@/utils/company/api";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import { Icons } from "@/components/ui";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Slot { day_of_week: number; start_time: string; end_time: string; is_active: boolean; }
interface Exception { exception_id: string; exception_date: string; reason: string | null; }

export default function AvailabilityPage() {
  const [schedule, setSchedule] = useState<Slot[]>([]);
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [excDate, setExcDate] = useState("");
  const [excReason, setExcReason] = useState("");
  const [addingExc, setAddingExc] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [s, e] = await Promise.all([companyApi.get("/availability/schedule"), companyApi.get("/availability/exceptions")]);
      setSchedule(s.data.schedules || []); setExceptions(e.data.exceptions || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    if (!loading && schedule.length === 0)
      setSchedule([1,2,3,4,5].map(d => ({ day_of_week: d, start_time: "09:00", end_time: "17:00", is_active: true })));
  }, [loading, schedule.length]);

  const toggle = (d: number) => {
    const ex = schedule.find(s => s.day_of_week === d);
    if (ex) setSchedule(schedule.map(s => s.day_of_week === d ? { ...s, is_active: !s.is_active } : s));
    else setSchedule([...schedule, { day_of_week: d, start_time: "09:00", end_time: "17:00", is_active: true }]);
  };

  const save = async () => {
    setSaving(true);
    try { await companyApi.put("/availability/schedule", { slots: schedule.filter(s => s.is_active) }); setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); }
    catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const addExc = async () => {
    if (!excDate) return; setAddingExc(true);
    try { await companyApi.post("/availability/exceptions", { exception_date: excDate, is_available: false, reason: excReason || null }); setExcDate(""); setExcReason(""); await fetchData(); }
    catch (err) { console.error(err); } finally { setAddingExc(false); }
  };

  const removeExc = async (id: string) => {
    try { await companyApi.delete(`/availability/exceptions/${id}`); setExceptions(exceptions.filter(e => e.exception_id !== id)); }
    catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Availability</h1>
          <p className="text-sm text-neutral-500 mt-1">Weekly hours and blocked dates for appointments</p>
        </div>
        <div className="flex items-center gap-2.5">
          {saveSuccess && <div className="flex items-center gap-1.5 text-sm font-medium text-accent-600"><Icons.CheckCircle className="h-4 w-4" />Saved</div>}
          <button onClick={save} disabled={saving}
            className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-all disabled:opacity-50 flex items-center gap-2 min-w-[80px] justify-center">
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Save"}
          </button>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">Weekly Schedule</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Set when the voice agent can book appointments</p>
        </div>
        <div className="divide-y divide-neutral-100">
          {DAYS.map((name, i) => {
            const slot = schedule.find(s => s.day_of_week === i);
            const on = slot?.is_active ?? false;
            return (
              <div key={i} className="px-5 py-3 flex items-center gap-4">
                <span className={`w-28 text-sm ${on ? "font-medium text-neutral-900" : "text-neutral-400"}`}>{name}</span>
                <Toggle checked={on} onChange={() => toggle(i)} size="sm" />
                {on ? (
                  <div className="flex items-center gap-2">
                    <input type="time" value={slot?.start_time || "09:00"} onChange={e => setSchedule(schedule.map(s => s.day_of_week === i ? { ...s, start_time: e.target.value } : s))}
                      className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all" />
                    <span className="text-sm text-neutral-400">to</span>
                    <input type="time" value={slot?.end_time || "17:00"} onChange={e => setSchedule(schedule.map(s => s.day_of_week === i ? { ...s, end_time: e.target.value } : s))}
                      className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all" />
                  </div>
                ) : <span className="text-sm text-neutral-400">Closed</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Blocked Dates */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Blocked Dates</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Holidays, time off, or any day you&apos;re not available</p>
          </div>
        </div>
        <div className="px-5 py-4">
          <div className="flex items-end gap-3 mb-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</label>
              <input type="date" value={excDate} onChange={e => setExcDate(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Reason</label>
              <input type="text" value={excReason} onChange={e => setExcReason(e.target.value)} placeholder="Optional"
                className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white placeholder-neutral-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all" />
            </div>
            <Button onClick={addExc} loading={addingExc} size="sm" variant="secondary">Block</Button>
          </div>
          {exceptions.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {exceptions.map(exc => (
                <div key={exc.exception_id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{new Date(exc.exception_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                    {exc.reason && <p className="text-xs text-neutral-500">{exc.reason}</p>}
                  </div>
                  <button onClick={() => removeExc(exc.exception_id)} className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"><Icons.Trash className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-neutral-400 text-center py-6">No blocked dates</p>}
        </div>
      </div>
    </div>
  );
}
