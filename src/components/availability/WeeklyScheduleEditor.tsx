"use client";

import React, { useState } from "react";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import { Icons } from "@/components/ui";

export interface ScheduleSlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Props {
  schedule: ScheduleSlot[];
  onChange: (next: ScheduleSlot[]) => void;
}

interface DayGroup {
  day: number;
  ranges: ScheduleSlot[];
}

function groupByDay(schedule: ScheduleSlot[]): DayGroup[] {
  return Array.from({ length: 7 }, (_, day) => ({
    day,
    ranges: schedule
      .filter((s) => s.day_of_week === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time)),
  }));
}

function flattenGroups(groups: DayGroup[]): ScheduleSlot[] {
  return groups.flatMap((g) => g.ranges);
}

export default function WeeklyScheduleEditor({ schedule, onChange }: Props) {
  const groups = groupByDay(schedule);
  const [copyMenuFor, setCopyMenuFor] = useState<number | null>(null);

  const updateGroup = (day: number, next: ScheduleSlot[]) => {
    const updated = groups.map((g) => (g.day === day ? { ...g, ranges: next } : g));
    onChange(flattenGroups(updated));
  };

  const toggleDay = (day: number, on: boolean) => {
    if (on) {
      const ranges = groups.find((g) => g.day === day)?.ranges || [];
      if (ranges.length === 0) {
        updateGroup(day, [{ day_of_week: day, start_time: "09:00", end_time: "17:00", is_active: true }]);
      } else {
        updateGroup(day, ranges.map((r) => ({ ...r, is_active: true })));
      }
    } else {
      updateGroup(day, (groups.find((g) => g.day === day)?.ranges || []).map((r) => ({ ...r, is_active: false })));
    }
  };

  const updateRange = (day: number, idx: number, patch: Partial<ScheduleSlot>) => {
    const ranges = groups.find((g) => g.day === day)?.ranges || [];
    const next = ranges.map((r, i) => (i === idx ? { ...r, ...patch } : r));
    updateGroup(day, next);
  };

  const addRange = (day: number) => {
    const ranges = groups.find((g) => g.day === day)?.ranges || [];
    const last = ranges[ranges.length - 1];
    const start = last ? last.end_time : "09:00";
    const end = "17:00";
    updateGroup(day, [...ranges, { day_of_week: day, start_time: start, end_time: end, is_active: true }]);
  };

  const removeRange = (day: number, idx: number) => {
    const ranges = groups.find((g) => g.day === day)?.ranges || [];
    updateGroup(day, ranges.filter((_, i) => i !== idx));
  };

  const copyTo = (sourceDay: number, targetDays: number[]) => {
    const sourceRanges = groups.find((g) => g.day === sourceDay)?.ranges || [];
    const next = groups.map((g) =>
      targetDays.includes(g.day)
        ? { ...g, ranges: sourceRanges.map((r) => ({ ...r, day_of_week: g.day })) }
        : g
    );
    onChange(flattenGroups(next));
    setCopyMenuFor(null);
  };

  return (
    <div className="divide-y divide-neutral-100">
      {groups.map(({ day, ranges }) => {
        const enabled = ranges.some((r) => r.is_active);
        return (
          <div key={day} className="px-5 py-4 flex items-start gap-4">
            <div className="w-28 flex items-center gap-3 pt-1.5">
              <Toggle checked={enabled} onChange={(v) => toggleDay(day, v)} size="sm" />
              <span className={`text-sm ${enabled ? "font-medium text-neutral-900" : "text-neutral-400"}`}>
                {DAYS_FULL[day]}
              </span>
            </div>
            <div className="flex-1 space-y-2">
              {!enabled || ranges.length === 0 ? (
                <span className="text-sm text-neutral-400 inline-block pt-2">Closed</span>
              ) : (
                ranges.map((r, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={r.start_time}
                      onChange={(e) => updateRange(day, idx, { start_time: e.target.value })}
                      className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                    />
                    <span className="text-sm text-neutral-400">to</span>
                    <input
                      type="time"
                      value={r.end_time}
                      onChange={(e) => updateRange(day, idx, { end_time: e.target.value })}
                      className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                    />
                    {ranges.length > 1 && (
                      <button
                        onClick={() => removeRange(day, idx)}
                        className="p-1.5 hover:bg-red-50 rounded-lg group"
                        title="Remove range"
                      >
                        <Icons.Trash className="h-3.5 w-3.5 text-neutral-300 group-hover:text-red-500" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center gap-1 relative">
              {enabled && (
                <button
                  onClick={() => addRange(day)}
                  className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="Add another range"
                >
                  <Icons.Plus className="h-3.5 w-3.5 text-neutral-500" />
                </button>
              )}
              {enabled && ranges.length > 0 && (
                <button
                  onClick={() => setCopyMenuFor(copyMenuFor === day ? null : day)}
                  className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="Copy to other days"
                >
                  <Icons.Copy className="h-3.5 w-3.5 text-neutral-500" />
                </button>
              )}
              {copyMenuFor === day && (
                <CopyMenu
                  fromDay={day}
                  onCopy={(targets) => copyTo(day, targets)}
                  onClose={() => setCopyMenuFor(null)}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CopyMenu({
  fromDay,
  onCopy,
  onClose,
}: {
  fromDay: number;
  onCopy: (days: number[]) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-9 z-50 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden">
        <div className="px-3 py-2 border-b border-neutral-100">
          <p className="text-xs font-semibold text-neutral-700">Copy to...</p>
        </div>
        <div className="py-1">
          {DAYS_FULL.map((name, day) => {
            if (day === fromDay) return null;
            const checked = selected.includes(day);
            return (
              <label
                key={day}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-neutral-50 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setSelected((prev) =>
                      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
                    )
                  }
                  className="w-3.5 h-3.5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500/20"
                />
                <span className="text-neutral-700">{name}</span>
              </label>
            );
          })}
        </div>
        <div className="px-3 py-2 border-t border-neutral-100 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => onCopy(selected)} disabled={selected.length === 0}>
            Apply
          </Button>
        </div>
      </div>
    </>
  );
}
