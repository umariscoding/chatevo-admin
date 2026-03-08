"use client";

import React from "react";
import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import { useEmbedSettings } from "@/hooks/useEmbedSettings";
import { Icons, IOSContentLoader } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
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
    <div className="max-w-7xl mx-auto animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">
            Embed Widget
          </h1>
          <p className="text-sm text-neutral-500">
            Add a chat widget to any website with one line of code
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
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Icons.AlertCircle className="h-4 w-4 text-warning-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning-800 mb-1.5">
                Setup Required
              </p>
              <ul className="text-sm text-warning-700 space-y-1">
                {!slug && (
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-warning-500" />
                    Set a company slug in Settings
                  </li>
                )}
                {!isPublished && (
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-warning-500" />
                    Publish your chatbot in Settings
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {slug && isPublished && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings */}
          <div className="space-y-5">
            <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-5">
              <div className="pb-4 border-b border-neutral-100">
                <h3 className="text-sm font-semibold text-neutral-900">
                  Customization
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Settings auto-save. Click refresh to update preview.
                </p>
              </div>

              {/* Theme */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Theme
                </label>
                <div className="flex gap-2">
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
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Position
                </label>
                <div className="flex gap-2">
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

              {/* Color */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Brand Color
                </label>
                <div className="flex items-center gap-2 flex-wrap">
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
                      onChange={(e) =>
                        updateSetting("primaryColor", e.target.value)
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) =>
                        updateSetting("primaryColor", e.target.value)
                      }
                      className="w-20 px-2 py-1.5 text-xs border border-neutral-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                      placeholder="#6366f1"
                    />
                  </div>
                </div>
              </div>

              {/* Welcome Text */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Welcome Message
                </label>
                <input
                  type="text"
                  value={settings.welcomeText}
                  onChange={(e) => updateSetting("welcomeText", e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                  placeholder="Hi there! How can we help?"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={settings.subtitleText}
                  onChange={(e) =>
                    updateSetting("subtitleText", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                  placeholder="We typically reply instantly"
                />
              </div>
            </div>

            {/* Embed Code */}
            <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Embed Code
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Paste in your website&apos;s{" "}
                    <code className="bg-neutral-100 px-1 py-0.5 rounded text-[10px] font-mono">
                      &lt;head&gt;
                    </code>
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  <Icons.Copy className="h-3.5 w-3.5" />
                  Copy
                </button>
              </div>

              <pre className="bg-neutral-900 text-neutral-300 p-4 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed">
                <code>{embedCode}</code>
              </pre>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-4 h-fit">
            <div className="bg-white rounded-lg border border-neutral-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    Live Preview
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Interactive widget preview
                  </p>
                </div>
                <button
                  onClick={refreshPreview}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
                  title="Refresh preview"
                >
                  <Icons.Refresh className="h-4 w-4" />
                </button>
              </div>

              <div
                className="relative rounded-lg overflow-hidden border border-neutral-200"
                style={{ height: "600px" }}
              >
                <iframe
                  key={previewKey}
                  srcDoc={previewHtml}
                  className="w-full h-full border-0"
                  title="Widget Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>

              <p className="text-xs text-neutral-400 mt-3 text-center">
                Click the chat button to interact
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
