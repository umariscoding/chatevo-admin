"use client";

import React, { useState, useEffect } from "react";
import { Icons } from "@/components/ui";

interface EmbedSectionProps {
  slug: string | null;
  isPublished: boolean;
}

export default function EmbedSection({ slug, isPublished }: EmbedSectionProps) {
  const [copied, setCopied] = useState(false);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // In production, this would be your actual API URL
      // For development, use localhost:8000
      const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      setApiUrl(isDev ? "http://localhost:8000" : `${window.location.protocol}//api.${window.location.hostname.split('.').slice(-2).join('.')}`);
    }
  }, []);

  const embedCode = slug && apiUrl
    ? `<!-- ChatEvo Widget -->
<script
  src="${apiUrl}/embed.js"
  data-company-slug="${slug}"
  data-api-url="${apiUrl}"
  data-position="bottom-right"
  data-primary-color="#6366f1"
  async
></script>`
    : "";

  const handleCopy = async () => {
    if (!embedCode) return;

    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          Embed Widget
        </h2>
        <p className="text-neutral-600">
          Add a floating chat widget to any website
        </p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
        {/* Status Section */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-xl">
              <Icons.Code className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Website Integration
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                Copy the code below and paste it in your website&apos;s{" "}
                <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-xs font-mono">
                  &lt;head&gt;
                </code>{" "}
                tag
              </p>
            </div>
          </div>
        </div>

        {/* Requirements Check */}
        {(!slug || !isPublished) && (
          <div className="bg-warning-50 p-5 rounded-xl border border-warning-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-warning-200 rounded-lg">
                <Icons.AlertCircle className="h-5 w-5 text-warning-700" />
              </div>
              <div>
                <h4 className="font-semibold text-warning-800 mb-2">
                  Requirements Not Met
                </h4>
                <ul className="text-sm text-warning-700 space-y-1">
                  {!slug && (
                    <li className="flex items-center gap-2">
                      <Icons.Close className="h-4 w-4" />
                      Set a company slug in the Profile section
                    </li>
                  )}
                  {!isPublished && (
                    <li className="flex items-center gap-2">
                      <Icons.Close className="h-4 w-4" />
                      Publish your chatbot in the Publishing section
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Embed Code */}
        {slug && isPublished && (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-700">
                  Embed Code
                </label>
                <button
                  onClick={handleCopy}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${copied
                      ? "bg-success-100 text-success-700 border border-success-200"
                      : "bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200"
                    }
                  `}
                >
                  {copied ? (
                    <>
                      <Icons.CheckCheck className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Icons.Copy className="h-4 w-4" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed">
                  <code>{embedCode}</code>
                </pre>
              </div>
            </div>

            {/* Customization Options */}
            <div className="pt-6 border-t border-neutral-200">
              <h4 className="font-semibold text-neutral-900 mb-4">
                Customization Options
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <code className="text-xs font-mono text-primary-600">
                    data-position
                  </code>
                  <p className="text-sm text-neutral-600 mt-1">
                    Widget position:{" "}
                    <span className="font-medium">bottom-right</span> or{" "}
                    <span className="font-medium">bottom-left</span>
                  </p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <code className="text-xs font-mono text-primary-600">
                    data-primary-color
                  </code>
                  <p className="text-sm text-neutral-600 mt-1">
                    Widget color in hex format (e.g.,{" "}
                    <span className="font-medium">#6366f1</span>)
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Info */}
            <div className="bg-primary-50 p-5 rounded-xl border border-primary-200">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-200 rounded-lg">
                  <Icons.Eye className="h-5 w-5 text-primary-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">
                    How It Works
                  </h4>
                  <p className="text-sm text-primary-700">
                    Once installed, visitors will see a floating chat button in
                    the corner of your website. Clicking it opens a beautiful
                    chat modal where they can interact with your AI assistant as
                    guests - no login required.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
