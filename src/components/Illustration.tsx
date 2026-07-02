import { motion } from "motion/react";

// 1. Mindful Growth / Development Path Illustration
export function MindfulPathIllustration({ className = "h-48 w-full" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-radial from-brand-primary-soft/40 to-indigo-50/10 rounded-premium p-4 ${className}`}>
      <svg viewBox="0 0 400 240" className="w-full h-full max-w-sm overflow-visible">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="1" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="1" />
          </linearGradient>
          <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient concentric waves */}
        <circle cx="200" cy="180" r="140" fill="none" stroke="#2563EB" strokeOpacity="0.03" strokeWidth="2" />
        <circle cx="200" cy="180" r="100" fill="none" stroke="#2563EB" strokeOpacity="0.04" strokeWidth="2" />
        <circle cx="200" cy="180" r="60" fill="none" stroke="#2563EB" strokeOpacity="0.05" strokeWidth="2" />

        {/* The smooth developmental pathway curve */}
        <motion.path
          d="M 40,160 Q 120,60 200,140 T 360,80"
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />

        {/* Dashed background curve showing guidance */}
        <path
          d="M 40,165 Q 120,65 200,145 T 360,85"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Target Milestone Nodes */}
        <motion.circle
          cx="120"
          cy="110"
          r="6"
          fill="#2563EB"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          filter="url(#glow)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        />

        <motion.circle
          cx="200"
          cy="140"
          r="6"
          fill="#2563EB"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        />

        <motion.circle
          cx="280"
          cy="110"
          r="6"
          fill="#22C55E"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          filter="url(#glow)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
        />

        {/* Modern minimal plant nodes sprouting along the path representing growth */}
        <g transform="translate(280, 110)">
          <path d="M 0,0 C 10,-10 20,-5 25,-25 C 10,-20 5,-10 0,0" fill="#22C55E" fillOpacity="0.75" />
          <path d="M 0,0 C -10,-15 -5,-25 -20,-20 C -15,-10 -10,-5 0,0" fill="#22C55E" fillOpacity="0.6" />
        </g>

        <g transform="translate(120, 110)">
          <path d="M 0,0 C 10,-10 15,-15 15,-25 C 5,-15 2,-10 0,0" fill="#2563EB" fillOpacity="0.7" />
        </g>
      </svg>
    </div>
  );
}

// 2. Family Trust / Care Safe Space Illustration
export function FamilyTrustIllustration({ className = "h-48 w-full" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-radial from-brand-secondary-soft/40 to-green-50/10 rounded-premium p-4 ${className}`}>
      <svg viewBox="0 0 400 240" className="w-full h-full max-w-sm overflow-visible">
        <defs>
          <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Ambient surrounding circles */}
        <circle cx="200" cy="120" r="90" fill="none" stroke="#22C55E" strokeWidth="1" strokeDasharray="6 6" strokeOpacity="0.2" />
        <circle cx="200" cy="120" r="110" fill="none" stroke="#22C55E" strokeWidth="0.5" strokeOpacity="0.1" />

        {/* Smooth organic background shield representing safety */}
        <motion.path
          d="M 200,45 C 240,45 270,55 270,95 C 270,150 200,195 200,195 C 200,195 130,150 130,95 C 130,55 160,45 200,45 Z"
          fill="url(#shieldGrad)"
          stroke="#22C55E"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        />

        {/* Minimal flat vector heart cradling representing care */}
        <motion.g
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {/* Elegant geometric clean heart */}
          <path
            d="M 200,135 C 180,115 165,100 165,85 C 165,72 175,62 188,62 C 195,62 200,67 200,67 C 200,67 205,62 212,62 C 225,62 235,72 235,85 C 235,100 220,115 200,135 Z"
            fill="#22C55E"
            fillOpacity="0.85"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Minimal safe-haven abstract sheltering hands (represented as sleek arcs) */}
          <path
            d="M 150,115 Q 170,150 200,150 T 250,115"
            fill="none"
            stroke="#2563EB"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </motion.g>
      </svg>
    </div>
  );
}

// 3. Structured Focus / Daily Routine Clock Illustration
export function StructuredFocusIllustration({ className = "h-48 w-full" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-radial from-blue-50 to-indigo-50/10 rounded-premium p-4 ${className}`}>
      <svg viewBox="0 0 400 240" className="w-full h-full max-w-sm overflow-visible">
        {/* Subtle geometric grids representing structure and predictability */}
        <line x1="80" y1="120" x2="320" y2="120" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="200" y1="40" x2="200" y2="200" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />

        {/* Beautiful concentric analog clock outline representing rhythm */}
        <circle cx="200" cy="120" r="60" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        <circle cx="200" cy="120" r="54" fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="1 6" strokeOpacity="0.4" />

        {/* High contrast clock sector representing structured sessions */}
        <path d="M 200,120 L 200,66 A 54,54 0 0,1 246.7,93 Z" fill="#2563EB" fillOpacity="0.08" />

        {/* Sleek aesthetic clock hands */}
        <motion.line
          x1="200"
          y1="120"
          x2="200"
          y2="75"
          stroke="#2563EB"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ rotate: 0 }}
          animate={{ rotate: 120 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          style={{ originX: "200px", originY: "120px" }}
        />

        <motion.line
          x1="200"
          y1="120"
          x2="235"
          y2="120"
          stroke="#22C55E"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ rotate: 0 }}
          animate={{ rotate: -45 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          style={{ originX: "200px", originY: "120px" }}
        />

        {/* Center elegant metal pin */}
        <circle cx="200" cy="120" r="4" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.5" />

        {/* Surrounding clean checklist markers indicating tasks */}
        <motion.g
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Morning Routine node */}
          <rect x="75" y="80" width="45" height="18" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="85" cy="89" r="3.5" fill="#2563EB" />
          <line x1="94" y1="89" x2="112" y2="89" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

          {/* Evening routine node */}
          <rect x="280" y="140" width="45" height="18" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="290" cy="149" r="3.5" fill="#22C55E" />
          <line x1="299" y1="149" x2="317" y2="149" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
      </svg>
    </div>
  );
}
