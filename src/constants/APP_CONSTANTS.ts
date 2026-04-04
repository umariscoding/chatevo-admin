// Application constants
// NEVER hardcode these values in components - always import from here

export const APP_CONFIG = {
  NAME: "BotBeetle",
  DESCRIPTION: "Multi-tenant chatbot platform for businesses",
  VERSION: "1.0.0",
  AUTHOR: "BotBeetle Team",
} as const;

export const ROUTES = {
  HOME: "/",

  // Company auth routes (only companies can access these directly)
  COMPANY_LOGIN: "/auth",
  COMPANY_REGISTER: "/auth",

  // Dashboard routes
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",

  // Chat routes
  CHAT: "/chat",
  CHAT_DETAIL: "/chat/[chatId]",

  // Knowledge Base routes
  KNOWLEDGE_BASE: "/ai-studio",
  KNOWLEDGE_BASE_UPLOAD: "/ai-studio/upload",

  // Public routes
  PUBLIC_CHATBOT: "/[slug]",
  PUBLIC_CHAT: "/[slug]/chat",
} as const;

export const FORM_VALIDATION = {
  EMAIL: {
    REQUIRED: "Email is required",
    INVALID: "Please enter a valid email address",
    MAX_LENGTH: 255,
  },
  PASSWORD: {
    REQUIRED: "Password is required",
    MIN_LENGTH: 8,
    WEAK: "Password must contain at least 8 characters, including uppercase, lowercase, and numbers",
  },
  NAME: {
    REQUIRED: "Name is required",
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  COMPANY_NAME: {
    REQUIRED: "Company name is required",
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
} as const;
