import { Icons } from "@/components/ui";

/**
 * Small "Pro" pill badge shown next to features that require a paid plan.
 * Use this instead of duplicating the badge markup in every page.
 */
export default function ProBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
      <Icons.Crown className="h-3 w-3" />
      Pro
    </span>
  );
}
