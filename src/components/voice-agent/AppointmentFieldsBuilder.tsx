"use client";

import React from "react";
import Toggle from "@/components/ui/Toggle";
import { Icons } from "@/components/ui";

interface FieldDef {
  key: string;
  label: string;
  desc: string;
  required?: boolean;
}

const FIELD_DEFS: FieldDef[] = [
  { key: "name", label: "Name", desc: "Caller's full name", required: true },
  { key: "phone", label: "Phone Number", desc: "Contact phone number", required: true },
  { key: "email", label: "Email", desc: "Email address" },
  { key: "address", label: "Address", desc: "Service location or home address" },
  { key: "service_type", label: "Service Type", desc: "What service they need" },
  { key: "notes", label: "Notes", desc: "Any extra details from the caller" },
];

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
}

export default function AppointmentFieldsBuilder({ value, onChange }: Props) {
  const fields = value && value.length > 0 ? value : ["name", "phone"];

  const toggle = (key: string) => {
    const next = fields.includes(key) ? fields.filter((f) => f !== key) : [...fields, key];
    onChange(next);
  };

  return (
    <div className="space-y-1.5">
      {FIELD_DEFS.map((f) => {
        const enabled = fields.includes(f.key);
        return (
          <div
            key={f.key}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
              enabled ? "border-primary-200 bg-primary-50/40" : "border-neutral-200 bg-white"
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
              enabled ? "bg-primary-100" : "bg-neutral-100"
            }`}>
              <Icons.User className={`h-3.5 w-3.5 ${enabled ? "text-primary-700" : "text-neutral-400"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-900">{f.label}</span>
                {f.required && (
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">{f.desc}</p>
            </div>
            <Toggle checked={enabled} onChange={() => toggle(f.key)} size="sm" />
          </div>
        );
      })}
    </div>
  );
}
