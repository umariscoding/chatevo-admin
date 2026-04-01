"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import { useEmbedSettings } from "@/hooks/useEmbedSettings";
import { Icons, IOSContentLoader } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import { API_CONFIG } from "@/constants/api";
import { usePlan } from "@/hooks/usePlan";
import UpgradeNudge from "@/components/billing/UpgradeNudge";
import { DEFAULT_EMBED_SETTINGS } from "@/types/settings";
import WidgetPreview from "./WidgetPreview";
import {
  MessageCircle,
  Mail,
  Headphones,
  Sparkles,
  Zap,
  HelpCircle,
  Bot,
  Wand2,
  Phone,
  MessagesSquare,
} from "lucide-react";
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

const BUTTON_ICON_DEFS: { value: ButtonIconType; label: string; icon: React.ElementType }[] = [
  { value: "chat", label: "Chat", icon: MessageCircle },
  { value: "message", label: "Mail", icon: Mail },
  { value: "headset", label: "Support", icon: Headphones },
  { value: "sparkle", label: "Sparkle", icon: Sparkles },
  { value: "bolt", label: "Bolt", icon: Zap },
  { value: "help", label: "Help", icon: HelpCircle },
  { value: "robot", label: "Robot", icon: Bot },
  { value: "wand", label: "AI Wand", icon: Wand2 },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "bubble", label: "Bubble", icon: MessagesSquare },
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
  const { isFree } = usePlan();
  const [copied, setCopied] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);

  const slug = companyAuth.company?.slug;
  const isPublished = companyAuth.company?.is_published;
  const chatbotTitle = companyAuth.company?.chatbot_title;
  const companyName = companyAuth.company?.name;
  const apiUrl = API_CONFIG.BASE_URL;

  // Preview shows what the public widget actually looks like —
  // free users see default styling for Pro-only fields
  const previewSettings = isFree
    ? {
        ...DEFAULT_EMBED_SETTINGS,
        // Keep free-tier fields from actual settings
        autoOpenDelay: settings.autoOpenDelay,
      }
    : settings;

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

      {/* Embed Code — collapsible, always accessible */}
      {slug && isPublished && (
        <div className="mb-6 bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between">
            <button
              onClick={() => setShowEmbedCode(!showEmbedCode)}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                <Icons.Code className="h-4 w-4 text-neutral-300" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-neutral-900">
                  Embed Code
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Add the widget to your website
                </p>
              </div>
              <Icons.ChevronDown
                className={`h-4 w-4 text-neutral-400 transition-transform duration-200 ml-2 flex-shrink-0 ${
                  showEmbedCode ? "rotate-180" : ""
                }`}
              />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleCopy(); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex-shrink-0 ml-3 ${
                copied
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200"
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
                  Copy code
                </>
              )}
            </button>
          </div>

          <div
            className="transition-all duration-300 ease-in-out"
            style={{
              maxHeight: showEmbedCode ? "300px" : "0px",
              opacity: showEmbedCode ? 1 : 0,
              overflow: "hidden",
            }}
          >
            <div className="px-5 pb-5 space-y-3 border-t border-neutral-100 pt-4">
              <pre className="bg-neutral-900 text-neutral-300 p-4 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed">
                <code>{embedCode}</code>
              </pre>
              <p className="text-[11px] text-neutral-400">
                Paste this snippet inside your website&apos;s{" "}
                <code className="bg-neutral-100 text-neutral-600 px-1 py-0.5 rounded font-mono">
                  &lt;head&gt;
                </code>{" "}
                tag
              </p>
            </div>
          </div>
        </div>
      )}

      {slug && isPublished && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Settings */}
          <div className="space-y-5">
            {isFree && <UpgradeNudge feature="Appearance, content, and chat style" />}
            {/* Appearance — disabled for free users */}
            <div className={`bg-white rounded-lg border border-neutral-200 p-5 space-y-5 ${isFree ? "opacity-50 pointer-events-none select-none" : ""}`}>
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

            {/* Content — disabled for free users */}
            <div className={`bg-white rounded-lg border border-neutral-200 p-5 space-y-5 ${isFree ? "opacity-50 pointer-events-none select-none" : ""}`}>
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

            {/* Chat Template — disabled for free users */}
            <div className={`bg-white rounded-lg border border-neutral-200 p-5 space-y-5 ${isFree ? "opacity-50 pointer-events-none select-none" : ""}`}>
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

            {/* Behavior — disabled for free users */}
            <div className={`bg-white rounded-lg border border-neutral-200 overflow-hidden ${isFree ? "opacity-50 pointer-events-none select-none" : ""}`}>
              <div className="p-5 border-b border-neutral-100">
                <p className="text-sm font-semibold text-neutral-900">Behavior</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Button style and branding
                </p>
              </div>

              {/* Button Icon */}
              <div className="p-5 space-y-4">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Launcher Icon
                </label>

                {/* Icon grid — 5 per row, 2 rows */}
                <div className="grid grid-cols-5 gap-1.5">
                  {BUTTON_ICON_DEFS.map((opt) => {
                    const isActive = settings.buttonIcon === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => updateSetting("buttonIcon", opt.value)}
                        className={`group flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border transition-all duration-150 ${
                          isActive
                            ? "bg-primary-50 border-primary-300 shadow-sm shadow-primary-500/10"
                            : "border-transparent hover:border-neutral-200 hover:bg-neutral-50"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 flex items-center justify-center transition-all ${
                            settings.chatTemplate === "minimal" ? "rounded-lg" : "rounded-full"
                          } ${
                            isActive
                              ? "bg-primary-600 shadow-md shadow-primary-600/25"
                              : "bg-neutral-100 group-hover:bg-neutral-200"
                          }`}
                        >
                          <opt.icon
                            className={`w-[18px] h-[18px] transition-colors ${
                              isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-700"
                            }`}
                          />
                        </div>
                        <span
                          className={`text-[10px] font-semibold leading-none transition-colors ${
                            isActive ? "text-primary-700" : "text-neutral-400 group-hover:text-neutral-600"
                          }`}
                        >
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Site mockup preview */}
                <div className="relative rounded-xl overflow-hidden border border-neutral-200">
                  {/* Mini browser chrome */}
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-100 border-b border-neutral-200">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-neutral-300" />
                      <div className="w-2 h-2 rounded-full bg-neutral-300" />
                      <div className="w-2 h-2 rounded-full bg-neutral-300" />
                    </div>
                    <div className="flex-1 mx-2 h-4 rounded-md bg-white border border-neutral-200 flex items-center px-2">
                      <span className="text-[8px] text-neutral-400 font-mono">yourwebsite.com</span>
                    </div>
                  </div>

                  {/* Page body */}
                  <div
                    className="relative h-36"
                    style={{
                      background: settings.theme === "light"
                        ? "#ffffff"
                        : "#111114",
                    }}
                  >
                    {/* Fake page content lines */}
                    <div className="p-4 space-y-2.5">
                      <div
                        className="h-3 rounded-full w-2/3"
                        style={{ background: settings.theme === "light" ? "#e5e7eb" : "#27272a" }}
                      />
                      <div
                        className="h-2 rounded-full w-full"
                        style={{ background: settings.theme === "light" ? "#f3f4f6" : "#1e1e21" }}
                      />
                      <div
                        className="h-2 rounded-full w-5/6"
                        style={{ background: settings.theme === "light" ? "#f3f4f6" : "#1e1e21" }}
                      />
                      <div
                        className="h-2 rounded-full w-3/4"
                        style={{ background: settings.theme === "light" ? "#f3f4f6" : "#1e1e21" }}
                      />
                      <div className="pt-1 flex gap-2">
                        <div
                          className="h-6 rounded-md w-16"
                          style={{ background: settings.theme === "light" ? "#e5e7eb" : "#27272a" }}
                        />
                        <div
                          className="h-6 rounded-md w-20"
                          style={{ background: settings.theme === "light" ? "#f3f4f6" : "#1e1e21" }}
                        />
                      </div>
                    </div>

                    {/* Floating launcher button — positioned in corner */}
                    <div
                      className={`absolute bottom-3 ${settings.position === "right" ? "right-3" : "left-3"} transition-all`}
                    >
                      {/* Pulse ring */}
                      <div
                        className="absolute inset-0 rounded-full animate-ping opacity-20"
                        style={{ background: settings.primaryColor }}
                      />
                      <div
                        className="relative flex items-center justify-center transition-all"
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: settings.chatTemplate === "minimal" ? 12 : "50%",
                          background: settings.primaryColor,
                          boxShadow: `0 4px 16px ${settings.primaryColor}45, 0 1px 3px rgba(0,0,0,0.1)`,
                        }}
                      >
                        {(() => {
                          const IconComp = BUTTON_ICON_DEFS.find((d) => d.value === settings.buttonIcon)?.icon || MessageCircle;
                          return <IconComp className="w-5 h-5 text-white" />;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hide Branding */}
              <div className="mx-5 mb-5 flex items-center justify-between rounded-xl border border-neutral-200 px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${settings.hideBranding ? "bg-primary-50" : "bg-neutral-100"}`}>
                    <Icons.Eye className={`h-4 w-4 ${settings.hideBranding ? "text-primary-600" : "text-neutral-400"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {settings.hideBranding ? "Branding hidden" : "Show branding"}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      &quot;Powered by ChatEvo&quot; footer
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting("hideBranding", !settings.hideBranding)}
                  className={`relative rounded-full transition-colors duration-200 ${
                    settings.hideBranding ? "bg-primary-500" : "bg-neutral-300"
                  }`}
                  style={{ minWidth: 44, height: 24 }}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      settings.hideBranding ? "translate-x-5" : "translate-x-0"
                    }`}
                    style={{ width: 20, height: 20 }}
                  />
                </button>
              </div>
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
                  settings={previewSettings}
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
