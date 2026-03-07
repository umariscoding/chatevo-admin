"use client";

import React, { useState, useRef, useCallback } from "react";

import Button from "@/components/ui/Button";
import { Icons } from "@/components/ui";
import type { FileUploadProps } from "@/interfaces/KnowledgeBase.interface";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  loading = false,
  className = "",
  accept = ".txt,.pdf,.doc,.docx,.md",
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File "${file.name}" is too large. Maximum size is ${formatFileSize(maxSize)}.`;
    }

    // Check file type if accept is specified
    if (accept) {
      const allowedTypes = accept.split(",").map((type) => type.trim());
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      const isValidType = allowedTypes.some((type) => {
        if (type.startsWith(".")) {
          return type.toLowerCase() === fileExtension;
        }
        return file.type.includes(type);
      });

      if (!isValidType) {
        return `File "${file.name}" has an invalid type. Allowed types: ${accept}`;
      }
    }

    return null;
  };

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const newErrors: string[] = [];
      const validFiles: File[] = [];

      fileArray.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(error);
        } else {
          validFiles.push(file);
        }
      });

      setErrors(newErrors);

      if (validFiles.length > 0) {
        if (multiple) {
          setSelectedFiles((prev) => [...prev, ...validFiles]);
        } else {
          setSelectedFiles(validFiles.slice(0, 1));
        }
      }
    },
    [maxSize, accept, multiple],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles],
  );

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        onUpload(file);
      });
      setSelectedFiles([]);
      setErrors([]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Drag & Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 group/drop ${
          dragActive
            ? "border-primary-400 bg-gradient-to-br from-primary-50 to-primary-100/30 shadow-lg shadow-primary-200/50"
            : "border-slate-300/60 hover:border-slate-400 hover:shadow-md hover:bg-slate-50/30"
        } ${loading ? "opacity-60 pointer-events-none" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Animated background */}
        <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${
          dragActive ? "opacity-100" : "opacity-0"
        }`} />

        <div className="relative space-y-4">
          <div className="flex justify-center">
            <div className={`p-4 rounded-xl transition-all duration-300 ${
              dragActive
                ? "bg-primary-100/60 shadow-lg shadow-primary-200/50"
                : "bg-slate-100/50 group-hover/drop:bg-slate-100"
            }`}>
              <Icons.CloudUpload
                className={`h-12 w-12 transition-all duration-300 ${
                  dragActive ? "text-primary-500 scale-110" : "text-slate-400 group-hover/drop:text-slate-500"
                }`}
              />
            </div>
          </div>

          <div>
            <p className="text-lg font-bold text-slate-900">
              Drop files here to upload
            </p>
            <p className="mt-2 text-sm text-slate-600">
              or{" "}
              <button
                type="button"
                onClick={openFileDialog}
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors underline underline-offset-2"
                disabled={loading}
              >
                browse your files
              </button>
            </p>
          </div>

          <div className="pt-3 text-xs text-slate-500 space-y-1">
            <p>
              Formats: <span className="font-semibold text-slate-600">{accept}</span>
            </p>
            <p>
              Max size: <span className="font-semibold text-slate-600">{formatFileSize(maxSize)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        disabled={loading}
      />

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-3">
          {errors.map((error, index) => (
            <div
              key={index}
              className="p-4 bg-red-50/80 border border-red-200/60 rounded-xl flex items-start space-x-3 backdrop-blur-sm"
            >
              <Icons.AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 leading-relaxed">{error}</p>
            </div>
          ))}
        </div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary-100/50 rounded-lg">
                <Icons.Document className="h-5 w-5 text-primary-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {selectedFiles.length}{" "}
                {selectedFiles.length === 1 ? "file" : "files"} selected
              </h4>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100/50 px-3 py-1 rounded-full">
              {selectedFiles.reduce((sum, f) => sum + f.size, 0) > 0 &&
                formatFileSize(selectedFiles.reduce((sum, f) => sum + f.size, 0))}
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3.5 bg-slate-50/60 border border-slate-200/60 rounded-xl hover:bg-slate-100/60 hover:border-slate-300/60 transition-all duration-200 group/file"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="p-2 bg-white rounded-lg group-hover/file:shadow-sm transition-all">
                    <Icons.Document className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 ml-2 group-hover/file:opacity-100 opacity-75"
                  disabled={loading}
                  aria-label="Remove file"
                >
                  <Icons.Close className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="flex justify-end pt-4 border-t border-slate-200/40">
            <Button
              onClick={handleUpload}
              loading={loading}
              disabled={selectedFiles.length === 0 || loading}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-lg hover:shadow-primary-500/30"
            >
              Upload {selectedFiles.length}{" "}
              {selectedFiles.length === 1 ? "File" : "Files"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
