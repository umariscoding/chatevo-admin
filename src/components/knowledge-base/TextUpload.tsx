"use client";

import React, { useState } from "react";

import Button from "@/components/ui/Button";
import MinimalInput from "@/components/ui/MinimalInput";
import { Icons } from "@/components/ui";
import type { TextUploadProps } from "@/interfaces/KnowledgeBase.interface";

const TextUpload: React.FC<TextUploadProps> = ({
  onUpload,
  loading = false,
  className = "",
}) => {
  const [filename, setFilename] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<{ filename?: string; content?: string }>(
    {},
  );

  const validateForm = (): boolean => {
    const newErrors: { filename?: string; content?: string } = {};

    if (!filename.trim()) {
      newErrors.filename = "Filename is required";
    } else if (!filename.endsWith(".txt") && !filename.includes(".")) {
      // Auto-add .txt extension if no extension provided
      setFilename((prev) => prev + ".txt");
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    } else if (content.trim().length < 10) {
      newErrors.content = "Content must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onUpload(content.trim(), filename.trim());
      // Reset form after successful upload
      setFilename("");
      setContent("");
      setErrors({});
    }
  };

  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(e.target.value);
    if (errors.filename) {
      setErrors((prev) => ({ ...prev, filename: undefined }));
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: undefined }));
    }
  };

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  const charCount = content.length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Filename Input */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-900">
            Filename <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={filename}
              onChange={handleFilenameChange}
              placeholder="e.g., company-policy.txt"
              required
              disabled={loading}
              className={`w-full rounded-xl border px-4 py-3 text-sm bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                errors.filename
                  ? "border-red-500/60 focus:ring-red-500"
                  : "border-slate-200/80 hover:border-slate-300"
              }`}
            />
          </div>
          {errors.filename && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1">
              <Icons.AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              {errors.filename}
            </p>
          )}
          <p className="text-xs text-slate-600 font-medium">
            Give your content a descriptive name with .txt extension
          </p>
        </div>

        {/* Content Textarea */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-900">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Paste or type your content here..."
            rows={8}
            className={`w-full rounded-xl border px-4 py-3 text-sm bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none ${
              errors.content
                ? "border-red-500/60 focus:ring-red-500"
                : "border-slate-200/80 hover:border-slate-300"
            }`}
            disabled={loading}
            required
          />
          {errors.content && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1">
              <Icons.AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              {errors.content}
            </p>
          )}

          {/* Character and Word Count */}
          <div className="flex justify-between items-center pt-2 px-1">
            <div className="flex gap-4 text-xs font-semibold text-slate-600">
              <span className="bg-slate-100/50 px-3 py-1 rounded-lg">{wordCount} words</span>
              <span className="bg-slate-100/50 px-3 py-1 rounded-lg">{charCount} chars</span>
            </div>
            {content.length > 0 && (
              <div className="text-xs text-slate-500">
                {content.trim().length > 0 ? "✓ Ready" : "Content needed"}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-3 border-t border-slate-200/40">
          <Button
            type="submit"
            loading={loading}
            disabled={!filename.trim() || !content.trim() || loading}
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-lg hover:shadow-primary-500/30"
          >
            Upload Content
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TextUpload;
