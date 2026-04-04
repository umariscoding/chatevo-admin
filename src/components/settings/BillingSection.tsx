"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  useCompanyAppSelector,
  useCompanyAppDispatch,
} from "@/hooks/company/useCompanyAuth";
import { verifyCompanyToken } from "@/store/company/slices/companyAuthSlice";
import {
  createCheckout,
  cancelSubscription,
  resumeSubscription,
  clearBillingError,
} from "@/store/company/slices/billingSlice";
import { Icons } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import { usePlan } from "@/hooks/usePlan";

const PRO_FEATURES = [
  "Upload documents (PDF, DOCX)",
  "Choose your AI model",
  "Custom tone & instructions",
  "Embed widget customization",
  "User portal with login & history",
];

function isLemonSqueezyUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname.endsWith(".lemonsqueezy.com") ||
      parsed.hostname === "lemonsqueezy.com"
    );
  } catch {
    return false;
  }
}

export default function BillingSection() {
  const dispatch = useCompanyAppDispatch();
  const { isPro, isFree, isCancelled, subscriptionEndsAt, subscriptionRenewsAt } = usePlan();
  const { checkoutLoading, loading: billingLoading } = useCompanyAppSelector(
    (state) => state.billing,
  );

  const [billingSuccess, setBillingSuccess] = useState(false);
  const [billingActivating, setBillingActivating] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const upgradeClickedRef = useRef(false);

  // ── Post-checkout polling ──────────────────────────────────────────
  // When the user returns from LemonSqueezy checkout (?billing=success),
  // poll verifyCompanyToken a few times to pick up the webhook update.
  const polledRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || polledRef.current) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("billing") !== "success") return;

    polledRef.current = true;
    window.history.replaceState({}, "", window.location.pathname);
    setBillingActivating(true);
    setError(null);

    let attempts = 0;
    const maxAttempts = 5;
    const delay = 3_000;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;
      attempts++;

      const result = await dispatch(verifyCompanyToken())
        .unwrap()
        .catch(() => null);

      if (result?.company?.plan === "pro" || attempts >= maxAttempts) {
        setBillingActivating(false);
        setBillingSuccess(true);
        return;
      }

      timer = setTimeout(poll, delay);
    };

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [dispatch]);

  // ── Handlers ───────────────────────────────────────────────────────

  const handleUpgrade = useCallback(async () => {
    if (upgradeClickedRef.current || checkoutLoading) return;
    upgradeClickedRef.current = true;
    setError(null);

    try {
      dispatch(clearBillingError());
      const result = await dispatch(createCheckout()).unwrap();

      if (!result.checkout_url || !isLemonSqueezyUrl(result.checkout_url)) {
        throw new Error("Received an invalid checkout URL");
      }

      window.location.href = result.checkout_url;
    } catch (err: any) {
      setError(err?.message || "Failed to start checkout. Please try again.");
      upgradeClickedRef.current = false;
    }
  }, [dispatch, checkoutLoading]);

  const handleCancel = useCallback(async () => {
    setError(null);
    try {
      await dispatch(cancelSubscription()).unwrap();
      setShowCancelConfirm(false);
      dispatch(verifyCompanyToken());
    } catch (err: any) {
      setError(err?.message || "Failed to cancel subscription. Please try again.");
    }
  }, [dispatch]);

  const handleResume = useCallback(async () => {
    setError(null);
    try {
      await dispatch(resumeSubscription()).unwrap();
      dispatch(verifyCompanyToken());
    } catch (err: any) {
      setError(err?.message || "Failed to resume subscription. Please try again.");
    }
  }, [dispatch]);

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="mb-4 space-y-3">
      {/* Status banners */}
      {billingActivating && (
        <div className="flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl px-4 py-3">
          <IOSLoader size="sm" color="primary" />
          <p className="text-sm text-primary-700 font-medium">
            Activating your Pro account...
          </p>
        </div>
      )}

      {billingSuccess && !billingActivating && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <Icons.CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-700 font-medium flex-1">
            Welcome to Pro! Your subscription is now active.
          </p>
          <button
            onClick={() => setBillingSuccess(false)}
            className="text-green-400 hover:text-green-600 transition-colors"
          >
            <Icons.Close className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Icons.AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <Icons.Close className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Billing card */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center">
              <Icons.CreditCard className="h-3.5 w-3.5 text-neutral-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Billing
            </span>
          </div>

          {/* Current plan display */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isPro
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/25"
                    : "bg-neutral-100"
                }`}
              >
                <Icons.Crown
                  className={`h-4 w-4 ${isPro ? "text-white" : "text-neutral-400"}`}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900">
                    {isPro ? "Pro" : "Free"} Plan
                  </span>
                  {isPro && !isCancelled && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold uppercase tracking-wider">
                      Active
                    </span>
                  )}
                  {isCancelled && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold uppercase tracking-wider">
                      Cancelling
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {isFree && "Upgrade to unlock all features"}
                  {isPro && !isCancelled && subscriptionRenewsAt && (
                    <>Renews {new Date(subscriptionRenewsAt).toLocaleDateString()}</>
                  )}
                  {isCancelled && subscriptionEndsAt && (
                    <>Access until {new Date(subscriptionEndsAt).toLocaleDateString()}</>
                  )}
                  {isPro && !isCancelled && !subscriptionRenewsAt && "$99/month"}
                </p>
              </div>
            </div>

            {isPro && !isCancelled && (
              <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-full">
                $99/mo
              </span>
            )}
          </div>

          {/* Free plan — upgrade CTA */}
          {isFree && (
            <div className="bg-gradient-to-br from-neutral-50 to-primary-50/30 border border-neutral-200 rounded-xl p-4">
              <div className="space-y-2.5 mb-4">
                {PRO_FEATURES.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <Icons.CheckCircle className="h-3.5 w-3.5 text-primary-500 flex-shrink-0" />
                    <span className="text-xs text-neutral-600">{feature}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleUpgrade}
                disabled={checkoutLoading}
                aria-busy={checkoutLoading}
                className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {checkoutLoading ? (
                  <IOSLoader size="sm" color="white" />
                ) : (
                  <>
                    <Icons.Zap className="h-3.5 w-3.5" />
                    Upgrade to Pro — $99/mo
                  </>
                )}
              </button>
            </div>
          )}

          {/* Pro plan — manage */}
          {isPro && !isCancelled && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
            >
              Cancel subscription
            </button>
          )}

          {/* Cancelled — resume */}
          {isCancelled && (
            <button
              onClick={handleResume}
              disabled={billingLoading}
              aria-busy={billingLoading}
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {billingLoading ? (
                <IOSLoader size="sm" color="white" />
              ) : (
                <>
                  <Icons.Zap className="h-3.5 w-3.5" />
                  Resume subscription
                </>
              )}
            </button>
          )}

          {/* Cancel confirmation dialog */}
          {showCancelConfirm && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700 font-medium mb-1">
                Cancel your subscription?
              </p>
              <p className="text-xs text-red-600 mb-3">
                You&#39;ll keep Pro access until the end of your billing period.
                After that, your plan will revert to Free.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  disabled={billingLoading}
                  aria-busy={billingLoading}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-full transition-all disabled:opacity-40 flex items-center gap-1.5"
                >
                  {billingLoading ? (
                    <IOSLoader size="sm" color="white" />
                  ) : (
                    "Yes, cancel"
                  )}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={billingLoading}
                  className="px-3.5 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-700 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-all disabled:opacity-40"
                >
                  Keep subscription
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
