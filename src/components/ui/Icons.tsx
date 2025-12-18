import React from "react";
import {
  Home,
  MessageCircle,
  FileText,
  Settings,
  User,
  X,
  ArrowLeft,
  Check,
  Trash2,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  BookOpen,
  MoreVertical,
  Download,
  Eye,
  Upload,
  Globe,
  RefreshCw,
  Users,
  LogOut,
  Menu,
  ChevronDown,
  ChevronLeft,
  Send,
  Edit,
  Trash,
  MessageSquare,
  UserX,
  Zap,
  AlertTriangle,
  Shield,
  Code,
  Copy,
  CheckCheck,
} from "lucide-react";

// Icon component props interface
interface IconProps {
  className?: string;
  size?: number;
}

// Centralized icon components using Lucide React
export const Icons = {
  // Navigation Icons
  Home: ({ className = "h-5 w-5", size }: IconProps) => (
    <Home className={className} size={size} />
  ),

  Chat: ({ className = "h-5 w-5", size }: IconProps) => (
    <MessageCircle className={className} size={size} />
  ),

  Document: ({ className = "h-5 w-5", size }: IconProps) => (
    <FileText className={className} size={size} />
  ),

  Settings: ({ className = "h-5 w-5", size }: IconProps) => (
    <Settings className={className} size={size} />
  ),

  User: ({ className = "h-5 w-5", size }: IconProps) => (
    <User className={className} size={size} />
  ),

  // Action Icons
  Close: ({ className = "h-6 w-6", size }: IconProps) => (
    <X className={className} size={size} />
  ),

  ArrowLeft: ({ className = "h-5 w-5", size }: IconProps) => (
    <ArrowLeft className={className} size={size} />
  ),

  CloudUpload: ({ className = "h-6 w-6", size }: IconProps) => (
    <Upload className={className} size={size} />
  ),

  Upload: ({ className = "h-5 w-5", size }: IconProps) => (
    <Upload className={className} size={size} />
  ),

  Check: ({ className = "h-8 w-8", size }: IconProps) => (
    <Check className={className} size={size} />
  ),

  Trash: ({ className = "h-4 w-4", size }: IconProps) => (
    <Trash2 className={className} size={size} />
  ),

  Search: ({ className = "h-5 w-5", size }: IconProps) => (
    <Search className={className} size={size} />
  ),

  CheckCircle: ({ className = "h-5 w-5", size }: IconProps) => (
    <CheckCircle className={className} size={size} />
  ),

  Clock: ({ className = "h-5 w-5", size }: IconProps) => (
    <Clock className={className} size={size} />
  ),

  AlertCircle: ({ className = "h-5 w-5", size }: IconProps) => (
    <AlertCircle className={className} size={size} />
  ),

  Plus: ({ className = "h-5 w-5", size }: IconProps) => (
    <Plus className={className} size={size} />
  ),

  BookOpen: ({ className = "h-8 w-8", size }: IconProps) => (
    <BookOpen className={className} size={size} />
  ),

  MoreVertical: ({ className = "h-4 w-4", size }: IconProps) => (
    <MoreVertical className={className} size={size} />
  ),

  Download: ({ className = "h-4 w-4", size }: IconProps) => (
    <Download className={className} size={size} />
  ),

  Eye: ({ className = "h-4 w-4", size }: IconProps) => (
    <Eye className={className} size={size} />
  ),

  Globe: ({ className = "h-6 w-6", size }: IconProps) => (
    <Globe className={className} size={size} />
  ),

  Refresh: ({ className = "h-5 w-5", size }: IconProps) => (
    <RefreshCw className={className} size={size} />
  ),

  Users: ({ className = "h-6 w-6", size }: IconProps) => (
    <Users className={className} size={size} />
  ),

  Logout: ({ className = "h-5 w-5", size }: IconProps) => (
    <LogOut className={className} size={size} />
  ),

  Menu: ({ className = "h-6 w-6", size }: IconProps) => (
    <Menu className={className} size={size} />
  ),

  ChevronDown: ({ className = "h-5 w-5", size }: IconProps) => (
    <ChevronDown className={className} size={size} />
  ),

  ChevronLeft: ({ className = "h-5 w-5", size }: IconProps) => (
    <ChevronLeft className={className} size={size} />
  ),

  Send: ({ className = "h-5 w-5", size }: IconProps) => (
    <Send className={className} size={size} />
  ),

  Edit: ({ className = "h-4 w-4", size }: IconProps) => (
    <Edit className={className} size={size} />
  ),

  // Analytics Icons
  FileText: ({ className = "h-5 w-5", size }: IconProps) => (
    <FileText className={className} size={size} />
  ),

  MessageSquare: ({ className = "h-5 w-5", size }: IconProps) => (
    <MessageSquare className={className} size={size} />
  ),

  UserX: ({ className = "h-5 w-5", size }: IconProps) => (
    <UserX className={className} size={size} />
  ),

  Zap: ({ className = "h-5 w-5", size }: IconProps) => (
    <Zap className={className} size={size} />
  ),

  AlertTriangle: ({ className = "h-5 w-5", size }: IconProps) => (
    <AlertTriangle className={className} size={size} />
  ),

  MessageCircle: ({ className = "h-5 w-5", size }: IconProps) => (
    <MessageCircle className={className} size={size} />
  ),

  Shield: ({ className = "h-5 w-5", size }: IconProps) => (
    <Shield className={className} size={size} />
  ),

  Code: ({ className = "h-5 w-5", size }: IconProps) => (
    <Code className={className} size={size} />
  ),

  Copy: ({ className = "h-5 w-5", size }: IconProps) => (
    <Copy className={className} size={size} />
  ),

  CheckCheck: ({ className = "h-5 w-5", size }: IconProps) => (
    <CheckCheck className={className} size={size} />
  ),
};
