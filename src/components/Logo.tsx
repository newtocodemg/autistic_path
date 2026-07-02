import React from "react";
import { motion } from "motion/react";

export interface LogoProps {
  variant?: "icon" | "full" | "horizontal" | "compact";
  className?: string;
  size?: number | string;
  light?: boolean;
}

export function Logo({ variant = "horizontal", className = "", size, light = false }: LogoProps) {
  // Common colors from specifications:
  // Deep Blue (Autistic, personalized therapy): #112954
  // Vibrant Teal (Path, real progress): #00828A (or #0D9488)
  // Yellow/Gold (Sun, details): #F59E0B
  const textColor = light ? "text-white" : "text-[#112954]";
  const pathColor = "text-[#00828A]";
  const sloganColor = light ? "text-white/80" : "text-[#526075]";

  // The emblem vector SVG containing the arc, path, sun, child silhouette, and rainbow tree
  const LogoEmblem = ({ emblemSize = 75 }: { emblemSize?: number }) => (
    <svg
      viewBox="0 0 200 160"
      width={size || emblemSize}
      height={size ? undefined : (emblemSize * 0.8)}
      className="overflow-visible select-none"
    >
      <defs>
        {/* Arc Rainbow Gradient */}
        <linearGradient id="arcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="40%" stopColor="#14B8A6" />
          <stop offset="70%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Rising Sun Gradient */}
        <linearGradient id="sunGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>

        {/* Left Path Blue Gradient */}
        <linearGradient id="bluePathGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="50%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        {/* Right Path Green Gradient */}
        <linearGradient id="greenPathGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0F766E" />
          <stop offset="50%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#2DD4BF" />
        </linearGradient>
      </defs>

      {/* 1. Concentric Background Glow (Subtle and Premium) */}
      <circle cx="100" cy="85" r="75" fill="none" stroke="#2563EB" strokeOpacity="0.01" strokeWidth="1" />
      <circle cx="100" cy="85" r="65" fill="none" stroke="#2563EB" strokeOpacity="0.015" strokeWidth="1" />

      {/* 2. Rising Sun (behind path and tree) */}
      <path
        d="M 130,82 A 16,16 0 0,1 158,74 C 158,82 150,86 130,82 Z"
        fill="url(#sunGrad)"
      />

      {/* 3. Winding Path - Teal/Green S-Curve (Underneath right side) */}
      <path
        d="M 112,83 C 122,81 142,75 160,86 C 176,96 178,112 154,122 C 132,130 114,106 100,102 C 92,100 85,102 85,102 Z"
        fill="url(#greenPathGrad)"
      />

      {/* 4. Developmental Path - Blue Curve (Starting left, overlapping) */}
      <path
        d="M 68,124 C 82,118 100,104 116,99 C 120,98 124,101 121,103 C 102,114 85,130 68,136 Z"
        fill="url(#bluePathGrad)"
      />

      {/* 5. Rainbow Arc (Framing the left and top) */}
      <path
        d="M 76,112 A 54,54 0 1,1 166,98"
        fill="none"
        stroke="url(#arcGrad)"
        strokeWidth="4.2"
        strokeLinecap="round"
      />

      {/* 6. Child Silhouette (Walking on the blue path) */}
      {/* Hand-traced smooth vector representation of a child walking */}
      <g transform="translate(-14, 13) scale(0.95)">
        {/* Head */}
        <circle cx="120" cy="74.5" r="3.8" fill="#112954" />
        {/* Body and limbs */}
        <path
          d="M 119.5,79 C 117.8,79.5 116.5,81.5 116.5,84 C 116.5,86 117.2,88 117.2,90 L 118,97 L 120.2,97 L 119,90.5 L 121,90.5 L 123.5,95.5 L 125,95 L 122,89.5 C 121.5,88.5 121.5,87 121.5,85.5 L 121.2,80 C 120.8,79.2 120.2,79 119.5,79 Z"
          fill="#112954"
        />
        {/* Walking legs details */}
        <path
          d="M 117.5,90.5 L 115.5,95.5 L 117,96.5 L 118.8,91.8 Z"
          fill="#112954"
        />
        <path
          d="M 121,90.5 L 123.5,96 L 125,95.2 L 122.2,90 Z"
          fill="#112954"
        />
      </g>

      {/* 7. Neurodiversity Tree */}
      {/* Trunk and branches */}
      <path
        d="M 148,84 Q 149,76 148,68 Q 146,65 142,63 M 148,72 Q 152,69 155,64 M 148,76 Q 149,84 148,85"
        stroke="#112954"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Colorful Leaves (Rainbow spectrum) */}
      <g>
        {/* Blue / Teal Leaves (Left) */}
        <circle cx="132" cy="66" r="2.2" fill="#3B82F6" />
        <circle cx="136" cy="62" r="2.2" fill="#2563EB" />
        <circle cx="134" cy="58" r="2.2" fill="#0D9488" />
        <circle cx="140" cy="55" r="2.4" fill="#14B8A6" />
        <circle cx="138" cy="67" r="1.8" fill="#06B6D4" />

        {/* Green / Yellow Leaves (Top) */}
        <circle cx="145" cy="52" r="2.2" fill="#10B981" />
        <circle cx="150" cy="48" r="2.4" fill="#22C55E" />
        <circle cx="156" cy="48" r="2.4" fill="#84CC16" />
        <circle cx="161" cy="51" r="2.2" fill="#EAB308" />
        <circle cx="148" cy="56" r="2.0" fill="#4ADE80" />
        <circle cx="154" cy="55" r="2.0" fill="#A3E635" />

        {/* Orange / Peach / Coral Leaves (Right) */}
        <circle cx="165" cy="56" r="2.2" fill="#F59E0B" />
        <circle cx="168" cy="61" r="2.2" fill="#F97316" />
        <circle cx="169" cy="67" r="2.2" fill="#EF4444" />
        <circle cx="167" cy="73" r="2.0" fill="#F43F5E" />
        <circle cx="162" cy="74" r="1.8" fill="#EC4899" />
        <circle cx="161" cy="61" r="2.2" fill="#F87171" />
        <circle cx="165" cy="66" r="2.0" fill="#FB923C" />
      </g>
    </svg>
  );

  // Little heart icon for the "i" and center line separator
  const HeartIcon = ({ size = 8, color = "#00828A" }: { size?: number; color?: string }) => (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
      className="inline-block overflow-visible"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );

  // Render standard horizontal brand logo (Perfect for Navigation)
  if (variant === "horizontal") {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <LogoEmblem emblemSize={42} />
        <div className="flex flex-col">
          <div className={`text-xl font-extrabold font-display tracking-tight leading-none ${textColor} flex items-center`}>
            Aut
            <span className="relative inline-flex items-center">
              i
              <span className="absolute -top-[5px] left-1/2 -translate-x-1/2">
                <HeartIcon size={6.5} color="#00828A" />
              </span>
            </span>
            st
            <span className="relative inline-flex items-center">
              i
              <span className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#112954] rounded-full" />
            </span>
            c
            <span className={`ml-0.5 font-bold ${pathColor}`}>Path</span>
          </div>
          <span className={`text-[9px] font-bold tracking-widest uppercase mt-0.5 opacity-80 ${sloganColor}`}>
            Care platform
          </span>
        </div>
      </div>
    );
  }

  // Render compact view (Perfect for sidebar collapse or smaller badges)
  if (variant === "compact") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <LogoEmblem emblemSize={44} />
      </div>
    );
  }

  // Render just the icon (Perfect for loading spinner/favicon)
  if (variant === "icon") {
    return <LogoEmblem emblemSize={size ? Number(size) : 60} />;
  }

  // Render the fully stacked version with illustration, text, separator line, and slogan (Perfect for Splash Screen, Auth)
  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      <LogoEmblem emblemSize={140} />
      
      {/* Brand Text */}
      <div className={`text-4xl font-extrabold font-display tracking-tight mt-4 ${textColor} flex items-center justify-center`}>
        Aut
        <span className="relative inline-flex items-center">
          i
          <span className="absolute -top-[10px] left-1/2 -translate-x-1/2">
            <HeartIcon size={12} color="#00828A" />
          </span>
        </span>
        st
        <span className="relative inline-flex items-center">
          i
          <span className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#112954] rounded-full" />
        </span>
        c
        <span className={`ml-1 font-bold ${pathColor}`}>Path</span>
      </div>

      {/* Elegant Separator Line with Heart */}
      <div className="flex items-center w-full max-w-[280px] my-3">
        <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent to-[#112954]/50" />
        <div className="mx-3.5 flex items-center justify-center relative">
          {/* Outer Ring Heart */}
          <div className="h-6 w-6 rounded-full border border-[#00828A]/40 flex items-center justify-center bg-white shadow-sm">
            <HeartIcon size={10} color="#00828A" />
          </div>
          {/* Subtle gold center accent dot */}
          <div className="absolute h-1 w-1 rounded-full bg-[#F59E0B] top-[9px]" />
        </div>
        <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent to-[#00828A]/50" />
      </div>

      {/* Slogan */}
      <p className={`text-xs font-bold tracking-wide ${sloganColor}`}>
        Personalized Therapy.{" "}
        <span className="text-[#00828A]">Real Progress.</span>
      </p>
    </div>
  );
}
