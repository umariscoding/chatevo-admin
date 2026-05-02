"use client";

import { useEffect, useRef } from "react";
import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import { useTheme, type Theme } from "@/contexts/ThemeContext";

const isTheme = (v: unknown): v is Theme =>
  v === "light" || v === "dark" || v === "system";

export default function ThemeHydrator() {
  const { hydrateTheme } = useTheme();
  const serverPref = useCompanyAppSelector(
    (s) => s.companyAuth.company?.theme_preference,
  );
  const lastSeenRef = useRef<string | null>(null);

  // Only hydrate when the *server's* value changes — not when the local theme
  // changes. Otherwise a user click flips local state, the effect re-runs, and
  // the stale server value clobbers it back.
  useEffect(() => {
    if (!isTheme(serverPref)) return;
    if (lastSeenRef.current === serverPref) return;
    lastSeenRef.current = serverPref;
    hydrateTheme(serverPref);
  }, [serverPref, hydrateTheme]);

  return null;
}
