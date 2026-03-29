"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import { useEmbedSettings } from "@/hooks/useEmbedSettings";
import { Icons, IOSContentLoader } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import { API_CONFIG } from "@/constants/api";
import WidgetPreview from "./WidgetPreview";
import type { ButtonIconType, ChatTemplateType } from "@/types/settings";

const COLOR_PRESETS = [
  { name: "Teal", value: "#0d9488" },
  { name: "Emerald", value: "#10b981" },
  { name: "Sand", value: "#b0926a" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Coral", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
];

const HEADER_COLOR_PRESETS = [
  { name: "Same as brand", value: "" },
  { name: "Midnight", value: "#1e1e2e" },
  { name: "Navy", value: "#1e3a5f" },
  { name: "Forest", value: "#1a4d3e" },
  { name: "Charcoal", value: "#2d2d2d" },
  { name: "Plum", value: "#4a1942" },
];

const BUTTON_ICON_DEFS: { value: ButtonIconType; label: string; paths: React.ReactNode }[] = [
  { value: "chat", label: "Chat", paths: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /> },
  { value: "message", label: "Mail", paths: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></> },
  { value: "headset", label: "Support", paths: <><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></> },
  { value: "sparkle", label: "Sparkle", paths: <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" /> },
  { value: "bolt", label: "Bolt", paths: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /> },
  { value: "help", label: "Help", paths: <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></> },
  { value: "robot", label: "Robot", paths: <><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></> },
];

function SetupRequiredBanner({
  slug,
  isPublished,
}: {
  slug?: string | null;
  isPublished?: boolean;
}) {
  const router = useRouter();
  const steps = [];

  if (!slug) steps.push({ title: "Set a company slug", description: "Create a unique URL for your chatbot" });
  if (!isPublished) steps.push({ title: "Publish your chatbot", description: "Make it publicly accessible" });

  const totalSteps = steps.length;

  return (
    <div className="mb-8">
      {/* Premium card with subtle depth */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-neutral-200 shadow-sm">
        {/* Accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600" />

        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="relative px-8 py-10">
          <div className="flex items-start gap-8">
            {/* Left: Icon and heading */}
            <div className="flex-shrink-0">
              <div className="relative">
                {/* Subtle glow */}
                <div className="absolute -inset-3 bg-primary-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center border border-primary-500/30 backdrop-blur-sm">
                  <Icons.CheckCircle className="h-7 w-7 text-primary-600" />
                </div>
              </div>
            </div>

            {/* Center: Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                  <span className="text-xs font-medium text-primary-700">Setup Required</span>
                </span>
              </div>

              <h3 className="text-xl font-semibold text-neutral-900 mt-3 mb-2">
                Complete {totalSteps === 1 ? 'one step' : `${totalSteps} steps`} to go live
              </h3>
              <p className="text-sm text-neutral-600 max-w-xl mb-6">
                Your embed widget is almost ready. Just {totalSteps === 1 ? 'finish one final step' : 'complete these quick steps'} in Settings to start collecting conversations.
              </p>

              {/* Steps - Clean checklist style */}
              <div className="space-y-2.5 mb-6">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 group">
                    <div className="flex-shrink-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-primary-100 border border-primary-300 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-700">{idx + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-neutral-900">{step.title}</p>
                      <p className="text-xs text-neutral-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CTA Button */}
            <div className="flex-shrink-0">
              <button
                onClick={() => router.push("/settings")}
                className="relative group inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 active:scale-[0.98] whitespace-nowrap"
              >
                {/* Subtle shine effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                <span className="relative flex items-center gap-2">
                  Go to Settings
                  <Icons.ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmbedPage() {
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const { settings, loading, saving, updateSetting } = useEmbedSettings();
  const [copied, setCopied] = useState(false);

  const slug = companyAuth.company?.slug;
  const isPublished = companyAuth.company?.is_published;
  const chatbotTitle = companyAuth.company?.chatbot_title;
  const companyName = companyAuth.company?.name;
  const apiUrl = API_CONFIG.BASE_URL;

  const embedCode = slug
    ? `<!-- ChatEvo Widget -->\n<script\n  src="${apiUrl}/embed.js"\n  data-company-slug="${slug}"\n  data-api-url="${apiUrl}"\n  async\n></script>`
    : "";

  const handleCopy = async () => {
    if (!embedCode) return;
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (companyAuth.loading || loading) {
    return <IOSContentLoader isLoading={true} message="Loading..." />;
  }

  return (
    <div className="max-w-7xl mx-auto animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Embed Widget</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Customize and deploy your chat widget
          </p>
        </div>
        {saving && (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <IOSLoader size="sm" color="primary" />
            <span>Saving...</span>
          </div>
        )}
      </div>

      {/* Requirements Warning */}
      {(!slug || !isPublished) && (
        <SetupRequiredBanner slug={slug} isPublished={isPublished} />
      )}

      {slug && isPublished && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Settings */}
          <div className="space-y-5">
            {/* Appearance */}
            <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-5">
              <div>
                <p className="text-sm font-semibold text-neutral-900">Appearance</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Theme, colors, and widget position
                </p>
              </div>

              {/* Theme */}
              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Theme
                </label>
                <div className="mt-1.5 flex gap-2">
                  {(["light", "dark"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => updateSetting("theme", t)}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all flex items-center gap-2.5 ${
                        settings.theme === t
                          ? "border-primary-500 bg-primary-50/50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded border ${
                          t === "light"
                            ? "bg-white border-neutral-200"
                            : "bg-neutral-800 border-neutral-700"
                        } flex items-center justify-center`}
                      >
                        <div
                          className={`w-3 h-3 rounded-sm ${
                            t === "light" ? "bg-neutral-100" : "bg-neutral-700"
                          }`}
                        />
                      </div>
                      <span className="text-sm font-medium text-neutral-700 capitalize">
                        {t}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Position */}
              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Position
                </label>
                <div className="mt-1.5 flex gap-2">
                  {(["right", "left"] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => updateSetting("position", pos)}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                        settings.position === pos
                          ? "border-primary-500 bg-primary-50/50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div className="w-7 h-5 rounded border border-neutral-300 relative bg-white">
                        <div
                          className="w-1.5 h-1.5 rounded-sm absolute bottom-0.5"
                          style={{
                            background: settings.primaryColor,
                            [pos === "left" ? "left" : "right"]: "2px",
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-neutral-700 capitalize">
                        {pos}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Color */}
              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Brand Color
                </label>
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updateSetting("primaryColor", color.value)}
                      className={`w-8 h-8 rounded-lg transition-all ${
                        settings.primaryColor === color.value
                          ? "ring-2 ring-offset-2 ring-neutral-400 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ background: color.value }}
                      title={color.name}
                    />
                  ))}
                  <div className="flex items-center gap-1.5 ml-1">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting("primaryColor", e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting("primaryColor", e.target.value)}
                      className="w-20 px-2 py-1.5 text-xs border border-neutral-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                      placeholder="#0d9488"
                    />
                  </div>
                </div>
              </div>

              {/* Header Color */}
              <div>
                <div className="flex items-baseline justify-between">
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Header Color
                  </label>
                  <span className="text-xs text-neutral-400">
                    Empty = brand color
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                  {HEADER_COLOR_PRESETS.map((color) => (
                    <button
                      key={color.value || "__auto__"}
                      onClick={() => updateSetting("headerColor", color.value)}
                      className={`w-8 h-8 rounded-lg transition-all flex items-center justify-center ${
                        settings.headerColor === color.value
                          ? "ring-2 ring-offset-2 ring-neutral-400 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{
                        background: color.value || settings.primaryColor,
                      }}
                      title={color.name}
                    >
                      {!color.value && (
                        <span className="text-[9px] font-bold text-white/70">A</span>
                      )}
                    </button>
                  ))}
                  <div className="flex items-center gap-1.5 ml-1">
                    <input
                      type="color"
                      value={settings.headerColor || settings.primaryColor}
                      onChange={(e) => updateSetting("headerColor", e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={settings.headerColor}
                      onChange={(e) => updateSetting("headerColor", e.target.value)}
                      className="w-20 px-2 py-1.5 text-xs border border-neutral-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                      placeholder="auto"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-5">
              <div>
                <p className="text-sm font-semibold text-neutral-900">Content</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Messages and bot identity
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Welcome Message
                </label>
                <input
                  type="text"
                  value={settings.welcomeText}
                  onChange={(e) => updateSetting("welcomeText", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  placeholder="Hi there! How can we help?"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={settings.subtitleText}
                  onChange={(e) => updateSetting("subtitleText", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  placeholder="We typically reply instantly"
                />
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showHeaderSubtitle}
                    onChange={(e) => updateSetting("showHeaderSubtitle", e.target.checked)}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500/20"
                  />
                  <span className="text-xs text-neutral-500">Show in header</span>
                </label>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Input Placeholder
                </label>
                <input
                  type="text"
                  value={settings.placeholderText}
                  onChange={(e) => updateSetting("placeholderText", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                  placeholder="Type your message..."
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Suggested Messages
                </label>
                <p className="text-xs text-neutral-400 mt-0.5 mb-2">
                  Quick-reply buttons shown to the user before they type
                </p>
                <div className="space-y-2">
                  {(settings.suggestedMessages || []).map((msg, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        value={msg}
                        onChange={(e) => {
                          const updated = [...(settings.suggestedMessages || [])];
                          updated[idx] = e.target.value;
                          updateSetting("suggestedMessages", updated);
                        }}
                        className="flex-1 rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
                        placeholder={`e.g. What are your pricing plans?`}
                      />
                      <button
                        onClick={() => {
                          const updated = (settings.suggestedMessages || []).filter((_, i) => i !== idx);
                          updateSetting("suggestedMessages", updated);
                        }}
                        className="flex-shrink-0 w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-200 transition-colors"
                      >
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ))}
                  {(settings.suggestedMessages || []).length < 6 && (
                    <button
                      onClick={() => {
                        const updated = [...(settings.suggestedMessages || []), ""];
                        updateSetting("suggestedMessages", updated);
                      }}
                      className="w-full rounded-lg border border-dashed border-neutral-300 py-2 text-xs text-neutral-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
                    >
                      + Add suggested message
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Template */}
            <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-5">
              <div>
                <p className="text-sm font-semibold text-neutral-900">Chat Style</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Overall look and feel of the widget
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Template
                </label>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {([
                    { value: "default" as ChatTemplateType, label: "Default", desc: "Classic rounded chat" },
                    { value: "bubbles" as ChatTemplateType, label: "Bubbles", desc: "Soft & playful" },
                    { value: "minimal" as ChatTemplateType, label: "Minimal", desc: "Sharp & compact" },
                  ]).map((tpl) => {
                    const isActive = settings.chatTemplate === tpl.value;
                    return (
                      <button
                        key={tpl.value}
                        onClick={() => updateSetting("chatTemplate", tpl.value)}
                        className={`group rounded-xl border-2 transition-all text-left overflow-hidden ${
                          isActive
                            ? "border-primary-500 ring-2 ring-primary-500/20"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        {/* Mini widget rendered on dark surface */}
                        <div className="bg-neutral-950 px-3 pt-4 pb-2 flex justify-center">
                          <div
                            className="w-full transition-transform duration-200 group-hover:scale-[1.02]"
                            style={{ maxWidth: 120 }}
                          >
                            {/* === DEFAULT template mockup === */}
                            {tpl.value === "default" && (
                              <div className="bg-white rounded-lg overflow-hidden shadow-lg shadow-black/20" style={{ aspectRatio: "7/10" }}>
                                {/* Header */}
                                <div className="px-2 py-1.5 flex items-center justify-between" style={{ background: settings.headerColor || settings.primaryColor }}>
                                  <div>
                                    <div className="text-[6px] font-semibold text-white leading-tight">Chat</div>
                                    <div className="text-[4.5px] text-white/60 leading-tight">Online</div>
                                  </div>
                                  <div className="w-2.5 h-2.5 rounded flex items-center justify-center bg-white/10">
                                    <div className="w-1.5 h-px bg-white/70" />
                                  </div>
                                </div>
                                {/* Messages */}
                                <div className="px-1.5 py-1.5 flex flex-col gap-1 flex-1">
                                  <div className="self-start">
                                    <div className="text-[5px] text-neutral-500 leading-tight">How can I help?</div>
                                  </div>
                                  <div className="self-end">
                                    <div className="text-[5px] bg-neutral-100 rounded-full px-1.5 py-0.5 text-neutral-700 leading-tight">I have a question</div>
                                  </div>
                                  <div className="self-start">
                                    <div className="text-[5px] text-neutral-500 leading-tight">Sure, go ahead!</div>
                                  </div>
                                </div>
                                {/* Input */}
                                <div className="px-1.5 pb-1.5">
                                  <div className="bg-neutral-100 rounded-full h-3.5 flex items-center px-1.5">
                                    <div className="text-[4px] text-neutral-400">Type a message...</div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* === BUBBLES template mockup === */}
                            {tpl.value === "bubbles" && (
                              <div className="bg-white rounded-xl overflow-hidden shadow-lg shadow-black/20" style={{ aspectRatio: "7/10" }}>
                                {/* Header */}
                                <div className="px-2 py-2 flex items-center gap-1.5" style={{ background: settings.headerColor || settings.primaryColor }}>
                                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                                    <div className="text-[5px] text-white font-bold">A</div>
                                  </div>
                                  <div>
                                    <div className="text-[6px] font-bold text-white leading-tight">Chat</div>
                                    <div className="text-[4.5px] text-white/60 leading-tight">Online</div>
                                  </div>
                                </div>
                                {/* Messages */}
                                <div className="px-1.5 py-1.5 flex flex-col gap-1 flex-1">
                                  <div className="self-start flex items-end gap-0.5">
                                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: settings.primaryColor }}>
                                      <div className="text-[4px] text-white font-bold">A</div>
                                    </div>
                                    <div className="text-[5px] bg-neutral-100 rounded-lg rounded-bl-sm px-1.5 py-0.5 text-neutral-700 leading-tight">How can I help?</div>
                                  </div>
                                  <div className="self-end">
                                    <div className="text-[5px] text-white rounded-lg rounded-br-sm px-1.5 py-0.5 leading-tight" style={{ background: settings.primaryColor }}>I have a question</div>
                                  </div>
                                  <div className="self-start flex items-end gap-0.5">
                                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: settings.primaryColor }}>
                                      <div className="text-[4px] text-white font-bold">A</div>
                                    </div>
                                    <div className="text-[5px] bg-neutral-100 rounded-lg rounded-bl-sm px-1.5 py-0.5 text-neutral-700 leading-tight">Sure, go ahead!</div>
                                  </div>
                                </div>
                                {/* Input */}
                                <div className="px-1.5 pb-1.5">
                                  <div className="bg-neutral-100 rounded-full h-3.5 flex items-center justify-between px-1.5">
                                    <div className="text-[4px] text-neutral-400">Type a message...</div>
                                    <div className="w-2 h-2 rounded-full flex items-center justify-center" style={{ background: settings.primaryColor }}>
                                      <svg className="w-1 h-1 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* === MINIMAL template mockup === */}
                            {tpl.value === "minimal" && (
                              <div className="bg-white rounded overflow-hidden shadow-lg shadow-black/20" style={{ aspectRatio: "7/10" }}>
                                {/* Header */}
                                <div className="px-2 py-1.5 flex items-center gap-1 border-b border-neutral-200">
                                  <div className="w-3 h-3 rounded flex-shrink-0 flex items-center justify-center" style={{ background: settings.primaryColor }}>
                                    <div className="text-[4px] text-white font-bold">A</div>
                                  </div>
                                  <div>
                                    <div className="text-[6px] font-semibold text-neutral-800 leading-tight">Chat</div>
                                    <div className="text-[4px] text-neutral-400 leading-tight">Online</div>
                                  </div>
                                </div>
                                {/* Messages */}
                                <div className="px-1.5 py-1 flex flex-col gap-0.5 flex-1">
                                  <div className="self-start">
                                    <div className="text-[5px] text-neutral-500 py-0.5 leading-tight">How can I help?</div>
                                  </div>
                                  <div className="self-end">
                                    <div className="text-[5px] bg-neutral-50 rounded px-1.5 py-0.5 text-neutral-700 leading-tight">I have a question</div>
                                  </div>
                                  <div className="self-start">
                                    <div className="text-[5px] text-neutral-500 py-0.5 leading-tight">Sure, go ahead!</div>
                                  </div>
                                </div>
                                {/* Input */}
                                <div className="px-1.5 pb-1.5">
                                  <div className="border border-neutral-200 rounded h-3.5 flex items-center justify-between px-1.5">
                                    <div className="text-[4px] text-neutral-400">Type a message...</div>
                                    <div className="w-2 h-2 rounded flex items-center justify-center" style={{ background: settings.primaryColor }}>
                                      <svg className="w-1 h-1 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Label area */}
                        <div className={`px-3 py-2.5 transition-colors ${isActive ? "bg-primary-50/50" : "bg-white"}`}>
                          <div className="flex items-center gap-1.5">
                            {isActive && (
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                            )}
                            <p className={`text-sm font-semibold ${isActive ? "text-primary-700" : "text-neutral-800"}`}>
                              {tpl.label}
                            </p>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            {tpl.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Behavior */}
            <div className="bg-white rounded-lg border border-neutral-200 divide-y divide-neutral-100">
              <div className="p-5">
                <p className="text-sm font-semibold text-neutral-900">Behavior</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Button style and branding
                </p>
              </div>

              {/* Button Icon */}
              <div className="p-5">
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Launcher Icon
                </label>
                {/* Preview of selected icon on contrasting surface */}
                <div
                  className="mt-2.5 mb-3 flex items-center justify-center rounded-lg py-4"
                  style={{
                    background: settings.theme === "light"
                      ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
                      : "linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)",
                  }}
                >
                  <div
                    className="flex items-center justify-center transition-all"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: settings.chatTemplate === "minimal" ? 12 : "50%",
                      background: settings.primaryColor,
                      boxShadow: `0 4px 16px ${settings.primaryColor}40`,
                    }}
                  >
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {BUTTON_ICON_DEFS.find((d) => d.value === settings.buttonIcon)?.paths}
                    </svg>
                  </div>
                </div>
                {/* Icon grid — flat selection, no colored circles */}
                <div className="grid grid-cols-7 gap-1">
                  {BUTTON_ICON_DEFS.map((opt) => {
                    const isActive = settings.buttonIcon === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => updateSetting("buttonIcon", opt.value)}
                        className={`flex flex-col items-center gap-1 py-1.5 px-1 rounded-lg transition-all ${
                          isActive
                            ? "bg-primary-50 ring-1 ring-primary-400"
                            : "hover:bg-neutral-50"
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 transition-colors ${
                            isActive ? "text-primary-600" : "text-neutral-400"
                          }`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          {opt.paths}
                        </svg>
                        <span
                          className={`text-[9px] font-medium leading-none ${
                            isActive ? "text-primary-600" : "text-neutral-400"
                          }`}
                        >
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hide Branding */}
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {settings.hideBranding ? "Branding hidden" : "Branding visible"}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    &quot;Powered by ChatEvo&quot; footer
                  </p>
                </div>
                <button
                  onClick={() => updateSetting("hideBranding", !settings.hideBranding)}
                  className={`relative rounded-full transition-colors ${
                    settings.hideBranding ? "bg-primary-500" : "bg-neutral-300"
                  }`}
                  style={{ minWidth: 44, height: 24 }}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform ${
                      settings.hideBranding ? "translate-x-5" : "translate-x-0"
                    }`}
                    style={{ width: 20, height: 20 }}
                  />
                </button>
              </div>
            </div>

            {/* Embed Code */}
            <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    Embed Code
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Paste in your website&apos;s{" "}
                    <code className="bg-neutral-100 px-1 py-0.5 rounded text-[10px] font-mono">
                      &lt;head&gt;
                    </code>
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    copied
                      ? "bg-accent-600 text-white"
                      : "bg-primary-600 text-white hover:bg-primary-700"
                  }`}
                >
                  {copied ? (
                    <>
                      <Icons.CheckCircle className="h-3.5 w-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Icons.Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-neutral-900 text-neutral-300 p-4 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed">
                <code>{embedCode}</code>
              </pre>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="lg:sticky lg:top-4 h-fit">
            <div className="rounded-lg border border-neutral-200 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-neutral-100 bg-white">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
                  <p className="text-sm font-semibold text-neutral-900">
                    Live Preview
                  </p>
                </div>
                {slug && isPublished && (
                  <button
                    onClick={() => window.open(`${apiUrl}/preview/${slug}`, "_blank")}
                    className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
                    title="Open full-screen preview"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    Full screen
                  </button>
                )}
              </div>

              <div className="p-4">
                <WidgetPreview
                  settings={settings}
                  chatbotTitle={chatbotTitle}
                  companyName={companyName}
                  companySlug={slug}
                />
              </div>

              <div className="px-5 py-3 border-t border-neutral-100 bg-white">
                <p className="text-xs text-neutral-400 text-center">
                  Click the chat button to toggle &middot; Send real messages to test
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
