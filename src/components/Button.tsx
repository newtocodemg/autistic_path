import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { ButtonProps } from "../types";

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  // Base classes for the button
  const baseClass = "relative inline-flex items-center justify-center font-medium font-sans select-none overflow-hidden cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 smooth-transition";

  // Variant classes mapping
  const variantClasses = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary-hover active:bg-brand-primary-hover/90 shadow-premium-sm border border-transparent",
    secondary: "bg-brand-secondary text-white hover:bg-brand-secondary-hover active:bg-brand-secondary-hover/90 shadow-premium-sm border border-transparent",
    outline: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200",
    soft: "bg-brand-primary-soft text-brand-primary hover:bg-blue-100/80 hover:text-brand-primary-hover active:bg-blue-200/50",
  };

  // Size classes mapping - beautiful density and spatial padding
  const sizeClasses = {
    sm: "px-4 py-2 text-xs rounded-premium-sm gap-1.5",
    md: "px-5 py-3 text-sm rounded-premium gap-2",
    lg: "px-6 py-4 text-base rounded-premium-lg gap-2.5",
  };

  return (
    <motion.button
      whileTap={disabled || isLoading ? {} : { scale: 0.97 }}
      disabled={disabled || isLoading}
      className={`${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...(props as any)}
    >
      {isLoading && (
        <Loader2 className="h-4 w-4 animate-spin text-current" />
      )}
      {!isLoading && leftIcon && (
        <span className="flex items-center justify-center shrink-0">{leftIcon}</span>
      )}
      <span className="relative flex items-center justify-center gap-1.5 text-center font-medium">
        {children}
      </span>
      {!isLoading && rightIcon && (
        <span className="flex items-center justify-center shrink-0">{rightIcon}</span>
      )}
    </motion.button>
  );
}
