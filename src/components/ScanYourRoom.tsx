import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Camera,
  Check,
  X,
  Plus,
  RefreshCw,
  Sliders,
  Play,
  RotateCcw,
  Sparkle,
  BookmarkCheck,
  Compass,
  Layers,
  Heart,
  BookOpen,
  Volume2,
  Trash2,
  Info,
  CheckCircle,
  Eye,
  Activity,
  Mic
} from "lucide-react";

interface ScanYourRoomProps {
  theme: "light" | "dark";
  lang: "en" | "es" | "sp" | "hi";
  logEvent: (type: "info" | "success" | "warning", message: string) => void;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  setCurrentCalmProgress: React.Dispatch<React.SetStateAction<number>>;
}

interface HouseholdObject {
  id: string;
  nameEn: string;
  nameEs: string;
  nameSp: string;
  category: "sensory" | "motor" | "cognitive" | "social";
  confidence: number;
  icon: any;
  coordinates: { x: number; y: number }; // Percentage from top-left for 3D overlay representation
  confirmed: boolean;
  color: string;
}

const INITIAL_DETECTED_OBJECTS: HouseholdObject[] = [
  {
    id: "pillow",
    nameEn: "Soft Pillow",
    nameEs: "Almohada Suave",
    nameSp: "Almohadita Cómoda",
    category: "sensory",
    confidence: 97.4,
    icon: Sparkle,
    coordinates: { x: 32, y: 45 },
    confirmed: true,
    color: "from-indigo-400 to-purple-500"
  },
  {
    id: "blanket",
    nameEn: "Cozy Blanket",
    nameEs: "Manta Acogedora",
    nameSp: "Mantita Suave",
    category: "sensory",
    confidence: 94.8,
    icon: Layers,
    coordinates: { x: 68, y: 55 },
    confirmed: true,
    color: "from-blue-400 to-cyan-500"
  },
  {
    id: "book",
    nameEn: "Story Book",
    nameEs: "Libro de Cuentos",
    nameSp: "Cuento Ilustrado",
    category: "cognitive",
    confidence: 98.1,
    icon: BookOpen,
    coordinates: { x: 50, y: 70 },
    confirmed: true,
    color: "from-emerald-400 to-teal-500"
  },
  {
    id: "mug",
    nameEn: "Plastic Mug",
    nameEs: "Taza de Plástico",
    nameSp: "Vasito Divertido",
    category: "motor",
    confidence: 89.2,
    icon: Volume2,
    coordinates: { x: 18, y: 62 },
    confirmed: true,
    color: "from-amber-400 to-orange-500"
  },
  {
    id: "mirror",
    nameEn: "Hand Mirror",
    nameEs: "Espejo de Mano",
    nameSp: "Espejito Mágico",
    category: "social",
    confidence: 91.5,
    icon: Eye,
    coordinates: { x: 82, y: 38 },
    confirmed: true,
    color: "from-rose-400 to-pink-500"
  },
  {
    id: "chair",
    nameEn: "Wooden Chair",
    nameEs: "Silla de Madera",
    nameSp: "Silla del Trono",
    category: "motor",
    confidence: 96.3,
    icon: Activity,
    coordinates: { x: 45, y: 30 },
    confirmed: true,
    color: "from-violet-400 to-fuchsia-500"
  }
];

