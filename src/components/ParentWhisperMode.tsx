import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  ShieldAlert,
  HelpCircle,
  Check,
  EyeOff,
  Mic,
  Languages,
  Headphones,
  Compass,
  Smile
} from "lucide-react";

interface ParentWhisperModeProps {
  theme: "light" | "dark";
  lang: "en" | "es" | "sp" | "hi";
  logEvent: (type: "info" | "success" | "warning", message: string) => void;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  childName?: string;
}

interface InstructionStep {
  id: string;
  en: string;
  es: string;
  sp: string; // Kid-friendly or simplified guidance
  category: "calming" | "transition" | "attention" | "social";
}

// Beautiful curated collection of therapeutic parenting prompt sequences
const WHISPER_SCENARIOS = {
  calming: {
    title: { en: "Overload De-escalation", es: "Desescalada de Sobrecarga", sp: "Momento de Calma Máxima" },
    desc: { en: "Stealth coaching to ground sensory meltdowns quietly.", es: "Coaching discreto para calmar crisis sensoriales.", sp: "Guía silenciosa para volver a la paz." },
    steps: [
      {
        id: "c1",
        en: "Lower your voice to a gentle murmur. Bring your physical posture below their eye level.",
        es: "Baja la voz a un susurro suave. Coloca tu postura física por debajo de su nivel visual.",
        sp: "Baja tu cabecita y háblale como si contaras el secreto más dulce del mundo."
      },
      {
        id: "c2",
        en: "Acknowledge the environment. Whisper: 'I see you are feeling a lot of energy. You are completely safe.'",
        es: "Reconoce el entorno. Susurra: 'Veo que sientes mucha energía. Estás completamente a salvo.'",
        sp: "Dile suavemente al oído: 'Sé que es difícil hoy, pero aquí estoy contigo siempre'."
      },
      {
        id: "c3",
        en: "Slow your own breathing visibly. Take 3 deep, audible inhales. Let them match your chest rhythm.",
        es: "Ralentiza tu propia respiración de forma visible. Inspira profundamente 3 veces, haz que oiga tu exhalación.",
        sp: "Inhala aire como una flor y bótalo despacio como una vela, para que Liam te imite."
      },
      {
        id: "c4",
        en: "Offer a deep pressure touch on shoulders or back, only if they initiate or welcome physical contact.",
        es: "Ofrece un contacto de presión profunda en hombros o espalda, solo si aceptan el contacto físico.",
        sp: "Pon tu manito suave en su hombro o dale un abrazo de oso suave si lo desea."
      },
      {
        id: "c5",
        en: "Minimize nearby visual clutter immediately. Dim lights or redirect focus to a soft textured surface.",
        es: "Reduce el desorden visual de inmediato. Atenúa las luces o redirige la mirada a algo suave.",
        sp: "Apaga la tele o luz fuerte y miren juntos un rinconcito tranquilo de la habitación."
      }
    ] as InstructionStep[]
  },
  transition: {
    title: { en: "Seamless Transition Guide", es: "Guía de Transición Suave", sp: "Cambio de Actividad Mágico" },
    desc: { en: "Stealthily guide changes between tasks without triggering resistance.", es: "Guía cambios de tareas discretamente sin generar resistencia.", sp: "Consejos para pasar de jugar a comer o dormir tranquilos." },
    steps: [
      {
        id: "t1",
        en: "Position yourself within their field of view. Do not touch or interrupt their active play yet.",
        es: "Colócate dentro de su campo visual. No toques ni interrumpas su juego activo todavía.",
        sp: "Ponte cerca de él donde pueda verte, pero déjalo terminar su juego un minutito."
      },
      {
        id: "t2",
        en: "Whisper a 2-minute soft warning countdown: 'In two minutes, we will pack up and start our puzzle.'",
        es: "Susurra una cuenta atrás de 2 minutos: 'En dos minutos guardaremos esto y empezaremos el rompecabezas.'",
        sp: "Dile cantando: 'Faltan dos minutitos mágicos para guardar los juguetes'."
      },
      {
        id: "t3",
        en: "Introduce a transitional sensory object (like a key, token, or soft card) to hold during the movement.",
        es: "Introduce un objeto sensorial de transición (como una llave o tarjeta suave) para que lo sostenga.",
        sp: "Dale un objeto especial para que lo lleve de la mano como el guardián de la mudanza."
      },
      {
        id: "t4",
        en: "Engage in joint clean-up. Turn it into a slow-motion game where you mimic each other's placement.",
        es: "Participa en la limpieza conjunta. Hazlo un juego en cámara lenta imitando sus movimientos.",
        sp: "Pongan las piezas en la caja súper despacio, como si fueran astronautas en la luna."
      },
      {
        id: "t5",
        en: "Praise the physical effort with quiet, warm words. Avoid high-pitched cheering that startles.",
        es: "Elogia el esfuerzo físico con palabras cálidas y tranquilas. Evita gritos que puedan asustar.",
        sp: "Dile con una gran sonrisa y voz bajita: '¡Qué buen trabajo de astronauta hiciste!'."
      }
    ] as InstructionStep[]
  },
  attention: {
    title: { en: "Cooperative Joint Focus", es: "Enfoque Cooperativo Mutuo", sp: "Atención de Súper Detective" },
    desc: { en: "Calibrate neural alignment and capture attention with minimal distraction.", es: "Calibra la alineación neuronal y capta la atención con mínima distracción.", sp: "Juegos silenciosos para mirar y concentrarnos juntos." },
    steps: [
      {
        id: "a1",
        en: "Hold a highly colored sensory target close to your chest, right in front of your chin.",
        es: "Sostiene un juguete colorido cerca de tu pecho, justo delante de tu barbilla.",
        sp: "Sostén un juguete cerca de tu cara para que Liam mire tus ojos al ver el objeto."
      },
      {
        id: "a2",
        en: "Whisper: 'Look... what's hiding behind my hand?' Create visual curiosity with gentle reveals.",
        es: "Susurra: 'Mira... ¿qué se esconde detrás de mi mano?' Crea curiosidad con revelaciones suaves.",
        sp: "Dile en un susurro: '¿Qué tengo aquí guardado en mi mano mágica?'"
      },
      {
        id: "a3",
        en: "Trace lines with your finger in front of them in the air. Invite them to follow the invisible track.",
        es: "Traza líneas con tu dedo en el aire. Invíta a seguir el sendero invisible con la mirada.",
        sp: "Dibuja un círculo invisible en el aire y pídele que lo sople suavemente."
      },
      {
        id: "a4",
        en: "Pause dialogue completely. Communicate only with nods and pointing for 30 peaceful seconds.",
        es: "Pausa el diálogo por completo. Comunícate solo con gestos de cabeza y señalando durante 30 segundos.",
        sp: "No hables ahora. Juega a comunicarte solo con miradas y sonrisas divertidas."
      }
    ] as InstructionStep[]
  }
};

