import React, { ReactNode } from "react";

// Button Types
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "soft";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

// Card Types
export interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: ReactNode;
  secondaryText?: string;
}

export interface HealthMetricCardProps {
  id?: string;
  metricName: string;
  currentScore: number;
  maxScore?: number;
  unit?: string;
  statusText: string;
  statusType: "excellent" | "good" | "monitoring" | "action";
  progress: number; // 0 to 100
  historyData?: number[]; // Simple Sparkline data
  suggestion?: string;
}

export interface InformationCardProps {
  id?: string;
  tag?: string;
  title: string;
  description: string;
  badgeText?: string;
  imageUrl?: string;
  actionText?: string;
  onClick?: () => void;
}

export interface ActionCardProps {
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: ReactNode;
  buttonText: string;
  buttonVariant?: ButtonVariant;
  onClick?: () => void;
}

export interface GlassCardProps {
  id?: string;
  title: string;
  description: string;
  icon?: ReactNode;
  badgeText?: string;
  backgroundGradient?: string; // Tailwind class e.g. "from-blue-50 to-indigo-50"
}

// Input Types
export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  error?: string;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps {
  label?: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

// Progress Card Types
export interface CircularProgressProps {
  percentage: number;
  label?: string;
  valueText?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "warning";
}

export interface LinearProgressProps {
  percentage: number;
  label?: string;
  valueText?: string;
  statusColor?: "primary" | "secondary" | "warning" | "error";
  showPercentage?: boolean;
}

export interface StepItem {
  label: string;
  description?: string;
  status: "completed" | "active" | "upcoming";
}

export interface StepProgressTrackerProps {
  steps: StepItem[];
}

export interface TimelineItem {
  title: string;
  subtitle?: string;
  date: string;
  status?: string;
  icon?: ReactNode;
}

export interface TimelineProgressProps {
  items: TimelineItem[];
}

// Badge Types
export interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "info" | "primary" | "secondary";
  label: string;
  size?: "sm" | "md";
}

export interface PillBadgeProps {
  label: string;
  icon?: ReactNode;
  size?: "sm" | "md";
  active?: boolean;
  onClick?: () => void;
}

export interface DotBadgeProps {
  label: string;
  status?: "active" | "inactive" | "pending";
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface SidebarProps {
  items: NavItem[];
  activeId: string;
  onChange: (id: string) => void;
  collapsed?: boolean;
  onLogout?: () => void;
}

export interface BottomNavigationProps {
  items: NavItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

// Dialog Types
export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "info" | "warning" | "danger";
}

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "left" | "right";
  title?: string;
  children: ReactNode;
}
