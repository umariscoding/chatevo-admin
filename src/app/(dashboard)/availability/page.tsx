"use client";

import React, { useCallback, useEffect, useState } from "react";
import { companyApi } from "@/utils/company/api";
import { Icons } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import WeeklyScheduleEditor, {
  type ScheduleSlot,
} from "@/components/availability/WeeklyScheduleEditor";
import ExceptionsList, { type Exception } from "@/components/availability/ExceptionsList";

const DEFAULT_WEEK: ScheduleSlot[] = [1, 2, 3, 4, 5].map((d) => ({
  day_of_week: d,
  start_time: "09:00",
  end_time: "17:00",
  is_active: true,
}));

export default function AvailabilityPage() {
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [s, e] = await Promise.all([
        companyApi.get("/availability/schedule"),
        companyApi.get("/availability/exceptions"),
      ]);
      const slots: ScheduleSlot[] = s.data.schedules || [];
      setSchedule(slots.length > 0 ? slots : DEFAULT_WEEK);
      setExceptions(e.data.exceptions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleScheduleChange = (next: ScheduleSlot[]) => {
    setSchedule(next);
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      await companyApi.put("/availability/schedule", {
        slots: schedule.filter((s) => s.is_active),
      });
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addException = async (date: string, reason: string) => {
    await companyApi.post("/availability/exceptions", {
      exception_date: date,
      is_available: false,
      reason: reason || null,
    });
    await fetchData();
  };

  const removeException = async (id: string) => {
    await companyApi.delete(`/availability/exceptions/${id}`);
    setExceptions((prev) => prev.filter((e) => e.exception_id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <IOSLoader size="md" color="primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Availability</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Set the hours your voice agent can book appointments.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <Icons.CheckCircle className="h-4 w-4" />
              Saved
            </div>
          )}
          <button
            onClick={save}
            disabled={saving || !hasChanges}
            className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[80px] justify-center"
          >
            {saving ? <IOSLoader size="sm" color="white" /> : "Save"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Weekly schedule — wider on the left */}
        <section className="lg:col-span-3 bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h2 className="text-sm font-semibold text-neutral-900">Weekly hours</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Toggle each day on or off. Add multiple time ranges for split shifts.
            </p>
          </div>
          <WeeklyScheduleEditor schedule={schedule} onChange={handleScheduleChange} />
        </section>

        {/* Date overrides */}
        <section className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h2 className="text-sm font-semibold text-neutral-900">Blocked dates</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Holidays, time off, or any day you&apos;re unavailable.
            </p>
          </div>
          <div className="px-5 py-4">
            <ExceptionsList
              exceptions={exceptions}
              onAdd={addException}
              onRemove={removeException}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
