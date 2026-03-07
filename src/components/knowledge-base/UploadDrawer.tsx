"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { Icons } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import FileUpload from "@/components/knowledge-base/FileUpload";
import TextUpload from "@/components/knowledge-base/TextUpload";
import type { UploadModalProps } from "@/interfaces/KnowledgeBase.interface";

type UploadMode = "file" | "text";
type UploadState = "idle" | "uploading" | "success";

const UploadDrawer: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onFileUpload,
  onTextUpload,
  loading = false,
  uploadProgress = 0,
}) => {
  const [uploadMode, setUploadMode] = useState<UploadMode>("file");
  const [uploadState, setUploadState] = useState<UploadState>("idle");

  useEffect(() => {
    if (loading && uploadProgress > 0) {
      setUploadState("uploading");
    } else if (!loading && uploadProgress === 100) {
      setUploadState("success");
    } else {
      setUploadState("idle");
    }
  }, [loading, uploadProgress]);

  useEffect(() => {
    if (uploadState === "success") {
      const timer = setTimeout(() => {
        onClose();
        setUploadState("idle");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [uploadState, onClose]);

  // Add/remove scroll lock when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const drawerContent = (
    <>
      {/* Overlay with gradient backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-white z-50 flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header - Premium gradient background */}
        <div className="relative overflow-hidden border-b border-slate-200/50">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-600/10 via-transparent to-transparent blur-3xl pointer-events-none" />

          <div className="relative px-6 sm:px-8 py-6 sm:py-7 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 shadow-lg shadow-primary-200/30 flex-shrink-0">
                <Icons.CloudUpload className="h-6 w-6 text-primary-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold text-slate-900 tracking-[-0.02em]">
                  Add Content
                </h2>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Upload files or add text to expand your knowledge base
                </p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              disabled={uploadState === "uploading"}
              className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Close drawer"
            >
              <Icons.Close className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 sm:px-8 py-8">
            {uploadState === "idle" && (
              <>
                {/* Mode Tabs - Centered */}
                <div className="mb-8 flex justify-center">
                  <div className="inline-flex gap-2 p-1.5 bg-slate-100/80 rounded-xl">
                    <button
                      onClick={() => setUploadMode("file")}
                      disabled={loading}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        uploadMode === "file"
                          ? "bg-white text-slate-900 shadow-md shadow-slate-200/50"
                          : "text-slate-700 hover:text-slate-900"
                      }`}
                    >
                      <Icons.CloudUpload className="h-4 w-4" />
                      <span>Upload Files</span>
                    </button>
                    <button
                      onClick={() => setUploadMode("text")}
                      disabled={loading}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        uploadMode === "text"
                          ? "bg-white text-slate-900 shadow-md shadow-slate-200/50"
                          : "text-slate-700 hover:text-slate-900"
                      }`}
                    >
                      <Icons.Document className="h-4 w-4" />
                      <span>Add Text</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                {uploadMode === "file" && (
                  <FileUpload
                    onUpload={onFileUpload}
                    loading={loading}
                    multiple={false}
                    maxSize={10 * 1024 * 1024}
                    accept=".txt,.pdf,.doc,.docx,.md"
                  />
                )}

                {uploadMode === "text" && (
                  <TextUpload onUpload={onTextUpload} loading={loading} />
                )}
              </>
            )}

            {uploadState === "uploading" && (
              <div className="flex flex-col items-center justify-center py-16 space-y-8">
                <div className="space-y-4 text-center">
                  <div className="inline-flex justify-center">
                    <div className="p-6 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-full shadow-lg shadow-primary-200/30">
                      <IOSLoader size="lg" color="primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {uploadProgress < 50
                        ? "Reading file..."
                        : uploadProgress < 90
                          ? "Processing content..."
                          : "Finalizing..."}
                    </p>
                    <p className="text-sm text-slate-600 mt-2">
                      Please wait while we prepare your content
                    </p>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full max-w-xs space-y-3">
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 transition-all duration-500 ease-out rounded-full shadow-sm"
                      style={{
                        width: `${uploadProgress}%`,
                        backgroundSize: "200% 100%",
                        animation: "shimmer 3s infinite"
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-slate-700">{Math.round(uploadProgress)}%</span>
                    <span className="text-slate-500">
                      {uploadProgress === 100
                        ? "Upload complete"
                        : "Do not close"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {uploadState === "success" && (
              <div className="flex flex-col items-center justify-center py-16 space-y-6">
                <div className="inline-flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full shadow-lg shadow-emerald-200/50" />
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                      <Icons.Check className="h-10 w-10 text-emerald-600" />
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-bold text-slate-900">
                    Upload Successful!
                  </p>
                  <p className="text-sm text-slate-600 max-w-sm">
                    Your content has been added to the knowledge base and is being processed
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes slide-in-from-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-in {
          animation: slide-in-from-right 0.3s ease-out;
        }
      `}</style>
    </>
  );

  return createPortal(drawerContent, document.body);
};

export default UploadDrawer;
