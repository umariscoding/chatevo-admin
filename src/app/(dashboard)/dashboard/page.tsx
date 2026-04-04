"use client";

import React from "react";

import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import { IOSContentLoader } from "@/components/ui";
import DashboardAnalytics from "@/components/dashboard/analytics/DashboardAnalytics";

export default function DashboardPage() {
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);

  const isLoading = companyAuth.loading;

  if (isLoading) {
    return <IOSContentLoader isLoading={true} message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-7 animate-in">
      <DashboardAnalytics />
    </div>
  );
}
