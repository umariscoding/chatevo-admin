"use client";

import React, { useRef } from "react";
import { useCompanyAppDispatch, useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import { createCheckout, clearBillingError } from "@/store/company/slices/billingSlice";
import { Icons } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";

interface UpgradePromptProps {
  feature: string;
  description?: string;
}

export default function UpgradePrompt({
  feature,
  description,
}: UpgradePromptProps) {
  const dispatch = useCompanyAppDispatch();
  const { checkoutLoading, error } = useCompanyAppSelector((state) => state.billing);
  const clickedRef = useRef(false);

  const handleUpgrade = async () => {
    if (clickedRef.current || checkoutLoading) return;
    clickedRef.current = true;

    try {
      dispatch(clearBillingError());
      const result = await dispatch(createCheckout()).unwrap();

      const checkout = result.checkout_url;
      if (!checkout) throw new Error("No checkout URL returned");

      let host: string;
      try {
        host = new URL(checkout).hostname;
      } catch {
        throw new Error("Invalid checkout URL received");
      }
      if (!host.endsWith(".lemonsqueezy.com") && host !== "lemonsqueezy.com") {
        throw new Error("Invalid checkout URL received");
      }

      window.location.href = result.checkout_url;
    } catch (err: any) {
      console.error("Failed to create checkout:", err);
      clickedRef.current = false;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
          <Icons.Crown className="h-3.5 w-3.5 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-neutral-700">{feature}</p>
          {description && (
            <p className="text-[11px] text-neutral-400 mt-0.5">{description}</p>
          )}
        </div>
        <button
          onClick={handleUpgrade}
          disabled={checkoutLoading}
          aria-busy={checkoutLoading}
          aria-label={`Upgrade to Pro to unlock ${feature}`}
          className="px-3 py-1.5 text-[11px] font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-full transition-all disabled:opacity-40 flex items-center gap-1.5 flex-shrink-0"
        >
          {checkoutLoading ? (
            <IOSLoader size="sm" color="white" />
          ) : (
            <>
              <Icons.Zap className="h-3 w-3" />
              Upgrade
            </>
          )}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-600 px-1">{error}</p>
      )}
    </div>
  );
}
