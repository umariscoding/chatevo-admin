"use client";

import React from "react";

interface ChatbotSectionProps {
  chatbotTitle: string;
  chatbotDescription: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function ChatbotSection({
  chatbotTitle,
  chatbotDescription,
  onTitleChange,
  onDescriptionChange,
}: ChatbotSectionProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">
          Chatbot Configuration
        </h2>
        <p className="text-sm text-neutral-500 mt-0.5">
          How your chatbot appears to users
        </p>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-5 space-y-5">
        <div>
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Chatbot Title
          </label>
          <input
            type="text"
            value={chatbotTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Customer Support Assistant"
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Description
          </label>
          <textarea
            value={chatbotDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Brief description of what your chatbot can help with..."
            rows={4}
            className="mt-2 w-full rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none transition-all"
          />
        </div>

        {/* Preview hint */}
        {(chatbotTitle || chatbotDescription) && (
          <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100">
            <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium mb-2">
              Preview
            </p>
            <p className="text-sm font-semibold text-neutral-900">
              {chatbotTitle || "Untitled Chatbot"}
            </p>
            {chatbotDescription && (
              <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                {chatbotDescription}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
