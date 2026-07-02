import { useState, useRef } from "react";
import { Search, X, Check, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import {
  CheckboxProps,
  FloatingLabelInputProps,
  RadioGroupProps,
  SearchInputProps,
  SegmentedControlProps,
  SelectProps,
  SwitchProps,
  TextInputProps,
  TextareaProps,
} from "../types";

// 1. Standard TextInput with modern visual state responses
export function TextInput({
  label,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  disabled,
  className = "",
  id,
  ...props
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const internalId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full font-sans ${className}`}>
      {label && (
        <label htmlFor={internalId} className="text-xs font-semibold text-gray-500 tracking-wide font-sans">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          id={internalId}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-white font-medium text-sm text-gray-800 rounded-premium h-12 transition-all duration-250 ease-out border placeholder-gray-400
            ${leftIcon ? "pl-11" : "pl-4"}
            ${rightIcon || error || success ? "pr-11" : "pr-4"}
            ${disabled ? "bg-gray-50 text-gray-400 border-gray-100" : ""}
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : success
                ? "border-brand-secondary/40 focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary-soft"
                : isFocused
                ? "border-brand-primary focus:ring-4 focus:ring-brand-primary-soft/50 shadow-premium-sm"
                : "border-gray-200 hover:border-gray-300"
            }
          `}
          {...props}
        />
        {/* Right Status Indicators */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center gap-1.5">
          {error && <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />}
          {success && <Check className="h-5 w-5 text-brand-secondary shrink-0" />}
          {!error && !success && rightIcon && <div className="text-gray-400 shrink-0">{rightIcon}</div>}
        </div>
      </div>
      
      {/* Helper text / error notifications */}
      {error ? (
        <p className="text-xs text-red-500 font-medium mt-0.5 flex items-center gap-1">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-gray-400 font-sans mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

// 2. FloatingLabelInput - elegant, minimalist input fields for onboarding
export function FloatingLabelInput({
  label,
  error,
  value,
  id,
  ...props
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const internalId = id || `floating-${Math.random().toString(36).slice(2, 9)}`;
  const hasValue = value !== undefined && value !== null && value.toString() !== "";

  return (
    <div className="flex flex-col w-full font-sans relative pt-2">
      <div className="relative">
        <input
          id={internalId}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-white font-medium text-sm text-gray-800 rounded-premium h-14 px-4 pt-4 border transition-all duration-250 ease-out placeholder-transparent
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : isFocused
                ? "border-brand-primary focus:ring-4 focus:ring-brand-primary-soft/50"
                : "border-gray-200 hover:border-gray-300"
            }
          `}
          {...props}
        />
        {/* Floating Label */}
        <label
          htmlFor={internalId}
          className={`absolute left-4 select-none pointer-events-none transition-all duration-200 origin-left
            ${
              isFocused || hasValue
                ? "-translate-y-2.5 scale-75 text-brand-primary font-bold"
                : "translate-y-3.5 scale-100 text-gray-400 font-medium"
            }
          `}
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}

// 3. Custom Dropdown Select
export function Select({
  label,
  options,
  error,
  helperText,
  className = "",
  id,
  ...props
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const internalId = id || `select-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full font-sans ${className}`}>
      {label && (
        <label htmlFor={internalId} className="text-xs font-semibold text-gray-500 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={internalId}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-white font-medium text-sm text-gray-800 rounded-premium h-12 px-4 pr-10 border transition-all duration-250 ease-out appearance-none
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : isFocused
                ? "border-brand-primary focus:ring-4 focus:ring-brand-primary-soft/50"
                : "border-gray-200 hover:border-gray-300"
            }
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron icon indicator */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error ? (
        <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-gray-400 font-sans mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}

// 4. SearchInput
export function SearchInput({
  placeholder = "Search metric, article, or resource...",
  value,
  onChange,
  onClear,
  className = "",
  ...props
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative w-full font-sans ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`w-full bg-white font-medium text-sm text-gray-800 rounded-premium h-11 pl-11 pr-11 border transition-all duration-250 ease-out placeholder-gray-400
          ${
            isFocused
              ? "border-brand-primary focus:ring-4 focus:ring-brand-primary-soft/50 shadow-premium-sm"
              : "border-gray-200 hover:border-gray-300"
          }
        `}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            if (onClear) onClear();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 smooth-transition rounded-full p-0.5 hover:bg-gray-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// 5. iOS Style tactile Switch Toggle (perfect 24px-28px layout)
export function Switch({ checked, onChange, label, description }: SwitchProps) {
  return (
    <label className="flex items-start gap-4 select-none cursor-pointer group font-sans">
      <div className="relative pt-0.5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <motion.div
          animate={{
            backgroundColor: checked ? "#2563EB" : "#E2E8F0",
          }}
          transition={{ duration: 0.2 }}
          className="w-11 h-6 rounded-full p-0.5 flex items-center smooth-transition"
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`w-5 h-5 rounded-full bg-white shadow-premium-sm ${
              checked ? "ml-5" : "ml-0"
            }`}
          />
        </motion.div>
      </div>
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && <span className="text-sm font-semibold text-gray-800 leading-snug">{label}</span>}
          {description && <span className="text-xs text-gray-400 leading-relaxed">{description}</span>}
        </div>
      )}
    </label>
  );
}

// 6. Custom Elegant Checkbox
export function Checkbox({ checked, onChange, label, description, error }: CheckboxProps) {
  return (
    <label className="flex items-start gap-3 select-none cursor-pointer group font-sans">
      <div className="relative pt-0.5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <motion.div
          whileTap={{ scale: 0.92 }}
          animate={{
            backgroundColor: checked ? "#22C55E" : "#FFFFFF",
            borderColor: checked ? "#22C55E" : error ? "#EF4444" : "#D1D5DB",
          }}
          transition={{ duration: 0.15 }}
          className={`w-5 h-5 rounded-md border flex items-center justify-center smooth-transition hover:border-gray-400`}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />
            </motion.div>
          )}
        </motion.div>
      </div>
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && <span className="text-sm font-semibold text-gray-700 leading-tight group-hover:text-gray-900 smooth-transition">{label}</span>}
          {description && <span className="text-xs text-gray-400 leading-relaxed">{description}</span>}
          {error && <span className="text-xs text-red-500 font-medium mt-1">{error}</span>}
        </div>
      )}
    </label>
  );
}

// 7. Custom Textarea
export function Textarea({
  label,
  error,
  helperText,
  className = "",
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const internalId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full font-sans ${className}`}>
      {label && (
        <label htmlFor={internalId} className="text-xs font-semibold text-gray-500 tracking-wide">
          {label}
        </label>
      )}
      <textarea
        id={internalId}
        rows={rows}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-white font-medium text-sm text-gray-800 rounded-premium p-4 border transition-all duration-250 ease-out placeholder-gray-400 resize-none
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : isFocused
              ? "border-brand-primary focus:ring-4 focus:ring-brand-primary-soft/50 shadow-premium-sm"
              : "border-gray-200 hover:border-gray-300"
          }
        `}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-gray-400 font-sans mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}

// 8. Custom Radio Group with descriptions
export function RadioGroup({ label, name, options, value, onChange, error }: RadioGroupProps) {
  return (
    <div className="flex flex-col gap-3 font-sans w-full">
      {label && <span className="text-xs font-semibold text-gray-500 tracking-wide">{label}</span>}
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-3.5 rounded-premium border select-none cursor-pointer transition-all duration-200 bg-white
                ${
                  isSelected
                    ? "border-brand-primary bg-brand-primary-soft/30 ring-1 ring-brand-primary"
                    : "border-gray-100 hover:border-gray-200"
                }
              `}
            >
              <div className="relative pt-0.5 shrink-0">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  onChange={() => onChange(opt.value)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center smooth-transition
                    ${isSelected ? "border-brand-primary" : "border-gray-300"}
                  `}
                >
                  {isSelected && (
                    <motion.div
                      layoutId={`radio-dot-${name}`}
                      className="w-2.5 h-2.5 rounded-full bg-brand-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">{opt.label}</span>
                {opt.description && <span className="text-xs text-gray-400 leading-normal mt-0.5">{opt.description}</span>}
              </div>
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>}
    </div>
  );
}

// 9. Minimalist Segmented Control - gorgeous sliding pills!
export function SegmentedControl({ options, value, onChange, label }: SegmentedControlProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full font-sans">
      {label && (
        <span className="text-xs font-semibold text-gray-500 tracking-wide">
          {label}
        </span>
      )}
      <div className="relative flex p-1 bg-gray-100/90 rounded-premium w-full select-none">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className="relative flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-gray-600 rounded-premium-sm transition-colors duration-200 z-10 hover:text-gray-900"
            >
              {option.icon && <span className="shrink-0">{option.icon}</span>}
              <span>{option.label}</span>

              {/* Shared animated backdrop sliding block */}
              {isSelected && (
                <motion.div
                  layoutId="activeSegment"
                  className="absolute inset-0 bg-white rounded-premium-sm shadow-premium-sm border border-gray-100 -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
