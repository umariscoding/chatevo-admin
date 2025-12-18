"use client";

import React from "react";
import { Icons } from "@/components/ui";

export type SettingsSection = "profile" | "chatbot" | "publishing" | "embed";

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const sections = [
  {
    id: "profile" as const,
    label: "Profile",
    description: "Company information",
    icon: Icons.User,
  },
  {
    id: "chatbot" as const,
    label: "Chatbot",
    description: "Title and description",
    icon: Icons.Edit,
  },
  {
    id: "publishing" as const,
    label: "Publishing",
    description: "Public access control",
    icon: Icons.Globe,
  },
  {
    id: "embed" as const,
    label: "Embed Widget",
    description: "Website integration code",
    icon: Icons.Code,
  },
];

export default function SettingsSidebar({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  return (
    <nav className="space-y-1">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;

        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`
              w-full flex items-start space-x-3 px-4 py-3 rounded-xl transition-all
              ${
                isActive
                  ? "bg-primary-50 border-l-4 border-primary-600"
                  : "hover:bg-neutral-50 border-l-4 border-transparent"
              }
            `}
          >
            <div
              className={`
              p-2 rounded-lg mt-0.5
              ${isActive ? "bg-primary-100" : "bg-neutral-100"}
            `}
            >
              <Icon
                className={`h-4 w-4 ${isActive ? "text-primary-600" : "text-neutral-600"}`}
              />
            </div>
            <div className="flex-1 text-left">
              <p
                className={`text-sm font-semibold ${isActive ? "text-primary-900" : "text-neutral-900"}`}
              >
                {section.label}
              </p>
              <p className="text-xs text-neutral-500">{section.description}</p>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
