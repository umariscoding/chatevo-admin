"use client";

import React from "react";

import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import { IOSContentLoader } from "@/components/ui";
import DashboardAnalytics from "@/components/dashboard/analytics/DashboardAnalytics";

export default function DashboardPage() {
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);

  const isLoading = companyAuth.loading;
  const displayName = companyAuth.company?.name || "there";
  const firstName = displayName.split(" ")[0];

  if (isLoading) {
    return <IOSContentLoader isLoading={true} message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-7">
      {/* Hero / Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-[#12103a] to-slate-900 border border-white/[0.07] shadow-xl shadow-black/20">
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 w-56 h-56 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Grid texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative px-8 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            {/* Pill badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-violet-300 tracking-wide uppercase">Live</span>
            </div>

            <h1 className="text-3xl font-bold text-white tracking-[-0.03em] leading-tight">
              Good{getTimeOfDay()},{" "}
              <span className="bg-gradient-to-r from-violet-300 to-purple-400 bg-clip-text text-transparent">
                {firstName}
              </span>
            </h1>
            <p className="mt-2 text-slate-400 text-sm leading-relaxed max-w-md">
              Your AI chatbot is active and serving users. Here&apos;s an overview of your platform performance.
            </p>
          </div>

          {/* Quick stat pills */}
          <div className="flex flex-wrap gap-3 sm:flex-col sm:items-end">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
              <span className="text-xs text-slate-400">Last 7 days</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="text-xs font-semibold text-emerald-400">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <DashboardAnalytics />
    </div>
  );
}

function getTimeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
