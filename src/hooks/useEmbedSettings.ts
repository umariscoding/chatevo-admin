import { useState, useEffect, useCallback, useRef } from "react";
import { companyApi } from "@/utils/company/api";
import type { EmbedSettings } from "@/types/settings";
import { DEFAULT_EMBED_SETTINGS } from "@/types/settings";

interface UseEmbedSettingsReturn {
  settings: EmbedSettings;
  loading: boolean;
  saving: boolean;
  error: string | null;
  updateSetting: <K extends keyof EmbedSettings>(
    key: K,
    value: EmbedSettings[K]
  ) => void;
  refreshPreview: () => void;
  previewKey: number;
}

export function useEmbedSettings(): UseEmbedSettingsReturn {
  const [settings, setSettings] = useState<EmbedSettings>(DEFAULT_EMBED_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await companyApi.get("/auth/company/embed-settings");
        const data = response.data.settings;
        if (data) {
          setSettings({
            theme: data.theme || DEFAULT_EMBED_SETTINGS.theme,
            position: data.position || DEFAULT_EMBED_SETTINGS.position,
            primaryColor: data.primaryColor || DEFAULT_EMBED_SETTINGS.primaryColor,
            welcomeText: data.welcomeText || DEFAULT_EMBED_SETTINGS.welcomeText,
            subtitleText: data.subtitleText || DEFAULT_EMBED_SETTINGS.subtitleText,
          });
        }
      } catch (err) {
        console.error("Failed to load embed settings:", err);
        setError("Failed to load settings");
      } finally {
        setLoading(false);
        isInitialLoad.current = false;
      }
    };

    loadSettings();
  }, []);

  // Save settings with debounce
  const saveSettings = useCallback(async (newSettings: EmbedSettings) => {
    setSaving(true);
    setError(null);
    try {
      await companyApi.put("/auth/company/embed-settings", {
        theme: newSettings.theme,
        position: newSettings.position,
        primaryColor: newSettings.primaryColor,
        welcomeText: newSettings.welcomeText,
        subtitleText: newSettings.subtitleText,
      });
    } catch (err) {
      console.error("Failed to save embed settings:", err);
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }, []);

  // Update a single setting
  const updateSetting = useCallback(
    <K extends keyof EmbedSettings>(key: K, value: EmbedSettings[K]) => {
      setSettings((prev) => {
        const newSettings = { ...prev, [key]: value };

        // Debounced save
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
          saveSettings(newSettings);
        }, 500);

        return newSettings;
      });
    },
    [saveSettings]
  );

  // Manual preview refresh
  const refreshPreview = useCallback(() => {
    setPreviewKey((k) => k + 1);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    settings,
    loading,
    saving,
    error,
    updateSetting,
    refreshPreview,
    previewKey,
  };
}
