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

type Tab = "profile" | "chatbot";

export default function SettingsPage() {
  const dispatch = useCompanyAppDispatch();
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const { loading, error } = useCompanyAppSelector((state) => state.company);

  const [activeTab, setActiveTab] = useState<Tab>("profile");
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
      if (changes.changedFields.has("chatbotDescription")) {
        updateData.chatbot_description = formData.chatbotDescription;
      }
      if (changes.changedFields.has("isPublished")) {
        updateData.is_published = formData.isPublished;
      }
      if (changes.changedFields.has("defaultModel")) {
        updateData.default_model = formData.defaultModel;
      }
      if (changes.changedFields.has("systemPrompt")) {
        updateData.system_prompt = formData.systemPrompt;
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

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "profile",
      label: "Profile",
      icon: <Icons.User className="h-4 w-4" />,
    },
    {
      id: "chatbot",
      label: "Chatbot",
      icon: <Icons.Bot className="h-4 w-4" />,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage your chatbot configuration and preferences
          </p>
        </div>
        {changes.hasChanges && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => resetChanges()}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-700 border border-neutral-200 rounded-lg transition-all disabled:opacity-50 hover:bg-neutral-50"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 min-w-[80px] justify-center"
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

      {/* Notifications */}
      {error && (
        <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
            <Icons.AlertCircle className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-sm text-red-700 flex-1">
            {typeof error === "string" ? error : "Something went wrong."}
          </p>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-100"
          >
            <Icons.Close className="h-4 w-4" />
          </button>
        </div>
      )}

      {saveSuccess && (
        <div className="mb-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Icons.CheckCircle className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-sm text-emerald-700 font-medium">
            Settings saved successfully
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center border border-neutral-200 bg-white rounded-xl p-1 gap-0.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 text-[13px] font-medium rounded-[10px] transition-all duration-200 ${
                  isActive
                    ? "bg-primary-600 text-white shadow-sm shadow-primary-600/25"
                    : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* === PROFILE TAB === */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100">
            <h2 className="text-sm font-semibold text-neutral-900">
              Company Information
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Your account details
            </p>
          </div>
          <div className="divide-y divide-neutral-100">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Company Name
                </label>
                <p className="mt-1 text-sm font-medium text-neutral-900">
                  {formData.name}
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                <span className="text-xs font-bold text-primary-600">
                  {formData.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="px-6 py-4">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Email
              </label>
              <p className="mt-1 text-sm font-medium text-neutral-900">
                {formData.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* === CHATBOT TAB === */}
      {activeTab === "chatbot" && (
        <div className="space-y-6">
          {/* Chatbot Info Card */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100">
              <h2 className="text-sm font-semibold text-neutral-900">
                Chatbot Identity
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                How your chatbot appears to visitors
              </p>
            </div>
            <div className="px-6 py-5 space-y-5">
              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1.5 block">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.chatbotTitle}
                  onChange={(e) => updateField("chatbotTitle", e.target.value)}
                  placeholder="Customer Support Assistant"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 text-neutral-900 placeholder-neutral-400 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-500 mb-1.5 block">
                  Description
                </label>
                <textarea
                  value={formData.chatbotDescription}
                  onChange={(e) =>
                    updateField("chatbotDescription", e.target.value)
                  }
                  placeholder="Brief description of what your chatbot can help with..."
                  rows={3}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 text-neutral-900 placeholder-neutral-400 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white resize-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Slug Card */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100">
              <h2 className="text-sm font-semibold text-neutral-900">
                Public URL
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Your chatbot&apos;s unique address
              </p>
            </div>
            <div className="px-6 py-5">
              <label className="text-xs font-medium text-neutral-500 mb-1.5 block">
                Slug
              </label>
              <div className="flex items-center gap-0">
                <span className="inline-flex items-center px-3.5 py-2.5 rounded-l-lg border border-r-0 border-neutral-200 bg-neutral-100 text-xs text-neutral-500 font-mono">
                  yoursite.com/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="my-company"
                  className="flex-1 rounded-r-lg border border-neutral-200 bg-neutral-50/50 text-neutral-900 placeholder-neutral-400 px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all"
                />
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Lowercase letters, numbers, and hyphens only (3-50 characters)
              </p>
            </div>
          </div>

          {/* Publishing Card */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100">
              <h2 className="text-sm font-semibold text-neutral-900">
                Publishing
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Control your chatbot&apos;s visibility
              </p>
            </div>

            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-[10px] flex items-center justify-center transition-all duration-300 ${
                    formData.isPublished
                      ? "bg-emerald-500/10 shadow-sm shadow-emerald-500/10"
                      : "bg-neutral-100"
                  }`}
                >
                  <Icons.Globe
                    className={`h-4 w-4 transition-colors duration-300 ${
                      formData.isPublished
                        ? "text-emerald-600"
                        : "text-neutral-400"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-neutral-900">
                      {formData.isPublished ? "Live" : "Not published"}
                    </p>
                    {formData.isPublished && (
                      <span className="flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
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

            {!formData.slug && (
              <div className="px-6 pb-4">
                <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <Icons.AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700">
                    Set a slug above before publishing
                  </p>
                </div>
              </div>
            )}

            {formData.slug && formData.isPublished && (
              <div className="px-6 pb-5 pt-1 space-y-2">
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
                  Public URLs
                </p>
                <button
                  onClick={handleVisitPublicChatbot}
                  className="w-full flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 px-4 py-3 rounded-lg border border-neutral-200 group transition-all text-left"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                      Path
                    </p>
                    <p className="text-sm font-mono text-neutral-700 mt-0.5">
                      {chatBaseUrl}/
                      <span className="text-primary-600 font-semibold">
                        {formData.slug}
                      </span>
                    </p>
                  </div>
                  <Icons.ExternalLink className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                </button>
                <button
                  onClick={handleVisitSubdomain}
                  className="w-full flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 px-4 py-3 rounded-lg border border-neutral-200 group transition-all text-left"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                      Subdomain
                    </p>
                    <p className="text-sm font-mono text-neutral-700 mt-0.5">
                      {getSubdomainUrl()}
                    </p>
                  </div>
                  <Icons.ExternalLink className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}
