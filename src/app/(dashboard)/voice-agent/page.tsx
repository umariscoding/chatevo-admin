"use client";

import React, { useCallback, useEffect, useState } from "react";
import { companyApi } from "@/utils/company/api";
import Toggle from "@/components/ui/Toggle";
import { Icons } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import VoiceModelPicker from "@/components/voice-agent/VoiceModelPicker";
import AppointmentFieldsBuilder from "@/components/voice-agent/AppointmentFieldsBuilder";
import TestCallPanel from "@/components/voice-agent/TestCallPanel";

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

const SECTIONS = [
  { id: "agent", label: "Agent", icon: Icons.Bot },
  { id: "voice", label: "Voice", icon: Icons.Mic },
  { id: "fields", label: "Booking fields", icon: Icons.FileText },
  { id: "phone", label: "Phone", icon: Icons.Phone },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const inputCls =
  "mt-1.5 w-full rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all";
const labelCls = "text-xs font-medium text-neutral-500 uppercase tracking-wider";

export default function VoiceAgentPage() {
  const [s, setS] = useState<VoiceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("agent");
  const [showTest, setShowTest] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await companyApi.get("/voice-agent/settings");
      setS(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const update = (field: keyof VoiceSettings, value: unknown) => {
    if (!s) return;
    setS({ ...s, [field]: value });
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const save = async () => {
    if (!s) return;
    setSaving(true);
    try {
      await companyApi.put("/voice-agent/settings", s);
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !s) {
    return (
      <div className="flex items-center justify-center h-64">
        <IOSLoader size="md" color="primary" />
      </div>
    );
  }

  const apiBase = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_API_URL || "" : "";

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Voice Agent</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            AI phone agent that answers calls and books appointments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTest(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 border border-neutral-200 rounded-full transition-all hover:bg-neutral-50"
          >
            <Icons.Phone className="h-3.5 w-3.5" /> Try it
          </button>
        </div>
      </div>

      {/* Status banner */}
      <div
        className={`relative overflow-hidden rounded-xl border mb-6 transition-all ${
          s.is_enabled
            ? "border-primary-200 bg-gradient-to-br from-primary-50 to-white"
            : "border-neutral-200 bg-white"
        }`}
      >
        {s.is_enabled && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400" />
        )}
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                s.is_enabled ? "bg-primary-600 shadow-lg shadow-primary-600/25" : "bg-neutral-100"
              }`}
            >
              {s.is_enabled && (
                <div className="absolute inset-0 rounded-xl bg-primary-500 animate-ping opacity-20" />
              )}
              <Icons.Mic
                className={`h-4 w-4 relative z-10 transition-colors ${
                  s.is_enabled ? "text-white" : "text-neutral-400"
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold text-neutral-900">
                  {s.is_enabled ? "Active" : "Inactive"}
                </span>
                {s.is_enabled && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[10px] font-semibold uppercase tracking-wider">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-600" />
                    </span>
                    Live
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {s.is_enabled
                  ? "Incoming calls will be answered by the AI"
                  : "Enable to start answering calls"}
              </p>
            </div>
          </div>
          <Toggle
            checked={s.is_enabled}
            onChange={(v) => update("is_enabled", v)}
            variant="success"
            size="md"
          />
        </div>
      </div>

      {/* Sectioned settings */}
      <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-6">
        {/* Anchor nav */}
        <nav className="lg:sticky lg:top-4 self-start">
          <ul className="flex lg:flex-col gap-1 overflow-x-auto">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const active = activeSection === sec.id;
              return (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(sec.id);
                      document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      active
                        ? "bg-primary-50 text-primary-700"
                        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {sec.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sections */}
        <div className="space-y-6">
          {/* AGENT */}
          <section id="agent" className="bg-white rounded-xl border border-neutral-200 overflow-hidden scroll-mt-4">
            <div className="px-5 py-4 border-b border-neutral-100">
              <h2 className="text-sm font-semibold text-neutral-900">Agent</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Tell the agent who it is and how to greet callers.
              </p>
            </div>
            <div className="px-5 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Business Name</label>
                  <input
                    type="text"
                    value={s.business_name || ""}
                    onChange={(e) => update("business_name", e.target.value)}
                    placeholder="Joe's Plumbing"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Business Type</label>
                  <input
                    type="text"
                    value={s.business_type || ""}
                    onChange={(e) => update("business_type", e.target.value)}
                    placeholder="plumber, electrician..."
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Greeting</label>
                <textarea
                  value={s.greeting_message}
                  onChange={(e) => update("greeting_message", e.target.value)}
                  rows={2}
                  placeholder="Hello! Thanks for calling."
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div>
                <label className={labelCls}>Custom Instructions</label>
                <p className="text-xs text-neutral-400 mt-1 mb-1.5">
                  Extra rules appended to the default agent prompt.
                </p>
                <textarea
                  value={s.system_prompt || ""}
                  onChange={(e) => update("system_prompt", e.target.value)}
                  rows={4}
                  placeholder="e.g., Always ask if it's an emergency first"
                  className={`${inputCls} resize-y`}
                />
              </div>
              <div>
                <label className={labelCls}>Appointment Duration</label>
                <select
                  value={s.appointment_duration_min}
                  onChange={(e) => update("appointment_duration_min", parseInt(e.target.value))}
                  className={inputCls}
                >
                  {[15, 30, 45, 60, 90, 120].map((d) => (
                    <option key={d} value={d}>
                      {d} minutes
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* VOICE */}
          <section id="voice" className="bg-white rounded-xl border border-neutral-200 overflow-hidden scroll-mt-4">
            <div className="px-5 py-4 border-b border-neutral-100">
              <h2 className="text-sm font-semibold text-neutral-900">Voice</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Pick the voice your callers will hear.
              </p>
            </div>
            <div className="px-5 py-5">
              <VoiceModelPicker
                value={s.voice_model}
                onChange={(v) => update("voice_model", v)}
              />
            </div>
          </section>

          {/* BOOKING FIELDS */}
          <section id="fields" className="bg-white rounded-xl border border-neutral-200 overflow-hidden scroll-mt-4">
            <div className="px-5 py-4 border-b border-neutral-100">
              <h2 className="text-sm font-semibold text-neutral-900">Booking fields</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Information the agent collects before confirming a booking.
              </p>
            </div>
            <div className="px-5 py-5">
              <AppointmentFieldsBuilder
                value={s.appointment_fields || ["name", "phone"]}
                onChange={(v) => update("appointment_fields", v)}
              />
            </div>
          </section>

          {/* PHONE */}
          <section id="phone" className="bg-white rounded-xl border border-neutral-200 overflow-hidden scroll-mt-4">
            <div className="px-5 py-4 border-b border-neutral-100">
              <h2 className="text-sm font-semibold text-neutral-900">Phone (Twilio)</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Connect a phone number for real calls. Test in the browser without it.
              </p>
            </div>
            <div className="px-5 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input
                    type="text"
                    value={s.twilio_phone_number || ""}
                    onChange={(e) => update("twilio_phone_number", e.target.value)}
                    placeholder="+1234567890"
                    className={`${inputCls} font-mono`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Account SID</label>
                  <input
                    type="text"
                    value={s.twilio_account_sid || ""}
                    onChange={(e) => update("twilio_account_sid", e.target.value)}
                    placeholder="AC..."
                    className={`${inputCls} font-mono`}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Auth Token</label>
                <input
                  type="password"
                  onChange={(e) => update("twilio_auth_token" as keyof VoiceSettings, e.target.value)}
                  placeholder="Enter to update (hidden)"
                  className={`${inputCls} font-mono`}
                />
              </div>
              {s.twilio_phone_number && (
                <div className="flex items-start gap-3 bg-primary-50 border border-primary-200 rounded-xl px-4 py-3">
                  <Icons.CheckCircle className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs text-primary-700 font-medium">Twilio webhook URL</p>
                    <code className="text-xs text-primary-700 font-mono select-all break-all">
                      {apiBase
                        ? `${apiBase}/voice-agent/twilio/incoming`
                        : "Set NEXT_PUBLIC_API_URL"}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Sticky save bar */}
      {hasChanges && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-neutral-900 text-white rounded-full shadow-2xl shadow-black/20 flex items-center gap-3 pl-5 pr-2 py-2 border border-white/10">
          <span className="text-xs font-medium">You have unsaved changes</span>
          <button
            onClick={() => fetchSettings().then(() => setHasChanges(false))}
            className="text-xs font-medium text-neutral-300 hover:text-white px-2 py-1 rounded-full"
          >
            Discard
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-colors disabled:opacity-50 flex items-center gap-1.5 min-w-[64px] justify-center"
          >
            {saving ? <IOSLoader size="sm" color="white" /> : "Save"}
          </button>
        </div>
      )}

      {/* Saved toast */}
      {saveSuccess && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-emerald-600 text-white rounded-full shadow-lg flex items-center gap-2 px-4 py-2">
          <Icons.CheckCircle className="h-4 w-4" />
          <span className="text-xs font-medium">Saved</span>
        </div>
      )}

      {/* Test panel */}
      <TestCallPanel open={showTest} onClose={() => setShowTest(false)} />
    </div>
  );
}
