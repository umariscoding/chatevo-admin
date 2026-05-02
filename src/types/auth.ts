// Authentication related types
export type UserType = "company" | "user" | "guest";

export interface Company {
  company_id: string;
  name: string;
  email: string;
  plan: "free" | "pro";
  status: "active" | "inactive" | "suspended";
  slug: string | null;
  is_published: boolean;
  chatbot_title?: string;
  chatbot_description?: string;
  default_model?: string;
  system_prompt?: string;
  tone?: string;
  settings?: {
    enable_user_portal?: boolean;
    embed?: Record<string, unknown>;
  };
  ls_subscription_status?: "none" | "active" | "cancelled" | "expired" | "past_due" | "paused";
  subscription_ends_at?: string | null;
  subscription_renews_at?: string | null;
  theme_preference?: "light" | "dark" | "system";
  created_at: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
