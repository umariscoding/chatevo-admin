import React, { memo } from "react";
import IOSLoader from "./IOSLoader";

import type { ButtonProps } from "@/interfaces/Button.interface";

const Button = memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        className,
        variant = "primary",
        size = "md",
        loading,
        children,
        disabled,
        ...props
      },
      ref,
    ) => {
      const baseClasses =
        "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

      const variants = {
        primary:
          "bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-sm hover:shadow-md",
        secondary:
          "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 rounded-full",
        outline:
          "border border-neutral-300 bg-transparent hover:bg-primary-50 text-neutral-700 hover:text-primary-600 hover:border-primary-400 rounded-full",
        ghost:
          "hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 rounded-full",
        destructive:
          "bg-error-600 text-white hover:bg-error-700 rounded-full shadow-sm",
      };

      const sizes = {
        sm: "h-8 px-3 text-sm gap-1.5",
        md: "h-9 py-2 px-4 text-sm gap-2",
        lg: "h-10 px-6 text-base gap-2",
      };

      const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className || ""}`;

      return (
        <button
          className={classes}
          ref={ref}
          disabled={disabled || loading}
          {...props}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <IOSLoader size="sm" color={variant === "primary" || variant === "destructive" ? "white" : "primary"} />
              <span>Loading...</span>
            </div>
          ) : (
            children
          )}
        </button>
      );
    },
  ),
);

Button.displayName = "Button";

export default Button;
