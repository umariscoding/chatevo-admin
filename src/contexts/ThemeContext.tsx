"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { companyApi } from "@/utils/company/api";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const PREF_KEY = "wispoke-theme-pref";
const COOKIE_KEY = "wispoke-theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const DEFAULT_PREF: Theme = "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  hydrateTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const isTheme = (v: unknown): v is Theme =>
  v === "light" || v === "dark" || v === "system";

const applyClass = (resolved: ResolvedTheme) => {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  if (resolved === "dark") html.classList.add("dark");
  else html.classList.remove("dark");
};

const writeCookie = (resolved: ResolvedTheme) => {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_KEY}=${resolved}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
};

const writePref = (pref: Theme) => {
  try {
    window.localStorage.setItem(PREF_KEY, pref);
  } catch {
    // ignore
  }
};

const resolveTheme = (theme: Theme): ResolvedTheme => {
  if (theme === "light" || theme === "dark") return theme;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

interface ProviderProps {
  children: React.ReactNode;
  initialResolved?: ResolvedTheme;
}

export function ThemeProvider({ children, initialResolved = "dark" }: ProviderProps) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_PREF);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(initialResolved);
  const lastSyncedRef = useRef<Theme | null>(null);

  // Hydrate from localStorage on mount (client-only, after SSR placeholder render)
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(PREF_KEY);
    } catch {
      // ignore
    }
    const initial: Theme = isTheme(stored) ? stored : DEFAULT_PREF;
    const resolved = resolveTheme(initial);
    setThemeState(initial);
    setResolvedTheme(resolved);
    applyClass(resolved);
    writeCookie(resolved);
  }, []);

  // Follow OS preference when theme === 'system'
  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const resolved: ResolvedTheme = mql.matches ? "dark" : "light";
      setResolvedTheme(resolved);
      applyClass(resolved);
      writeCookie(resolved);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  const apply = useCallback((next: Theme) => {
    const resolved = resolveTheme(next);
    setThemeState(next);
    setResolvedTheme(resolved);
    applyClass(resolved);
    writeCookie(resolved);
    writePref(next);
  }, []);

  const setTheme = useCallback(
    (next: Theme) => {
      apply(next);
      if (lastSyncedRef.current === next) return;
      lastSyncedRef.current = next;
      // Fire-and-forget: persist to DB. Auth interceptor handles 401.
      companyApi
        .put("/auth/company/theme-preference", { theme_preference: next })
        .catch(() => {
          // Reset so a retry can fire if the next setTheme call repeats this value.
          lastSyncedRef.current = null;
        });
    },
    [apply],
  );

  const hydrateTheme = useCallback(
    (next: Theme) => {
      // Server-driven sync (e.g., from login response). Skip DB write to avoid loop.
      lastSyncedRef.current = next;
      apply(next);
    },
    [apply],
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, hydrateTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
