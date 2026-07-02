import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Calendar,
  Flame,
  Trophy,
  Heart,
  Brain,
  Activity,
  Eye,
  CheckCircle2,
  Award,
  Clock,
  ArrowRight,
  Sparkle,
  BookOpen,
  Volume2,
  ChevronDown
} from "lucide-react";

interface ProgressScreenProps {
  theme: "light" | "dark";
  lang: "en" | "es" | "sp" | "hi";
  logEvent: (type: "info" | "success" | "warning", message: string) => void;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  onNavigateToTab?: (tab: string) => void;
  childName?: string;
  parentName?: string;
}

const COMPLETED_ADVENTURES = [
  {
    id: "adv-1",
    titleEn: "Cosmic Breath Sandbox",
    titleEs: "Caja de Arena de Respiración Cósmica",
    titleSp: "🌬️ Respiración del Espacio",
    date: "Today",
    duration: "15 min",
    icon: CompassIcon,
    rewardEn: "Silver Star Badge",
    rewardEs: "Insignia de Estrella de Plata",
    rewardSp: "Estrellita Brillante",
    color: "from-teal-400 to-emerald-500"
  },
  {
    id: "adv-2",
    titleEn: "Story Book Focus Explorer",
    titleEs: "Explorador de Enfoque en Cuentos",
    titleSp: "📖 Detective de Cuentos",
    date: "Yesterday",
    duration: "12 min",
    icon: BookOpen,
    rewardEn: "Perfect Focus Certificate",
    rewardEs: "Certificado de Enfoque Perfecto",
    rewardSp: "Lupa de Súper Detective",
    color: "from-indigo-400 to-purple-500"
  },
  {
    id: "adv-3",
    titleEn: "Echo Chamber Audio Pacing",
    titleEs: "Ritmo de Audio en Cámara de Eco",
    titleSp: "🔊 El Eco del Castillo",
    date: "2 days ago",
    duration: "18 min",
    icon: Volume2,
    rewardEn: "Sonic Explorer Badge",
    rewardEs: "Insignia de Explorador Sónico",
    rewardSp: "Corona de Sonido Divertido",
    color: "from-cyan-400 to-sky-500"
  },
  {
    id: "adv-4",
    titleEn: "Soft Pillow Cloud Balance",
    titleEs: "Equilibrio en Nube de Almohada",
    titleSp: "☁️ El Cojín Volador",
    date: "3 days ago",
    duration: "8 min",
    icon: Activity,
    rewardEn: "Balance Master Badge",
    rewardEs: "Insignia de Maestro del Equilibrio",
    rewardSp: "Alas de Pájaro Suave",
    color: "from-amber-400 to-orange-500"
  }
];

// Helper components since Compass is custom
function CompassIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

const SKILLS_IMPROVED = [
  {
    id: "skill-1",
    nameEn: "Postural Stability & Balance",
    nameEs: "Estabilidad Postural y Equilibrio",
    nameSp: "🧘 Equilibrio de Súper Héroe",
    milestoneEn: "Maintained a 5-step pillow walk with steady pacing.",
    milestoneEs: "Mantuvo caminata de 5 pasos con cojín de ritmo constante.",
    milestoneSp: "¡Caminaste con el cojín en la cabeza como un rey!",
    category: "motor",
    icon: Activity,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
  },
  {
    id: "skill-2",
    nameEn: "Visual Joint Attention",
    nameEs: "Atención Visual Conjunta",
    nameSp: "👁️ Ojitos Súper Atentos",
    milestoneEn: "Successfully scanned and verified 6 target objects in room space.",
    milestoneEs: "Escaneó y verificó exitosamente 6 objetos objetivo en la sala.",
    milestoneSp: "¡Encontraste todos los juguetes mágicos en tu cuarto!",
    category: "cognitive",
    icon: Eye,
    color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
  },
  {
    id: "skill-3",
    nameEn: "Sensory Adaptation & Tactile Tolerances",
    nameEs: "Adaptación Sensorial y Tolerancias Táctiles",
    nameSp: "🧸 Amigo de las Texturas",
    milestoneEn: "Engaged with fuzzy and soft textures for 12 consecutive minutes.",
    milestoneEs: "Interactuó con texturas suaves durante 12 minutos consecutivos.",
    milestoneSp: "¡Abrazaste la mantita suave y jugaste calientito!",
    category: "sensory",
    icon: Brain,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
  },
  {
    id: "skill-4",
    nameEn: "Vocal Modulation & Breathing",
    nameEs: "Modulación Vocal y Respiración",
    nameSp: "🗣️ Respirar y Hablar Suave",
    milestoneEn: "Completed 3 full cycles of deep, synchronized balloon breathing.",
    milestoneEs: "Completó 3 ciclos de respiración sincronizada de globo.",
    milestoneSp: "¡Soplaste la vela imaginaria despacito con mamá!",
    category: "sensory",
    icon: CompassIcon,
    color: "bg-teal-500/10 text-teal-600 dark:text-teal-400"
  }
];

