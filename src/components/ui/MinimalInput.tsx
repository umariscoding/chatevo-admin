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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value));
      props.onChange?.(e);
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
              peer w-full px-4 pt-6 pb-2.5 bg-white border rounded-lg
              border-neutral-300 text-neutral-900 placeholder-transparent
              focus:ring-2 focus:ring-primary-600/20 focus:border-primary-500 focus:outline-none
              transition-all duration-150
              ${error ? "border-error-400 focus:ring-error-500/20 focus:border-error-400" : ""}
              ${isPassword ? "pr-10" : ""}
              ${className}
            `}
            placeholder={label}
            autoComplete="new-password"
          />
          <label
            className={`
              absolute left-4 transition-all duration-150 pointer-events-none
              ${
                focused || hasValue
                  ? `top-2 text-xs font-medium ${error ? "text-error-500" : focused ? "text-primary-600" : "text-neutral-500"}`
                  : `top-1/2 -translate-y-1/2 text-sm text-neutral-400`
              }
            `}
          >
            {label}
          </label>

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          )}

          {error && (
            <p className="mt-1.5 text-xs text-error-500 font-medium">{error}</p>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-1.5 mb-1">
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            {...props}
            type={inputType}
            onChange={handleChange}
            className={`
              w-full px-4 py-2.5 bg-white border rounded-lg
              border-neutral-300 text-neutral-900 placeholder-neutral-400
              focus:ring-2 focus:ring-primary-600/20 focus:border-primary-500 focus:outline-none
              transition-all duration-150
              ${error ? "border-error-400 focus:ring-error-500/20 focus:border-error-400" : ""}
              ${isPassword ? "pr-10" : ""}
              ${className}
            `}
            autoComplete="new-password"
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          )}
        </div>

        {error && (
          <p className="text-xs text-error-500 font-medium">{error}</p>
        )}
      </div>
    );
  },
);

MinimalInput.displayName = "MinimalInput";

export default MinimalInput;
