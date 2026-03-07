"use client";

import React, { useState } from "react";

import {
  useCompanyAppSelector,
  useCompanyAppDispatch,
} from "@/hooks/company/useCompanyAuth";
import {
  uploadFile,
  uploadText,
} from "@/store/company/slices/knowledgeBaseSlice";
import { Icons, IOSContentLoader } from "@/components/ui";
import Button from "@/components/ui/Button";
import DocumentList from "@/components/knowledge-base/DocumentList";
import UploadDrawer from "@/components/knowledge-base/UploadDrawer";

export default function KnowledgeBasePage() {
  const dispatch = useCompanyAppDispatch();
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const knowledgeBase = useCompanyAppSelector((state) => state.knowledgeBase);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Check if page is loading
  if (companyAuth.loading) {
    return (
      <IOSContentLoader isLoading={true} message="Loading knowledge base..." />
    );
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 30;
        });
      }, 300);

      await dispatch(uploadFile(file)).unwrap();

      clearInterval(progressInterval);
      setUploadProgress(100);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextUpload = async (content: string, filename: string) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 30;
        });
      }, 300);

      await dispatch(uploadText({ content, filename })).unwrap();

      clearInterval(progressInterval);
      setUploadProgress(100);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  // Only company accounts can access knowledge base management
  if (!companyAuth.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="text-center space-y-8">
            {/* Decorative background elements */}
            <div className="absolute top-20 right-10 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Icon */}
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 shadow-lg shadow-primary-200/30">
                <Icons.Shield className="h-12 w-12 text-primary-600" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-slate-900 tracking-[-0.02em]">
                Access Restricted
              </h1>
              <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
                Knowledge base management is exclusive to company accounts. Please sign in with your company credentials to access this feature.
              </p>
            </div>

            {/* Status Card */}
            <div className="relative z-10 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 rounded-2xl p-8 max-w-sm mx-auto shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <p className="text-sm font-semibold text-slate-900">Company Access Only</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Only authorized administrators can manage documents and content for your knowledge base.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-[-0.02em] mb-1">
            Knowledge Base
          </h1>
          <p className="text-slate-600">
            {knowledgeBase.documents.length} document{knowledgeBase.documents.length !== 1 ? 's' : ''} •{' '}
            {knowledgeBase.documents.filter((d) => d.embeddings_status === "completed").length} processed
          </p>
        </div>

        {/* Add Content Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="group relative inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 text-white font-semibold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0 self-start sm:self-center"
        >
          {/* Animated background shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-500" />

          <div className="relative flex items-center gap-2">
            <Icons.Plus className="h-5 w-5" />
            <span>Add Content</span>
          </div>
        </button>
      </div>

      {/* Documents Section */}
      <DocumentList />

      {/* Upload Drawer */}
      <UploadDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setUploadProgress(0);
        }}
        onFileUpload={handleFileUpload}
        onTextUpload={handleTextUpload}
        loading={isUploading}
        uploadProgress={uploadProgress}
      />
    </div>
  );
}
