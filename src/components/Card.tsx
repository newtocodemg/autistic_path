import { ArrowDownRight, ArrowUpRight, ChevronRight, Activity } from "lucide-react";
import { motion } from "motion/react";
import {
  ActionCardProps,
  GlassCardProps,
  HealthMetricCardProps,
  InformationCardProps,
  StatCardProps,
} from "../types";
import { Button } from "./Button";
import { StatusBadge } from "./Badge";

// SVG Sparkline Helper for Health Metrics (replicates real device logs elegantly)
function Sparkline({ data, color = "#2563EB" }: { data: number[]; color?: string }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 120;
  const height = 32;
  
  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3; // padding top/bottom
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {/* Area path */}
      <path
        d={`M 0,${height} L ${points} L ${width},${height} Z`}
        fill="url(#sparklineGrad)"
      />
      {/* Line path */}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* End pulse dot */}
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * (height - 6) - 3}
        r="3"
        fill={color}
      />
    </svg>
  );
}

// 1. StatCard Component
export function StatCard({
  title,
  value,
  change,
  trend = "neutral",
  icon,
  secondaryText,
}: StatCardProps) {
  const isUp = trend === "up";
  const isDown = trend === "down";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-brand-card rounded-premium p-6 border border-brand-border shadow-premium-sm flex flex-col justify-between h-full group"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
          {icon && (
            <div className="h-10 w-10 rounded-premium-sm bg-gray-50 text-gray-400 group-hover:text-brand-primary group-hover:bg-brand-primary-soft flex items-center justify-center smooth-transition">
              {icon}
            </div>
          )}
        </div>
        <h3 className="text-3xl font-bold font-display tracking-tight text-gray-900 mb-2">
          {value}
        </h3>
      </div>

      <div className="flex items-center gap-2 mt-2">
        {change && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
              isUp
                ? "bg-brand-secondary-soft text-brand-secondary"
                : isDown
                ? "bg-red-50 text-red-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {isUp && <ArrowUpRight className="h-3 w-3 shrink-0" />}
            {isDown && <ArrowDownRight className="h-3 w-3 shrink-0" />}
            {change}
          </span>
        )}
        {secondaryText && <span className="text-xs text-gray-400 font-sans">{secondaryText}</span>}
      </div>
    </motion.div>
  );
}

// 2. HealthMetricCard Component
export function HealthMetricCard({
  metricName,
  currentScore,
  maxScore = 100,
  unit = "",
  statusText,
  statusType,
  progress,
  historyData,
  suggestion,
}: HealthMetricCardProps) {
  const statusColors = {
    excellent: { text: "text-brand-secondary", bg: "bg-brand-secondary-soft", bar: "bg-brand-secondary", theme: "#22C55E" },
    good: { text: "text-brand-primary", bg: "bg-brand-primary-soft", bar: "bg-brand-primary", theme: "#2563EB" },
    monitoring: { text: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500", theme: "#F59E0B" },
    action: { text: "text-red-600", bg: "bg-red-50", bar: "bg-red-500", theme: "#EF4444" },
  };

  const currentTheme = statusColors[statusType];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-brand-card rounded-premium p-6 border border-brand-border shadow-premium-sm flex flex-col h-full justify-between"
    >
      <div>
        {/* Metric Name and Health Category Indicator */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-500 font-sans">{metricName}</h4>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold font-display tracking-tight text-gray-900">
                {currentScore}
              </span>
              {unit && <span className="text-sm text-gray-400 font-semibold">{unit}</span>}
              <span className="text-xs text-gray-400 font-sans ml-1">/ {maxScore}</span>
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${currentTheme.bg} ${currentTheme.text}`}
          >
            {statusText}
          </span>
        </div>

        {/* Dynamic Activity Graph Sparkline or Progress visualizer */}
        <div className="flex items-center justify-between gap-4 py-3 border-y border-gray-50 my-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-gray-400 font-sans">Activity Pattern</span>
            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              <Activity className="h-3 w-3 text-brand-primary shrink-0 animate-pulse" /> Live Tracker
            </span>
          </div>
          {historyData && historyData.length > 0 ? (
            <Sparkline data={historyData} color={currentTheme.theme} />
          ) : (
            <div className="h-8 w-[120px] bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
              <span className="text-[10px] text-gray-400 font-mono">No telemetry logs</span>
            </div>
          )}
        </div>

        {/* Target Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-medium text-gray-400 font-sans">
            <span>Progress Goal</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${currentTheme.bar}`}
            />
          </div>
        </div>
      </div>

      {/* Suggestion Box */}
      {suggestion && (
        <div className="mt-4 p-3 bg-gray-50/50 rounded-premium-sm border border-gray-100 text-xs text-gray-600 font-sans leading-relaxed">
          <span className="font-semibold text-gray-800">Recommendation:</span> {suggestion}
        </div>
      )}
    </motion.div>
  );
}

