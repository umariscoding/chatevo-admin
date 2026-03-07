"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  useCompanyAppSelector,
  useCompanyAppDispatch,
} from "@/hooks/company/useCompanyAuth";
import { logoutCompanyComprehensive } from "@/store/company/slices/companyAuthSlice";
import { Icons } from "@/components/ui";
import IOSLoader from "@/components/ui/IOSLoader";
import type { HeaderProps } from "@/interfaces/Header.interface";

const LogoutButton: React.FC = () => {
  const dispatch = useCompanyAppDispatch();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutCompanyComprehensive());
      router.push("/company/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {isLoggingOut ? (
        <IOSLoader size="sm" color="primary" />
      ) : (
        <>
          <Icons.Logout className="h-4 w-4" />
          <span>Sign out</span>
        </>
      )}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({
  className = "",
  onMenuToggle,
  showMobileMenuButton = true,
}) => {
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header
      className={`
        sticky top-0 z-20 h-14 flex items-center px-6
        bg-[#f8fafc]/95 backdrop-blur-md
        border-b border-slate-200/70
        ${className}
      `}
    >
      {/* Left side */}
      <div className="flex items-center gap-3 flex-1">
        {showMobileMenuButton && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 -ml-1 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Icons.Menu className="h-5 w-5" />
          </button>
        )}
        <span className="hidden sm:block text-sm text-slate-400 font-medium">
          {today}
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        <LogoutButton />
      </div>
    </header>
  );
};

export default Header;
