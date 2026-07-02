import { motion } from "motion/react";
import { DotBadgeProps, PillBadgeProps, StatusBadgeProps } from "../types";

export function StatusBadge({ status, label, size = "md" }: StatusBadgeProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium font-sans rounded-full shrink-0";
  
  const statusClasses = {
    primary: "bg-brand-primary-soft text-brand-primary",
    secondary: "bg-brand-secondary-soft text-brand-secondary",
    success: "bg-green-50 text-green-700 border border-green-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    error: "bg-red-50 text-red-700 border border-red-100",
    info: "bg-sky-50 text-sky-700 border border-sky-100",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]} ${sizeClasses[size]}`}>
      {label}
    </span>
  );
}

export function PillBadge({ label, icon, size = "md", active = false, onClick }: PillBadgeProps) {
  const isClickable = !!onClick;
  
  const baseClasses = `inline-flex items-center gap-1.5 font-medium font-sans rounded-full shrink-0 border transition-all duration-200 select-none ${
    isClickable ? "cursor-pointer" : ""
  }`;

  const sizeClasses = {
    sm: "px-3 py-1 text-[11px]",
    md: "px-4 py-1.5 text-xs",
  };

  const stateClasses = active
    ? "bg-brand-primary border-brand-primary text-white shadow-premium-sm"
    : "bg-white border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100";

  if (isClickable) {
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`${baseClasses} ${sizeClasses[size]} ${stateClasses}`}
      >
        {icon && <span className="flex items-center shrink-0">{icon}</span>}
        <span>{label}</span>
      </motion.button>
    );
  }

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${stateClasses}`}>
      {icon && <span className="flex items-center shrink-0">{icon}</span>}
      <span>{label}</span>
    </span>
  );
}

export function DotBadge({ label, status = "active" }: DotBadgeProps) {
  const dotColor = {
    active: "bg-brand-secondary ring-brand-secondary/20",
    inactive: "bg-gray-300 ring-gray-300/20",
    pending: "bg-amber-500 ring-amber-500/20",
  };

  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium font-sans text-gray-600 bg-gray-50/50 border border-gray-100 px-2.5 py-1 rounded-full">
      <span className={`relative flex h-2 w-2 shrink-0 rounded-full`}>
        {status === "active" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-secondary opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor[status]} ring-2`}></span>
      </span>
      <span>{label}</span>
    </span>
  );
}
