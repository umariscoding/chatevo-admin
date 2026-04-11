"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import MinimalButton from "@/components/ui/MinimalButton";
import {
  useCompanyAppDispatch,
  useCompanyAppSelector,
} from "@/hooks/company/useCompanyAuth";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import {
  loginCompany,
  registerCompany,
  googleAuthCompany,
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
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) return;
    setGoogleLoading(true);
    try {
      await dispatch(
        googleAuthCompany({ credential: response.credential }),
      ).unwrap();
    } catch (error) {
      console.error("Google auth failed:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

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

  const inputBase =
    "w-full px-4 py-2.5 bg-white border rounded-full text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all";
  const inputOk = "border-neutral-200";
  const inputErr = "border-error-500/50";

  return (
    <div className="h-screen flex overflow-hidden">
      {/* ====== LEFT — Light form panel (scrolls independently) ====== */}
      <div className="flex-1 lg:w-[50%] overflow-y-auto bg-neutral-50">
        <div className="flex flex-col justify-center min-h-full py-12 px-6 sm:px-12 lg:pl-16 lg:pr-12">
          <div className="mx-auto w-full max-w-sm">
            {/* Logo */}
            <div className="mb-10">
              <Image
                src="/wordmark.svg"
                alt={APP_CONFIG.NAME}
                width={200}
                height={64}
                className="h-11 w-auto"
              />
            </div>

            {/* Tab switch */}
            <div className="mb-8">
              <div className="flex bg-neutral-100 border border-neutral-200 rounded-full p-1">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-full transition-all duration-150 ${
                    isLogin
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-full transition-all duration-150 ${
                    !isLogin
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700"
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
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
              <div className="mb-5 flex items-start gap-3 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-full text-sm">
                <svg className="w-4 h-4 text-error-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
              <>
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</label>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={loginData.email}
                      onChange={handleLoginInputChange}
                      placeholder="you@company.com"
                      className={`${inputBase} ${formErrors.email ? inputErr : inputOk}`}
                    />
                    {formErrors.email && <p className="text-xs text-error-500">{formErrors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">Password</label>
                    <input
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={loginData.password}
                      onChange={handleLoginInputChange}
                      placeholder="Enter your password"
                      className={`${inputBase} ${formErrors.password ? inputErr : inputOk}`}
                    />
                    {formErrors.password && <p className="text-xs text-error-500">{formErrors.password}</p>}
                  </div>

                  <MinimalButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={companyLoading}
                    disabled={companyLoading}
                    className=""
                  >
                    Sign In
                  </MinimalButton>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-neutral-50 px-3 text-neutral-400">or</span>
                  </div>
                </div>

                <div className="w-full [&>div]:!w-full [&_iframe]:!w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => dispatch(clearError())}
                    size="large"
                    width="384"
                    text="signin_with"
                  />
                </div>
              </>
            ) : (
              <>
                <form onSubmit={handleSignupSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">Company Name</label>
                    <input
                      name="name"
                      type="text"
                      autoComplete="organization"
                      value={signupData.name}
                      onChange={handleSignupInputChange}
                      placeholder="Acme Inc."
                      className={`${inputBase} ${formErrors.name ? inputErr : inputOk}`}
                    />
                    {formErrors.name && <p className="text-xs text-error-500">{formErrors.name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</label>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={signupData.email}
                      onChange={handleSignupInputChange}
                      placeholder="you@company.com"
                      className={`${inputBase} ${formErrors.email ? inputErr : inputOk}`}
                    />
                    {formErrors.email && <p className="text-xs text-error-500">{formErrors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">Password</label>
                    <input
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      value={signupData.password}
                      onChange={handleSignupInputChange}
                      placeholder="Min. 8 characters"
                      className={`${inputBase} ${formErrors.password ? inputErr : inputOk}`}
                    />
                    {formErrors.password && <p className="text-xs text-error-500">{formErrors.password}</p>}
                  </div>

                  <MinimalButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={companyLoading}
                    disabled={companyLoading}
                    className=""
                  >
                    Create Account
                  </MinimalButton>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-neutral-50 px-3 text-neutral-400">or</span>
                  </div>
                </div>

                <div className="w-full [&>div]:!w-full [&_iframe]:!w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => dispatch(clearError())}
                    size="large"
                    width="384"
                    text="signup_with"
                  />
                </div>
              </>
            )}

            <p className="mt-8 text-center text-xs text-neutral-400">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* ====== RIGHT — Dark orbital graphic (fixed, never scrolls) ====== */}
      <div className="hidden lg:flex lg:w-[50%] flex-col items-center justify-center relative overflow-hidden bg-neutral-950 border-l border-neutral-800/40">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-primary-500/[0.06] rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[280px] h-[280px] bg-primary-500/[0.03] rounded-full blur-[80px] pointer-events-none" />

        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(13,148,136,0.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Orbital composition */}
        <div className="relative w-[440px] h-[440px] flex-shrink-0">
          {/* SVG rings + dots */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 440 440" fill="none">
            <circle cx="220" cy="220" r="210" stroke="rgba(13,148,136,0.06)" strokeWidth="1" />
            <circle cx="220" cy="220" r="155" stroke="rgba(13,148,136,0.1)" strokeWidth="1" strokeDasharray="5 7" />
            <circle cx="220" cy="220" r="85" stroke="rgba(13,148,136,0.15)" strokeWidth="1" />

            <circle cx="430" cy="220" r="3" fill="rgba(13,148,136,0.35)" />
            <circle cx="220" cy="10" r="2.5" fill="rgba(13,148,136,0.25)" />
            <circle cx="75" cy="345" r="3" fill="rgba(13,148,136,0.30)" />
            <circle cx="360" cy="90" r="2" fill="rgba(13,148,136,0.20)" />
            <circle cx="55" cy="160" r="2.5" fill="rgba(13,148,136,0.25)" />
            <circle cx="330" cy="385" r="2" fill="rgba(13,148,136,0.18)" />
            <circle cx="145" cy="55" r="2" fill="rgba(13,148,136,0.22)" />
            <circle cx="390" cy="310" r="2.5" fill="rgba(13,148,136,0.20)" />
          </svg>

          {/* Center logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-primary-500/[0.12] border border-primary-500/25 flex items-center justify-center shadow-glow-lg">
            <svg className="w-10 h-10 text-primary-400" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="24" height="24" rx="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 12.5C9 11.12 10.12 10 11.5 10h5c1.38 0 2.5 1.12 2.5 2.5v3c0 1.38-1.12 2.5-2.5 2.5H13l-2.5 2V18h-.5A1.5 1.5 0 019 16.5v-4z" fill="currentColor" opacity="0.7" />
            </svg>
          </div>

          {/* Floating cards */}

          {/* AI response card */}
          <div className="absolute -top-2 right-0 animate-float-gentle" style={{ animationDelay: "0s" }}>
            <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800/80 rounded-xl p-3.5 shadow-xl w-56">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-5 h-5 rounded-md bg-primary-500/15 flex items-center justify-center">
                  <svg className="w-3 h-3 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-neutral-400">AI Response</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Your chatbot is live! Embed it on any page with one script tag.
              </p>
            </div>
          </div>

          {/* Messages stat */}
          <div className="absolute bottom-10 -left-6 animate-float-gentle" style={{ animationDelay: "2s" }}>
            <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800/80 rounded-xl p-3.5 shadow-xl">
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-0.5">Messages today</p>
              <p className="text-xl font-bold text-white tracking-tight">10,482</p>
            </div>
          </div>

          {/* Uptime badge */}
          <div className="absolute top-[30%] -left-8 animate-float-gentle" style={{ animationDelay: "4s" }}>
            <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800/80 rounded-xl px-3.5 py-2.5 shadow-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-400" />
              <span className="text-xs font-medium text-neutral-300">99.9% uptime</span>
            </div>
          </div>

          {/* Docs badge */}
          <div className="absolute bottom-2 right-4 animate-float-gentle" style={{ animationDelay: "1s" }}>
            <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800/80 rounded-xl px-3.5 py-2.5 shadow-xl flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="text-xs font-medium text-neutral-300">12 docs indexed</span>
            </div>
          </div>

          {/* Response time badge */}
          <div className="absolute top-16 left-4 animate-float-gentle" style={{ animationDelay: "3s" }}>
            <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800/80 rounded-xl px-3.5 py-2.5 shadow-xl flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <span className="text-xs font-medium text-neutral-300">&lt;200ms response</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="absolute bottom-6 text-[11px] text-neutral-700">
          &copy; {new Date().getFullYear()} {APP_CONFIG.NAME}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
