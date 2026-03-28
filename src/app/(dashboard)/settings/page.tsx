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
import { useSettings } from "@/hooks/useSettings";

export default function SettingsPage() {
  const dispatch = useCompanyAppDispatch();
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const { loading, error } = useCompanyAppSelector((state) => state.company);

  const [saveSuccess, setSaveSuccess] = useState(false);

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
      if (changes.changedFields.has("enableUserPortal")) {
        updateData.enable_user_portal = formData.enableUserPortal;
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
        <Icons.Settings className="h-10 w-10 text-neutral-300 mb-4" />
        <h3 className="text-base font-semibold text-neutral-900 mb-1">
          Access Restricted
        </h3>
        <p className="text-sm text-neutral-500">
          Only company administrators can access settings.
        </p>
      </div>
    );
  }

  const changes = getChanges();

  const CHAT_DOMAIN = "chatevo.vercel.app";
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");
  const chatBaseUrl = isLocalhost
    ? "http://localhost:5173"
    : `https://${CHAT_DOMAIN}`;

  const handleVisitPublicChatbot = () => {
    if (formData.slug) {
      window.open(`${chatBaseUrl}/${formData.slug}`, "_blank");
    }
  };

  const handleVisitSubdomain = () => {
    if (formData.slug) {
      const url = isLocalhost
        ? `http://${formData.slug}.localhost:5173`
        : `https://${formData.slug}.${CHAT_DOMAIN}`;
      window.open(url, "_blank");
    }
  };

  const getSubdomainUrl = () => {
    if (!formData.slug) return "";
    return isLocalhost
      ? `${formData.slug}.localhost:5173`
      : `${formData.slug}.${CHAT_DOMAIN}`;
  };

  return (
    <div className="max-w-2xl mx-auto pb-16">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6 pt-1">
        <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">
          Settings
        </h1>

        {changes.hasChanges && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => resetChanges()}
              disabled={loading}
              className="px-3.5 py-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-all disabled:opacity-40"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-1.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-all disabled:opacity-40 flex items-center gap-2 min-w-[68px] justify-center"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        <div className="mb-4 flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl px-4 py-3">
          <Icons.CheckCircle className="h-4 w-4 text-primary-500 flex-shrink-0" />
          <p className="text-sm text-primary-700 font-medium">Settings saved</p>
        </div>
      )}

      {/* ══════════════════════════════════════
          1. PUBLISHING
          ══════════════════════════════════════ */}
      <div className="mb-4">
        <div
          className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
            formData.isPublished
              ? "border-primary-200 bg-gradient-to-br from-primary-50 to-white"
              : "border-neutral-200 bg-white"
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
                    : "bg-neutral-100"
                }`}
              >
                {formData.isPublished && (
                  <div className="absolute inset-0 rounded-xl bg-primary-500 animate-ping opacity-20" />
                )}
                <Icons.Zap
                  className={`h-4 w-4 relative z-10 transition-colors duration-300 ${
                    formData.isPublished ? "text-white" : "text-neutral-400"
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-neutral-900">
                    {formData.isPublished ? "Live" : "Private"}
                  </span>
                  {formData.isPublished && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary-100 text-primary-700 text-[10px] font-semibold uppercase tracking-wider">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-600" />
                      </span>
                      Online
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {formData.isPublished
                    ? "Your chatbot is publicly accessible"
                    : "Toggle to make your chatbot public"}
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

          {/* User Portal toggle — only visible when published */}
          {formData.isPublished && (
            <div className="px-5 pb-4">
              <div className="border border-neutral-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icons.User className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-neutral-700">
                      User Portal
                    </span>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {formData.enableUserPortal
                        ? "Standalone chat page with login, history & accounts"
                        : "Users can only interact through the embed widget on your website"}
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={formData.enableUserPortal}
                  onChange={(checked) => updateField("enableUserPortal", checked)}
                  size="md"
                />
              </div>
            </div>
          )}

          {/* Public URLs — only when published AND user portal is on */}
          {formData.slug && formData.isPublished && formData.enableUserPortal && (
            <div className="px-5 pb-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleVisitPublicChatbot}
                  className="flex items-center justify-between bg-white hover:bg-primary-50 border border-primary-100 hover:border-primary-200 px-3.5 py-3 rounded-xl group transition-all text-left"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Path
                    </p>
                    <p className="text-xs font-mono text-primary-600 font-semibold mt-0.5 truncate max-w-[120px]">
                      /{formData.slug}
                    </p>
                  </div>
                  <Icons.ExternalLink className="h-3.5 w-3.5 text-neutral-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                </button>
                <button
                  onClick={handleVisitSubdomain}
                  className="flex items-center justify-between bg-white hover:bg-primary-50 border border-primary-100 hover:border-primary-200 px-3.5 py-3 rounded-xl group transition-all text-left"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Subdomain
                    </p>
                    <p className="text-xs font-mono text-primary-600 font-semibold mt-0.5 truncate max-w-[120px]">
                      {formData.slug}.
                    </p>
                  </div>
                  <Icons.ExternalLink className="h-3.5 w-3.5 text-neutral-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          2. CHATBOT
          ══════════════════════════════════════ */}
      <div className="mb-4">
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {/* Section label */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center">
                <Icons.Bot className="h-3.5 w-3.5 text-neutral-500" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Chatbot
              </span>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-neutral-600 mb-2 block">
                Display Title
              </label>
              <input
                type="text"
                value={formData.chatbotTitle}
                onChange={(e) => updateField("chatbotTitle", e.target.value)}
                placeholder="Customer Support Assistant"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder-neutral-400 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-2 block">
                URL Slug
              </label>
              <div className="flex items-stretch rounded-xl border border-neutral-200 bg-neutral-50 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:bg-white transition-all overflow-hidden">
                <span className="inline-flex items-center px-3.5 border-r border-neutral-200 text-xs text-neutral-400 font-mono bg-neutral-100 select-none whitespace-nowrap">
                  chatevo.vercel.app/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="my-company"
                  className="flex-1 bg-transparent text-neutral-900 placeholder-neutral-400 px-3.5 py-2.5 text-sm font-mono focus:outline-none"
                />
              </div>
              <p className="text-xs text-neutral-400 mt-1.5">
                Lowercase letters, numbers, hyphens · 3–50 chars
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          3. ACCOUNT
          ══════════════════════════════════════ */}
      <div>
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center">
                <Icons.User className="h-3.5 w-3.5 text-neutral-500" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
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
                <p className="text-sm font-bold text-neutral-900 truncate">
                  {formData.name}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5 truncate">
                  {formData.email}
                </p>
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-lg flex-shrink-0">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
