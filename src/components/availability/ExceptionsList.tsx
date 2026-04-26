"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { Icons } from "@/components/ui";

export interface Exception {
  exception_id: string;
  exception_date: string;
  reason: string | null;
}

interface Props {
  exceptions: Exception[];
  onAdd: (date: string, reason: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export default function ExceptionsList({ exceptions, onAdd, onRemove }: Props) {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const submit = async () => {
    if (!date) return;
    setAdding(true);
    setError(null);
    try {
      await onAdd(date, reason);
      setDate("");
      setReason("");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to add blocked date");
    } finally {
      setAdding(false);
    }
  };

  const sorted = [...exceptions].sort((a, b) => a.exception_date.localeCompare(b.exception_date));

  return (
    <div>
      <div className="flex items-end gap-3 mb-4">
        <div className="flex-1">
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</label>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Reason</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Holiday, vacation..."
            className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white placeholder-neutral-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
          />
        </div>
        <Button onClick={submit} loading={adding} disabled={!date} size="sm" variant="secondary">
          Block
        </Button>
      </div>

      {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

      {sorted.length > 0 ? (
        <div className="divide-y divide-neutral-100">
          {sorted.map((exc) => (
            <div key={exc.exception_id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <Icons.Calendar className="h-4 w-4 text-neutral-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {new Date(exc.exception_date + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  {exc.reason && <p className="text-xs text-neutral-500">{exc.reason}</p>}
                </div>
              </div>
              <button
                onClick={() => onRemove(exc.exception_id)}
                className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                title="Unblock"
              >
                <Icons.Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="mx-auto h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
            <Icons.Calendar className="h-5 w-5 text-neutral-400" />
          </div>
          <p className="text-sm text-neutral-400">No blocked dates</p>
          <p className="text-xs text-neutral-400 mt-1">
            Add holidays, vacations, or any day you&apos;re not available.
          </p>
        </div>
      )}
    </div>
  );
}
