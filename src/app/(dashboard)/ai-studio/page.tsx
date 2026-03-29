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
import {
  batchUpdateSettings,
  clearError,
} from "@/store/company/slices/companySlice";
import { updateCompanyInfo } from "@/store/company/slices/companyAuthSlice";
import { Icons, IOSContentLoader } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import { useSettings } from "@/hooks/useSettings";
import DocumentList from "@/components/knowledge-base/DocumentList";
import UploadDrawer from "@/components/knowledge-base/UploadDrawer";

type Section = "documents" | "model" | "prompt";

const MODEL_OPTIONS = [
  {
    id: "Llama-instant",
    name: "Llama 3.1 8B",
    provider: "Groq",
    desc: "Fast, great for most use cases",
    speed: "~200 tok/s",
    tag: null,
  },
  {
    id: "Llama-large",
    name: "Llama 3.3 70B",
    provider: "Groq",
    desc: "Handles complex queries better",
    speed: "~90 tok/s",
    tag: "Recommended",
  },
  {
    id: "GPT-OSS-20B",
    name: "GPT-OSS 20B",
    provider: "Groq",
    desc: "Fastest production model on Groq",
    speed: "~1000 tok/s",
    tag: null,
  },
  {
    id: "GPT-OSS-120B",
    name: "GPT-OSS 120B",
    provider: "Groq",
    desc: "OpenAI open weights, strong reasoning",
    speed: "~500 tok/s",
    tag: null,
  },
  {
    id: "OpenAI",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    desc: "Strong reasoning, reliable",
    speed: "~100 tok/s",
    tag: null,
  },
  {
    id: "Claude",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    desc: "Nuanced, thoughtful responses",
    speed: "~80 tok/s",
    tag: null,
  },
  {
    id: "Cohere",
    name: "Command A",
    provider: "Cohere",
    desc: "Enterprise-grade RAG",
    speed: "~70 tok/s",
    tag: null,
  },
];

