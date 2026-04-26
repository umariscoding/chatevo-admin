"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";
import { Icons } from "@/components/ui";
import type { Appointment } from "@/hooks/useAppointments";

const STATUS_BAR: Record<Appointment["status"], string> = {
  confirmed: "bg-primary-500",
  completed: "bg-emerald-500",
  cancelled: "bg-neutral-300",
  no_show: "bg-red-400",
};

const STATUS_LABEL: Record<Appointment["status"], string> = {
  confirmed: "bg-primary-100 text-primary-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-neutral-100 text-neutral-500",
  no_show: "bg-red-100 text-red-700",
};

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-neutral-200 shadow-xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

interface DetailProps {
  appointment: Appointment;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Appointment["status"]) => void;
  onDelete: (id: string) => void;
}

export function AppointmentDetailModal({ appointment: a, onClose, onUpdateStatus, onDelete }: DetailProps) {
  return (
    <ModalShell onClose={onClose}>
      <div className={`h-1 ${STATUS_BAR[a.status]}`} />
      <div className="px-5 py-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">{a.caller_name || "Unknown"}</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {new Date(a.scheduled_date + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-lg">
            <Icons.Close className="h-4 w-4 text-neutral-400" />
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2.5">
            <Icons.Clock className="h-3.5 w-3.5 text-neutral-400" />
            <span className="text-neutral-700">
              {a.start_time.slice(0, 5)} – {a.end_time.slice(0, 5)} ({a.duration_min} min)
            </span>
          </div>
          {a.caller_phone && (
            <div className="flex items-center gap-2.5">
              <Icons.Phone className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-neutral-700">{a.caller_phone}</span>
            </div>
          )}
          {a.caller_email && (
            <div className="flex items-center gap-2.5">
              <Icons.Mail className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-neutral-700">{a.caller_email}</span>
            </div>
          )}
          {a.service_type && (
            <div className="flex items-center gap-2.5">
              <Icons.Briefcase className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-neutral-700">{a.service_type}</span>
            </div>
          )}
          {a.notes && (
            <div className="flex items-start gap-2.5">
              <Icons.FileText className="h-3.5 w-3.5 text-neutral-400 mt-0.5" />
              <span className="text-neutral-600">{a.notes}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 pt-1">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_LABEL[a.status]}`}
            >
              {a.status.replace("_", " ")}
            </span>
            <span className="text-xs text-neutral-400">
              via {a.source === "voice_agent" ? "Phone" : a.source}
            </span>
          </div>
        </div>
      </div>
      <div className="px-5 pb-4 flex items-center gap-2">
        {a.status === "confirmed" && (
          <>
            <Button size="sm" onClick={() => onUpdateStatus(a.appointment_id, "completed")}>
              <Icons.Check className="h-3.5 w-3.5" />
              Done
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onUpdateStatus(a.appointment_id, "no_show")}
            >
              No Show
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateStatus(a.appointment_id, "cancelled")}
            >
              Cancel
            </Button>
          </>
        )}
        <div className="flex-1" />
        <button
          onClick={() => {
            if (confirm("Delete this appointment?")) onDelete(a.appointment_id);
          }}
          className="p-2 hover:bg-red-50 rounded-lg group"
          title="Delete"
        >
          <Icons.Trash className="h-3.5 w-3.5 text-neutral-300 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </ModalShell>
  );
}

interface AddProps {
  initialDate?: string;
  initialTime?: string;
  defaultDuration?: number;
  onClose: () => void;
  onCreate: (payload: {
    scheduled_date: string;
    start_time: string;
    duration_min: number;
    caller_name: string;
    caller_phone?: string | null;
    service_type?: string | null;
    notes?: string | null;
  }) => Promise<void>;
}

export function NewAppointmentModal({
  initialDate,
  initialTime,
  defaultDuration = 30,
  onClose,
  onCreate,
}: AddProps) {
  const [date, setDate] = useState(initialDate || new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(initialTime || "09:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState(defaultDuration);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!name || !date || !time) return;
    setSaving(true);
    setError(null);
    try {
      await onCreate({
        scheduled_date: date,
        start_time: time,
        duration_min: duration,
        caller_name: name,
        caller_phone: phone || null,
        service_type: service || null,
        notes: notes || null,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create appointment");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all";
  const labelCls = "text-xs font-semibold text-neutral-600 mb-1.5 block";

  return (
    <ModalShell onClose={onClose}>
      <div className="px-5 py-4 flex items-center justify-between border-b border-neutral-100">
        <h3 className="text-sm font-bold text-neutral-900">New Appointment</h3>
        <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-lg">
          <Icons.Close className="h-4 w-4 text-neutral-400" />
        </button>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div>
          <label className={labelCls}>Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer name"
            className={inputCls}
            autoFocus
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Date *</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Time *</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1..."
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className={inputCls}
            >
              {[15, 30, 45, 60, 90, 120].map((d) => (
                <option key={d} value={d}>
                  {d} min
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Service</label>
          <input
            type="text"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="e.g., Pipe repair"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
      <div className="px-5 pb-4 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={submit} loading={saving} disabled={!name || !date || !time}>
          Create
        </Button>
      </div>
    </ModalShell>
  );
}
