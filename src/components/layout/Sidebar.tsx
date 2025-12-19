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
}

const NavigationItemComponent: React.FC<
  NavigationItemComponentProps & { onNavigate?: () => void }
> = ({ item, current, onNavigate }) => {
  const Icon = item.icon;

  const handleClick = () => {
    // Close mobile sidebar on navigation
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <Link
      href={item.href}
      className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative ${
        current
          ? "bg-primary-600/10 text-primary-400 shadow-sm border border-primary-600/20"
          : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-hover"
      }`}
      prefetch={true}
      onClick={handleClick}
    >
      {current && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary-600 rounded-r-full" />
      )}
      <Icon
        className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors ${
          current
            ? "text-primary-400"
            : "text-sidebar-text-muted group-hover:text-sidebar-text-hover"
        }`}
      />
      <span className="truncate">{item.name}</span>
      {item.badge && (
        <span className="ml-auto inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-primary-600/10 text-primary-400 border border-primary-600/20">
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

  // Company sidebar always shows company items
  const currentUserType = "company";

  // Filter navigation items based on user type
  const filteredSections = navigationSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.allowedUserTypes.includes(currentUserType),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-neutral-900/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className="relative h-full">
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-sidebar-bg transform transition-all duration-300 ease-in-out shadow-2xl
            md:relative md:translate-x-0 md:z-0 md:h-full
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            ${className}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Logo/Header area */}
            <div className="flex-shrink-0 flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg shadow-primary-600/20">
                    <span className="text-white font-bold text-sm">C</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-sidebar-text-active">
                    Chatelio
                  </h2>
                  <p className="text-xs text-sidebar-text-muted">
                    AI Dashboard
                  </p>
                </div>
              </div>
              {/* Close button for mobile */}
              <button
                onClick={onClose}
                className="md:hidden p-2 rounded-lg text-sidebar-text-muted hover:text-sidebar-text-hover hover:bg-sidebar-hover transition-colors"
              >
                <Icons.Close className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
              {filteredSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-2">
                  {section.title && (
                    <div className="px-3 py-2">
                      <h3 className="text-xs font-semibold text-sidebar-text-muted uppercase tracking-wider">
                        {section.title}
                      </h3>
                    </div>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavigationItemComponent
                        key={item.name}
                        item={item}
                        current={pathname === item.href}
                        onNavigate={onClose}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