// 3. InformationCard Component
export function InformationCard({
  tag,
  title,
  description,
  badgeText,
  imageUrl,
  actionText = "Explore guide",
  onClick,
}: InformationCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="bg-brand-card rounded-premium overflow-hidden border border-brand-border shadow-premium-sm flex flex-col h-full group"
    >
      {/* Decorative calm background image container */}
      <div className="relative h-48 bg-linear-to-b from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 smooth-transition"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 bg-radial from-brand-primary-soft to-indigo-50 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-white shadow-premium-md flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
          </div>
        )}
        {tag && (
          <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-brand-primary text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-premium-sm">
            {tag}
          </span>
        )}
        {badgeText && (
          <span className="absolute bottom-4 right-4 bg-brand-dark/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            {badgeText}
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <h4 className="text-xl font-bold font-display tracking-tight text-gray-900 mb-2 leading-snug group-hover:text-brand-primary smooth-transition">
            {title}
          </h4>
          <p className="text-sm text-gray-500 font-sans leading-relaxed mb-4">
            {description}
          </p>
        </div>

        {onClick && (
          <button
            onClick={onClick}
            className="mt-2 text-xs font-semibold text-brand-primary flex items-center gap-1 hover:text-brand-primary-hover smooth-transition text-left"
          >
            <span>{actionText}</span>
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// 4. ActionCard Component
export function ActionCard({
  title,
  subtitle,
  description,
  icon,
  buttonText,
  buttonVariant = "primary",
  onClick,
}: ActionCardProps) {
  return (
    <div className="bg-brand-card rounded-premium p-6 border border-brand-border shadow-premium-sm flex flex-col justify-between h-full hover:border-gray-300 smooth-transition">
      <div className="flex gap-4 items-start mb-6">
        {icon && (
          <div className="h-12 w-12 rounded-premium bg-brand-primary-soft text-brand-primary flex items-center justify-center shrink-0 shadow-premium-sm">
            {icon}
          </div>
        )}
        <div className="space-y-1">
          {subtitle && <span className="text-[11px] font-semibold text-brand-primary uppercase tracking-wider">{subtitle}</span>}
          <h4 className="text-lg font-bold font-display text-gray-900 leading-tight">{title}</h4>
          <p className="text-sm text-gray-500 font-sans leading-relaxed mt-1">{description}</p>
        </div>
      </div>

      <div className="mt-auto">
        <Button variant={buttonVariant} size="sm" onClick={onClick} className="w-full justify-center">
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

// 5. GlassCard Component
export function GlassCard({
  title,
  description,
  icon,
  badgeText,
  backgroundGradient = "from-brand-primary-soft/40 to-indigo-50/20",
}: GlassCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-premium p-6 border border-white/60 shadow-premium-md bg-gradient-to-br ${backgroundGradient} backdrop-blur-md`}>
      {/* Abstract glossy reflections */}
      <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-white/40 blur-xl" />
      <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-brand-primary/10 blur-xl" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-4">
          {icon && (
            <div className="h-11 w-11 rounded-premium-sm bg-white/85 backdrop-blur-md shadow-premium-sm text-brand-primary flex items-center justify-center">
              {icon}
            </div>
          )}
          {badgeText && (
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/80 backdrop-blur-sm text-brand-primary px-2.5 py-1 rounded-full border border-white/40 shadow-premium-sm">
              {badgeText}
            </span>
          )}
        </div>

        <div className="mt-2">
          <h4 className="text-lg font-bold font-display text-gray-800 tracking-tight leading-tight mb-1">
            {title}
          </h4>
          <p className="text-xs text-gray-500 font-sans leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
