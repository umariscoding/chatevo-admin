import { useState, useEffect, useCallback } from "react";
import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import type { SettingsFormData, SettingsChanges } from "@/types/settings";

export function useSettings() {
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const company = companyAuth.company;

  const [formData, setFormData] = useState<SettingsFormData>({
    name: company?.name || "",
    email: company?.email || "",
    slug: company?.slug || "",
    chatbotTitle: company?.chatbot_title || company?.name || "",
    chatbotDescription:
      company?.chatbot_description || "Get help with our services and products",
    defaultModel: company?.default_model || "Llama-instant",
    systemPrompt: company?.system_prompt || "",
    tone: company?.tone || "professional",
    isPublished: company?.is_published || false,
  });

  const [initialData, setInitialData] = useState<SettingsFormData>(formData);

  // Sync with Redux state
  useEffect(() => {
    if (company) {
      const newData: SettingsFormData = {
        name: company.name || "",
        email: company.email || "",
        slug: company.slug || "",
        chatbotTitle: company.chatbot_title || company.name || "",
        chatbotDescription:
          company.chatbot_description ||
          "Get help with our services and products",
        defaultModel: company.default_model || "Llama-instant",
        systemPrompt: company.system_prompt || "",
        tone: company.tone || "professional",
        isPublished: company.is_published || false,
      };
      setFormData(newData);
      setInitialData(newData);
    }
  }, [company]);

  const updateField = useCallback(
    <K extends keyof SettingsFormData>(
      field: K,
      value: SettingsFormData[K],
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const getChanges = useCallback((): SettingsChanges => {
    const changedFields = new Set<keyof SettingsFormData>();

    (Object.keys(formData) as Array<keyof SettingsFormData>).forEach((key) => {
      if (formData[key] !== initialData[key]) {
        changedFields.add(key);
      }
    });

    return {
      hasChanges: changedFields.size > 0,
      changedFields,
    };
  }, [formData, initialData]);

  const resetChanges = useCallback(() => {
    setFormData(initialData);
  }, [initialData]);

  const markAsSaved = useCallback(() => {
    setInitialData(formData);
  }, [formData]);

  return {
    formData,
    updateField,
    getChanges,
    resetChanges,
    markAsSaved,
  };
}
