"use client";

import React from "react";
import { Icons } from "@/components/ui";
import type { Appointment } from "@/hooks/useAppointments";

const STATUS_BADGE: Record<Appointment["status"], string> = {
  confirmed: "bg-primary-100 text-primary-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-neutral-100 text-neutral-500",
  no_show: "bg-red-100 text-red-700",
};

interface Props {
  appointments: Appointment[];
  emptyHint?: string;
  onUpdateStatus: (id: string, status: Appointment["status"]) => void;
  onDelete: (id: string) => void;
  onSelect?: (a: Appointment) => void;
}

export default function AppointmentsTable({
  appointments,
  emptyHint = "No appointments yet",
  onUpdateStatus,
  onDelete,
  onSelect,
}: Props) {
  if (appointments.length === 0) {
    return (
      <div className="px-5 py-16 text-center">
        <div className="mx-auto h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
          <Icons.Calendar className="h-5 w-5 text-neutral-400" />
        </div>
        <p className="text-sm text-neutral-400">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-100">
            <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Customer</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Date &amp; Time</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Service</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Source</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
            <th className="text-right px-5 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {appointments.map((a) => (
            <tr
              key={a.appointment_id}
              className={`hover:bg-neutral-50 transition-colors ${onSelect ? "cursor-pointer" : ""}`}
              onClick={() => onSelect?.(a)}
            >
              <td className="px-5 py-3">
                <p className="font-medium text-neutral-900">{a.caller_name || "—"}</p>
                {a.caller_phone && <p className="text-xs text-neutral-500">{a.caller_phone}</p>}
              </td>
              <td className="px-5 py-3">
                <p className="text-neutral-900">
                  {new Date(a.scheduled_date + "T00:00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-neutral-500">
                  {a.start_time.slice(0, 5)} – {a.end_time.slice(0, 5)}
                </p>
              </td>
              <td className="px-5 py-3 text-neutral-700">{a.service_type || "—"}</td>
              <td className="px-5 py-3">
                <span className="text-xs text-neutral-500">
                  {a.source === "voice_agent" ? "Phone" : a.source}
                </span>
              </td>
              <td className="px-5 py-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${STATUS_BADGE[a.status]}`}
                >
                  {a.status.replace("_", " ")}
                </span>
              </td>
              <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                  {a.status === "confirmed" && (
                    <>
                      <button
                        onClick={() => onUpdateStatus(a.appointment_id, "completed")}
                        className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Mark complete"
                      >
                        <Icons.Check className="h-3.5 w-3.5 text-emerald-500" />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(a.appointment_id, "no_show")}
                        className="p-1.5 hover:bg-amber-50 rounded-lg transition-colors"
                        title="No show"
                      >
                        <Icons.UserX className="h-3.5 w-3.5 text-amber-500" />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(a.appointment_id, "cancelled")}
                        className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <Icons.Close className="h-3.5 w-3.5 text-neutral-400" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onDelete(a.appointment_id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                    title="Delete"
                  >
                    <Icons.Trash className="h-3.5 w-3.5 text-neutral-300 group-hover:text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