const AI_INSIGHTS = [
  {
    id: "insight-1",
    tagEn: "Sensory Pattern",
    tagEs: "Patrón Sensorial",
    tagSp: "🌟 Superpoder del Día",
    textEn: "Liam showed a strong affinity for tactile textures yesterday afternoon. Integrating the Cozy Blanket into transitions helped reduce auditory startle reactions by half during transition routines.",
    textEs: "Liam mostró una fuerte afinidad por las texturas táctiles ayer por la tarde. Integrar la Manta Acogedora ayudó a reducir las reacciones de sobresalto auditivo a la mitad.",
    textSp: "A Liam le encantan las texturas suaves. Sostener su mantita favorita lo hace sentir súper seguro y feliz cuando es hora de cambiar de juego.",
    clinicianEn: "Dr. Miller (Clinical Director)",
    clinicianEs: "Dra. Miller (Directora Clínica)",
    confidence: "High",
    color: "bg-teal-500/5 border-teal-500/10"
  },
  {
    id: "insight-2",
    tagEn: "Circadian Rhythm Stability",
    tagEs: "Estabilidad del Ritmo Circadiano",
    tagSp: "⏰ Mi Hora de la Calma",
    textEn: "A high stability score was noted for the 10:00 AM session window. Performing sensory exercises at a consistent hour creates a biological expectation of regulation, decreasing overall anxiety.",
    textEs: "Se observó una alta estabilidad en la ventana de sesión de las 10:00 AM. Hacer actividades a la misma hora diaria crea un hábito reconfortante y seguro.",
    textSp: "Jugar a la misma hora en la mañana te ayuda a tener un día más tranquilo y divertido. ¡Tu relojito biológico está muy feliz!",
    clinicianEn: "AI Co-regulation Engine",
    clinicianEs: "Motor de Co-regulación de IA",
    confidence: "Excellent",
    color: "bg-indigo-500/5 border-indigo-500/10"
  },
  {
    id: "insight-3",
    tagEn: "Parent-Child Alignment",
    tagEs: "Alineación Padres-Hijo",
    tagSp: "🤗 Conexión con Mamá y Papá",
    textEn: "Co-regulation alignment index is highly optimal. Liam matching your slow chest movements during joint breathing indicates excellent neural mirror synchronization and deep emotional safety.",
    textEs: "El índice de alineación de co-regulación es óptimo. Liam imitando tus respiraciones pausadas indica una excelente sincronización y seguridad emocional.",
    textSp: "Respirar al mismo ritmo que mamá o papá te hace sentir súper protegido. ¡Están perfectamente conectados hoy!",
    clinicianEn: "Therapeutic Mirror Model",
    clinicianEs: "Modelo de Espejo Terapéutico",
    confidence: "High",
    color: "bg-cyan-500/5 border-cyan-500/10"
  }
];

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  theme,
  lang,
  logEvent,
  setNotifications,
  onNavigateToTab,
  childName,
  parentName
}) => {
  const [activeTab, setActiveTab] = useState<"parent" | "child">("parent");
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const child = childName || "Aarav";
  const parent = parentName || "Sarah";

  const sanitizeText = (txt: string) => {
    if (!txt) return "";
    let s = txt;
    s = s.replace(/Liam Henderson/g, child);
    s = s.replace(/Liam/g, child);
    s = s.replace(/Sarah Hendrickx/g, "AutisticPath Author");
    s = s.replace(/Dr\. Miller/g, "Connected Therapist");
    s = s.replace(/Dra\. Miller/g, "Terapeuta Asociada");
    s = s.replace(/Sarah/g, parent);
    return s;
  };

  const strings = {
    titleEn: "Growth & Connection Journal",
    titleEs: "Diario de Crecimiento y Conexión",
    titleSp: "🏆 Mis Grandes Logros",
    descEn: "A calm workspace reflecting daily steps, routine rhythms, and personalized support insights.",
    descEs: "Un espacio tranquilo que refleja los pasos diarios, ritmos cotidianos e información de apoyo personalizada.",
    descSp: "¡Mira todas las cosas geniales que has aprendido y las aventuras que has completado!",
    
    viewParentEn: "Parent Journal",
    viewParentEs: "Diario de Padres",
    viewParentSp: "Vista para Papás",
    viewChildEn: "Child Stars",
    viewChildEs: "Mis Estrellas",
    viewChildSp: "🌟 Mi Álbum de Estrellas",

    growthTitleEn: "Weekly Growth & Integration",
    growthTitleEs: "Crecimiento Semanal e Integración",
    growthTitleSp: "📈 Mi Crecimiento Semanal",
    growthDescEn: "Tracking daily regulatory activities and active sensory milestones.",
    growthDescEs: "Seguimiento de minutos regulatorios y logros sensoriales activos.",
    growthDescSp: "Los días que jugamos y nos sentimos felices.",

    consistencyTitleEn: "Routine Rhythm",
    consistencyTitleEs: "Consistencia de la Rutina",
    consistencyTitleSp: "🔥 Mi Súper Racha",
    consistencyDescEn: "Stable daily schedules offer gentle predictability and deep emotional safety.",
    consistencyDescEs: "Los horarios estables ofrecen previsibilidad y seguridad.",
    consistencyDescSp: "¡Mantén tu racha activa jugando todos los días!",

    completedTitleEn: "Completed Adventures",
    completedTitleEs: "Aventuras Completadas",
    completedTitleSp: "🚀 Mis Aventuras Superadas",

    skillsTitleEn: "Core Milestones Reached",
    skillsTitleEs: "Habilidades Clave Mejoradas",
    skillsTitleSp: "🧠 Mis Nuevos Súper Poderes",

    insightsTitleEn: "Clinical AI Guidance",
    insightsTitleEs: "Información Clínica de IA",
    insightsTitleSp: "💡 Mensajes de la Computadora Mágica",

    quoteEn: "“Small steps in a supportive space lead to magnificent horizons.”",
    quoteEs: "“Los pasos pequeños en un espacio de apoyo nos llevan a horizontes magníficos.”",
    quoteSp: "“¡Cada pequeño paso que das te hace más fuerte y brillante!”"
  };

  const currentTitle = lang === "sp" ? strings.titleSp : lang === "es" ? strings.titleEs : strings.titleEn;
  const currentDesc = lang === "sp" ? strings.descSp : lang === "es" ? strings.descEs : strings.descEn;

  const cardBgClass = theme === "light" ? "bg-white border-gray-150/85" : "bg-[#111726]/80 border-gray-800/80";
  const textPrimaryClass = theme === "light" ? "text-gray-900" : "text-[#ECF0F1]";
  const textSecondaryClass = theme === "light" ? "text-gray-500" : "text-[#94A3B8]";
  const borderClass = theme === "light" ? "border-gray-150" : "border-gray-800/80";

  return (
    <div className="space-y-12 max-w-4xl mx-auto py-4">
      
      {/* Top Header - Massive Typography, Loving Tone */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800/60">
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
            {lang === "sp" ? "PASO A PASO" : "JOURNEY TIMELINE"}
          </span>
          <h2 className={`text-4xl font-extrabold font-display tracking-tight leading-none ${textPrimaryClass}`}>
            {currentTitle}
          </h2>
          <p className={`text-base ${textSecondaryClass} max-w-2xl font-sans`}>
            {currentDesc}
          </p>
        </div>

        {/* Minimalist Switcher */}
        <div className="flex bg-gray-100/90 dark:bg-gray-800/60 p-1 rounded-full shrink-0">
          <button
            onClick={() => {
              setActiveTab("parent");
              logEvent("info", "Switched to parent journal perspective");
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "parent"
                ? "bg-teal-600 text-white shadow-premium-sm"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
            }`}
          >
            {lang === "sp" ? strings.viewParentSp : lang === "es" ? strings.viewParentEs : strings.viewParentEn}
          </button>
          <button
            onClick={() => {
              setActiveTab("child");
              logEvent("success", "Switched to child achievement gallery!");
            }}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "child"
                ? "bg-teal-600 text-white shadow-premium-sm"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
            }`}
          >
            <Sparkle className="h-3.5 w-3.5 text-amber-300 fill-amber-300 animate-pulse" />
            {lang === "sp" ? strings.viewChildSp : lang === "es" ? strings.viewChildEs : strings.viewChildEn}
          </button>
        </div>
      </div>

      <div className="space-y-16">
        
        {/* SECTION 1: WEEKLY GROWTH (Soft Floating Pebbles/Orbs) */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h3 className={`text-xl font-bold font-display ${textPrimaryClass}`}>
              {lang === "sp" ? strings.growthTitleSp : lang === "es" ? strings.growthTitleEs : strings.growthTitleEn}
            </h3>
            <p className={`text-sm ${textSecondaryClass}`}>
              {lang === "sp" ? strings.growthDescSp : lang === "es" ? strings.growthDescEs : strings.growthDescEn}
            </p>
          </div>

          <div className={`p-8 rounded-premium border ${cardBgClass} shadow-premium-sm space-y-8`}>
            {/* Pebble-like Calendar with large airy layout */}
            <div className="grid grid-cols-7 gap-4 md:gap-6 pt-2 max-w-2xl mx-auto">
              {[
                { day: "Mon", active: true, label: "M", title: "Pillow Balance (8m)" },
                { day: "Tue", active: true, label: "T", title: "Breathing Quest (15m)" },
                { day: "Wed", active: false, label: "W", title: "Rest Day" },
                { day: "Thu", active: true, label: "T", title: "Story Focus (12m)" },
                { day: "Fri", active: true, label: "F", title: "Echo Soundscape (18m)" },
                { day: "Sat", active: true, label: "S", title: "Pillow + Blanket (20m)" },
                { day: "Sun", active: false, label: "S", title: "Planned rest" }
              ].map((d, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 group cursor-pointer" title={d.title}>
                  <div className={`h-14 w-14 rounded-full flex items-center justify-center border transition-all relative ${
                    d.active
                      ? "bg-gradient-to-tr from-teal-500 to-cyan-400 text-white border-transparent shadow-premium-md scale-105"
                      : `${theme === 'light' ? 'bg-gray-50 border-gray-150 text-gray-400' : 'bg-gray-850 border-gray-800 text-gray-600'}`
                  }`}>
                    {d.active && <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-300 animate-ping" />}
                    <span className="text-sm font-extrabold">{d.label}</span>
                  </div>
                  <span className={`text-xs font-semibold ${d.active ? "text-teal-600 dark:text-teal-400" : "text-gray-400"}`}>
                    {lang === "sp" ? (idx === 0 ? "Lun" : idx === 1 ? "Mar" : idx === 2 ? "Mié" : idx === 3 ? "Jue" : idx === 4 ? "Vie" : idx === 5 ? "Sáb" : "Dom") : d.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-premium-sm bg-teal-500/5 border border-teal-500/10 flex items-start gap-4">
              <CheckCircle2 className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className={`text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block`}>
                  {lang === "sp" ? "Sincronización Natural" : "Natural Synchronization Achieved"}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  {sanitizeText(lang === "sp"
                    ? "Liam completó con mucho éxito el juego del Eco dos veces seguidas, manteniendo una voz muy calmada y suave junto a mamá."
                    : "Liam experienced deep calm state integration across multiple days this week. Rhythms are beautifully stable."
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: CONSISTENCY & ROUTINE */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h3 className={`text-xl font-bold font-display ${textPrimaryClass}`}>
              {lang === "sp" ? strings.consistencyTitleSp : lang === "es" ? strings.consistencyTitleEs : strings.consistencyTitleEn}
            </h3>
            <p className={`text-sm ${textSecondaryClass}`}>
              {lang === "sp" ? strings.consistencyDescSp : lang === "es" ? strings.consistencyDescEs : strings.consistencyDescEn}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Active Streak */}
            <div className={`p-8 rounded-premium border ${cardBgClass} shadow-premium-sm flex items-start gap-6`}>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Flame className="h-6 w-6 fill-current" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-widest block">
                  {lang === "sp" ? "MOMENTUM" : "CONNECTION RHYTHM"}
                </span>
                <h4 className={`text-lg font-bold ${textPrimaryClass}`}>
                  {lang === "sp" ? "3 Días Seguidos" : "3 Days Strong"}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  {sanitizeText(lang === "sp"
                    ? "¡Has jugado tres días seguidos sin parar! La constancia ayuda a Liam a sentirse seguro."
                    : "Launching play sessions consecutively creates an elegant biological habit of emotional safety."
                  )}
                </p>
              </div>
            </div>

            {/* Regulatory Window */}
            <div className={`p-8 rounded-premium border ${cardBgClass} shadow-premium-sm flex items-start gap-6`}>
              <div className="h-12 w-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block">
                  {lang === "sp" ? "ESTABILIDAD" : "BIOLOGICAL TIMING"}
                </span>
                <h4 className={`text-lg font-bold ${textPrimaryClass}`}>
                  {lang === "sp" ? "10:00 AM (Estable)" : "10:15 AM Window"}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  {lang === "sp"
                    ? "Jugar siempre en la mañana te ayuda a tener un día más tranquilo y divertido."
                    : "Sessions launched in this comfortable morning slot experience twice the focused attention length."
                  }
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: CORE MILESTONES (Skills Improved) */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h3 className={`text-xl font-bold font-display ${textPrimaryClass}`}>
              {lang === "sp" ? strings.skillsTitleSp : lang === "es" ? strings.skillsTitleEs : strings.skillsTitleEn}
            </h3>
          </div>

          <div className="space-y-4">
            {SKILLS_IMPROVED.map((skill) => {
              const SkillIcon = skill.icon;
              const isSelected = selectedSkill === skill.id;

              return (
                <div
                  key={skill.id}
                  onClick={() => {
                    setSelectedSkill(isSelected ? null : skill.id);
                    logEvent("info", `Explored milestone details: ${skill.nameEn}`);
                  }}
                  className={`p-5 rounded-premium border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-teal-500/5 border-teal-500/30 shadow-premium-sm"
                      : `${theme === 'light' ? 'bg-white hover:bg-gray-50 border-gray-150/80' : 'bg-gray-900/30 hover:bg-gray-900/60 border-gray-800/80'}`
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full ${skill.color} flex items-center justify-center shrink-0`}>
                        <SkillIcon className="h-5 w-5" />
                      </div>
                      <h4 className={`text-sm font-bold ${textPrimaryClass}`}>
                        {lang === "sp" ? skill.nameSp : lang === "es" ? skill.nameEs : skill.nameEn}
                      </h4>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isSelected ? "rotate-180" : ""}`} />
                  </div>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 pl-14 border-t border-gray-100 dark:border-gray-800/60 mt-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed space-y-1.5">
                          <p className="font-semibold text-gray-700 dark:text-gray-300">
                            {lang === 'sp' ? "🏆 ¡Tu Gran Paso!" : "Clinical Milestone achieved!"}: {lang === "sp" ? skill.milestoneSp : lang === "es" ? skill.milestoneEs : skill.milestoneEn}
                          </p>
                          <p className="text-[10px] text-teal-600 dark:text-teal-400 font-mono tracking-wider uppercase">
                            DEVELOPMENTAL DOMAIN: {skill.category.toUpperCase()}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: CLINICAL GUIDANCE (AI Insights with zero borders) */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h3 className={`text-xl font-bold font-display ${textPrimaryClass}`}>
              {lang === "sp" ? strings.insightsTitleSp : lang === "es" ? strings.insightsTitleEs : strings.insightsTitleEn}
            </h3>
          </div>

          <div className="space-y-4">
            {AI_INSIGHTS.map((insight) => {
              const isSelected = selectedInsight === insight.id;

              return (
                <div
                  key={insight.id}
                  onClick={() => {
                    setSelectedInsight(isSelected ? null : insight.id);
                    logEvent("info", `Viewed guidance plan: ${insight.tagEn}`);
                  }}
                  className={`p-6 rounded-premium border transition-all cursor-pointer relative overflow-hidden ${insight.color} hover:bg-gray-50/20`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                      {lang === "sp" ? insight.tagSp : lang === "es" ? insight.tagEs : insight.tagEn}
                    </span>
                    <span className="text-[9px] bg-white/60 dark:bg-black/30 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400 font-bold font-mono">
                      CONFIDENCE: {insight.confidence}
                    </span>
                  </div>

                  <p className={`text-sm mt-3 leading-relaxed font-medium ${textPrimaryClass}`}>
                    "{sanitizeText(lang === "sp" ? insight.textSp : lang === "es" ? insight.textEs : insight.textEn)}"
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400 border-t border-black/5 dark:border-white/5 pt-3">
                    <span className="italic font-medium">
                      {sanitizeText(lang === "es" ? insight.clinicianEs : insight.clinicianEn)}
                    </span>
                    <span className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-bold">
                      {isSelected ? (lang === 'sp' ? 'Cerrar' : 'Minimize') : (lang === 'sp' ? 'Ver Detalles' : 'Read Guidance Plan')}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed bg-black/5 dark:bg-white/5 rounded p-4 mt-4 space-y-2">
                          <h5 className="font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">CO-REGULATION PLAYBOOK ACTION:</h5>
                          <p className="font-medium">
                            {sanitizeText(lang === "sp"
                              ? "Introduce esta actividad de 10 a 15 minutos en un espacio suave. Sostén a Liam con contacto firme para brindarle soporte táctil y reducir estímulos auditivos bruscos."
                              : "Integrate this target for 12 minutes during the transition out of active play. Dim visual devices 10 minutes prior to starting.")}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: COMPLETED ADVENTURES */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h3 className={`text-xl font-bold font-display ${textPrimaryClass}`}>
              {lang === "sp" ? strings.completedTitleSp : lang === "es" ? strings.completedTitleEs : strings.completedTitleEn}
            </h3>
          </div>

          <div className="space-y-4">
            {COMPLETED_ADVENTURES.map((adv) => {
              const AdvIcon = adv.icon;

              return (
                <div
                  key={adv.id}
                  className={`p-5 rounded-premium border ${theme === 'light' ? 'bg-white border-gray-150/80' : 'bg-[#111726]/40 border-gray-800/80'} flex items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-tr ${adv.color} text-white flex items-center justify-center shrink-0`}>
                      <AdvIcon className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className={`text-sm font-bold ${textPrimaryClass}`}>
                        {lang === "sp" ? adv.titleSp : lang === "es" ? adv.titleEs : adv.titleEn}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-mono">
                        {adv.date} • {adv.duration}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full font-bold">
                    {lang === "sp" ? adv.rewardSp : lang === "es" ? adv.rewardEs : adv.rewardEn}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* "Share Your Path" Community Integration Card */}
        {onNavigateToTab && (
          <div className="p-8 rounded-premium border border-dashed border-teal-500/30 bg-teal-500/[0.02] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                <Heart className="h-6 w-6 fill-current" />
              </div>
              <div className="space-y-1">
                <h4 className={`text-base font-bold ${textPrimaryClass}`}>
                  {lang === "sp" ? "Compartir Nuestro Camino" : lang === "es" ? "Comparte Tu Camino" : "Share Your Path"}
                </h4>
                <p className="text-xs text-gray-400 font-medium">
                  {lang === "sp" 
                    ? "Mira historias reales de otros niños and mamás en un espacio seguro y lleno de cariño." 
                    : lang === "es"
                      ? "Comparte historias reales, celebra metas e interactúa en un espacio seguro y sin ruidos."
                      : "Explore authentic, clinical, and heartwarming community stories from other caretakers."}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onNavigateToTab("sharing");
                logEvent("info", "Opened Community Storyboard from Progress Timeline.");
              }}
              className="px-6 py-2.5 rounded-full bg-[#00828A] hover:opacity-90 text-white font-bold transition-all text-xs cursor-pointer shadow-premium-sm shrink-0"
            >
              {lang === "sp" ? "Ver Historias" : lang === "es" ? "Abrir Portal" : "Open Storyboard"}
            </button>
          </div>
        )}

        {/* Supporting Quote Card */}
        <div className="text-center p-8 bg-gradient-to-r from-teal-500/5 via-indigo-500/5 to-transparent rounded-premium border border-dashed border-teal-500/20 max-w-xl mx-auto">
          <Heart className="h-6 w-6 text-rose-400 mx-auto animate-pulse fill-rose-400" />
          <p className={`text-sm italic mt-3.5 font-medium leading-relaxed ${textPrimaryClass}`}>
            {lang === "sp" ? strings.quoteSp : lang === "es" ? strings.quoteEs : strings.quoteEn}
          </p>
        </div>

      </div>

    </div>
  );
};
