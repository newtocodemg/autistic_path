import { ChevronRight, Home, Activity, FileText, Settings, Heart } from "lucide-react";
import { motion } from "motion/react";
import { BottomNavigationProps, BreadcrumbsProps, SidebarProps } from "../types";
import { Logo } from "./Logo";

// 1. Sidebar Panel (Sleek minimalist sidebar)
export function Sidebar({ items, activeId, onChange, collapsed = false, onLogout }: SidebarProps) {
  return (
    <aside
      className={`bg-white border-r border-brand-border h-full flex flex-col justify-between py-6 transition-all duration-300 ${
        collapsed ? "w-20 px-3" : "w-64 px-5"
      }`}
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className={`flex items-center ${collapsed ? "justify-center" : "px-1.5"}`}>
          <Logo variant={collapsed ? "compact" : "horizontal"} />
        </div>

        {/* Navigation Items list */}
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = item.id === activeId;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className={`relative w-full flex items-center gap-3.5 py-2.5 px-3.5 rounded-premium text-sm font-semibold select-none cursor-pointer transition-colors duration-250 ${
                  isActive
                    ? "text-brand-primary font-bold bg-brand-primary-soft/50"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {/* Active Slider Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarIndicator"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-brand-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <IconComponent className={`h-5 w-5 shrink-0 ${isActive ? "text-brand-primary" : "text-gray-400"}`} />

                {!collapsed && <span className="truncate">{item.label}</span>}

                {!collapsed && item.badge && (
                  <span className="ml-auto text-[10px] font-extrabold bg-brand-secondary text-white px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer info */}
      {!collapsed && (
        <div className="space-y-3 bg-gray-50/50 border border-gray-100 p-4 rounded-premium text-xs text-gray-400 font-sans leading-relaxed">
          <div>
            <span className="font-semibold text-gray-700 block mb-0.5">Family Workspace</span>
            Syncing with clinical portal.
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full text-center py-1.5 px-3 rounded-lg bg-white border border-gray-200 hover:border-red-200 text-gray-500 hover:text-red-500 font-bold transition-all cursor-pointer text-[10px] uppercase tracking-wider"
            >
              Lock Workspace
            </button>
          )}
        </div>
      )}
    </aside>
  );
}

// 2. Bottom Tab Navigation (Perfect for compact mobile screens or standard frames)
export function BottomNavigation({ items, activeId, onChange }: BottomNavigationProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md border-t border-brand-border py-2 px-6 flex items-center justify-around w-full select-none z-50 shadow-premium-lg">
      {items.map((item) => {
        const isActive = item.id === activeId;
        const IconComponent = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="flex flex-col items-center justify-center gap-1 py-1 px-3 relative cursor-pointer group"
          >
            <div className="relative">
              <IconComponent
                className={`h-5.5 w-5.5 smooth-transition ${
                  isActive
                    ? "text-brand-primary scale-110"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              {item.badge && (
                <span className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] text-[9px] font-extrabold bg-red-500 text-white flex items-center justify-center rounded-full px-1">
                  {item.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-bold smooth-transition ${
                isActive ? "text-brand-primary font-bold" : "text-gray-400 group-hover:text-gray-600"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// 3. Breadcrumbs (Standard location indicators)
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 font-sans text-xs select-none py-2">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <div key={idx} className="flex items-center gap-1.5 text-gray-400">
            {item.href && !isLast ? (
              <a
                href={item.href}
                className="font-medium text-gray-500 hover:text-brand-primary smooth-transition"
              >
                {item.label}
              </a>
            ) : (
              <span className={`font-semibold ${isLast ? "text-gray-800" : "text-gray-400"}`}>
                {item.label}
              </span>
            )}

            {!isLast && <ChevronRight className="h-3 w-3 shrink-0 text-gray-300" />}
          </div>
        );
      })}
    </nav>
  );
}
