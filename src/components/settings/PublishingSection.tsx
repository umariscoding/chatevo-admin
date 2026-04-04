"use client";

import React, { useState, useEffect } from "react";
import { Icons, Toggle } from "@/components/ui";

interface PublishingSectionProps {
  isPublished: boolean;
  slug: string | null;
  onPublishToggle: (checked: boolean) => void;
}

export default function PublishingSection({
  isPublished,
  slug,
  onPublishToggle,
}: PublishingSectionProps) {
  const CHAT_DOMAIN = "botbeetle.vercel.app";
  const [chatBaseUrl, setChatBaseUrl] = useState(`https://${CHAT_DOMAIN}`);

  useEffect(() => {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (isLocalhost) setChatBaseUrl("http://localhost:3001");
  }, []);

  const handleVisitPublicChatbot = () => {
    if (slug) {
      window.open(`${chatBaseUrl}/${slug}`, "_blank");
    }
  };

  const handleVisitSubdomain = () => {
    if (slug) {
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const subdomainUrl = isLocalhost
        ? `http://${slug}.localhost:3001`
        : `https://${slug}.${CHAT_DOMAIN}`;
      window.open(subdomainUrl, "_blank");
    }
  };

  const getSubdomainUrl = () => {
    if (!slug) return "Loading...";
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");
    return isLocalhost
      ? `${slug}.localhost:3001`
      : `${slug}.${CHAT_DOMAIN}`;
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Publishing</h2>
        <p className="text-sm text-neutral-500 mt-0.5">
          Control public access to your chatbot
        </p>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 divide-y divide-neutral-100">
        {/* Toggle */}
        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-900">
              {isPublished ? "Live" : "Private"}
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isPublished ? "Your chatbot is publicly accessible" : "Not accessible to visitors"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isPublished && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-accent-600">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                Live
              </span>
            )}
            <Toggle
              checked={isPublished}
              onChange={onPublishToggle}
              disabled={!slug}
              variant="success"
              size="md"
              label=""
              description=""
            />
          </div>
        </div>

        {/* Warnings / URLs */}
        <div className="p-5">
          {!slug && (
            <div className="flex items-start gap-2.5 bg-warning-50 border border-warning-200 rounded-lg p-3.5">
              <Icons.AlertCircle className="h-4 w-4 text-warning-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning-800">
                  Slug required
                </p>
                <p className="text-xs text-warning-600 mt-0.5">
                  Set a company slug in the Profile section before publishing
                </p>
              </div>
            </div>
          )}

          {slug && isPublished && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Public URLs
              </p>

              <button
                onClick={handleVisitPublicChatbot}
                className="w-full flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 px-3.5 py-2.5 rounded-lg border border-neutral-200 group transition-colors text-left"
              >
                <div>
                  <p className="text-xs text-neutral-400">Path URL</p>
                  <p className="text-sm font-mono text-neutral-700 mt-0.5">
                    {chatBaseUrl}/<span className="text-primary-600">{slug}</span>
                  </p>
                </div>
                <Icons.Eye className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
              </button>

              <button
                onClick={handleVisitSubdomain}
                className="w-full flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 px-3.5 py-2.5 rounded-lg border border-neutral-200 group transition-colors text-left"
              >
                <div>
                  <p className="text-xs text-neutral-400">Subdomain URL</p>
                  <p className="text-sm font-mono text-neutral-700 mt-0.5">
                    {getSubdomainUrl()}
                  </p>
                </div>
                <Icons.Eye className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
              </button>
            </div>
          )}

          {slug && !isPublished && (
            <div className="flex items-center gap-2.5 text-neutral-500">
              <Icons.Eye className="h-4 w-4" />
              <p className="text-sm">
                Toggle the switch to make your chatbot public
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
