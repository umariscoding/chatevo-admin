"use client";

import React, { useState } from "react";
import { CompanyReduxProvider } from "@/lib/company-redux-provider";
import { CompanyAuthProvider } from "@/components/auth/company/CompanyAuthProvider";
import { CompanyProtectedRoute } from "@/components/auth/company/CompanyProtectedRoute";
import ThemeHydrator from "@/components/auth/company/ThemeHydrator";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <CompanyReduxProvider>
      <CompanyAuthProvider>
        <ThemeHydrator />
        <CompanyProtectedRoute>
          <div className="h-screen overflow-hidden bg-sidebar-bg flex">
            <div className="w-72 flex-shrink-0 h-screen fixed left-0 top-0 z-10">
              <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
            </div>

            <div className="flex-1 ml-72 bg-neutral-50 dark:bg-sidebar-bg h-screen overflow-y-auto smooth-scroll-container">
              <Header
                onMenuToggle={handleMenuToggle}
                showMobileMenuButton={true}
              />

              <main>
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </CompanyProtectedRoute>
      </CompanyAuthProvider>
    </CompanyReduxProvider>
  );
}
