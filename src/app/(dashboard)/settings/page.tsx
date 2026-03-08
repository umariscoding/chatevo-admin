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
import MinimalButton from "@/components/ui/MinimalButton";
import { useSettings } from "@/hooks/useSettings";

type Tab = "profile" | "chatbot";

export default function SettingsPage() {
  const dispatch = useCompanyAppDispatch();
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const { loading, error } = useCompanyAppSelector((state) => state.company);

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { formData, updateField, getChanges, markAsSaved } = useSettings();

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

  const handleVisitPublicChatbot = () => {
    if (formData.slug && typeof window !== "undefined") {
      window.open(`${window.location.origin}/${formData.slug}`, "_blank");
    }
  };

  const handleVisitSubdomain = () => {
    if (typeof window !== "undefined" && formData.slug) {
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : "";
      const protocol = window.location.protocol;
      let url;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        url = `${protocol}//${formData.slug}.localhost${port}`;
      } else {
        const parts = hostname.split(".");
        const base = parts.length >= 2 ? parts.slice(-2).join(".") : hostname;
        url = `${protocol}//${formData.slug}.${base}${port}`;
      }
      window.open(url, "_blank");
    }
  };

  const getSubdomainUrl = () => {
    if (typeof window === "undefined" || !formData.slug) return "";
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : "";
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `${formData.slug}.localhost${port}`;
    }
    const parts = hostname.split(".");
    const base = parts.length >= 2 ? parts.slice(-2).join(".") : hostname;
    return `${formData.slug}.${base}${port}`;
  };

  return (
    <div className="max-w-3xl mx-auto animate-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-4 flex items-center gap-3 bg-error-50 border border-error-200 rounded-lg p-3">
          <Icons.AlertCircle className="h-4 w-4 text-error-500 flex-shrink-0" />
          <p className="text-sm text-error-700 flex-1">
            {typeof error === "string" ? error : "Something went wrong."}
          </p>
          <button
            onClick={() => dispatch(clearError())}
            className="text-error-400 hover:text-error-600"
          >
            <Icons.Close className="h-4 w-4" />
          </button>
        </div>
      )}

      {saveSuccess && (
        <div className="mb-4 flex items-center gap-3 bg-accent-50 border border-accent-200 rounded-lg p-3">
          <Icons.CheckCircle className="h-4 w-4 text-accent-600 flex-shrink-0" />
          <p className="text-sm text-accent-700">Settings saved</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            activeTab === "profile"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("chatbot")}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
            activeTab === "chatbot"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Chatbot
        </button>
      </div>

      {/* Content */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-lg border border-neutral-200 divide-y divide-neutral-100">
          <div className="p-5">
            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Company Name
            </label>
            <p className="mt-1 text-sm font-medium text-neutral-900">
              {formData.name}
            </p>
          </div>
          <div className="p-5">
            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Email
            </label>
            <p className="mt-1 text-sm font-medium text-neutral-900">
              {formData.email}
            </p>
          </div>
        </div>
      )}

      {activeTab === "chatbot" && (
        <div className="space-y-5">
          {/* Chatbot Info */}
          <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-5">
            <div>
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Title
              </label>
              <input
                type="text"
                value={formData.chatbotTitle}
                onChange={(e) => updateField("chatbotTitle", e.target.value)}
                placeholder="Customer Support Assistant"
                className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Description
              </label>
              <textarea
                value={formData.chatbotDescription}
                onChange={(e) =>
                  updateField("chatbotDescription", e.target.value)
                }
                placeholder="Brief description of what your chatbot can help with..."
                rows={3}
                className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="my-company"
                className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
              />
              <p className="text-xs text-neutral-400 mt-1.5">
                Lowercase letters, numbers, and hyphens only
              </p>
              {formData.slug && (
                <div className="mt-2 flex items-center gap-2 bg-neutral-50 px-3 py-2 rounded-md">
                  <Icons.Globe className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="text-xs text-neutral-500 font-mono">
                    yoursite.com/
                    <span className="text-primary-600 font-medium">
                      {formData.slug}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Publishing */}
          <div className="bg-white rounded-lg border border-neutral-200 divide-y divide-neutral-100">
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {formData.isPublished ? "Live" : "Not published"}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {formData.isPublished
                    ? "Your chatbot is publicly accessible"
                    : "Toggle to make your chatbot public"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {formData.isPublished && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-accent-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                    Live
                  </span>
                )}
                <Toggle
                  checked={formData.isPublished}
                  onChange={(checked) => updateField("isPublished", checked)}
                  disabled={!formData.slug}
                  variant="success"
                  size="md"
                  label=""
                  description=""
                />
              </div>
            </div>

            {!formData.slug && (
              <div className="p-5">
                <div className="flex items-start gap-2.5 bg-warning-50 border border-warning-200 rounded-lg p-3">
                  <Icons.AlertCircle className="h-4 w-4 text-warning-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-warning-700">
                    Set a slug above before publishing
                  </p>
                </div>
              </div>
            )}

            {formData.slug && formData.isPublished && (
              <div className="p-5 space-y-2.5">
                <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Public URLs
                </p>
                <button
                  onClick={handleVisitPublicChatbot}
                  className="w-full flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 px-3.5 py-2.5 rounded-lg border border-neutral-200 group transition-colors text-left"
                >
                  <div>
                    <p className="text-xs text-neutral-400">Path</p>
                    <p className="text-sm font-mono text-neutral-700 mt-0.5">
                      {typeof window !== "undefined"
                        ? window.location.origin
                        : "https://yoursite.com"}
                      /<span className="text-primary-600">{formData.slug}</span>
                    </p>
                  </div>
                  <Icons.Eye className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                </button>
                <button
                  onClick={handleVisitSubdomain}
                  className="w-full flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 px-3.5 py-2.5 rounded-lg border border-neutral-200 group transition-colors text-left"
                >
                  <div>
                    <p className="text-xs text-neutral-400">Subdomain</p>
                    <p className="text-sm font-mono text-neutral-700 mt-0.5">
                      {getSubdomainUrl()}
                    </p>
                  </div>
                  <Icons.Eye className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Bar */}
      {changes.hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg z-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full" />
                <p className="text-sm font-medium text-neutral-700">
                  Unsaved changes
                </p>
              </div>
              <div className="flex items-center gap-2">
                <MinimalButton
                  onClick={() => window.location.reload()}
                  variant="ghost"
                  size="sm"
                  disabled={loading}
                >
                  Discard
                </MinimalButton>
                <MinimalButton
                  onClick={handleSave}
                  variant="primary"
                  size="sm"
                  loading={loading}
                >
                  Save
                </MinimalButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
