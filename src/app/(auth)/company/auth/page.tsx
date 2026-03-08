"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import MinimalInput from "@/components/ui/MinimalInput";
import MinimalButton from "@/components/ui/MinimalButton";
import {
  useCompanyAppDispatch,
  useCompanyAppSelector,
} from "@/hooks/company/useCompanyAuth";
import {
  loginCompany,
  registerCompany,
  clearError,
} from "@/store/company/slices/companyAuthSlice";
import { APP_CONFIG, ROUTES, FORM_VALIDATION } from "@/constants/APP_CONSTANTS";

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function CompanyAuthPage() {
  const router = useRouter();
  const dispatch = useCompanyAppDispatch();
  const {
    loading: companyLoading,
    error,
    isAuthenticated: isCompanyAuthenticated,
  } = useCompanyAppSelector((state) => state.companyAuth);

  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [signupData, setSignupData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isCompanyAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isCompanyAuthenticated, router]);

  useEffect(() => {
    dispatch(clearError());
    setFormErrors({});
  }, [dispatch, isLogin]);

  const validateLoginForm = (): boolean => {
    const errors: FormErrors = {};

    if (!loginData.email) {
      errors.email = FORM_VALIDATION.EMAIL.REQUIRED;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      errors.email = FORM_VALIDATION.EMAIL.INVALID;
    }

    if (!loginData.password) {
      errors.password = FORM_VALIDATION.PASSWORD.REQUIRED;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignupForm = (): boolean => {
    const errors: FormErrors = {};

    if (!signupData.name.trim()) {
      errors.name = FORM_VALIDATION.COMPANY_NAME.REQUIRED;
    } else if (
      signupData.name.trim().length < FORM_VALIDATION.COMPANY_NAME.MIN_LENGTH
    ) {
      errors.name = `Company name must be at least ${FORM_VALIDATION.COMPANY_NAME.MIN_LENGTH} characters`;
    }

    if (!signupData.email) {
      errors.email = FORM_VALIDATION.EMAIL.REQUIRED;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      errors.email = FORM_VALIDATION.EMAIL.INVALID;
    }

    if (!signupData.password) {
      errors.password = FORM_VALIDATION.PASSWORD.REQUIRED;
    } else if (
      signupData.password.length < FORM_VALIDATION.PASSWORD.MIN_LENGTH
    ) {
      errors.password = `Password must be at least ${FORM_VALIDATION.PASSWORD.MIN_LENGTH} characters`;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(signupData.password)) {
      errors.password = FORM_VALIDATION.PASSWORD.WEAK;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLoginForm()) return;

    try {
      await dispatch(
        loginCompany({
          email: loginData.email.trim(),
          password: loginData.password,
        }),
      ).unwrap();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSignupForm()) return;

    try {
      await dispatch(
        registerCompany({
          name: signupData.name.trim(),
          email: signupData.email.trim(),
          password: signupData.password,
        }),
      ).unwrap();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary-600/[0.06] blur-[120px] animate-float-orb" />
        <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] rounded-full bg-accent-500/[0.04] blur-[100px] animate-float-orb-reverse" />
        <div
          className="absolute inset-0 animate-grid-pulse"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Left Panel - Form */}
      <div className="flex-1 lg:w-[50%] flex flex-col justify-center py-12 px-6 sm:px-12 lg:pl-16 lg:pr-12 relative z-10">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <svg className="w-7 h-7 text-primary-400" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="24" height="24" rx="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 12.5C9 11.12 10.12 10 11.5 10h5c1.38 0 2.5 1.12 2.5 2.5v3c0 1.38-1.12 2.5-2.5 2.5H13l-2.5 2V18h-.5A1.5 1.5 0 019 16.5v-4z" fill="currentColor" opacity="0.7"/>
            </svg>
            <span className="text-lg font-semibold text-white tracking-tight">
              {APP_CONFIG.NAME}
            </span>
          </div>

          {/* Tab Switch */}
          <div className="mb-8">
            <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-150 ${
                  isLogin
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-150 ${
                  !isLogin
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isLogin ? "Welcome back" : "Get started"}
            </h2>
            <p className="mt-1.5 text-sm text-neutral-500">
              {isLogin
                ? "Sign in to your dashboard"
                : "Create your account to start building"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-error-500/10 border border-error-500/20 text-error-300 px-4 py-3 rounded-lg text-sm">
              <svg className="w-4 h-4 text-error-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>
                {typeof error === "string"
                  ? error
                  : "An error occurred. Please try again."}
              </span>
            </div>
          )}

          {/* Forms */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={loginData.email}
                  onChange={handleLoginInputChange}
                  placeholder="you@company.com"
                  className={`w-full px-4 py-2.5 bg-white/[0.04] border rounded-lg text-white placeholder-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all ${
                    formErrors.email ? "border-error-500/50" : "border-white/[0.08]"
                  }`}
                />
                {formErrors.email && (
                  <p className="text-xs text-error-400">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Password</label>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={loginData.password}
                  onChange={handleLoginInputChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2.5 bg-white/[0.04] border rounded-lg text-white placeholder-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all ${
                    formErrors.password ? "border-error-500/50" : "border-white/[0.08]"
                  }`}
                />
                {formErrors.password && (
                  <p className="text-xs text-error-400">{formErrors.password}</p>
                )}
              </div>

              <MinimalButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={companyLoading}
                disabled={companyLoading}
              >
                Sign In
              </MinimalButton>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Company Name</label>
                <input
                  name="name"
                  type="text"
                  autoComplete="organization"
                  value={signupData.name}
                  onChange={handleSignupInputChange}
                  placeholder="Acme Inc."
                  className={`w-full px-4 py-2.5 bg-white/[0.04] border rounded-lg text-white placeholder-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all ${
                    formErrors.name ? "border-error-500/50" : "border-white/[0.08]"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-xs text-error-400">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={signupData.email}
                  onChange={handleSignupInputChange}
                  placeholder="you@company.com"
                  className={`w-full px-4 py-2.5 bg-white/[0.04] border rounded-lg text-white placeholder-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all ${
                    formErrors.email ? "border-error-500/50" : "border-white/[0.08]"
                  }`}
                />
                {formErrors.email && (
                  <p className="text-xs text-error-400">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Password</label>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={signupData.password}
                  onChange={handleSignupInputChange}
                  placeholder="Min. 8 characters"
                  className={`w-full px-4 py-2.5 bg-white/[0.04] border rounded-lg text-white placeholder-neutral-600 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all ${
                    formErrors.password ? "border-error-500/50" : "border-white/[0.08]"
                  }`}
                />
                {formErrors.password && (
                  <p className="text-xs text-error-400">{formErrors.password}</p>
                )}
              </div>

              <MinimalButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={companyLoading}
                disabled={companyLoading}
              >
                Create Account
              </MinimalButton>
            </form>
          )}

          <p className="mt-8 text-center text-xs text-neutral-600">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:w-[50%] flex-col justify-center px-12 xl:px-20 relative z-10">
        <div className="max-w-lg">
          <h1 className="text-4xl xl:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Build smarter customer{" "}
            <span className="bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
              experiences
            </span>
          </h1>
          <p className="mt-5 text-neutral-400 text-base leading-relaxed max-w-md">
            Deploy AI chatbots trained on your knowledge base. Embed anywhere with one line of code.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-start gap-3.5">
              <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-white">Quick Setup</p>
                <p className="text-sm text-neutral-500 mt-0.5">Upload docs and go live in minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-white">Analytics</p>
                <p className="text-sm text-neutral-500 mt-0.5">Track conversations and user insights</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-white">Custom Branding</p>
                <p className="text-sm text-neutral-500 mt-0.5">Match your brand with full customization</p>
              </div>
            </div>
          </div>

          <p className="mt-12 text-xs text-neutral-700">
            &copy; {new Date().getFullYear()} {APP_CONFIG.NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
