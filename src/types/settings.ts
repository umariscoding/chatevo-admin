export interface SettingsFormData {
  // Profile
  name: string;
  email: string;
  slug: string;

  // Chatbot
  chatbotTitle: string;
  chatbotDescription: string;

  // Publishing
  isPublished: boolean;
}

export interface SettingsChanges {
  hasChanges: boolean;
  changedFields: Set<keyof SettingsFormData>;
}

// Embed Widget Settings
export interface EmbedSettings {
  theme: "light" | "dark";
  position: "left" | "right";
  primaryColor: string;
  welcomeText: string;
  subtitleText: string;
}

export const DEFAULT_EMBED_SETTINGS: EmbedSettings = {
  theme: "dark",
  position: "right",
  primaryColor: "#6366f1",
  welcomeText: "Hi there! How can we help you today?",
  subtitleText: "We typically reply instantly",
};