export const ScanYourRoom: React.FC<ScanYourRoomProps> = ({
  theme,
  lang,
  logEvent,
  setNotifications,
  setCurrentCalmProgress
}) => {
  // Scanning States
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scannedObjects, setScannedObjects] = useState<HouseholdObject[]>([]);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [isMissionCreated, setIsMissionCreated] = useState<boolean>(false);
  const [selectedTaskIndices, setSelectedTaskIndices] = useState<Record<string, boolean[]>>({});

  // Refs
  const scanTimerRef = useRef<any>(null);

  // Localization
  const strings = {
    title: {
      en: "Create Session From My Room",
      es: "Crear Sesión Desde Mi Habitación",
      sp: "Crear Sesión Desde Mi Habitación"
    },
    subtitle: {
      en: "Point your camera around your room. We'll use everyday objects to create a personalized therapy session.",
      es: "Apunta tu cámara alrededor de tu habitación. Usaremos objetos cotidianos para crear una sesión de terapia personalizada.",
      sp: "¡Busca cosas lindas en tu habitación con la cámara para crear juegos divertidos!"
    },
    startScan: {
      en: "Create Session From My Room",
      es: "Crear Sesión Desde Mi Habitación",
      sp: "¡Empezar Juego!"
    },
    scanning: {
      en: "Finding everyday objects...",
      es: "Buscando objetos cotidianos...",
      sp: "Buscando cosas lindas..."
    },
    calibrating: {
      en: "Preparing your warm session...",
      es: "Preparando tu sesión acogedora...",
      sp: "Preparando tu juego..."
    },
    confidenceBadge: {
      en: "Match",
      es: "Coincidencia",
      sp: "Coincidencia"
    },
    confirm: {
      en: "Use This",
      es: "Usar",
      sp: "Usar"
    },
    remove: {
      en: "Skip",
      es: "Omitir",
      sp: "Omitir"
    },
    confirmedTitle: {
      en: "Selected Objects",
      es: "Objetos Seleccionados",
      sp: "Cosas de la Habitación"
    },
    createMissionBtn: {
      en: "Create Session",
      es: "Crear Sesión",
      sp: "¡Crear Mi Sesión!"
    },
    missionCreatedHeader: {
      en: "Your Session is Ready!",
      es: "¡Tu Sesión está Lista!",
      sp: "¡Tu Sesión Mágica ya está Lista!"
    },
    missionCreatedSub: {
      en: "We have prepared daily games using the everyday items found in your room.",
      es: "Hemos preparado juegos diarios utilizando los artículos cotidianos de tu habitación.",
      sp: "¡Hemos preparado juegos increíbles usando las cosas de tu cuarto!"
    },
    resetScan: {
      en: "Scan Again",
      es: "Volver a Escanear",
      sp: "Escanear Otra Vez"
    },
    emptyState: {
      en: "Press the button below and slowly scan your room to detect safe items like pillows, books, or blankets.",
      es: "Presiona el botón de abajo y escanea lentamente tu habitación para detectar artículos seguros como almohadas, libros o mantas.",
      sp: "¡Presiona el botón de abajo para empezar a buscar cosas en tu habitación!"
    },
    activityTitle: {
      en: "Playful Interaction Ideas",
      es: "Ideas de Juego",
      sp: "Juegos para Divertirse"
    },
    activityDesc: {
      en: "Warm, gentle ways to practice communication and play together using your selected items.",
      es: "Formas cálidas y amables de practicar la comunicación y jugar juntos utilizando los objetos seleccionados.",
      sp: "Juegos lindos y sencillos diseñados especialmente para divertirse hoy."
    }
  };

  // Run Simulated Scan
  const startScanningFlow = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScannedObjects([]);
    setHasScanned(false);
    setIsMissionCreated(false);
    logEvent("info", "Starting room camera search...");

    if (scanTimerRef.current) clearInterval(scanTimerRef.current);

    scanTimerRef.current = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 5;
        
        // Staggered object discoveries
        if (next === 20) {
          const obj = INITIAL_DETECTED_OBJECTS[0];
          setScannedObjects((current) => [...current, obj]);
          logEvent("success", `Found: ${obj.nameEn}!`);
        } else if (next === 40) {
          const obj = INITIAL_DETECTED_OBJECTS[1];
          const obj2 = INITIAL_DETECTED_OBJECTS[2];
          setScannedObjects((current) => [...current, obj, obj2]);
          logEvent("success", `Found: ${obj.nameEn} & ${obj2.nameEn}!`);
        } else if (next === 65) {
          const obj = INITIAL_DETECTED_OBJECTS[3];
          setScannedObjects((current) => [...current, obj]);
          logEvent("success", `Found: ${obj.nameEn}!`);
        } else if (next === 85) {
          const obj1 = INITIAL_DETECTED_OBJECTS[4];
          const obj2 = INITIAL_DETECTED_OBJECTS[5];
          setScannedObjects((current) => [...current, obj1, obj2]);
          logEvent("success", `Found: ${obj1.nameEn} & ${obj2.nameEn}!`);
        }

        if (next >= 100) {
          clearInterval(scanTimerRef.current);
          setIsScanning(false);
          setHasScanned(true);
          logEvent("success", "Room search complete.");
          return 100;
        }
        return next;
      });
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    };
  }, []);

  // Toggles for confirmation
  const handleToggleConfirm = (id: string) => {
    setScannedObjects((current) =>
      current.map((obj) => {
        if (obj.id === id) {
          const nextState = !obj.confirmed;
          logEvent(
            nextState ? "success" : "info",
            `${nextState ? "Confirmed" : "Ignored"} spatial object: ${obj.nameEn}`
          );
          return { ...obj, confirmed: nextState };
        }
        return obj;
      })
    );
  };

  const handleRemoveObject = (id: string) => {
    setScannedObjects((current) => current.filter((obj) => obj.id !== id));
    logEvent("warning", `Removed spatial object ${id} from scanner memory.`);
  };

  // Create Mission
  const handleCreateMission = () => {
    const confirmedCount = scannedObjects.filter((o) => o.confirmed).length;
    if (confirmedCount === 0) {
      logEvent("warning", "Cannot generate adventure without confirmed spatial nodes.");
      return;
    }

    setIsMissionCreated(true);
    setCurrentCalmProgress((prev) => Math.min(100, prev + 3.0));
    
    // Set initial checklist arrays for generated activities
    const initialTasks: Record<string, boolean[]> = {};
    scannedObjects.forEach((obj) => {
      if (obj.confirmed) {
        initialTasks[obj.id] = [false, false, false];
      }
    });
    setSelectedTaskIndices(initialTasks);

    const notificationText = {
      en: `Spatial Portal: Calibrated today's home adventure utilizing ${confirmedCount} confirmed objects.`,
      es: `Portal Espacial: Calibrada la aventura de hoy utilizando ${confirmedCount} objetos del hogar.`,
      sp: `🏆 ¡Nueva aventura creada con tus juguetes favoritos del cuarto!`
    };

    setNotifications((prev) => [
      {
        id: Math.random().toString(),
        text: notificationText[lang],
        time: "Just now",
        read: false
      },
      ...prev
    ]);

    logEvent("success", `Spatial telemetry compiled: Generated visionOS-friendly tasks for ${confirmedCount} elements.`);
  };

  // Complete specific subtask
  const handleToggleSubtask = (objId: string, idx: number) => {
    setSelectedTaskIndices((prev) => {
      const current = prev[objId] ? [...prev[objId]] : [false, false, false];
      current[idx] = !current[idx];
      
      const isCompleted = current[idx];
      logEvent(
        isCompleted ? "success" : "info",
        `Completed subtask ${idx + 1} for sensory target: "${objId}"`
      );

      // Check if all tasks in this sensory target are done to award extra calm progress
      if (current.every((v) => v)) {
        setCurrentCalmProgress((p) => Math.min(100, p + 1.5));
      }

      return { ...prev, [objId]: current };
    });
  };

  // Activity templates based on detected objects
  const getActivitiesForObject = (id: string): { title: string; tasks: string[]; benefit: string; time: string } => {
    const playbook: Record<string, { title: string; tasks: string[]; benefit: string; time: string }> = {
      pillow: {
        title: lang === "sp" ? "☁️ El Cojín Nube" : lang === "es" ? "Cojín de Relajación" : "The Soft Cloud Float",
        tasks: lang === "sp" ? [
          "Sostén el cojín con las dos manos y apriétalo fuerte mientras cuentas hasta 5.",
          "Coloca el cojín sobre tu cabeza e intenta caminar 5 pasos sin que se caiga.",
          "Recuéstate y descansa tu mejilla sintiendo la tela suavecita."
        ] : lang === "es" ? [
          "Sostén el cojín con ambas manos y ejerce presión profunda durante 5 segundos.",
          "Camina con el cojín sobre tu cabeza para mejorar la postura y equilibrio.",
          "Abraza el cojín respirando lentamente para regular pulsaciones."
        ] : [
          "Apply deep physical pressure against the pillow with both hands for 5 seconds.",
          "Balance the pillow on your head and take 5 careful, rhythmic steps.",
          "Hug the pillow closely while performing slow, rhythmic breathing cycles."
        ],
        benefit: lang === "sp" ? "Calmar el cuerpo y mejorar el equilibrio" : "Sensory integration & pressure calibration",
        time: "4 mins"
      },
      blanket: {
        title: lang === "sp" ? "🎪 El Fuerte Mágico" : lang === "es" ? "Capullo de Seguridad" : "The Warm Cocoon Wrap",
        tasks: lang === "sp" ? [
          "Envuelve tus hombros con la mantita como una capa de superhéroe.",
          "Toca los bordes de la manta buscando costuras suaves con tus dedos.",
          "Haz una casita pequeña sobre tus piernas para jugar en secreto."
        ] : lang === "es" ? [
          "Envuélvete suavemente con la manta sintiendo el peso reconfortante.",
          "Toca las texturas del borde de la manta estimulando el tacto fino.",
          "Crea una pequeña cabaña para disminuir la estimulación visual externa."
        ] : [
          "Wrap the cozy blanket around your shoulders like a weighted safe cape.",
          "Trace the stitched borders of the blanket to calibrate touch fine sensory levels.",
          "Use the blanket to build a low-stimulation micro-fort for quiet focus."
        ],
        benefit: lang === "sp" ? "Sentirse seguro y calientito" : "Deep touch pressure & thermal grounding",
        time: "6 mins"
      },
      book: {
        title: lang === "sp" ? "📖 El Detective de Dibujos" : lang === "es" ? "Buscador de Historias" : "Story Book Finder",
        tasks: lang === "sp" ? [
          "Abre una página y busca tres dibujos de color verde.",
          "Toca suavemente las esquinas de las páginas al pasarlas una a una.",
          "Señala la letra más grande que encuentres en el título del cuento."
        ] : lang === "es" ? [
          "Abre un capítulo al azar y localiza tres palabras que inicien con la vocal 'A'.",
          "Pasa las hojas secuencialmente enfocándote en el sonido del papel crujir.",
          "Señala símbolos o personajes grandes entrenando la atención visual conjunta."
        ] : [
          "Scan any page to locate three geometric shapes or vibrant green illustrations.",
          "Turn pages slowly and listen to the rhythmic paper rustling sound.",
          "Point out the largest letter on the page to build focused attention spans."
        ],
        benefit: lang === "sp" ? "Enfoque de ojos y aprender palabras" : "Cognitive tracking & auditory calming",
        time: "5 mins"
      },
      mug: {
        title: lang === "sp" ? "🥤 El Vasito de Agua Mágica" : lang === "es" ? "El Guardián del Agua" : "The Liquid Precision Play",
        tasks: lang === "sp" ? [
          "Sostén el vasito vacío e imita beber con un sonido divertido.",
          "Toca el borde redondo del vasito con tu dedo índice despacito.",
          "Coloca el vasito boca abajo en el suelo para tapar un objeto secreto."
        ] : lang === "es" ? [
          "Sostén el vaso con firmeza moviéndolo en círculos lentos sin soltarlo.",
          "Usa la yema de tus dedos para rastrear el borde circular de la taza.",
          "Utiliza el vaso boca abajo para apilarlo de forma segura."
        ] : [
          "Grip the plastic mug firmly and mimic slow, controlled drinking motions.",
          "Trace the smooth circular rim with your primary index finger to calibrate touch.",
          "Place the mug upside down over a small toy to practice focus hide-and-seek."
        ],
        benefit: lang === "sp" ? "Fuerza en las manos y coordinación" : "Fine motor grip & hand-eye coordination",
        time: "3 mins"
      },
      mirror: {
        title: lang === "sp" ? "🪞 El Espejo de las Muecas" : lang === "es" ? "Espejo de Expresiones" : "Mirror Mimicry Explorer",
        tasks: lang === "sp" ? [
          "Mira el espejo y haz una cara feliz y luego una sorprendida.",
          "Señala tu propia nariz y sonríe con alegría frente al espejo.",
          "Di tu nombre completo mirándote fijamente a los ojos con orgullo."
        ] : lang === "es" ? [
          "Haz 3 muecas diferentes frente al espejo para reconocer emociones corporales.",
          "Señala tus ojos, nariz y boca de manera pausada y coordinada.",
          "Pronuncia palabras de calma viéndote de frente con respiración controlada."
        ] : [
          "Look into the mirror and practice forming a happy face, then a calm face.",
          "Point to your nose, eyes, and ears sequentially to practice body mapping.",
          "State your current mood aloud while looking directly at your reflection."
        ],
        benefit: lang === "sp" ? "Conocer nuestras caritas y divertirnos" : "Social-emotional feedback & self-reflection",
        time: "4 mins"
      },
      chair: {
        title: lang === "sp" ? "👑 El Trono del Castillo" : lang === "es" ? "El Trono de la Calma" : "The Castle Throne Posture",
        tasks: lang === "sp" ? [
          "Siéntate derechito como un rey o reina en su trono.",
          "Coloca tus manos sobre tus rodillas y respira como un oso grande.",
          "Levántate de la silla y da una vuelta alrededor de ella flotando."
        ] : lang === "es" ? [
          "Siéntate manteniendo la espalda alineada con el respaldo de la silla.",
          "Coloca las manos en los reposabrazos y presiona con firmeza para sentir soporte.",
          "Levántate con cuidado, camina en círculo alrededor de la silla y vuelve a sentarte."
        ] : [
          "Sit upright with your back flush against the support structure.",
          "Press your palms flat against the armrests to feel grounding physical feedback.",
          "Stand up slowly, orbit the chair once, and take your seat with total control."
        ],
        benefit: lang === "sp" ? "Sentarse derechito y respirar fuerte" : "Proprioceptive feedback & postural alignment",
        time: "5 mins"
      }
    };

    return playbook[id] || {
      title: "Sensory Playground Target",
      tasks: [
        "Interact with this object safely under parent supervision.",
        "Practice deep slow breath cycles near the target area.",
        "Describe the visual texture color of the object."
      ],
      benefit: "General sensory focus",
      time: "3 mins"
    };
  };

  // Styled helper values matching theme
  const cardBgClass = theme === "light" ? "bg-white border-gray-150" : "bg-[#161D30]/85 border-gray-800";
  const textPrimaryClass = theme === "light" ? "text-gray-900" : "text-[#ECF0F1]";
  const textSecondaryClass = theme === "light" ? "text-gray-500" : "text-[#94A3B8]";
  const borderClass = theme === "light" ? "border-gray-200" : "border-gray-800/80";

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Upper Brand Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
            <Camera className="h-4 w-4" />
          </div>
          <h2 className={`text-2xl font-extrabold font-display ${textPrimaryClass}`}>
            {strings.title[lang]}
          </h2>
        </div>
        <p className={`text-sm ${textSecondaryClass} leading-relaxed`}>
          {strings.subtitle[lang]}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Spatial Viewfinder Container */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`relative overflow-hidden rounded-premium border ${
            theme === "light" ? "bg-gray-150/40 border-gray-200" : "bg-[#090D16] border-gray-800"
          } shadow-premium-lg h-[400px] flex flex-col items-center justify-center`}>
            
            {/* Ambient spatial grid lines */}
            <div className="absolute inset-0 bg-spatial-grid opacity-[0.06] pointer-events-none" />
            
            {/* Viewfinder brackets */}
            <div className="absolute top-6 left-6 h-6 w-6 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-md" />
            <div className="absolute top-6 right-6 h-6 w-6 border-t-2 border-r-2 border-cyan-500/40 rounded-tr-md" />
            <div className="absolute bottom-6 left-6 h-6 w-6 border-b-2 border-l-2 border-cyan-500/40 rounded-bl-md" />
            <div className="absolute bottom-6 right-6 h-6 w-6 border-b-2 border-r-2 border-cyan-500/40 rounded-br-md" />

            {/* Glowing background spatial particles */}
            <div className="absolute top-1/4 left-1/3 h-32 w-32 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 h-32 w-32 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {!isScanning && !hasScanned ? (
                /* START SCAN IDLE STATE */
                <motion.div
                  key="idle-viewfinder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center p-8 text-center space-y-6 relative z-10"
                >
                  <div className="h-16 w-16 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center shadow-premium-sm relative">
                    <span className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
                    <Camera className="h-7 w-7" />
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <h3 className={`text-base font-extrabold ${textPrimaryClass}`}>
                      {lang === "en" ? "Environmental LiDAR Ready" : "LiDAR Ambiental Listo"}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {strings.emptyState[lang]}
                    </p>
                  </div>
                  <button
                    onClick={startScanningFlow}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 hover:scale-[1.02] active:scale-95 text-white text-xs font-extrabold uppercase tracking-wider shadow-premium-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    {strings.startScan[lang]}
                  </button>
                </motion.div>
              ) : isScanning ? (
                /* ACTIVE SCANNING SCREEN */
                <motion.div
                  key="scanning-viewfinder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col items-center justify-center p-8 relative z-10"
                >
                  {/* Moving scanning horizontal laser */}
                  <motion.div
                    animate={{ y: [0, 350, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20"
                  />

                  {/* Circular depth ring */}
                  <div className="relative h-44 w-44 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/30"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                      className="absolute inset-3 rounded-full border border-dashed border-purple-400/20"
                    />
                    <div className="h-28 w-28 rounded-full bg-cyan-950/25 border border-cyan-500/30 backdrop-blur-md flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-extrabold text-cyan-400 font-mono">{scanProgress}%</span>
                      <span className="text-[8px] font-mono uppercase tracking-wider text-cyan-300/60 mt-0.5">MESH DATA</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-center mt-6 max-w-sm">
                    <h3 className={`text-sm font-extrabold tracking-wide ${textPrimaryClass} animate-pulse`}>
                      {strings.scanning[lang]}
                    </h3>
                    <p className="text-[11px] text-cyan-400/75 leading-relaxed font-mono">
                      {strings.calibrating[lang]}
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* SCAN COMPLETED SPACE MAP OVERLAY VIEW */
                <motion.div
                  key="mapped-viewfinder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full relative"
                >
                  {/* Backdrop showing a simulated room wireframe */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/80 to-[#1E293B]/90 flex items-center justify-center p-8 text-center pointer-events-none">
                    <div className="border border-cyan-500/10 rounded-premium p-6 max-w-xs space-y-2 backdrop-blur-md">
                      <Compass className="h-8 w-8 text-cyan-500/30 mx-auto animate-spin-slow" />
                      <p className="text-[10px] font-mono text-cyan-400/40">SPATIAL ANCHORS LOCKED IN REAL TIME</p>
                    </div>
                  </div>

                  {/* Interactive floating point-cloud coordinates on the simulated space viewport */}
                  {scannedObjects.map((obj) => (
                    <motion.div
                      key={obj.id}
                      style={{ top: `${obj.coordinates.y}%`, left: `${obj.coordinates.x}%` }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 100, delay: obj.coordinates.x * 0.01 }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
                    >
                      {/* Anchor pulsing dot */}
                      <span className="relative flex h-5 w-5 items-center justify-center">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          obj.confirmed ? "bg-cyan-400" : "bg-gray-400"
                        }`}></span>
                        <span className={`relative inline-flex rounded-full h-3.5 w-3.5 items-center justify-center ${
                          obj.confirmed ? "bg-cyan-500" : "bg-gray-500"
                        } text-white`}>
                          <Plus className="h-2 w-2 stroke-[3px]" />
                        </span>
                      </span>

                      {/* Floating tag above dot */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold py-1 px-2.5 rounded-full whitespace-nowrap shadow-premium-md opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
                        {lang === "en" ? obj.nameEn : lang === "es" ? obj.nameEs : obj.nameSp}
                      </div>
                    </motion.div>
                  ))}

                  {/* Laser line glowing sweep on complete */}
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[9px] font-mono text-cyan-400 flex items-center gap-1.5 z-20">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>SPATIAL AUDIO CALIBRATED</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Rescan control */}
          {hasScanned && !isScanning && (
            <div className="flex justify-between items-center">
              <button
                onClick={startScanningFlow}
                className={`text-xs font-extrabold uppercase tracking-wider ${textSecondaryClass} hover:${textPrimaryClass} flex items-center gap-1.5 cursor-pointer`}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {strings.resetScan[lang]}
              </button>
              <div className="text-[10px] font-mono text-gray-400">
                {scannedObjects.filter((o) => o.confirmed).length} objects confirmed
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Glassmorphic Floating Cards & Confirmation Desk */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="space-y-4">
            <h3 className={`text-base font-extrabold font-display ${textPrimaryClass}`}>
              {hasScanned ? strings.confirmedTitle[lang] : (lang === "en" ? "Environmental Targets" : "Objetivos del Entorno")}
            </h3>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {scannedObjects.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-6 text-center border border-dashed rounded-premium ${borderClass} flex flex-col items-center justify-center space-y-3`}
                  >
                    <Layers className="h-8 w-8 text-gray-400/60" />
                    <p className="text-xs text-gray-400 leading-normal max-w-[220px]">
                      {lang === "en" ? "No household items in memory buffer." : "No hay elementos en la memoria del escáner."}
                    </p>
                  </motion.div>
                ) : (
                  scannedObjects.map((obj) => {
                    const ObjIcon = obj.icon;
                    return (
                      <motion.div
                        key={obj.id}
                        layout
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={`p-4 rounded-premium border ${cardBgClass} flex items-center justify-between gap-4 shadow-premium-sm hover:scale-[1.01] hover:shadow-premium-md transition-all relative overflow-hidden`}
                      >
                        {/* Glow indicator based on confirm state */}
                        {obj.confirmed && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-indigo-500" />
                        )}

                        <div className="flex items-center gap-3">
                          {/* Circle icon */}
                          <div className={`h-10 w-10 rounded-full bg-gradient-to-tr ${obj.color} text-white flex items-center justify-center shrink-0 shadow-premium-sm`}>
                            <ObjIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className={`text-sm font-bold ${textPrimaryClass}`}>
                              {lang === "en" ? obj.nameEn : lang === "es" ? obj.nameEs : obj.nameSp}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[9px] text-gray-400 font-mono">
                                {strings.confidenceBadge[lang]}:
                              </span>
                              <span className="text-[9px] text-emerald-500 font-bold font-mono">
                                {obj.confidence}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Confirm/Remove Vision Pro toggles */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleConfirm(obj.id)}
                            className={`p-2 rounded-full cursor-pointer transition-all ${
                              obj.confirmed
                                ? "bg-emerald-500 text-white"
                                : `${theme === "light" ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`
                            }`}
                            title={strings.confirm[lang]}
                          >
                            <Check className="h-3.5 w-3.5 stroke-[3px]" />
                          </button>
                          <button
                            onClick={() => handleRemoveObject(obj.id)}
                            className={`p-2 rounded-full cursor-pointer transition-all ${
                              theme === "light"
                                ? "bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500"
                                : "bg-gray-800/60 text-gray-500 hover:bg-rose-950/40 hover:text-rose-400"
                            }`}
                            title={strings.remove[lang]}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Core confirmation CTA to compile activities */}
          {hasScanned && (
            <button
              onClick={handleCreateMission}
              disabled={scannedObjects.filter((o) => o.confirmed).length === 0}
              className={`w-full py-4 rounded-full text-xs font-extrabold tracking-wider uppercase shadow-premium-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                scannedObjects.filter((o) => o.confirmed).length > 0
                  ? "bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:opacity-90 hover:scale-[1.01] active:scale-95 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border border-dashed border-gray-200 dark:border-gray-700 shadow-none"
              }`}
            >
              <BookmarkCheck className="h-4.5 w-4.5" />
              {strings.createMissionBtn[lang]}
            </button>
          )}

        </div>

      </div>

      {/* LOWER EXPANDED PANEL: "Today's Mission has been created." & Spatial Activities */}
      <AnimatePresence>
        {isMissionCreated && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="space-y-8 pt-4"
          >
            
            {/* Majestic Spatial Dynamic Confirm Alert Banner */}
            <div className={`p-8 rounded-premium border relative overflow-hidden text-center md:text-left ${
              theme === "light" 
                ? "bg-gradient-to-r from-[#EBFBFC] via-white to-[#EEF2F6] border-teal-200/60" 
                : "bg-gradient-to-r from-[#0E1E2C] via-[#111A2E] to-[#1E1B4B]/80 border-cyan-500/25"
            } shadow-premium-lg`}>
              
              {/* Spinning background magical particles */}
              <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-cyan-500/10 blur-2xl animate-pulse" />
              <div className="absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-indigo-500/10 blur-xl animate-pulse" />

              <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-premium-md animate-bounce">
                  <CheckCircle className="h-9 w-9 stroke-[2.5px]" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className={`text-xl md:text-2xl font-extrabold font-display tracking-tight ${textPrimaryClass}`}>
                    {strings.missionCreatedHeader[lang]}
                  </h3>
                  <p className={`text-xs ${textSecondaryClass} leading-relaxed`}>
                    {strings.missionCreatedSub[lang]}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-3 py-1 rounded-full font-bold">
                    VISION_PRO_SYNTH
                  </span>
                </div>
              </div>
            </div>

            {/* Generated Spatial activities */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className={`text-lg font-extrabold font-display ${textPrimaryClass}`}>
                  {strings.activityTitle[lang]}
                </h3>
                <p className={`text-xs ${textSecondaryClass}`}>
                  {strings.activityDesc[lang]}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scannedObjects
                  .filter((o) => o.confirmed)
                  .map((obj) => {
                    const act = getActivitiesForObject(obj.id);
                    const taskStates = selectedTaskIndices[obj.id] || [false, false, false];
                    const completedAll = taskStates.every((v) => v);

                    return (
                      <motion.div
                        key={obj.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-6 rounded-premium border ${cardBgClass} flex flex-col justify-between h-[390px] shadow-premium-sm relative overflow-hidden transition-all ${
                          completedAll ? "ring-2 ring-emerald-500/40 border-emerald-500/30" : ""
                        }`}
                      >
                        {/* Glow corner decoration */}
                        <div className={`absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-gradient-to-bl ${obj.color} opacity-[0.04] pointer-events-none`} />

                        <div>
                          {/* Card upper info */}
                          <div className="flex items-center justify-between border-b pb-3 border-gray-100 dark:border-gray-800">
                            <span className="text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2.5 py-0.5 rounded-full">
                              {act.time}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              {obj.id} target
                            </span>
                          </div>

                          <div className="pt-3 space-y-1.5">
                            <h4 className={`text-base font-extrabold leading-snug ${textPrimaryClass}`}>
                              {act.title}
                            </h4>
                            <p className="text-[10px] text-emerald-500 font-bold leading-normal">
                              🎯 {act.benefit}
                            </p>
                          </div>

                          {/* Task List */}
                          <div className="space-y-2.5 pt-4">
                            {act.tasks.map((task, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleToggleSubtask(obj.id, idx)}
                                className={`w-full p-2.5 rounded-premium border text-left flex items-start gap-2.5 cursor-pointer transition-all ${
                                  taskStates[idx]
                                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-900 dark:text-emerald-300"
                                    : `${theme === "light" ? "bg-gray-50 border-gray-150" : "bg-gray-800/20 border-gray-800/80"} ${textPrimaryClass}`
                                }`}
                              >
                                <div className={`h-4.5 w-4.5 rounded border shrink-0 flex items-center justify-center mt-0.5 transition-all ${
                                  taskStates[idx]
                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                }`}>
                                  {taskStates[idx] && <Check className="h-3 w-3 stroke-[3px]" />}
                                </div>
                                <span className="text-[11px] font-medium leading-relaxed leading-snug">{task}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Completed celebration bar inside the activity card */}
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
                          {completedAll ? (
                            <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-emerald-500 uppercase tracking-wider">
                              <CheckCircle className="h-4 w-4" />
                              <span>{lang === 'sp' ? '¡Juego Superado!' : 'Activity Cleared!'}</span>
                            </div>
                          ) : (
                            <div className="text-[10px] text-gray-400 font-mono text-center">
                              {taskStates.filter(Boolean).length} of 3 tasks completed
                            </div>
                          )}
                        </div>

                      </motion.div>
                    );
                  })}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
