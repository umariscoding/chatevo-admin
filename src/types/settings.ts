export interface SettingsFormData {
  // Profile
  name: string;
  email: string;
  slug: string;

  // Chatbot
  chatbotTitle: string;
  chatbotDescription: string;

  // AI Configuration
  defaultModel: string;
  systemPrompt: string;
  tone: string;

  // Publishing
  isPublished: boolean;
}

export interface SettingsChanges {
  hasChanges: boolean;
  changedFields: Set<keyof SettingsFormData>;
}

// Embed Widget Settings
export type ButtonIconType = "chat" | "message" | "headset" | "sparkle" | "bolt" | "help" | "robot";
export type ChatTemplateType = "default" | "bubbles" | "minimal";

export interface EmbedSettings {
  theme: "light" | "dark";
  position: "left" | "right";
  primaryColor: string;
  headerColor: string;
  welcomeText: string;
  subtitleText: string;
  placeholderText: string;
  initialMessage: string;
  hideBranding: boolean;
  autoOpenDelay: number; // 0 = disabled, otherwise seconds
  buttonIcon: ButtonIconType;
  botDisplayName: string;
  chatTemplate: ChatTemplateType;
}

export const DEFAULT_EMBED_SETTINGS: EmbedSettings = {
  theme: "dark",
  position: "right",
  primaryColor: "#6366f1",
  headerColor: "",
  welcomeText: "Hi there! How can we help you today?",
  subtitleText: "We typically reply instantly",
  placeholderText: "Type your message...",
  initialMessage: "",
  hideBranding: false,
  autoOpenDelay: 0,
  buttonIcon: "chat",
  botDisplayName: "",
  chatTemplate: "default",
};
