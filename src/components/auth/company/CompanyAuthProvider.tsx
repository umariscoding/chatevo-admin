"use client";

import React, { useEffect, useState } from "react";
import {
  useCompanyAppDispatch,
} from "@/hooks/company/useCompanyAuth";
import {
  loadFromStorage,
  verifyCompanyToken,
} from "@/store/company/slices/companyAuthSlice";

interface CompanyAuthProviderProps {
  children: React.ReactNode;
}

export const CompanyAuthProvider: React.FC<CompanyAuthProviderProps> = ({
  children,
}) => {
  const dispatch = useCompanyAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // Load tokens and company data from localStorage
      dispatch(loadFromStorage());

      // Verify stored token is valid (API interceptor handles refresh)
      const storedToken = localStorage.getItem("company_access_token");
      if (storedToken) {
        try {
          await dispatch(verifyCompanyToken()).unwrap();
        } catch (error) {
          // Token expired/invalid, clear storage
          localStorage.removeItem("company_access_token");
          localStorage.removeItem("company_refresh_token");
          localStorage.removeItem("company_data");
        }
      }

      setIsInitialized(true);
    };

    initAuth();
  }, [dispatch]);

  // Show loading state until auth is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};
