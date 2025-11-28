"use client";

import React from "react";
import IOSLoader from "./IOSLoader";

interface MinimalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  theme?: "default" | "auth";
}

const MinimalButton = React.forwardRef<HTMLButtonElement, MinimalButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      className = "",
      children,
      disabled,
      theme = "default",
      ...props
    },
    ref,
  ) => {
    const baseClasses = `
      inline-flex items-center justify-center rounded-lg font-medium
      transition-all duration-200 focus:outline-none
      disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? "w-full" : ""}
    `;

    const defaultVariants = {
      primary: `
        bg-primary-600 hover:bg-primary-700 text-text-white
        focus:ring-2 focus:ring-primary-600/40 focus:ring-offset-1 focus:ring-offset-bg-primary
        shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30
      `,
      secondary: `
        bg-neutral-200 hover:bg-neutral-300 text-text-primary
        focus:ring-2 focus:ring-primary-600/40 focus:ring-offset-1 focus:ring-offset-bg-primary
        border border-border-light hover:border-border-medium
      `,
      ghost: `
        bg-transparent hover:bg-bg-secondary text-text-secondary hover:text-text-primary
        focus:ring-2 focus:ring-primary-600/40 focus:ring-offset-1 focus:ring-offset-bg-primary
      `,
      outline: `
        bg-transparent border border-border-light hover:border-primary-600
        text-text-secondary hover:text-primary-600 hover:bg-primary-50
        focus:ring-2 focus:ring-primary-600/40 focus:ring-offset-1 focus:ring-offset-bg-primary
      `,
    };

    const authVariants = {
      primary: `
        bg-primary-600 hover:bg-primary-700 text-text-white
        focus:ring-2 focus:ring-primary-600/40 focus:ring-offset-1 focus:ring-offset-sidebar-bg
        shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-600/40
      `,
      secondary: `
        bg-sidebar-hover hover:bg-sidebar-active text-sidebar-text
        focus:ring-2 focus:ring-primary-600/40 focus:ring-offset-1 focus:ring-offset-sidebar-bg
        border border-sidebar-border hover:border-neutral-600
      `,
      ghost: `
        bg-transparent hover:bg-sidebar-hover text-sidebar-text hover:text-sidebar-text-hover
        focus:ring-2 focus:ring-primary-600/40 focus:ring-offset-1 focus:ring-offset-sidebar-bg
      `,
      outline: `
        bg-transparent border border-sidebar-border hover:border-primary-600
        text-sidebar-text hover:text-sidebar-text-hover hover:bg-sidebar-hover
        focus:ring-2 focus:ring-primary-600/40 focus:ring-offset-1 focus:ring-offset-sidebar-bg
      `,
    };

    const variants = theme === "auth" ? authVariants : defaultVariants;

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-base",
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <IOSLoader size="sm" color="white" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  },
);

MinimalButton.displayName = "MinimalButton";

export default MinimalButton;
