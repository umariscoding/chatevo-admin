"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface MinimalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  variant?: "default" | "floating";
  theme?: "light" | "dark" | "auth";
}

const MinimalInput = React.forwardRef<HTMLInputElement, MinimalInputProps>(
  (
    {
      label,
      error,
      variant = "floating",
      theme = "dark",
      className = "",
      type = "text",
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(
      Boolean(props.value || props.defaultValue),
    );
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    // Theme-based styles
    const themeStyles = {
      light: {
        input:
          "border-border-light text-text-primary focus:border-primary-600 focus:ring-primary-600/30 hover:border-border-medium",
        label: {
          default: "text-text-secondary",
          focused: "text-primary-600",
          error: "text-error-600",
        },
        error: "text-error-600",
        passwordToggle: "text-text-secondary hover:text-text-primary",
      },
      dark: {
        input:
          "border-neutral-700 text-neutral-50 focus:border-primary-600 focus:ring-primary-600/30",
        label: {
          default: "text-neutral-500",
          focused: "text-neutral-50",
          error: "text-error-400",
        },
        error: "text-error-400",
        passwordToggle: "text-neutral-400 hover:text-neutral-300",
      },
      auth: {
        input:
          "border-neutral-700 text-neutral-100 focus:border-primary-600 focus:ring-primary-600/30",
        label: {
          default: "text-neutral-400",
          focused: "text-primary-400",
          error: "text-error-400",
        },
        error: "text-error-400",
        passwordToggle: "text-neutral-400 hover:text-neutral-300",
      },
    };

    const currentTheme = themeStyles[theme];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value));
      props.onChange?.(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    if (variant === "floating") {
      return (
        <div className="relative mb-1">
          <input
            ref={ref}
            {...props}
            type={inputType}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              peer w-full px-4 pt-6 pb-3 bg-transparent border rounded-xl
              ${currentTheme.input} placeholder-transparent
              focus:ring-1 focus:outline-none 
              transition-all duration-200 autofill:bg-transparent
              ${error ? "border-error-500" : ""}
              ${isPassword ? "pr-10" : ""}
              ${className}
            `}
            placeholder={label}
            autoComplete="new-password" // Prevents browser autofill
          />
          <label
            className={`
              absolute left-4 transition-all duration-200 pointer-events-none
              ${
                focused || hasValue
                  ? `top-2 text-xs font-medium ${focused ? currentTheme.label.focused : currentTheme.label.default}`
                  : `top-1/2 -translate-y-1/2 text-sm ${currentTheme.label.default}`
              }
              ${error ? currentTheme.label.error : ""}
            `}
          >
            {label}
          </label>

          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none ${currentTheme.passwordToggle}`}
              tabIndex={-1}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          )}

          {error && (
            <p className={`mt-1 text-sm font-medium ${currentTheme.error}`}>
              {error}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2 mb-1">
        <label
          className={`block text-sm font-medium ${currentTheme.label.default}`}
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            {...props}
            type={inputType}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 ${theme === "light" ? "bg-bg-primary" : "bg-neutral-900/50"} border rounded-xl
              ${currentTheme.input} ${theme === "light" ? "placeholder-text-placeholder" : "placeholder-neutral-500"}
              focus:ring-1 focus:outline-none
              transition-all duration-200 autofill:bg-transparent
              ${error ? "border-error-500" : ""}
              ${isPassword ? "pr-10" : ""}
              ${className}
            `}
            autoComplete="new-password" // Prevents browser autofill
          />

          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none ${currentTheme.passwordToggle}`}
              tabIndex={-1}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          )}
        </div>

        {error && (
          <p className={`text-sm font-medium ${currentTheme.error}`}>{error}</p>
        )}
      </div>
    );
  },
);

MinimalInput.displayName = "MinimalInput";

export default MinimalInput;
