"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCompanyAppSelector,
  useCompanyAppDispatch,
} from "@/hooks/company/useCompanyAuth";
import {
  batchUpdateSettings,
  clearError,
} from "@/store/company/slices/companySlice";
import { updateCompanyInfo } from "@/store/company/slices/companyAuthSlice";
import { Icons, IOSContentLoader } from "@/components/ui";
import MinimalButton from "@/components/ui/MinimalButton";
import SettingsSidebar, {
  SettingsSection,
} from "@/components/settings/SettingsSidebar";
import ProfileSection from "@/components/settings/ProfileSection";
import ChatbotSection from "@/components/settings/ChatbotSection";
import PublishingSection from "@/components/settings/PublishingSection";
import { useSettings } from "@/hooks/useSettings";

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useCompanyAppDispatch();
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const { loading, error } = useCompanyAppSelector((state) => state.company);

  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");
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

      // Update auth slice with new data
      if (companyAuth.company) {
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Icons.Settings className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            Access Restricted
          </h3>
          <p className="text-neutral-600">
            Only company administrators can access settings.
          </p>
        </div>
      </div>
    );
  }

  const changes = getChanges();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Settings</h1>
        <p className="text-neutral-600">
          Manage your company profile, chatbot, and publishing settings
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-error-50 border-l-4 border-error-500 rounded-r-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icons.AlertCircle className="h-5 w-5 text-error-500 mr-3" />
              <p className="text-sm text-error-700 font-medium">
                {typeof error === "string"
                  ? error
                  : "An error occurred. Please try again."}
              </p>
            </div>
            <button
              onClick={() => dispatch(clearError())}
              className="text-error-400 hover:text-error-600 transition-colors"
            >
              <Icons.Close className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6 bg-success-50 border-l-4 border-success-500 rounded-r-lg p-4">
          <div className="flex items-center">
            <Icons.CheckCircle className="h-5 w-5 text-success-500 mr-3" />
            <p className="text-sm text-success-700 font-medium">
              Settings saved successfully
            </p>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-neutral-200 p-4 sticky top-4">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {activeSection === "profile" && (
              <ProfileSection
                name={formData.name}
                email={formData.email}
                slug={formData.slug}
                onSlugChange={(value) => updateField("slug", value)}
              />
            )}

            {activeSection === "chatbot" && (
              <ChatbotSection
                chatbotTitle={formData.chatbotTitle}
                chatbotDescription={formData.chatbotDescription}
                onTitleChange={(value) => updateField("chatbotTitle", value)}
                onDescriptionChange={(value) =>
                  updateField("chatbotDescription", value)
                }
              />
            )}

            {activeSection === "publishing" && (
              <PublishingSection
                isPublished={formData.isPublished}
                slug={formData.slug || null}
                onPublishToggle={(checked) =>
                  updateField("isPublished", checked)
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Sticky Save Bar */}
      {changes.hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <p className="text-sm font-medium text-neutral-900">
                  You have unsaved changes
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <MinimalButton
                  onClick={() => window.location.reload()}
                  variant="secondary"
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
                  Save Changes
                </MinimalButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
