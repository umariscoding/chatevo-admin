"use client";

import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CompanyReduxProvider } from "@/lib/company-redux-provider";
import { CompanyAuthProvider } from "@/components/auth/company/CompanyAuthProvider";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <CompanyReduxProvider>
        <CompanyAuthProvider>{children}</CompanyAuthProvider>
      </CompanyReduxProvider>
    </GoogleOAuthProvider>
  );
}
