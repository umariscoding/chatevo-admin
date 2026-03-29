import React from "react";
import { Switch } from "@headlessui/react";

import type { ToggleProps } from "@/interfaces/Toggle.interface";

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  size = "md",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) => {
  const sizeConfig = {
    sm: { track: "h-[22px] w-[40px]", thumb: "h-[16px] w-[16px]", translate: 18, padding: 3 },
    md: { track: "h-[26px] w-[48px]", thumb: "h-[20px] w-[20px]", translate: 22, padding: 3 },
    lg: { track: "h-[32px] w-[56px]", thumb: "h-[24px] w-[24px]", translate: 24, padding: 4 },
  };

  const variantColors = {
    primary: { on: "bg-primary-600", glow: "shadow-primary-500/25" },
    success: { on: "bg-teal-500", glow: "shadow-teal-500/25" },
    warning: { on: "bg-amber-500", glow: "shadow-amber-500/25" },
    error: { on: "bg-red-500", glow: "shadow-red-500/25" },
  };

  const config = sizeConfig[size];
  const colors = variantColors[variant];

  const handleChange = (val: boolean) => {
    if (!disabled && !loading) onChange(val);
  };

  const switchEl = (
    <Switch
      checked={checked}
      onChange={handleChange}
      disabled={disabled || loading}
      className={`
        ${config.track}
        ${checked ? `${colors.on} shadow-lg ${colors.glow}` : "bg-neutral-200/80"}
        relative inline-flex shrink-0 cursor-pointer rounded-full
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500/40
        ${disabled || loading ? "opacity-40 cursor-not-allowed saturate-0" : "hover:brightness-105 active:scale-[0.97]"}
        ${className}
      `.trim()}
      {...props}
    >
      <span className="sr-only">{label || "Toggle"}</span>
      <span
        className={`
          ${config.thumb}
          pointer-events-none inline-block rounded-full bg-white
          transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${checked ? "shadow-md" : "shadow-sm"}
        `.trim()}
        style={{
          transform: `translateX(${checked ? config.translate : 0}px)`,
          marginTop: config.padding,
          marginLeft: config.padding,
        }}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="block w-2.5 h-2.5 border-[1.5px] border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
          </span>
        )}
      </span>
    </Switch>
  );

  if (label || description) {
    return (
      <Switch.Group>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            {label && (
              <Switch.Label className="text-sm font-medium text-neutral-900 cursor-pointer select-none">
                {label}
              </Switch.Label>
            )}
            {description && (
              <Switch.Description className="text-[13px] text-neutral-500 mt-0.5">
                {description}
              </Switch.Description>
            )}
          </div>
          {switchEl}
        </div>
      </Switch.Group>
    );
  }

  return switchEl;
};

export default Toggle;
