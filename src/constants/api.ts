// API constants and endpoints
// NEVER hardcode these endpoints in components - always import from here

// API Configuration
// Uses environment variable NEXT_PUBLIC_API_URL if available,
// falls back to production Railway URL
// https://botbeetle-api-production.up.railway.app/
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Utility function to construct API URLs
// Always use this instead of hardcoding URLs
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
