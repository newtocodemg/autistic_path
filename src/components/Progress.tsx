import { Check, Circle } from "lucide-react";
import { motion } from "motion/react";
import {
  CircularProgressProps,
  LinearProgressProps,
  StepProgressTrackerProps,
  TimelineProgressProps,
} from "../types";

// 1. Circular Progress (SVG Ring visualization for targets)
export function CircularProgress({
  percentage,
  label,
  valueText,
  subtitle,
  size = "md",
  color = "primary",
}: CircularProgressProps) {
  // Config sizing
  const sizeMap = {
    sm: { diameter: 70, stroke: 6, radius: 28 },
    md: { diameter: 100, stroke: 8, radius: 40 },
    lg: { diameter: 140, stroke: 10, radius: 55 },
  };

  const { diameter, stroke, radius } = sizeMap[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    primary: "stroke-brand-primary",
    secondary: "stroke-brand-secondary",
    warning: "stroke-amber-500",
  };

  const ringBg = "stroke-gray-100";

  return (
    <div className="flex flex-col items-center justify-center text-center font-sans">
      <div className="relative" style={{ width: diameter, height: diameter }}>
        <svg width={diameter} height={diameter} className="rotate-[-90deg]">
          {/* Background circle */}
          <circle
            className={ringBg}
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            strokeWidth={stroke}
            fill="transparent"
          />
          {/* Foreground animated stroke */}
          <motion.circle
            className={`${colorMap[color]}`}
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            strokeWidth={stroke}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold font-display text-gray-800">
            {valueText || `${percentage}%`}
          </span>
          {label && (
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {label}
            </span>
          )}
        </div>
      </div>

      {subtitle && (
        <span className="text-xs text-gray-500 font-medium mt-3 max-w-[120px] leading-snug">
          {subtitle}
        </span>
      )}
    </div>
  );
}

// 2. Linear Progress Bar
export function LinearProgress({
  percentage,
  label,
  valueText,
  statusColor = "primary",
  showPercentage = true,
}: LinearProgressProps) {
  const colorMap = {
    primary: "bg-brand-primary",
    secondary: "bg-brand-secondary",
    warning: "bg-amber-500",
    error: "bg-red-500",
  };

  return (
    <div className="flex flex-col gap-1.5 w-full font-sans">
      {(label || valueText || showPercentage) && (
        <div className="flex justify-between items-baseline">
          {label && <span className="text-xs font-semibold text-gray-500">{label}</span>}
          <span className="text-xs font-bold text-gray-700">
            {valueText || (showPercentage ? `${percentage}%` : "")}
          </span>
        </div>
      )}
      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${colorMap[statusColor]}`}
        />
      </div>
    </div>
  );
}

// 3. Step Progress Tracker (milestones indicator)
export function StepProgressTracker({ steps }: StepProgressTrackerProps) {
  return (
    <div className="flex flex-col w-full font-sans">
      <div className="relative flex justify-between items-start w-full">
        {/* Connector Line behind nodes */}
        <div className="absolute top-5 left-[30px] right-[30px] h-0.5 bg-gray-100 z-0" />

        {steps.map((step, idx) => {
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";

          return (
            <div key={idx} className="flex-1 flex flex-col items-center text-center relative z-10 group">
              {/* Node Dot / Checked ring */}
              <div className="mb-3.5">
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="h-10 w-10 rounded-full bg-brand-secondary text-white flex items-center justify-center shadow-premium-sm"
                  >
                    <Check className="h-5 w-5 stroke-[2.5px]" />
                  </motion.div>
                ) : isActive ? (
                  <div className="h-10 w-10 rounded-full bg-white border-[3px] border-brand-primary flex items-center justify-center shadow-premium-md relative">
                    {/* Ring pulsating halo */}
                    <span className="absolute -inset-1.5 rounded-full bg-brand-primary/10 animate-ping opacity-60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-primary" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center smooth-transition group-hover:border-gray-300">
                    <span className="text-xs font-bold">{idx + 1}</span>
                  </div>
                )}
              </div>

              {/* Text labels */}
              <div className="px-2 max-w-[140px]">
                <h5
                  className={`text-xs font-bold leading-tight ${
                    isActive ? "text-brand-primary" : "text-gray-700"
                  }`}
                >
                  {step.label}
                </h5>
                {step.description && (
                  <p className="text-[10px] text-gray-400 leading-normal mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 4. Timeline Progress
export function TimelineProgress({ items }: TimelineProgressProps) {
  return (
    <div className="flex flex-col font-sans relative pl-2">
      {/* Dynamic continuous connecting line */}
      <div className="absolute top-2 bottom-2 left-6 w-0.5 bg-gray-100" />

      <div className="space-y-6">
        {items.map((item, idx) => {
          return (
            <div key={idx} className="relative flex gap-5 pl-1.5 items-start">
              {/* Left Side Icon/Bullet Node */}
              <div className="relative z-10 shrink-0">
                {item.icon ? (
                  <div className="h-9 w-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-brand-primary shadow-premium-sm">
                    {item.icon}
                  </div>
                ) : (
                  <div className="h-9 w-9 rounded-full bg-white border-2 border-brand-primary-soft flex items-center justify-center text-brand-primary shadow-premium-sm">
                    <Circle className="h-3 w-3 fill-brand-primary text-brand-primary" />
                  </div>
                )}
              </div>

              {/* Right Side Content Block */}
              <div className="flex-1 bg-white p-4 rounded-premium border border-brand-border shadow-premium-sm hover:border-gray-200 smooth-transition">
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold text-brand-primary tracking-wider uppercase font-mono">
                    {item.date}
                  </span>
                  {item.status && (
                    <span className="text-[9px] font-bold bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  )}
                </div>
                <h6 className="text-sm font-bold text-gray-800 font-sans">{item.title}</h6>
                {item.subtitle && (
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
