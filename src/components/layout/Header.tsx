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
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-all duration-150 disabled:opacity-40"
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
        bg-white/80 backdrop-blur-md
        border-b border-neutral-200/60
        ${className}
      `}
    >
      <div className="flex items-center gap-3 flex-1">
        {showMobileMenuButton && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 -ml-1 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <Icons.Menu className="h-5 w-5" />
          </button>
        )}
        <span className="hidden sm:block text-sm text-neutral-400">
          {today}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <LogoutButton />
      </div>
    </header>
  );
};

export default Header;
