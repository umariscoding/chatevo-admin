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
        <Icons.Settings className="h-10 w-10 text-neutral-300 dark:text-neutral-600 mb-4" />
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
          Access Restricted
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Only company administrators can access settings.
        </p>
      </div>
    );
  }

  const changes = getChanges();

  return (
    <div className="max-w-2xl mx-auto pb-16">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6 pt-1">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Settings
        </h1>

        {changes.hasChanges && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => resetChanges()}
              disabled={loading}
              className="px-3.5 py-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all disabled:opacity-40"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-1.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-all disabled:opacity-40 flex items-center gap-2 min-w-[68px] justify-center"
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
        <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Icons.AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 flex-1">
            {typeof error === "string" ? error : "Something went wrong."}
          </p>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <Icons.Close className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {saveSuccess && (
        <div className="mb-4 flex items-center gap-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-900/40 rounded-xl px-4 py-3">
          <Icons.CheckCircle className="h-4 w-4 text-primary-500 flex-shrink-0" />
          <p className="text-sm text-primary-700 dark:text-primary-300 font-medium">Settings saved</p>
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
              ? "border-primary-200 dark:border-primary-900/40 bg-gradient-to-br from-primary-50 to-white"
              : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
          }`}
        >
          {formData.isPublished && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400" />
          )}

          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Status icon */}
              <div
                className={`relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                  formData.isPublished
                    ? "bg-primary-600 shadow-lg shadow-primary-600/25"
                    : "bg-neutral-100 dark:bg-neutral-800"
                }`}
              >
                {formData.isPublished && (
                  <div className="absolute inset-0 rounded-xl bg-primary-500 animate-ping opacity-20" />
                )}
                <Icons.Zap
                  className={`h-4 w-4 relative z-10 transition-colors duration-300 ${
                    formData.isPublished ? "text-white" : "text-neutral-400 dark:text-neutral-500"
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                    {formData.isPublished ? "Live" : "Private"}
                  </span>
                  {formData.isPublished && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:text-primary-300 text-[10px] font-semibold uppercase tracking-wider">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-600" />
                      </span>
                      Online
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
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
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-2.5">
                <Icons.AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                <p className="text-xs text-amber-700">
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
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {/* Section label */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Icons.Bot className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                Chatbot
              </span>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 block">
                Display Title
              </label>
              <input
                type="text"
                value={formData.chatbotTitle}
                onChange={(e) => updateField("chatbotTitle", e.target.value)}
                placeholder="Customer Support Assistant"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white dark:focus:bg-neutral-900 transition-all"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 block">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="my-company"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white dark:focus:bg-neutral-900 transition-all"
              />
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1.5">
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
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Icons.Settings className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                Appearance
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`relative flex flex-col items-center gap-2 px-4 py-4 rounded-xl border transition-all ${
                  theme === "light"
                    ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500/20"
                    : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                <div className="w-12 h-8 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-end pr-1.5">
                  <div className="w-3 h-3 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <span className={`text-xs font-semibold ${theme === "light" ? "text-primary-700 dark:text-primary-300" : "text-neutral-600 dark:text-neutral-400"}`}>
                  Light
                </span>
                {theme === "light" && (
                  <span className="absolute top-2 right-2">
                    <Icons.CheckCircle className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                  </span>
                )}
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`relative flex flex-col items-center gap-2 px-4 py-4 rounded-xl border transition-all ${
                  theme === "dark"
                    ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500/20"
                    : "border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                <div className="w-12 h-8 rounded-md bg-neutral-900 border border-neutral-700 flex items-center justify-end pr-1.5">
                  <div className="w-3 h-3 rounded-full bg-neutral-700" />
                </div>
                <span className={`text-xs font-semibold ${theme === "dark" ? "text-primary-700 dark:text-primary-300" : "text-neutral-600 dark:text-neutral-400"}`}>
                  Dark
                </span>
                {theme === "dark" && (
                  <span className="absolute top-2 right-2">
                    <Icons.CheckCircle className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          4. ACCOUNT
          ══════════════════════════════════════ */}
      <div>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Icons.User className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                Account
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-primary-500/20">
                <span className="text-base font-bold text-white">
                  {formData.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50 truncate">
                  {formData.name}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 truncate">
                  {formData.email}
                </p>
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full flex-shrink-0">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
