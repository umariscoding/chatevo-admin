"use client";

import React from "react";
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
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Publishing</h2>
        <p className="text-sm text-neutral-500 mt-0.5">
          Enable your chatbot for embed on your website
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
              {isPublished
                ? "Your chatbot is enabled for embed"
                : "Embed widget will not respond to visitors"}
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

        {/* Warnings */}
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
            <div className="flex items-center gap-2.5 text-neutral-500">
              <Icons.CheckCircle className="h-4 w-4 text-accent-500" />
              <p className="text-sm">
                Install the embed widget on your site to start chatting with visitors
              </p>
            </div>
          )}

          {slug && !isPublished && (
            <div className="flex items-center gap-2.5 text-neutral-500">
              <Icons.Eye className="h-4 w-4" />
              <p className="text-sm">
                Toggle the switch to enable your chatbot
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
