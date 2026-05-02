"use client";

import React, { useState } from "react";
import {
  useCompanyAppSelector,
  useCompanyAppDispatch,
} from "@/hooks/company/useCompanyAuth";
import {
  batchUpdateSettings,
  clearError,
} from "@/store/company/slices/companySlice";
import { updateCompanyInfo } from "@/store/company/slices/companyAuthSlice";
import { Icons, IOSContentLoader, Toggle } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import { useSettings } from "@/hooks/useSettings";
import { usePlan } from "@/hooks/usePlan";
import { useTheme } from "@/contexts/ThemeContext";
import BillingSection from "@/components/settings/BillingSection";

export default function SettingsPage() {
  const dispatch = useCompanyAppDispatch();
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const { loading, error } = useCompanyAppSelector((state) => state.company);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const { isFree } = usePlan();
  const { theme, setTheme } = useTheme();

  const { formData, updateField, getChanges, markAsSaved, resetChanges } =
    useSettings();

  const handleSave = async () => {
    try {
      dispatch(clearError());
      setSaveSuccess(false);

      const changes = getChanges();
      if (!changes.hasChanges) return;

      const updateData: any = {};

      if (changes.changedFields.has("slug")) {
        updateData.slug = formData.slug.trim().toLowerCase();
      }
      if (changes.changedFields.has("chatbotTitle")) {
        updateData.chatbot_title = formData.chatbotTitle;
      }
      if (changes.changedFields.has("isPublished")) {
        updateData.is_published = formData.isPublished;
      }

      const result = await dispatch(batchUpdateSettings(updateData)).unwrap();

      if (result.company) {
        dispatch(updateCompanyInfo(result.company));
      }

      markAsSaved();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      console.error("Failed to update settings:", error);
    }
  };

  if (companyAuth.loading) {
    return <IOSContentLoader isLoading={true} message="Loading settings..." />;
  }

  if (!companyAuth.isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Icons.Settings className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
          Access Restricted
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Only company administrators can access settings.
        </p>
      </div>
    );
  }

  const changes = getChanges();

  return (
    <div className="max-w-7xl mx-auto pb-16">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6 pt-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Settings
        </h1>

        {changes.hasChanges && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => resetChanges()}
              disabled={loading}
              className="px-3.5 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 rounded-full border border-neutral-200 dark:border-white/[0.06] hover:bg-neutral-50 dark:hover:bg-white/[0.04] transition-all disabled:opacity-40"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-1.5 text-sm font-semibold text-white bg-primary-600 hover:bg-teal-500 dark:hover:bg-teal-500/25 dark:border dark:border-teal-500/30 rounded-full transition-all disabled:opacity-40 flex items-center gap-2 min-w-[68px] justify-center"
            >
              {loading ? (
                <IOSLoader size="sm" color="white" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── Toasts ── */}
      {error && (
        <div className="mb-4 flex items-center gap-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl px-4 py-3">
          <Icons.AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
          <p className="text-sm text-rose-700 dark:text-rose-300 flex-1">
            {typeof error === "string" ? error : "Something went wrong."}
          </p>
          <button
            onClick={() => dispatch(clearError())}
            className="text-rose-400 hover:text-rose-600 dark:text-rose-400 transition-colors"
          >
            <Icons.Close className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {saveSuccess && (
        <div className="mb-4 flex items-center gap-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 rounded-xl px-4 py-3">
          <Icons.CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Settings saved</p>
        </div>
      )}

      <BillingSection />

      {/* ══════════════════════════════════════
          1. PUBLISHING
          ══════════════════════════════════════ */}
      <div className="mb-4">
        <div
          className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
            formData.isPublished
              ? "border-emerald-200/60 dark:border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-500/[0.04]"
              : "border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]"
          }`}
        >
          {/* Top hairline glow — same recipe as the sidebar */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />

          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Status icon */}
              <div
                className={`relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                  formData.isPublished
                    ? "bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-500/25"
                    : "bg-slate-100 dark:bg-white/[0.04]"
                }`}
              >
                <Icons.Zap
                  className={`h-4 w-4 relative z-10 transition-colors duration-300 ${
                    formData.isPublished ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-400"
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {formData.isPublished ? "Live" : "Private"}
                  </span>
                  {formData.isPublished && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/20 text-[10px] font-semibold uppercase tracking-[0.08em]">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                      </span>
                      Online
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {formData.isPublished
                    ? "Your chatbot is enabled for embed"
                    : "Toggle to enable your chatbot"}
                </p>
              </div>
            </div>

            <Toggle
              checked={formData.isPublished}
              onChange={(checked) => updateField("isPublished", checked)}
              disabled={!formData.slug}
              variant="success"
              size="md"
            />
          </div>

          {/* No slug warning */}
          {!formData.slug && (
            <div className="px-5 pb-4">
              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/20 rounded-xl px-3.5 py-2.5">
                <Icons.AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Set a chatbot slug below before publishing
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ══════════════════════════════════════
          2. CHATBOT
          ══════════════════════════════════════ */}
      <div className="mb-4">
        <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-neutral-200 dark:border-white/[0.06] overflow-hidden">
          {/* Section label */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-white/[0.04] flex items-center justify-center">
                <Icons.Bot className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400">
                Chatbot
              </span>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">
                Display Title
              </label>
              <input
                type="text"
                value={formData.chatbotTitle}
                onChange={(e) => updateField("chatbotTitle", e.target.value)}
                placeholder="Customer Support Assistant"
                className="w-full rounded-xl border border-slate-200 dark:border-white/[0.10] bg-neutral-50 dark:bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:focus:ring-teal-500/40 focus:border-teal-400 dark:focus:border-teal-500/50 focus:bg-white dark:focus:bg-white/[0.04] transition-all"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="my-company"
                className="w-full rounded-xl border border-slate-200 dark:border-white/[0.10] bg-neutral-50 dark:bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:focus:ring-teal-500/40 focus:border-teal-400 dark:focus:border-teal-500/50 focus:bg-white dark:focus:bg-white/[0.04] transition-all"
              />
              <p className="text-xs text-slate-400 dark:text-slate-400 mt-1.5">
                Unique identifier for your embed widget · lowercase letters, numbers, hyphens · 3–50 chars
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          3. APPEARANCE
          ══════════════════════════════════════ */}
      <div className="mb-4">
        <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-neutral-200 dark:border-white/[0.06] overflow-hidden">
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-white/[0.04] flex items-center justify-center">
                <Icons.Settings className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400">
                Appearance
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  {
                    value: "light" as const,
                    label: "Light",
                    swatch: (
                      <div className="w-12 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-end pr-1.5">
                        <div className="w-3 h-3 rounded-full bg-slate-200" />
                      </div>
                    ),
                  },
                  {
                    value: "dark" as const,
                    label: "Dark",
                    swatch: (
                      <div className="w-12 h-8 rounded-md bg-[#0E1515] border border-white/[0.08] flex items-center justify-end pr-1.5">
                        <div className="w-3 h-3 rounded-full bg-white/[0.10]" />
                      </div>
                    ),
                  },
                  {
                    value: "system" as const,
                    label: "System",
                    swatch: (
                      <div className="w-12 h-8 rounded-md border border-slate-200 dark:border-white/[0.10] overflow-hidden flex">
                        <div className="w-1/2 bg-white flex items-center justify-end pr-1">
                          <div className="w-2 h-2 rounded-full bg-slate-200" />
                        </div>
                        <div className="w-1/2 bg-[#0E1515] flex items-center justify-end pr-1">
                          <div className="w-2 h-2 rounded-full bg-white/[0.10]" />
                        </div>
                      </div>
                    ),
                  },
                ]
              ).map((opt) => {
                const active = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    aria-pressed={active}
                    className={`relative flex flex-col items-center gap-2 px-4 py-4 rounded-xl border transition-all ${
                      active
                        ? "border-teal-400 dark:border-teal-500/40 bg-teal-50/60 dark:bg-teal-500/[0.06] ring-2 ring-teal-500/15 dark:ring-teal-500/20"
                        : "border-slate-200 bg-slate-50/60 dark:bg-white/[0.02] hover:border-slate-300 dark:border-white/[0.06] dark:hover:border-white/[0.10]"
                    }`}
                  >
                    {opt.swatch}
                    <span
                      className={`text-xs font-semibold ${
                        active
                          ? "text-teal-700 dark:text-teal-200"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {opt.label}
                    </span>
                    {active && (
                      <span className="absolute top-2 right-2">
                        <Icons.CheckCircle className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          4. ACCOUNT
          ══════════════════════════════════════ */}
      <div>
        <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-neutral-200 dark:border-white/[0.06] overflow-hidden">
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-white/[0.04] flex items-center justify-center">
                <Icons.User className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400">
                Account
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/10 ring-1 ring-inset ring-teal-200 dark:ring-teal-500/25 flex items-center justify-center flex-shrink-0">
                <span className="text-base font-bold text-teal-700 dark:text-teal-200">
                  {formData.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {formData.name}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5 truncate">
                  {formData.email}
                </p>
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 bg-neutral-100 dark:bg-white/[0.04] px-2.5 py-1 rounded-full flex-shrink-0">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
