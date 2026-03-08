"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import { Icons } from "@/components/ui";
import type {
  SidebarProps,
  NavigationItem,
  NavigationSection,
} from "@/interfaces/Sidebar.interface";

const getNavigationSections = (): NavigationSection[] => [
  {
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: Icons.Home,
        allowedUserTypes: ["company", "user"],
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        name: "Knowledge Base",
        href: "/knowledge-base",
        icon: Icons.Document,
        allowedUserTypes: ["company"],
      },
      {
        name: "Users",
        href: "/users",
        icon: Icons.User,
        allowedUserTypes: ["company"],
      },
    ],
  },
  {
    title: "Integration",
    items: [
      {
        name: "Embed Widget",
        href: "/embed",
        icon: Icons.Code,
        allowedUserTypes: ["company"],
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        name: "Settings",
        href: "/settings",
        icon: Icons.Settings,
        allowedUserTypes: ["company"],
      },
    ],
  },
];

interface NavigationItemComponentProps {
  item: NavigationItem;
  current: boolean;
  onNavigate?: () => void;
}

const NavigationItemComponent: React.FC<NavigationItemComponentProps> = ({
  item,
  current,
  onNavigate,
}) => {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
        current
          ? "bg-white/[0.08] text-white"
          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
      }`}
      prefetch={true}
    >
      {current && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-indigo-400" />
      )}

      <Icon
        className={`flex-shrink-0 h-4 w-4 transition-colors ${
          current ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
        }`}
      />
      <span className="truncate">{item.name}</span>

      {item.badge && (
        <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
          {item.badge}
        </span>
      )}
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  className = "",
  isOpen = true,
  onClose,
}) => {
  const pathname = usePathname();
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const navigationSections = getNavigationSections();

  const currentUserType = "company";

  const filteredSections = navigationSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.allowedUserTypes.includes(currentUserType)
      ),
    }))
    .filter((section) => section.items.length > 0);

  const companyName = companyAuth.company?.name || "Company";
  const companyInitial = companyName.charAt(0).toUpperCase();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div className="relative h-full">
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-72 flex flex-col
            bg-[#0b1120] border-r border-white/[0.06]
            transform transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0 md:z-0 md:h-full
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            ${className}
          `}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          {/* Brand */}
          <div className="flex-shrink-0 flex items-center justify-between h-14 px-5 border-b border-white/[0.05]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">C</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">Chatevo</p>
                <p className="text-slate-500 text-[10px] mt-0.5 font-medium tracking-wider uppercase">Admin</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-colors"
            >
              <Icons.Close className="h-4 w-4" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto min-h-0 space-y-5">
            {filteredSections.map((section, idx) => (
              <div key={idx} className="space-y-0.5">
                {section.title && (
                  <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-600">
                    {section.title}
                  </p>
                )}
                {section.items.map((item) => (
                  <NavigationItemComponent
                    key={item.name}
                    item={item}
                    current={pathname === item.href}
                    onNavigate={onClose}
                  />
                ))}
              </div>
            ))}
          </nav>

          <div className="mx-4 h-px bg-white/[0.05]" />

          {/* Footer */}
          <div className="flex-shrink-0 p-4">
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-indigo-300">{companyInitial}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate leading-none">{companyName}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Company</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
