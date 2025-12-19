"use client";

import React from "react";
import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import { useEmbedSettings } from "@/hooks/useEmbedSettings";
import { Icons, IOSContentLoader } from "@/components/ui";
import { API_CONFIG } from "@/constants/api";

const COLOR_PRESETS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Violet", value: "#8b5cf6" },
];

export default function EmbedPage() {
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const {
    settings,
    loading,
    saving,
    updateSetting,
    refreshPreview,
    previewKey,
  } = useEmbedSettings();

  const slug = companyAuth.company?.slug;
  const isPublished = companyAuth.company?.is_published;
  const apiUrl = API_CONFIG.BASE_URL;

  // Convert position for embed code (bottom-left/bottom-right format)
  const positionForEmbed =
    settings.position === "left" ? "bottom-left" : "bottom-right";

  const embedCode = slug
    ? `<!-- ChatEvo Widget -->
<script
  src="${apiUrl}/embed.js"
  data-company-slug="${slug}"
  data-api-url="${apiUrl}"
  data-position="${positionForEmbed}"
  data-primary-color="${settings.primaryColor}"
  data-theme="${settings.theme}"
  data-welcome-text="${settings.welcomeText}"
  data-subtitle-text="${settings.subtitleText}"
  async
></script>`
    : "";

  const previewHtml = slug
    ? `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      background: ${settings.theme === "dark" ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
      padding: 20px;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .placeholder {
      background: rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .line {
      height: 8px;
      background: rgba(255,255,255,0.2);
      border-radius: 4px;
      margin-bottom: 8px;
    }
    .line:last-child { margin-bottom: 0; }
    .line.short { width: 60%; }
    .line.medium { width: 80%; }
  </style>
</head>
<body>
  <div class="placeholder">
    <div class="line short"></div>
    <div class="line medium"></div>
  </div>
  <div class="placeholder">
    <div class="line"></div>
    <div class="line medium"></div>
    <div class="line short"></div>
  </div>
  <script
    src="${apiUrl}/embed.js"
    data-company-slug="${slug}"
    data-api-url="${apiUrl}"
    data-position="${positionForEmbed}"
    data-primary-color="${settings.primaryColor}"
    data-theme="${settings.theme}"
    data-welcome-text="${settings.welcomeText}"
    data-subtitle-text="${settings.subtitleText}"
  ></script>
</body>
</html>`
    : "";

  const handleCopy = async () => {
    if (!embedCode) return;
    try {
      await navigator.clipboard.writeText(embedCode);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (companyAuth.loading || loading) {
    return <IOSContentLoader isLoading={true} message="Loading..." />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Embed Widget
            </h1>
            <p className="text-neutral-600">
              Add a floating chat widget to any website with a single line of
              code
            </p>
          </div>
          {saving && (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <div className="w-4 h-4 border-2 border-neutral-300 border-t-primary-600 rounded-full animate-spin" />
              Saving...
            </div>
          )}
        </div>
      </div>

      {/* Requirements Check */}
      {(!slug || !isPublished) && (
        <div className="bg-warning-50 p-5 rounded-xl border border-warning-200 mb-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-warning-200 rounded-lg">
              <Icons.AlertCircle className="h-5 w-5 text-warning-700" />
            </div>
            <div>
              <h4 className="font-semibold text-warning-800 mb-2">
                Setup Required
              </h4>
              <ul className="text-sm text-warning-700 space-y-1">
                {!slug && (
                  <li className="flex items-center gap-2">
                    <Icons.Close className="h-4 w-4" />
                    Set a company slug in Settings &gt; Profile
                  </li>
                )}
                {!isPublished && (
                  <li className="flex items-center gap-2">
                    <Icons.Close className="h-4 w-4" />
                    Publish your chatbot in Settings &gt; Publishing
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {slug && isPublished && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Settings */}
          <div className="space-y-6">
            {/* Customization Options */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-neutral-200">
                <div className="p-2 bg-primary-100 rounded-xl">
                  <Icons.Settings className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Customization
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Settings auto-save. Click refresh to update preview.
                  </p>
                </div>
              </div>

              {/* Theme Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-neutral-700">
                  Theme
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateSetting("theme", "light")}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      settings.theme === "light"
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center">
                        <div className="w-4 h-4 rounded bg-neutral-100" />
                      </div>
                      <p className="font-medium text-neutral-900 text-sm">
                        Light
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => updateSetting("theme", "dark")}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      settings.theme === "dark"
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <div className="w-4 h-4 rounded bg-zinc-700" />
                      </div>
                      <p className="font-medium text-neutral-900 text-sm">
                        Dark
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Position Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-neutral-700">
                  Position
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateSetting("position", "right")}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      settings.position === "right"
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-6 rounded border border-neutral-300 relative bg-white">
                        <div
                          className="w-2 h-2 rounded-sm absolute bottom-0.5 right-0.5"
                          style={{ background: settings.primaryColor }}
                        />
                      </div>
                      <span className="text-sm font-medium text-neutral-700">
                        Right
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => updateSetting("position", "left")}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      settings.position === "left"
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-6 rounded border border-neutral-300 relative bg-white">
                        <div
                          className="w-2 h-2 rounded-sm absolute bottom-0.5 left-0.5"
                          style={{ background: settings.primaryColor }}
                        />
                      </div>
                      <span className="text-sm font-medium text-neutral-700">
                        Left
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-neutral-700">
                  Brand Color
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updateSetting("primaryColor", color.value)}
                      className={`w-9 h-9 rounded-lg transition-all ${
                        settings.primaryColor === color.value
                          ? "ring-2 ring-offset-2 ring-neutral-400 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ background: color.value }}
                      title={color.name}
                    />
                  ))}
                  <div className="flex items-center gap-2 ml-1">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) =>
                        updateSetting("primaryColor", e.target.value)
                      }
                      className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) =>
                        updateSetting("primaryColor", e.target.value)
                      }
                      className="w-20 px-2 py-1.5 text-xs border border-neutral-200 rounded-lg font-mono"
                      placeholder="#6366f1"
                    />
                  </div>
                </div>
              </div>

              {/* Welcome Text */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Welcome Message
                </label>
                <input
                  type="text"
                  value={settings.welcomeText}
                  onChange={(e) => updateSetting("welcomeText", e.target.value)}
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Hi there! How can we help you today?"
                />
              </div>

              {/* Subtitle Text */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Header Subtitle
                </label>
                <input
                  type="text"
                  value={settings.subtitleText}
                  onChange={(e) =>
                    updateSetting("subtitleText", e.target.value)
                  }
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="We typically reply instantly"
                />
              </div>
            </div>

            {/* Embed Code Section */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-neutral-100 rounded-xl">
                    <Icons.Code className="h-5 w-5 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Embed Code
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Paste in your website&apos;s{" "}
                      <code className="bg-neutral-100 px-1 py-0.5 rounded text-xs font-mono">
                        &lt;head&gt;
                      </code>
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-all"
                >
                  <Icons.Copy className="h-4 w-4" />
                  Copy
                </button>
              </div>

              <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed">
                <code>{embedCode}</code>
              </pre>
            </div>
          </div>

          {/* Right Column - Live Preview */}
          <div className="lg:sticky lg:top-4 h-fit">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-xl">
                    <Icons.Eye className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Live Preview
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Interactive widget preview
                    </p>
                  </div>
                </div>
                <button
                  onClick={refreshPreview}
                  className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="Refresh preview"
                >
                  <Icons.Refresh className="h-4 w-4" />
                </button>
              </div>

              {/* Iframe Preview */}
              <div
                className="relative rounded-xl overflow-hidden border border-neutral-200"
                style={{ height: "700px" }}
              >
                <iframe
                  key={previewKey}
                  srcDoc={previewHtml}
                  className="w-full h-full border-0"
                  title="Widget Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>

              <p className="text-xs text-neutral-500 mt-3 text-center">
                Click the chat button to interact with the widget
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
