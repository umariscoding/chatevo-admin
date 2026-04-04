"use client";

import React, { useEffect } from "react";

import { useCompanyAnalytics } from "@/hooks/company/useCompanyAnalytics";
import MessagesChart from "./MessagesChart";
import ChatsChart from "./ChatsChart";
import { Icons } from "@/components/ui";
import type { DashboardAnalyticsProps } from "@/interfaces/Analytics.interface";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: { value: string; type: "increase" | "decrease" | "neutral" } | null;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  change,
  loading,
}) => {
  const changeColor =
    change?.type === "increase"
      ? "text-teal-500"
      : change?.type === "decrease"
        ? "text-red-400"
        : "text-slate-400";

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200/80 p-5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50 transition-all duration-200">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <Icon className="h-4 w-4 text-neutral-400" />
        {!loading && change && (
          <span className={`text-xs font-semibold ${changeColor} bg-transparent`}>
            {change.value}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="space-y-0.5">
        {loading ? (
          <div className="space-y-2">
            <div className="h-7 w-16 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-3.5 w-24 rounded bg-slate-100 animate-pulse mt-1.5" />
            <div className="h-3 w-16 rounded bg-slate-100 animate-pulse" />
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-slate-900 tracking-[-0.03em] leading-none">
              {Number(value).toLocaleString()}
            </p>
            <p className="text-sm font-medium text-slate-700 mt-1.5">{label}</p>
          </>
        )}
      </div>

      {/* Bottom accent line on hover */}
      <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
};

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  className = "",
}) => {
  const { dashboard, loading, error, loadDashboardAnalytics } =
    useCompanyAnalytics();

  useEffect(() => {
    loadDashboardAnalytics();
  }, [loadDashboardAnalytics]);

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
            <Icons.AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            Failed to load analytics
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            {typeof error === "string" ? error : "An error occurred while loading analytics."}
          </p>
          <button
            onClick={() => loadDashboardAnalytics()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const stats: StatCardProps[] = [
    {
      icon: Icons.MessageCircle,
      label: "Total Messages",
      value: dashboard?.overview.totalMessages.count || 0,
      change: dashboard?.overview.totalMessages.change ?? null,
      loading,
    },
    {
      icon: Icons.Users,
      label: "New Users",
      value: dashboard?.overview.users.count || 0,
      change: dashboard?.overview.users.change ?? null,
      loading,
    },
    {
      icon: Icons.MessageSquare,
      label: "Total Chats",
      value: dashboard?.overview.totalChats.count || 0,
      change: dashboard?.overview.totalChats.change ?? null,
      loading,
    },
    {
      icon: Icons.FileText,
      label: "Knowledge Bases",
      value: dashboard?.overview.knowledgeBases.count || 0,
      change: dashboard?.overview.knowledgeBases.change ?? null,
      loading,
    },
    {
      icon: Icons.UserX,
      label: "Guest Sessions",
      value: dashboard?.overview.guestSessions.count || 0,
      change: dashboard?.overview.guestSessions.change ?? null,
      loading,
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-800 tracking-[-0.02em]">Overview</h2>
          <p className="text-sm text-slate-400 mt-0.5">Performance metrics for the last 7 days</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <MessagesChart
          data={dashboard?.timeSeries.messagesOverTime || []}
          loading={loading}
        />
        <ChatsChart
          data={dashboard?.timeSeries.chatsOverTime || []}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DashboardAnalytics;
