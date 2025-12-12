import type { Document } from "@/types/knowledgeBase";

export interface DocumentListProps {
  className?: string;
}

export interface FileUploadProps {
  onUpload: (file: File) => void;
  loading?: boolean;
  className?: string;
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
}

export interface TextUploadProps {
  onUpload: (content: string, filename: string) => void;
  loading?: boolean;
  className?: string;
}

export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (file: File) => Promise<void>;
  onTextUpload: (content: string, filename: string) => Promise<void>;
  loading?: boolean;
  uploadProgress?: number; // 0-100
}
