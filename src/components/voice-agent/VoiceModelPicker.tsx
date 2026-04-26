"use client";

import React from "react";
import { Icons } from "@/components/ui";

export interface VoiceOption {
  value: string;
  name: string;
  gender: "Male" | "Female";
  accent?: string;
}

const VOICES: VoiceOption[] = [
  { value: "aura-2-andromeda-en", name: "Andromeda", gender: "Female" },
  { value: "aura-2-aurora-en", name: "Aurora", gender: "Female" },
  { value: "aura-asteria-en", name: "Asteria", gender: "Female" },
  { value: "aura-luna-en", name: "Luna", gender: "Female" },
  { value: "aura-2-odysseus-en", name: "Odysseus", gender: "Male" },
  { value: "aura-2-atlas-en", name: "Atlas", gender: "Male" },
  { value: "aura-orion-en", name: "Orion", gender: "Male" },
  { value: "aura-helios-en", name: "Helios", gender: "Male", accent: "UK" },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function VoiceModelPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {VOICES.map((v) => {
        const selected = v.value === value;
        return (
          <button
            key={v.value}
            onClick={() => onChange(v.value)}
            className={`group relative px-3 py-3 rounded-xl border text-left transition-all ${
              selected
                ? "border-primary-500 bg-primary-50/60 shadow-sm shadow-primary-500/10"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  selected ? "bg-primary-600" : "bg-neutral-100 group-hover:bg-neutral-200"
                }`}
              >
                <Icons.Mic
                  className={`h-3.5 w-3.5 ${selected ? "text-white" : "text-neutral-500"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${selected ? "text-primary-900" : "text-neutral-900"}`}>
                  {v.name}
                </p>
                <p className="text-[11px] text-neutral-500">
                  {v.gender}
                  {v.accent && ` · ${v.accent}`}
                </p>
              </div>
              {selected && (
                <Icons.CheckCircle className="h-4 w-4 text-primary-600 flex-shrink-0" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default VoiceModelPicker;