export const ParentWhisperMode: React.FC<ParentWhisperModeProps> = ({
  theme,
  lang,
  logEvent,
  setNotifications,
  childName = "your child"
}) => {
  const [activeCategory, setActiveCategory] = useState<"calming" | "transition" | "attention">("calming");
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedLang, setSelectedLang] = useState<"en" | "es" | "sp">(lang === "hi" ? "en" : lang);

  // Initialize selected language when outer lang prop updates
  useEffect(() => {
    setSelectedLang(lang === "hi" ? "en" : lang);
  }, [lang]);

  const currentScenario = WHISPER_SCENARIOS[activeCategory];
  const steps = currentScenario.steps;
  const currentStep = steps[stepIndex] || steps[0];
  const currentText = currentStep ? (currentStep[selectedLang] || "").replace(/Liam/g, childName) : "";

  // TTS / Voice engine simulated or browser native speech synthesis
  const speakCurrentStep = () => {
    if (!currentStep) return;
    const textToSpeak = currentStep[selectedLang];
    
    // Check for native speech synthesis support
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Select whisper-friendly soft voice properties
      utterance.rate = 0.85; // slightly slower
      utterance.pitch = 0.95; // warmer and soft
      
      // Determine voice matching selected language
      const voices = window.speechSynthesis.getVoices();
      let matchedVoice = null;
      if (selectedLang === "en") {
        matchedVoice = voices.find(v => v.lang.startsWith("en"));
      } else {
        matchedVoice = voices.find(v => v.lang.startsWith("es"));
      }
      if (matchedVoice) utterance.voice = matchedVoice;

      window.speechSynthesis.speak(utterance);
      logEvent("success", `Text-to-Speech active: Whispering instruction in "${selectedLang.toUpperCase()}"`);
    } else {
      logEvent("warning", "Speech synthesis not supported in this browser. Simulating audio playback...");
    }
  };

  // Play instruction automatically when moving steps or toggled
  useEffect(() => {
    if (isVoiceActive && isPlaying) {
      speakCurrentStep();
    }
  }, [stepIndex, activeCategory, selectedLang, isVoiceActive]);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
      logEvent("info", `Parent Whisper Mode stepped to instruction ${stepIndex + 2}`);
    } else {
      logEvent("success", "Completed Parent Whisper session guidelines!");
      // Send clinical sync notification
      setNotifications((prev) => [
        {
          id: Math.random().toString(),
          text: `🤫 Parent Whisper Session: Completed de-escalation path in "${selectedLang.toUpperCase()}".`,
          time: "Just now",
          read: false
        },
        ...prev
      ]);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const handleRepeat = () => {
    logEvent("info", "Repeating current Parent Whisper instruction");
    speakCurrentStep();
  };

  const handleToggleVoice = () => {
    const nextState = !isVoiceActive;
    setIsVoiceActive(nextState);
    if (nextState) {
      logEvent("success", "Stealth Audio Earbud mode activated. Guiding parent via Speech Synthesis.");
      speakCurrentStep();
    } else {
      window.speechSynthesis.cancel();
      logEvent("info", "Stealth Audio deactivated.");
    }
  };

  // Styling
  const cardBgClass = theme === "light" ? "bg-white border-gray-100/60" : "bg-[#111726] border-gray-800/60";
  const textPrimaryClass = theme === "light" ? "text-gray-900" : "text-[#ECF0F1]";
  const textSecondaryClass = theme === "light" ? "text-gray-500" : "text-[#94A3B8]";
  const borderClass = theme === "light" ? "border-gray-100/80" : "border-gray-800/40";

  return (
    <div className="space-y-12 max-w-4xl mx-auto py-4">
      
      {/* Header Block - Simplified & Cleaned */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Headphones className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <h2 className={`text-2xl font-semibold font-display tracking-tight ${textPrimaryClass}`}>
              {selectedLang === "sp" ? "🤫 Modo Susurro" : "🤫 Parent Whisper Mode"}
            </h2>
          </div>
          <p className={`text-xs ${textSecondaryClass} font-medium`}>
            {selectedLang === "sp" 
              ? `Guía discreta en pantalla gigante y audio suave para conectar con ${childName} sin pantallas ruidosas.`
              : `Earbud-friendly stealth guidelines to coordinate sensory regulation calmly with ${childName}.`
            }
          </p>
        </div>

        {/* Dynamic Category Pickers - Simplified outline */}
        <div className="flex bg-gray-100/70 dark:bg-gray-800/40 p-1 rounded-full self-start border border-gray-200/20">
          {(["calming", "transition", "attention"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setStepIndex(0);
                logEvent("info", `Whisper Mode category set to "${cat}"`);
              }}
              className={`px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#00828A] text-white shadow-premium-sm"
                  : "text-gray-500 hover:text-gray-850 dark:hover:text-white"
              }`}
            >
              {WHISPER_SCENARIOS[cat].title[selectedLang]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Vision Pro Minimalist Text Display Card */}
      <div className={`p-8 md:p-16 rounded-[32px] border ${cardBgClass} shadow-premium-lg relative overflow-hidden flex flex-col justify-between min-h-[420px] smooth-transition`}>
        
        {/* Stealth Mode Glowing Ring */}
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-emerald-500/5 dark:bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/10">
          <EyeOff className="h-3.5 w-3.5 text-emerald-500 animate-pulse" strokeWidth={1.5} />
          <span className="text-[8px] font-mono font-bold text-emerald-500 tracking-wider">CHILD STEALTH LOCK</span>
        </div>

        {/* Outer Background soft ambient gradient loops */}
        <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-teal-500/5 dark:bg-teal-500/10 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />

        {/* Top Progress bar */}
        <div className="space-y-3 relative z-10">
          <div className="flex justify-between items-center px-0.5">
            <span className="text-[10px] font-semibold tracking-widest text-[#00828A] uppercase font-sans">
              {currentScenario.title[selectedLang]}
            </span>
            <span className="text-[10px] font-mono text-gray-400 font-medium">
              Instruction {stepIndex + 1} of {steps.length}
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-100/60 dark:bg-gray-800/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00828A] to-indigo-500 transition-all duration-500 rounded-full"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* LARGE MINIMALIST INSTRUCTION DISPLAY */}
        <div className="py-14 relative z-10 flex items-center justify-center min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={`${activeCategory}-${stepIndex}-${selectedLang}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`text-xl sm:text-2xl md:text-[28px] font-light leading-relaxed text-center tracking-tight max-w-2xl mx-auto ${textPrimaryClass}`}
            >
              "{currentText}"
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation & Parent Micro-Actions */}
        <div className="border-t border-gray-100/60 dark:border-gray-800/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
          
          {/* Audio Steering Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleVoice}
              className={`h-11 w-11 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                isVoiceActive
                  ? "bg-[#00828A] text-white shadow-[#00828A]/25"
                  : `${theme === 'light' ? 'bg-gray-50 text-gray-500 hover:bg-gray-100' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'}`
              }`}
              title={isVoiceActive ? "Deactivate stealth voice guide" : "Activate stealth earbud audio guide"}
            >
              {isVoiceActive ? <Volume2 className="h-4.5 w-4.5 animate-pulse" strokeWidth={1.5} /> : <VolumeX className="h-4.5 w-4.5" strokeWidth={1.5} />}
            </button>

            {isVoiceActive && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2 rounded-full cursor-pointer transition-all ${
                    theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Play className="h-3.5 w-3.5 fill-current" strokeWidth={1.5} />}
                </button>
                <button
                  onClick={handleRepeat}
                  className={`p-2 rounded-full cursor-pointer transition-all ${
                    theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-800 text-gray-300'
                  }`}
                  title="Repeat spoken text"
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>

          {/* Stepper buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrev}
              disabled={stepIndex === 0}
              className={`h-11 px-5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                stepIndex === 0
                  ? "opacity-30 cursor-not-allowed border-gray-100/50 dark:border-gray-800/40 text-gray-400"
                  : `${theme === 'light' ? 'bg-white hover:bg-gray-50 border-gray-150 text-gray-700 shadow-sm' : 'bg-gray-800/30 hover:bg-gray-800/60 border-gray-800 text-gray-300'}`
              }`}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              {selectedLang === "sp" ? "Atrás" : "Previous"}
            </button>

            <button
              onClick={handleNext}
              className="h-11 px-7 rounded-full text-xs font-bold bg-[#00828A] hover:opacity-95 hover:scale-[1.01] active:scale-98 text-white tracking-wider uppercase shadow-premium-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              {stepIndex === steps.length - 1 ? (
                <>
                  <Check className="h-4 w-4 stroke-[2.5px]" />
                  {selectedLang === "sp" ? "¡Completar!" : "Complete Session"}
                </>
              ) : (
                <>
                  {selectedLang === "sp" ? "Entendido" : "Next Instruction"}
                  <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Parental Stealth Guide Info Banner - Extremely Minimal */}
      <div className={`p-6 rounded-[24px] border ${cardBgClass} flex flex-col md:flex-row items-start gap-5 shadow-premium-sm smooth-transition`}>
        <div className="h-9 w-9 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
          <Info className="h-4.5 w-4.5" strokeWidth={1.5} />
        </div>
        <div className="space-y-1.5 flex-1">
          <h4 className={`text-xs font-semibold uppercase tracking-wider ${textPrimaryClass}`}>
            {selectedLang === "sp" ? "ℹ️ ¿Cómo usar el Modo Susurro?" : "ℹ️ Stealth Earbud Guidelines"}
          </h4>
          <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
            {selectedLang === "sp"
              ? `Ponle audífonos al teléfono o míralo con brillo bajo. Estas guías están escritas con letra muy grande para que puedas leerlas a la distancia sin que ${childName} se distraiga con luces brillantes de la pantalla.`
              : `Pop an earbud into one ear, keep your device at an angle or low brightness. The massive high-contrast font permits effortless reading from a distance, allowing you to focus completely on eye contact and posture with ${childName}.`
            }
          </p>
        </div>

        {/* Dynamic Multi-lingual trigger on-the-fly */}
        <div className="flex items-center gap-2 border-l border-gray-150 dark:border-gray-800 pl-5 py-1.5 self-center">
          <Languages className="h-4 w-4 text-indigo-400" strokeWidth={1.5} />
          <select
            value={selectedLang}
            onChange={(e) => {
              const nextLang = e.target.value as "en" | "es" | "sp";
              setSelectedLang(nextLang);
              logEvent("info", `Parent Whisper Mode translated dynamically to "${nextLang.toUpperCase()}"`);
            }}
            className={`text-xs font-semibold bg-transparent border-0 focus:ring-0 cursor-pointer pr-8 ${textPrimaryClass}`}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="sp">Español Infantil</option>
          </select>
        </div>
      </div>

    </div>
  );
};
