"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { companyApi } from "@/utils/company/api";
import Toggle from "@/components/ui/Toggle";
import { Icons } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";

interface VoiceSettings {
  is_enabled: boolean;
  twilio_phone_number: string | null;
  twilio_account_sid: string | null;
  greeting_message: string;
  business_name: string | null;
  business_type: string | null;
  appointment_duration_min: number;
  voice_model: string;
  system_prompt: string | null;
  appointment_fields: string[];
}

const VOICES = [
  { value: "aura-2-odysseus-en", label: "Odysseus (Male)" },
  { value: "aura-2-andromeda-en", label: "Andromeda (Female)" },
  { value: "aura-2-aurora-en", label: "Aurora (Female)" },
  { value: "aura-2-atlas-en", label: "Atlas (Male)" },
  { value: "aura-asteria-en", label: "Asteria (Female)" },
  { value: "aura-luna-en", label: "Luna (Female)" },
  { value: "aura-orion-en", label: "Orion (Male)" },
  { value: "aura-helios-en", label: "Helios (Male, UK)" },
];

export default function VoiceAgentPage() {
  const router = useRouter();
  const [s, setS] = useState<VoiceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchSettings = useCallback(async () => {
    try { const res = await companyApi.get("/voice-agent/settings"); setS(res.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const update = (field: string, value: unknown) => {
    if (!s) return;
    setS({ ...s, [field]: value });
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const save = async () => {
    if (!s) return;
    setSaving(true);
    try { await companyApi.put("/voice-agent/settings", s); setHasChanges(false); setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); }
    catch (err) { console.error(err); } finally { setSaving(false); }
  };

  if (loading || !s) return <div className="flex items-center justify-center h-64"><div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;

  const inputCls = "mt-1.5 w-full rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all";
  const labelCls = "text-xs font-medium text-neutral-500 uppercase tracking-wider";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Voice Agent</h1>
          <p className="text-sm text-neutral-500 mt-1">AI phone agent that answers calls and books appointments</p>
        </div>
        <div className="flex items-center gap-2.5">
          {saveSuccess && <div className="flex items-center gap-1.5 text-sm font-medium text-accent-600"><Icons.CheckCircle className="h-4 w-4" />Saved</div>}
          <button onClick={() => router.push("/voice-agent/test")}
            className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-700 border border-neutral-200 rounded-full transition-all hover:bg-neutral-50 flex items-center gap-2">
            <Icons.Phone className="h-3.5 w-3.5" /> Test Call
          </button>
          {hasChanges && (
            <button onClick={save} disabled={saving}
              className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-all disabled:opacity-50 flex items-center gap-2 min-w-[80px] justify-center">
              {saving ? <IOSLoader size="sm" color="white" /> : "Save"}
            </button>
          )}
        </div>
      </div>

      {/* Enable/Disable */}
      <div className={`relative overflow-hidden rounded-xl border transition-all duration-500 ${s.is_enabled ? "border-primary-200 bg-gradient-to-br from-primary-50 to-white" : "border-neutral-200 bg-white"}`}>
        {s.is_enabled && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400" />}
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${s.is_enabled ? "bg-primary-600 shadow-lg shadow-primary-600/25" : "bg-neutral-100"}`}>
              {s.is_enabled && <div className="absolute inset-0 rounded-xl bg-primary-500 animate-ping opacity-20" />}
              <Icons.Mic className={`h-4 w-4 relative z-10 transition-colors duration-300 ${s.is_enabled ? "text-white" : "text-neutral-400"}`} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold text-neutral-900">{s.is_enabled ? "Active" : "Inactive"}</span>
                {s.is_enabled && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[10px] font-semibold uppercase tracking-wider">
                    <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-600" /></span>
                    Live
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">{s.is_enabled ? "Incoming calls will be answered by the AI" : "Enable to start answering calls"}</p>
            </div>
          </div>
          <Toggle checked={s.is_enabled} onChange={v => update("is_enabled", v)} variant="success" size="md" />
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">Configuration</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Business details, voice, and behavior</p>
        </div>

        <div className="px-5 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Business Name</label>
              <input type="text" value={s.business_name || ""} onChange={e => update("business_name", e.target.value)} placeholder="Joe's Plumbing" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Business Type</label>
              <input type="text" value={s.business_type || ""} onChange={e => update("business_type", e.target.value)} placeholder="plumber, electrician..." className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Voice</label>
              <select value={s.voice_model} onChange={e => update("voice_model", e.target.value)} className={inputCls}>
                {VOICES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Appointment Duration</label>
              <select value={s.appointment_duration_min} onChange={e => update("appointment_duration_min", parseInt(e.target.value))} className={inputCls}>
                {[15, 30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d} minutes</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Greeting Message</label>
            <textarea value={s.greeting_message} onChange={e => update("greeting_message", e.target.value)} rows={2} placeholder="Hello! Thanks for calling."
              className={`${inputCls} resize-none`} />
          </div>

          <div>
            <label className={labelCls}>Custom Instructions</label>
            <p className="text-xs text-neutral-400 mt-1 mb-1.5">Extra rules appended to the default agent prompt</p>
            <textarea value={s.system_prompt || ""} onChange={e => update("system_prompt", e.target.value)} rows={4}
              placeholder="e.g., Always ask if it's an emergency first"
              className={`${inputCls} resize-y`} />
          </div>
        </div>
      </div>

      {/* Appointment Fields */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-900">Appointment Fields</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Choose what information the agent collects from callers</p>
        </div>
        <div className="px-5 py-4">
          <div className="space-y-2">
            {[
              { key: "name", label: "Name", desc: "Caller's full name" },
              { key: "phone", label: "Phone Number", desc: "Contact phone number" },
              { key: "email", label: "Email", desc: "Email address" },
              { key: "address", label: "Address", desc: "Service location or home address" },
              { key: "service_type", label: "Service Type", desc: "What service they need" },
              { key: "notes", label: "Notes", desc: "Any extra details from the caller" },
            ].map((field) => {
              const fields = s.appointment_fields || ["name", "phone"];
              const checked = fields.includes(field.key);
              return (
                <label key={field.key} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const next = checked ? fields.filter((f: string) => f !== field.key) : [...fields, field.key];
                      update("appointment_fields", next);
                    }}
                    className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500/20"
                  />
                  <div>
                    <span className="text-sm font-medium text-neutral-900">{field.label}</span>
                    <p className="text-xs text-neutral-500">{field.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Twilio */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Twilio</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Connect a phone number for real calls (optional)</p>
          </div>
        </div>

        <div className="px-5 py-5 space-y-5">
          <div className="flex items-start gap-3 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3">
            <Icons.AlertCircle className="h-4 w-4 text-neutral-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-neutral-500 leading-relaxed">
              You can test without Twilio using the Test Call button. Add credentials when ready for real phone calls.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Phone Number</label>
              <input type="text" value={s.twilio_phone_number || ""} onChange={e => update("twilio_phone_number", e.target.value)} placeholder="+1234567890" className={`${inputCls} font-mono`} />
            </div>
            <div>
              <label className={labelCls}>Account SID</label>
              <input type="text" value={s.twilio_account_sid || ""} onChange={e => update("twilio_account_sid", e.target.value)} placeholder="AC..." className={`${inputCls} font-mono`} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Auth Token</label>
            <input type="password" onChange={e => update("twilio_auth_token", e.target.value)} placeholder="Enter to update (hidden)" className={`${inputCls} font-mono`} />
          </div>

          {s.is_enabled && s.twilio_phone_number && (
            <div className="flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-lg px-3.5 py-2.5">
              <Icons.CheckCircle className="h-3.5 w-3.5 text-primary-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-primary-700 font-medium">Webhook URL</p>
                <code className="text-xs text-primary-600 font-mono select-all">
                  {typeof window !== "undefined" ? `${process.env.NEXT_PUBLIC_API_URL || "https://your-api.com"}/voice-agent/twilio/incoming` : ""}
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