const TONE_OPTIONS: {
  id: string;
  label: string;
  icon: keyof typeof Icons;
  desc: string;
  color: { bg: string; bgActive: string; text: string; border: string };
}[] = [
  {
    id: "professional",
    label: "Professional",
    icon: "Briefcase",
    desc: "Polished and business-appropriate",
    color: { bg: "bg-slate-50", bgActive: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
  },
  {
    id: "friendly",
    label: "Friendly",
    icon: "Smile",
    desc: "Warm and approachable",
    color: { bg: "bg-amber-50", bgActive: "bg-amber-100", text: "text-amber-600", border: "border-amber-200" },
  },
  {
    id: "casual",
    label: "Casual",
    icon: "Coffee",
    desc: "Relaxed and conversational",
    color: { bg: "bg-sky-50", bgActive: "bg-sky-100", text: "text-sky-600", border: "border-sky-200" },
  },
  {
    id: "formal",
    label: "Formal",
    icon: "Award",
    desc: "Corporate and precise",
    color: { bg: "bg-teal-50", bgActive: "bg-teal-100", text: "text-teal-600", border: "border-teal-200" },
  },
  {
    id: "witty",
    label: "Witty",
    icon: "Flame",
    desc: "Clever with subtle humor",
    color: { bg: "bg-rose-50", bgActive: "bg-rose-100", text: "text-rose-600", border: "border-rose-200" },
  },
];

export default function AIStudioPage() {
  const dispatch = useCompanyAppDispatch();
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const knowledgeBase = useCompanyAppSelector((state) => state.knowledgeBase);
  const { loading: settingsLoading, error } = useCompanyAppSelector(
    (state) => state.company,
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<Section>("documents");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { formData, updateField, getChanges, markAsSaved, resetChanges } =
    useSettings();

  if (companyAuth.loading) {
    return (
      <IOSContentLoader
        isLoading={true}
        message="Loading..."
      />
    );
  }

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
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

  const handleSaveAIConfig = async () => {
    try {
      dispatch(clearError());
      setSaveSuccess(false);

      const changes = getChanges();
      if (!changes.hasChanges) return;

      const updateData: any = {};
      if (changes.changedFields.has("defaultModel")) {
        updateData.default_model = formData.defaultModel;
      }
      if (changes.changedFields.has("systemPrompt")) {
        updateData.system_prompt = formData.systemPrompt;
      }
      if (changes.changedFields.has("tone")) {
        updateData.tone = formData.tone;
      }

      if (Object.keys(updateData).length === 0) return;

      const result = await dispatch(batchUpdateSettings(updateData)).unwrap();
      if (result.company) {
        dispatch(updateCompanyInfo(result.company));
      }
      markAsSaved();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      console.error("Failed to save AI config:", error);
    }
  };

  if (!companyAuth.isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-neutral-100">
            <Icons.Shield className="h-8 w-8 text-neutral-400" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900">
            Access Restricted
          </h1>
          <p className="text-sm text-neutral-500 max-w-sm">
            This section is only available to company accounts.
          </p>
        </div>
      </div>
    );
  }

  const changes = getChanges();
  const hasAIChanges =
    changes.changedFields.has("defaultModel") ||
    changes.changedFields.has("systemPrompt") ||
    changes.changedFields.has("tone");

  const docCount = knowledgeBase.documents.length;
  const processedCount = knowledgeBase.documents.filter(
    (d) => d.embeddings_status === "completed",
  ).length;

  const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: "documents", label: "Documents", icon: <Icons.Database className="h-4 w-4" /> },
    { id: "model", label: "Model & Tone", icon: <Icons.Cpu className="h-4 w-4" /> },
    { id: "prompt", label: "Instructions", icon: <Icons.Terminal className="h-4 w-4" /> },
  ];

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with save/discard */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">AI Studio</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Knowledge base, model, and behavior
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {hasAIChanges && (
              <>
                <button
                  onClick={() => resetChanges()}
                  disabled={settingsLoading}
                  className="px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-700 border border-neutral-200 rounded-lg transition-all disabled:opacity-50 hover:bg-neutral-50"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveAIConfig}
                  disabled={settingsLoading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 min-w-[80px] justify-center"
                >
                  {settingsLoading ? (
                    <IOSLoader size="sm" color="white" />
                  ) : (
                    "Save"
                  )}
                </button>
              </>
            )}
            {saveSuccess && (
              <div className="flex items-center gap-1.5 text-sm font-medium text-accent-600">
                <Icons.CheckCircle className="h-4 w-4" />
                Saved
              </div>
            )}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-3 bg-error-50 border border-error-200 rounded-xl p-4">
            <Icons.AlertCircle className="h-4 w-4 text-error-600 flex-shrink-0" />
            <p className="text-sm text-error-700 flex-1">
              {typeof error === "string" ? error : "Something went wrong."}
            </p>
            <button
              onClick={() => dispatch(clearError())}
              className="text-error-400 hover:text-error-600 transition-colors p-1 rounded-lg hover:bg-error-100"
            >
              <Icons.Close className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Section tabs */}
        <div className="flex justify-center">
          <div className="inline-flex items-center border border-neutral-200 bg-white rounded-xl p-1 gap-0.5">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-5 py-2 text-[13px] font-medium rounded-[10px] transition-all duration-200 ${
                    isActive
                      ? "bg-primary-600 text-white shadow-sm shadow-primary-600/25"
                      : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
                  }`}
                >
                  {section.icon}
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* === DOCUMENTS === */}
        {activeSection === "documents" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {docCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-28 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-500 rounded-full transition-all duration-500"
                        style={{
                          width: docCount > 0 ? `${(processedCount / docCount) * 100}%` : "0%",
                        }}
                      />
                    </div>
                    <span className="text-xs text-neutral-500 tabular-nums font-medium">
                      {processedCount}/{docCount} ready
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-all active:scale-[0.97]"
              >
                <Icons.Plus className="h-3.5 w-3.5" />
                Add content
              </button>
            </div>
            <DocumentList />
          </div>
        )}

        {/* === MODEL & TONE === */}
        {activeSection === "model" && (
          <div className="space-y-6">
            {/* Model selection */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100">
                <h2 className="text-sm font-semibold text-neutral-900">Language Model</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Choose the AI model that powers your chatbot
                </p>
              </div>
              <div className="p-2 space-y-1">
                {MODEL_OPTIONS.map((model) => {
                  const isSelected = formData.defaultModel === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => updateField("defaultModel", model.id)}
                      className={`group w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-left transition-all duration-150 ${
                        isSelected
                          ? "bg-primary-50 ring-1 ring-primary-500/20"
                          : "hover:bg-neutral-50"
                      }`}
                    >
                      <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected ? "border-primary-600 bg-primary-600" : "border-neutral-300 group-hover:border-neutral-400"
                      }`}>
                        {isSelected && <div className="w-[7px] h-[7px] rounded-full bg-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[13px] font-semibold ${isSelected ? "text-primary-700" : "text-neutral-900"}`}>
                            {model.name}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                            {model.provider}
                          </span>
                          {model.tag && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-accent-100 text-accent-700">
                              {model.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">{model.desc}</p>
                      </div>
                      <span className={`text-[11px] font-mono tabular-nums hidden sm:block transition-colors ${
                        isSelected ? "text-primary-500" : "text-neutral-300"
                      }`}>
                        {model.speed}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone selection */}
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100">
                <h2 className="text-sm font-semibold text-neutral-900">Tone</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Set the personality and voice of your chatbot
                </p>
              </div>
              <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {TONE_OPTIONS.map((tone) => {
                  const isSelected = formData.tone === tone.id;
                  const IconComponent = Icons[tone.icon];
                  return (
                    <button
                      key={tone.id}
                      onClick={() => updateField("tone", tone.id)}
                      className={`group flex flex-col items-center gap-2 py-4 px-3 rounded-xl border transition-all duration-150 ${
                        isSelected
                          ? `${tone.color.bg} ${tone.color.border}`
                          : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected ? `${tone.color.bgActive}` : "bg-neutral-100 group-hover:bg-neutral-200/60"
                      }`}>
                        <IconComponent className={`h-[18px] w-[18px] transition-colors ${isSelected ? tone.color.text : "text-neutral-400 group-hover:text-neutral-500"}`} />
                      </div>
                      <div className="text-center">
                        <span className={`text-[13px] font-semibold block transition-colors ${isSelected ? tone.color.text : "text-neutral-800"}`}>
                          {tone.label}
                        </span>
                        <p className="text-[11px] text-neutral-400 mt-0.5 leading-tight">{tone.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* === INSTRUCTIONS (System Prompt) === */}
        {activeSection === "prompt" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900">Additional Instructions</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    These instructions are appended to the default system prompt — your base prompt is always preserved
                  </p>
                </div>
                {formData.systemPrompt && (
                  <button
                    onClick={() => updateField("systemPrompt", "")}
                    className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-600 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 transition-all"
                  >
                    <Icons.RotateCcw className="h-3 w-3" />
                    Clear
                  </button>
                )}
              </div>
              <div className="p-5">
                <textarea
                  value={formData.systemPrompt}
                  onChange={(e) => updateField("systemPrompt", e.target.value)}
                  placeholder={`Add custom instructions for your chatbot...\n\nExamples:\n- "Always recommend our premium plan when relevant"\n- "Never discuss competitor products"\n- "Include a link to our docs when answering technical questions"`}
                  rows={10}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 text-neutral-800 placeholder-neutral-300 px-4 py-3.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white resize-y transition-all"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3">
              <Icons.AlertCircle className="h-4 w-4 text-neutral-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-500 leading-relaxed">
                Your chatbot already has a comprehensive default prompt that handles greetings, knowledge-base-only answers, follow-ups, and more. Anything you write here gets added on top — use it for company-specific rules and preferences.
              </p>
            </div>
          </div>
        )}
      </div>

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
    </>
  );
}
