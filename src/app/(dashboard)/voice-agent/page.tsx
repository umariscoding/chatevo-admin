"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { companyApi } from "@/utils/company/api";
import Toggle from "@/components/ui/Toggle";
import { Icons, IOSContentLoader} from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import VoiceModelPicker from "@/components/voice-agent/VoiceModelPicker";
import AppointmentFieldsBuilder from "@/components/voice-agent/AppointmentFieldsBuilder";
import TestCallPanel from "@/components/voice-agent/TestCallPanel";
import UpgradeNudge from "@/components/billing/UpgradeNudge";
import ProBadge from "@/components/billing/ProBadge";
import { usePlan } from "@/hooks/usePlan";

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

// Apply UI defaults so the saved baseline matches what the form actually
// renders — otherwise the snapshot diff would flag default-fallbacks as
// "unsaved changes" the moment the page loads.
const normalizeSettings = (raw: VoiceSettings): VoiceSettings => ({
  ...raw,
  appointment_fields:
    raw.appointment_fields && raw.appointment_fields.length > 0
      ? raw.appointment_fields
      : ["name", "phone"],
});

const SECTIONS = [
  { id: "agent", label: "Agent", icon: Icons.Bot },
  { id: "voice", label: "Voice", icon: Icons.Mic },
  { id: "fields", label: "Booking fields", icon: Icons.FileText },
  { id: "phone", label: "Phone", icon: Icons.Phone },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const inputCls =
  "w-full rounded-lg border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-colors";
const labelCls = "text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block";

export default function VoiceAgentPage() {
  const { isFree } = usePlan();
  const [s, setS] = useState<VoiceSettings | null>(null);
  // Last-saved baseline. `hasChanges` is derived by diffing `s` against this.
  const [baseline, setBaseline] = useState<VoiceSettings | null>(null);
  // Auth token is write-only — server never returns it. Tracked separately
  // so it doesn't pollute the change-detection diff (and so browser autofill
  // can't trip the "Unsaved changes" bar on page load).
  const [authToken, setAuthToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("agent");
  const [showTest, setShowTest] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<SectionId, HTMLElement | null>>({
    agent: null,
    voice: null,
    fields: null,
    phone: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await companyApi.get("/voice-agent/settings");
        if (cancelled) return;
        const next = normalizeSettings(res.data);
        setS(next);
        setBaseline(next);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(<K extends keyof VoiceSettings>(field: K, value: VoiceSettings[K]) => {
    setS((prev) => (prev ? { ...prev, [field]: value } : prev));
    setSaveSuccess(false);
  }, []);

  const discard = useCallback(() => {
    if (baseline) setS(baseline);
    setAuthToken("");
    setSaveSuccess(false);
  }, [baseline]);

  const save = async () => {
    if (!s) return;
    setSaving(true);
    try {
      const payload: VoiceSettings & { twilio_auth_token?: string } = { ...s };
      if (authToken) payload.twilio_auth_token = authToken;
      await companyApi.put("/voice-agent/settings", payload);
      setBaseline(s);
      setAuthToken("");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = useMemo(() => {
    if (!s || !baseline) return false;
    if (JSON.stringify(s) !== JSON.stringify(baseline)) return true;
    return authToken.length > 0;
  }, [s, baseline, authToken]);

  // Scroll spy — observe each section, mark the topmost visible one active.
  useEffect(() => {
    if (!scrollRef.current || loading) return;
    const root = scrollRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const id = visible[0].target.getAttribute("data-section") as SectionId | null;
          if (id) setActiveSection(id);
        }
      },
      { root, rootMargin: "-10% 0px -70% 0px", threshold: 0 }
    );

    SECTIONS.forEach((sec) => {
      const el = sectionRefs.current[sec.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading]);

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading || !s) {
    return (
      <IOSContentLoader isLoading={true} message="Loading..." />
    );
  }

  const apiBase = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_API_URL || "" : "";

  return (
    // Fill the viewport below the dashboard header so only the inner column scrolls.
    <div
      className="flex flex-col -my-6 -mx-4 sm:-mx-6 lg:-mx-8"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 pt-6 pb-4 border-b border-slate-100 dark:border-white/[0.06] flex-shrink-0 bg-neutral-50 dark:bg-transparent">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Voice Agent</h1>
            {isFree && <ProBadge />}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            AI phone agent that answers calls and books appointments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill
            enabled={s.is_enabled}
            onToggle={(v) => update("is_enabled", v)}
            disabled={isFree}
          />
          <button
            onClick={() => !isFree && setShowTest(true)}
            disabled={isFree}
            title={isFree ? "Voice agent is a Pro feature" : "Test in your browser"}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-white/[0.06] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-white/[0.02]"
          >
            <Icons.Phone className="h-3.5 w-3.5" /> Try it
          </button>
        </div>
      </div>

      {/* Body — sidebar + scrollable form */}
      <div className="flex-1 flex min-h-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="hidden md:block w-44 flex-shrink-0 pt-6 pr-4 sticky top-0 self-start">
          <ul className="space-y-1">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const active = activeSection === sec.id;
              return (
                <li key={sec.id}>
                  <button
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:bg-white/[0.04]/70 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {sec.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          ref={scrollRef}
          className="flex-1 min-w-0 overflow-y-auto py-6 pb-32 space-y-6"
        >
          {isFree && <UpgradeNudge feature="Voice agent" />}
          <div
            className={
              isFree
                ? "space-y-6 opacity-50 pointer-events-none select-none"
                : "space-y-6"
            }
            aria-disabled={isFree}
          >
            <AgentSection
              ref={(el) => {
                sectionRefs.current.agent = el;
              }}
              settings={s}
              onUpdate={update}
            />
            <VoiceSection
              ref={(el) => {
                sectionRefs.current.voice = el;
              }}
              voiceModel={s.voice_model}
              onUpdate={update}
            />
            <FieldsSection
              ref={(el) => {
                sectionRefs.current.fields = el;
              }}
              fields={s.appointment_fields}
              onUpdate={update}
            />
            <PhoneSection
              ref={(el) => {
                sectionRefs.current.phone = el;
              }}
              settings={s}
              onUpdate={update}
              authToken={authToken}
              onAuthTokenChange={setAuthToken}
              apiBase={apiBase}
            />
          </div>
        </div>
      </div>

      {/* Sticky save bar — pinned to viewport bottom, only when there are changes. */}
      {hasChanges && !isFree && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-[#0a1414] text-white rounded-full shadow-2xl shadow-black/30 flex items-center gap-3 pl-5 pr-2 py-2 border border-primary-500/20">
          <span className="text-xs font-medium">Unsaved changes</span>
          <button
            onClick={discard}
            className="text-xs font-medium text-white/60 hover:text-white px-2 py-1 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
          >
            Discard
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-colors disabled:opacity-50 flex items-center gap-1.5 min-w-[64px] justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1414]"
          >
            {saving ? <IOSLoader size="sm" color="white" /> : "Save"}
          </button>
        </div>
      )}

      {saveSuccess && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-emerald-600 text-white rounded-full shadow-lg flex items-center gap-2 px-4 py-2">
          <Icons.CheckCircle className="h-4 w-4" />
          <span className="text-xs font-medium">Saved</span>
        </div>
      )}

      <TestCallPanel open={showTest} onClose={() => setShowTest(false)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sections — each one only re-renders when its own slice of state changes.
// ---------------------------------------------------------------------------

const SectionCard = React.forwardRef<
  HTMLElement,
  { id: SectionId; title: string; subtitle: string; children: React.ReactNode }
>(function SectionCard({ id, title, subtitle, children }, ref) {
  return (
    <section
      ref={ref}
      data-section={id}
      className="bg-white dark:bg-white/[0.02] rounded-xl border border-neutral-200 dark:border-white/[0.06] overflow-hidden scroll-mt-4"
    >
      <div className="px-5 py-4 border-b border-slate-100 dark:border-white/[0.06]">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
      </div>
      <div className="px-5 py-5">{children}</div>
    </section>
  );
});

interface UpdateFn {
  <K extends keyof VoiceSettings>(field: K, value: VoiceSettings[K]): void;
}

const StatusPill = React.memo(function StatusPill({
  enabled,
  onToggle,
  disabled = false,
}: {
  enabled: boolean;
  onToggle: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 pl-3 pr-1 py-1 rounded-full border transition-colors ${
        enabled ? "border-primary-200 dark:border-primary-900/40 bg-primary-50 dark:bg-primary-900/20" : "border-neutral-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      title={
        disabled
          ? "Voice agent is a Pro feature"
          : enabled
          ? "Active — agent answers incoming calls. Toggle off to pause."
          : "Inactive — agent will not answer calls. Toggle on to enable."
      }
    >
      <span
        className={`text-[10px] font-semibold uppercase tracking-wider ${
          enabled ? "text-primary-700 dark:text-primary-300" : "text-slate-400 dark:text-slate-400"
        }`}
      >
        {enabled ? "Active" : "Inactive"}
      </span>
      <Toggle checked={enabled} onChange={onToggle} variant="success" size="sm" />
    </div>
  );
});

const AgentSection = React.memo(
  React.forwardRef<HTMLElement, { settings: VoiceSettings; onUpdate: UpdateFn }>(
    function AgentSection({ settings: s, onUpdate }, ref) {
      return (
        <SectionCard
          ref={ref}
          id="agent"
          title="Agent"
          subtitle="Tell the agent who it is and how to greet callers."
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Business Name</label>
                <input
                  type="text"
                  value={s.business_name || ""}
                  onChange={(e) => onUpdate("business_name", e.target.value)}
                  placeholder="Joe's Plumbing"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Business Type</label>
                <input
                  type="text"
                  value={s.business_type || ""}
                  onChange={(e) => onUpdate("business_type", e.target.value)}
                  placeholder="plumber, electrician..."
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Greeting</label>
              <textarea
                value={s.greeting_message}
                onChange={(e) => onUpdate("greeting_message", e.target.value)}
                rows={2}
                placeholder="Hello! Thanks for calling."
                className={`${inputCls} resize-none`}
              />
            </div>
            <div>
              <label className={labelCls}>Custom Instructions</label>
              <p className="text-xs text-slate-400 dark:text-slate-400 -mt-1 mb-1.5">
                Extra rules appended to the default agent prompt.
              </p>
              <textarea
                value={s.system_prompt || ""}
                onChange={(e) => onUpdate("system_prompt", e.target.value)}
                rows={4}
                placeholder="e.g., Always ask if it's an emergency first"
                className={`${inputCls} resize-y`}
              />
            </div>
            <div>
              <label className={labelCls}>Appointment Duration</label>
              <select
                value={s.appointment_duration_min}
                onChange={(e) => onUpdate("appointment_duration_min", parseInt(e.target.value))}
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
        </SectionCard>
      );
    }
  )
);

const VoiceSection = React.memo(
  React.forwardRef<HTMLElement, { voiceModel: string; onUpdate: UpdateFn }>(
    function VoiceSection({ voiceModel, onUpdate }, ref) {
      const handleChange = useMemo(
        () => (v: string) => onUpdate("voice_model", v),
        [onUpdate]
      );
      return (
        <SectionCard
          ref={ref}
          id="voice"
          title="Voice"
          subtitle="Pick the voice your callers will hear."
        >
          <VoiceModelPicker value={voiceModel} onChange={handleChange} />
        </SectionCard>
      );
    }
  )
);

const FieldsSection = React.memo(
  React.forwardRef<HTMLElement, { fields: string[]; onUpdate: UpdateFn }>(
    function FieldsSection({ fields, onUpdate }, ref) {
      const handleChange = useMemo(
        () => (v: string[]) => onUpdate("appointment_fields", v),
        [onUpdate]
      );
      return (
        <SectionCard
          ref={ref}
          id="fields"
          title="Booking fields"
          subtitle="Information the agent collects before confirming a booking."
        >
          <AppointmentFieldsBuilder
            value={fields && fields.length > 0 ? fields : ["name", "phone"]}
            onChange={handleChange}
          />
        </SectionCard>
      );
    }
  )
);

const PhoneSection = React.memo(
  React.forwardRef<
    HTMLElement,
    {
      settings: VoiceSettings;
      onUpdate: UpdateFn;
      authToken: string;
      onAuthTokenChange: (v: string) => void;
      apiBase: string;
    }
  >(function PhoneSection({ settings: s, onUpdate, authToken, onAuthTokenChange, apiBase }, ref) {
    return (
      <SectionCard
        ref={ref}
        id="phone"
        title="Phone (Twilio)"
        subtitle="Connect a phone number for real calls. Test in the browser without it."
      >
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Phone Number</label>
              <input
                type="text"
                value={s.twilio_phone_number || ""}
                onChange={(e) => onUpdate("twilio_phone_number", e.target.value)}
                placeholder="+1234567890"
                className={`${inputCls} font-mono`}
              />
            </div>
            <div>
              <label className={labelCls}>Account SID</label>
              <input
                type="text"
                value={s.twilio_account_sid || ""}
                onChange={(e) => onUpdate("twilio_account_sid", e.target.value)}
                placeholder="AC..."
                className={`${inputCls} font-mono`}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Auth Token</label>
            <input
              type="password"
              value={authToken}
              onChange={(e) => onAuthTokenChange(e.target.value)}
              placeholder="Enter to update (hidden)"
              autoComplete="new-password"
              className={`${inputCls} font-mono`}
            />
          </div>
          {s.twilio_phone_number && (
            <div className="flex items-start gap-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-900/40 rounded-xl px-4 py-3">
              <Icons.CheckCircle className="h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-primary-700 dark:text-primary-300 font-medium">Twilio webhook URL</p>
                <code className="text-xs text-primary-700 dark:text-primary-300 font-mono select-all break-all">
                  {apiBase ? `${apiBase}/voice-agent/twilio/incoming` : "Set NEXT_PUBLIC_API_URL"}
                </code>
              </div>
            </div>
          )}
        </div>
      </SectionCard>
    );
  })
);
