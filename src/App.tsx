import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Sun,
  Moon,
  Globe,
  Search,
  Check,
  Lock,
  RefreshCw,
  Layers,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Sparkles,
  Trash2,
  Eye,
  Volume2,
  Sliders,
  CheckSquare,
  MapPin,
  Clock,
  Target,
  Play,
  Pause,
  Award,
  BookOpen,
  Heart,
  Activity,
  Camera,
  TrendingUp,
  Home,
  User,
  Settings,
  Sprout,
  Quote
} from "lucide-react";
import { Logo } from "./components/Logo";
import { MissionAnywhere } from "./components/MissionAnywhere";
import { ScanYourRoom } from "./components/ScanYourRoom";
import { ParentWhisperMode } from "./components/ParentWhisperMode";
import { ProgressScreen } from "./components/ProgressScreen";
import { ShareYourPath } from "./components/ShareYourPath";
import { Onboarding } from "./components/Onboarding";
import { ChildProfile, ParentProfile, TherapySession, getGoalLabel, generateWeeklyPlan } from "./lib/personalization";
import { useSaas } from "./lib/SaasContext";
// @ts-ignore
import whisperingWoodsHero from "./assets/images/whispering_woods_hero_1782753214681.jpg";
// @ts-ignore
import adventureSpace from "./assets/images/adventure_space_1782835237553.jpg";
// @ts-ignore
import adventureOcean from "./assets/images/adventure_ocean_1782835248936.jpg";
// @ts-ignore
import adventureJungle from "./assets/images/adventure_jungle_1782835260329.jpg";
// @ts-ignore
import adventureTreasure from "./assets/images/adventure_treasure_1782835278027.jpg";
// @ts-ignore
import adventureCastle from "./assets/images/adventure_castle_1782835296628.jpg";
// @ts-ignore
import adventureForest from "./assets/images/adventure_forest_1782835310930.jpg";

const GOAL_OF_THE_WEEK_MAP = {
  space: {
    accentColor: "purple",
    title: {
      en: "Improve Focus & Attention",
      es: "Mejorar la Atención",
      sp: "✨ Super Concentración",
      hi: "ध्यान और एकाग्रता सुधारें"
    },
    description: {
      en: "This week, focus on extending Liam's attention span by finding and tracking slow-moving objects in gentle sensory environments.",
      es: "Esta semana, concéntrate en ampliar la atención de Liam encontrando y siguiendo objetos lentos en entornos sensoriales suaves.",
      sp: "¡Vamos a buscar cosas brillantes que se mueven despacito por la habitación!",
      hi: "इस सप्ताह, शांत संवेदी वातावरण में धीमी गति से चलने वाली वस्तुओं को ढूंढने और ट्रैक करने पर ध्यान केंद्रित करें।"
    },
    suggestion: {
      en: "During play, guide Liam's eyes to a slowly moving glowing toy and encourage him to follow it for 10 seconds before transitioning.",
      es: "Durante el juego, guía la mirada de Liam hacia un juguete brillante que se mueva lento y anímalo a seguirlo por 10 segundos.",
      sp: "Cuando jueguen, muevan un juguete brillante muy despacio frente a sus ojitos para que lo siga con la mirada.",
      hi: "खेल के दौरान, लायम की आँखों को धीरे-धीरे चलने वाले चमकते खिलौने की ओर ले जाएं और उसे फॉलो करने के लिए प्रोत्साहित करें।"
    }
  },
  ocean: {
    accentColor: "cyan",
    title: {
      en: "Improve Eye Contact",
      es: "Mejorar el Contacto Visual",
      sp: "👀 Miradas de Cariño",
      hi: "आँखों का संपर्क सुधारें"
    },
    description: {
      en: "This week, focus on encouraging natural eye contact during everyday conversations and play.",
      es: "Esta semana, concéntrate en fomentar el contacto visual natural durante las conversaciones diarias y el juego.",
      sp: "¡Esta semana jugamos a mirarnos a los ojos y sonreír mucho!",
      hi: "इस सप्ताह, दैनिक बातचीत और खेल के दौरान प्राकृतिक आँखों के संपर्क को प्रोत्साहित करने पर ध्यान केंद्रित करें।"
    },
    suggestion: {
      en: "During breakfast, wait 3–5 seconds after asking a question to encourage eye contact before repeating it.",
      es: "Durante el desayuno, espera de 3 a 5 segundos después de hacer una pregunta para fomentar el contacto visual antes de repetirla.",
      sp: "En el desayuno, haz una pregunta y espera 3 a 5 segundos mirándole con una sonrisa para que te mire antes de responder.",
      hi: "नाश्ते के दौरान, सवाल पूछने के बाद 3-5 सेकंड रुकें ताकि दोहराने से पहले आँखों का संपर्क बन सके।"
    }
  },
  jungle: {
    accentColor: "emerald",
    title: {
      en: "Encourage Mimicry & Fine Motor",
      es: "Fomentar la Imitación Motora",
      sp: "🐒 ¡A Imitar a los Animales!",
      hi: "नकल और फाइन मोटर को प्रोत्साहित करें"
    },
    description: {
      en: "This week, focus on encouraging mimicry of friendly physical gestures and gentle tactile explorations.",
      es: "Esta semana, concéntrate en animar a Liam a imitar gestos físicos simples y explorar texturas suaves.",
      sp: "¡Vamos a imitar los movimientos divertidos de los animales de la selva!",
      hi: "इस सप्ताह, अनुकूल शारीरिक इशारों और सौम्य स्पर्श अन्वेषणों की नकल को प्रोत्साहित करने पर ध्यान केंद्रित करें।"
    },
    suggestion: {
      en: "Try playing a slow hand-clapping game, waiting for Liam to look at your hands before starting each sequence.",
      es: "Intenta jugar a aplaudir lentamente, esperando a que Liam mire tus manos antes de iniciar cada secuencia.",
      sp: "Jueguen a dar palmadas suaves y lentas, esperando que Liam mire tus manitos antes de hacer el siguiente aplauso.",
      hi: "हाथ से ताली बजाने का धीमा खेल खेलें, और लायम के आपके हाथों को देखने का इंतज़ार करें।"
    }
  },
  treasure: {
    accentColor: "amber",
    title: {
      en: "Strengthen Visual Tracking",
      es: "Fortalecer el Seguimiento Visual",
      sp: "🔍 Super Detectives de Tesoros",
      hi: "विजुअल ट्रैकिंग को मजबूत करें"
    },
    description: {
      en: "This week, focus on visual exploration and pointing behaviors to locate objects in structured layouts.",
      es: "Esta semana, concéntrate en la exploración visual y el gesto de señalar para ubicar objetos en el espacio.",
      sp: "¡Vamos a buscar piedras mágicas y tesoros escondidos usando nuestro dedo índice!",
      hi: "इस सप्ताह, वस्तुओं का पता लगाने के लिए विजुअल एक्सप्लोरेशन और पॉइंटिंग व्यवहार पर ध्यान केंद्रित करें।"
    },
    suggestion: {
      en: "When playing with objects, hold the object near your eyes before naming it to draw his attention to your gaze.",
      es: "Cuando jueguen con objetos, sostén el objeto cerca de tus ojos antes de nombrarlo para dirigir su atención hacia tu mirada.",
      sp: "Sostén un juguete cerca de tus ojos antes de decir su nombre, así Liam mirará tu cara y el juguete a la vez.",
      hi: "वस्तुओं के साथ खेलते समय, उसका नाम लेने से पहले उसे अपनी आँखों के पास रखें ताकि उसका ध्यान आपकी ओर आकर्षित हो सके।"
    }
  },
  castle: {
    accentColor: "rose",
    title: {
      en: "Enhance Sensory Grounding",
      es: "Mejorar la Regulación Sensorial",
      sp: "🏰 Guardianes Fuertes y Calmados",
      hi: "संवेदी ग्राउंडिंग बढ़ाएं"
    },
    description: {
      en: "This week, focus on using solid surfaces or proprioceptive pressure to support Liam when he feels overstimulated.",
      es: "Esta semana, concéntrate en usar superficies firmes o presión propioceptiva para apoyar a Liam cuando se sienta abrumado.",
      sp: "¡Vamos a aprender a sentirnos firmes y seguros como las paredes de un gran castillo!",
      hi: "इस सप्ताह, लायम के ओवरस्टिम्युलेटेड महसूस करने पर उसे सहारा देने के लिए ठोस सतहों या प्रोप्रियोसेप्टिव दबाव का उपयोग करने पर ध्यान दें।"
    },
    suggestion: {
      en: "If Liam feels overwhelmed, encourage him to stand with his back against a solid wall while taking 3 slow, deep breaths.",
      es: "Si Liam se siente abrumado, animálo a apoyarse de espalda contra una pared firme mientras respira hondo 3 veces.",
      sp: "Si Liam se pone nervioso, apóyense juntos contra una pared firme y sientan el frío de la pared mientras respiran hondo.",
      hi: "यदि लायम घबराया हुआ महसूस करता है, तो उसे एक मजबूत दीवार के सहारे खड़े होने और 3 धीमी गहरी साँसें लेने के लिए कहें।"
    }
  },
  forest: {
    accentColor: "teal",
    title: {
      en: "Develop Auditory Pattern Awareness",
      es: "Desarrollar Conciencia Auditiva",
      sp: "👂 Oídos Mágicos del Bosque",
      hi: "श्रवण पैटर्न जागरूकता विकसित करें"
    },
    description: {
      en: "This week, focus on tracking and naming subtle outdoor sounds like birds or rustling leaves to develop sensory focus.",
      es: "Esta semana, concéntrate en seguir y nombrar sonidos sutiles del entorno como aves o el viento en las hojas.",
      sp: "¡Vamos a escuchar con súper orejas mágicas el viento en las hojas y el canto de los pajaritos!",
      hi: "इस सप्ताह, संवेदी ध्यान विकसित करने के लिए पक्षियों या पत्तों की सरसराहट जैसी सूक्ष्म बाहरी ध्वनियों को ट्रैक करने और नाम देने पर ध्यान केंद्रित करें।"
    },
    suggestion: {
      en: "While walking near trees, stop and close your eyes for 5 seconds together. Ask Liam to point toward any chirping birds.",
      es: "Mientras caminan entre árboles, deténganse y cierren los ojos por 5 segundos. Pídele a Liam que señale dónde cantan las aves.",
      sp: "Cierren los ojos juntos por 5 segundos y traten de adivinar qué animal o ruido escucharon.",
      hi: "पेड़ों के पास चलते समय, एक साथ 5 सेकंड के लिए आँखें बंद करें। लायम से कहें कि वह चहचहाते पक्षियों की ओर इशारा करे।"
    }
  }
};

const STORYBOOK_ADVENTURES = [
  {
    id: "space",
    icon: Sparkles,
    accentColor: "purple",
    textColor: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    gradient: "from-purple-500 to-indigo-600",
    sound: "pink",
    image: adventureSpace,
    title: {
      en: "Cosmic Stardust Voyage",
      es: "Viaje de Polvo Estelar Cósmico",
      sp: "🚀 El Viaje de las Estrellas"
    },
    goal: {
      en: "Explore gentle cosmic hums, look for floating stardust, and practice calm asteroid-breaths in your ship.",
      es: "Explora suaves zumbidos cósmicos, busca polvo estelar flotante y practica respiraciones lentas de asteroides.",
      sp: "¡Vuela por el espacio y respira suave como un astronauta feliz!"
    },
    location: {
      en: "The Sparkling Galaxy Observatory",
      es: "Observatorio de la Galaxia Brillante",
      sp: "Estación Espacial Liam"
    },
    time: "10:00 AM – 11:30 AM",
    goalLabel: {
      en: "Auditory & Breathing",
      es: "Audición y Calma",
      sp: "Regulación"
    },
    tag: {
      en: "COSMIC CALMING",
      es: "CALMA CÓSMICA",
      sp: "JUEGO ESPACIAL"
    },
    steps: {
      en: [
        "Find a shiny glowing object or star in your room.",
        "Float silently like an astronaut for 30 seconds.",
        "Perform 3 slow deep breaths to launch your space rocket."
      ],
      es: [
        "Encuentra un objeto brillante o una estrella en tu habitación.",
        "Flota en silencio como un astronauta por 30 segundos.",
        "Haz 3 respiraciones profundas para lanzar tu cohete."
      ],
      sp: [
        "👉 Encuentra algo que brille como una estrella.",
        "🤫 Flota flotando como un astronauta sin hacer ruido.",
        "💨 Respira hondo 3 veces para hacer ¡BUM! con el cohete."
      ]
    }
  },
  {
    id: "ocean",
    icon: Eye,
    accentColor: "cyan",
    textColor: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-500/10",
    gradient: "from-cyan-500 to-blue-600",
    sound: "ocean",
    image: adventureOcean,
    title: {
      en: "Serene Deep Sea Symphony",
      es: "Sinfonía del Mar Profundo",
      sp: "🐳 El Canto de las Ballenas"
    },
    goal: {
      en: "Dive into gentle ocean wave sounds, mimic slow floating seaweed movements, and play bubble breathing games.",
      es: "Sumérgete en sonidos suaves de olas, imita el movimiento de las algas y juega a respirar burbujas.",
      sp: "¡Nada con los delfines y haz burbujas suaves con la respiración!"
    },
    location: {
      en: "The Coral Reef Sanctuary",
      es: "Santuario del Arrecife de Coral",
      sp: "El Mar Azul de Liam"
    },
    time: "2:00 PM – 3:30 PM",
    goalLabel: {
      en: "Tactile & Rhythmic",
      es: "Táctil y Rítmico",
      sp: "Respirar Despacio"
    },
    tag: {
      en: "DEEP SEA HARMONY",
      es: "ARMONÍA SUBMARINA",
      sp: "DIVERTIRSE EN EL AGUA"
    },
    steps: {
      en: [
        "Listen closely to the soothing sound of ocean tides.",
        "Sway your arms slowly like gentle sea seaweed.",
        "Exhale slowly to blow magical subsea bubbles."
      ],
      es: [
        "Escucha con atención el sonido de las olas del mar.",
        "Mueve tus brazos lentamente como algas marinas.",
        "Exhala despacio para soplar burbujas mágicas."
      ],
      sp: [
        "👉 Escucha el sonido del mar como en un caracol.",
        "🌿 Mueve los brazos despacio como las plantitas del mar.",
        "💨 Sopla aire muy suave para hacer burbujas."
      ]
    }
  },
  {
    id: "jungle",
    icon: Activity,
    accentColor: "emerald",
    textColor: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    gradient: "from-emerald-500 to-teal-600",
    sound: "forest",
    image: adventureJungle,
    title: {
      en: "Symphonic Canopy Expedition",
      es: "Expedición del Dosel Sinfónico",
      sp: "🦁 La Selva de los Sonidos"
    },
    goal: {
      en: "Track cheerful jungle birds, touch soft leafy plants, and play steady breathing games with friendly jungle animals.",
      es: "Sigue el canto alegre de las aves, toca hojas suaves y respira junto a los amigables animales de la selva.",
      sp: "¡Escucha a los pajaritos de la selva y muévete despacio como un jaguar!"
    },
    location: {
      en: "The Emerald Whisper Forest",
      es: "Bosque Susurro de Esmeralda",
      sp: "La Selva Mágica"
    },
    time: "11:00 AM – 12:30 PM",
    goalLabel: {
      en: "Motor & Auditory",
      es: "Motor y Audición",
      sp: "Mover las Manitos"
    },
    tag: {
      en: "CANOPY GROWTH",
      es: "CRECIMIENTO DEL DOSEL",
      sp: "AMIGOS DE LA SELVA"
    },
    steps: {
      en: [
        "Spot a soft green leaf or plant nearby.",
        "Mimic the calm breathing of a sleeping jaguar.",
        "Listen to birds singing and count three distinct sounds."
      ],
      es: [
        "Encuentra una hoja verde o planta suave cerca de ti.",
        "Imita la respiración tranquila de un jaguar dormido.",
        "Escucha cantar a las aves y cuenta tres sonidos."
      ],
      sp: [
        "👉 Toca una plantita o algo verde y suavecito.",
        "🐆 Respira despacio como un lindo gatito de la selva.",
        "🦜 Escucha los pajaritos y di cuántos escuchas."
      ]
    }
  },
  {
    id: "treasure",
    icon: BookOpen,
    accentColor: "amber",
    textColor: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    gradient: "from-amber-500 to-orange-600",
    sound: "ocean",
    image: adventureTreasure,
    title: {
      en: "Golden Sandbar Quest",
      es: "Búsqueda del Banco de Arena Dorado",
      sp: "🏴‍☠️ La Isla del Tesoro Oculto"
    },
    goal: {
      en: "Follow the wooden path, search for shiny gold coins (or smooth stones), and breathe slow like wind in the sails.",
      es: "Sigue el camino de madera, busca monedas doradas o piedras y respira como el viento en las velas.",
      sp: "¡Busca el cofre del tesoro y sopla aire para mover el barco pirata!"
    },
    location: {
      en: "The Secret Pirate Lagoon",
      es: "Laguna Secreta de Piratas",
      sp: "Isla de la Aventura de Liam"
    },
    time: "4:00 PM – 5:30 PM",
    goalLabel: {
      en: "Visual & Tactile Focus",
      es: "Foco Visual y Táctil",
      sp: "Buscar Tesoros"
    },
    tag: {
      en: "COGNITIVE DETECTIVE",
      es: "DETECTIVE COGNITIVO",
      sp: "PIRATAS BUENOS"
    },
    steps: {
      en: [
        "Draw a simple sand treasure map on paper or ground.",
        "Search for a smooth stone or 'gold coin'.",
        "Breathe deep and blow to guide your pirate ship safely home."
      ],
      es: [
        "Dibuja un mapa del tesoro simple en papel o tierra.",
        "Busca una piedra lisa o una 'moneda dorada'.",
        "Respira hondo y sopla para guiar tu barco de vuelta."
      ],
      sp: [
        "👉 Dibuja un mapa secreto con círculos y cruces.",
        "💎 Encuentra una piedrita brillante como un diamante.",
        "💨 Toma aire y sopla para que viaje el barco pirata."
      ]
    }
  },
  {
    id: "castle",
    icon: ShieldCheck,
    accentColor: "rose",
    textColor: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-500/10",
    gradient: "from-rose-500 to-pink-600",
    sound: "pink",
    image: adventureCastle,
    title: {
      en: "Echoing Citadel Quest",
      es: "Desafío de la Ciudadela del Eco",
      sp: "🏰 El Castillo de los Gigantes"
    },
    goal: {
      en: "Walk like a polite royal guard, find comforting stone surfaces, and blow calm fairy-tale bubbles near the castle walls.",
      es: "Camina como un guardia real, encuentra superficies cómodas y sopla burbujas en el castillo.",
      sp: "¡Camina como un caballero valiente y saluda al rey bueno!"
    },
    location: {
      en: "The Royal Whisper Towers",
      es: "Torres Reales del Susurro",
      sp: "Castillo de Fantasía de Liam"
    },
    time: "9:00 AM – 10:30 AM",
    goalLabel: {
      en: "Proprioceptive & Sound",
      es: "Propiocepción y Sonido",
      sp: "Jugar Juntos"
    },
    tag: {
      en: "ROYAL MINDFULNESS",
      es: "ATENCIÓN PLENA REAL",
      sp: "REYES Y REINAS"
    },
    steps: {
      en: [
        "Stand straight and walk slowly like a royal castle guard.",
        "Feel a cold, solid structure or wall for sensory grounding.",
        "Inhale courage, and exhale worries with 3 long steady breaths."
      ],
      es: [
        "Ponte derecho y camina despacio como un guardia real.",
        "Siente una estructura sólida o pared para calmarte.",
        "Inhala valentía y exhala preocupaciones con 3 respiraciones largas."
      ],
      sp: [
        "👉 Camina derecho y despacio como un guardia del rey.",
        "🏰 Toca una pared firme para sentirte súper fuerte.",
        "💨 Toma aire con energía y sácalo soplando despacio."
      ]
    }
  },
  {
    id: "forest",
    icon: Heart,
    accentColor: "teal",
    textColor: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-500/10",
    gradient: "from-teal-600 to-[#00828A]",
    sound: "forest",
    image: adventureForest,
    title: {
      en: "The Whispering Woods Journey",
      es: "El Camino de los Bosques Susurrantes",
      sp: "🌳 El Paseo del Bosque Mágico"
    },
    goal: {
      en: "Focus on tracking auditory patterns (birds, waves) and practice 4-7-8 grounding breaths by the shoreline.",
      es: "Concéntrate en seguir patrones auditivos (aves, olas) y practica respiraciones 4-7-8 junto a la orilla.",
      sp: "¡Camina entre los árboles gigantes y respira aire de pino fresco!"
    },
    location: {
      en: "Carkeek Park Coastal Trails",
      es: "Senderos Costeros de Carkeek Park",
      sp: "El Bosque de los Árboles Amigos"
    },
    time: "10:00 AM – 11:30 AM",
    goalLabel: {
      en: "Auditory & Breathing",
      es: "Audición y Calma",
      sp: "Regulación"
    },
    tag: {
      en: "FAMILY CO-REGULATION",
      es: "CO-REGULACIÓN FAMILIAR",
      sp: "RESPIRACIÓN CALMADA"
    },
    steps: {
      en: [
        "Find a smooth, flat stone or leaf with Liam.",
        "Listen for distant birds & close your eyes for 30 seconds.",
        "Practice 4-7-8 breathing while tracing your hand."
      ],
      es: [
        "Busca una piedra lisa o una hoja junto con Liam.",
        "Escucha las aves lejanas y cierra los ojos por 30 segundos.",
        "Practica la respiración 4-7-8 mientras trazas tu mano."
      ],
      sp: [
        "👉 Busca una piedrita plana o una hoja del suelo.",
        "🤫 Cierra los ojos y escucha a los pajaritos un ratito.",
        "💨 Toma aire lento, aguanta y saca el aire despacio."
      ]
    }
  }
];

// Type definition for Ledger Event
interface ShellEvent {
  id: string;
  timestamp: string;
  type: "info" | "success" | "warning";
  message: string;
}

// 1. Core Translations
const translations = {
  en: {
    dashboard: "Home",
    anywhere: "Adventures",
    scanRoom: "Scan",
    whisperMode: "Parent Whisper Mode",
    progressTab: "Journey",
    profileTab: "Profile",
    sensory: "Sensory Workspace",
    sharing: "Sharing Center",
    browse: "Browse Portal",
    clinicalSync: "Clinical Sync Active",
    clinicalSyncDesc: "Syncing with clinical portal.",
    searchPlaceholder: "Search workspace, metrics, and logs...",
    notificationsTitle: "Care Updates",
    clearAll: "Clear All",
    noNotifications: "No new notifications",
    profileTitle: "Care Workspace",
    profileRecipient: "Liam Henderson",
    profileRole: "Primary Caretaker",
    profileStatus: "Clinical Sync Active",
    profileAction: "Lock Workspace",
    themeLabel: "Theme",
    themeLight: "AutisticPath Light",
    themeDark: "AutisticPath Dark",
    langLabel: "Language",
    langEN: "English",
    langES: "Español",
    langSP: "Sensory Plain",
    workspaceTitle: "Home",
    breadcrumbsRoot: "AutisticPath",
    breadcrumbsCurrent: "Today's Adventure",
    shellController: "Shell Console & Playground",
    shellControllerDesc: "Simulate and test shell components, states, and notification triggers instantly.",
    triggerAlert: "Simulate Clinical Alert",
    triggerAlertDesc: "Fires a new notification from Liam's therapist, Dr. Miller.",
    toggleSidebar: "Toggle Desktop Sidebar",
    toggleSidebarDesc: "Toggle between standard and compact sidebar layouts.",
    clearLogs: "Clear Event Ledger",
    clearLogsDesc: "Erase the scrollable interaction timeline below.",
    eventLedger: "Shell Event Ledger",
    eventLedgerDesc: "Real-time timeline capturing interaction design state changes and transitions.",
    eventEmpty: "Perform shell interactions to populate the ledger.",
    layoutCardTitle: "AutisticPath Structural Metrics",
    layoutCardDesc: "Evaluating real-time white space, layout density, and sensory contrast.",
    whitespaceRatio: "Whitespace Ratio",
    whitespaceDesc: "Optimized negative space for cognitive ease.",
    sensoryCalmText: "Sensory Calming",
    sensoryCalmDesc: "Visual warmth and blue-light filtration.",
    syncStability: "Sync Stability",
    syncStabilityDesc: "Encrypted connection to clinic portal.",
    activeState: "Active",
    inactiveState: "Inactive",
    sensoryTip: "Neurodivergent Tip",
    sensoryTipText: "Spacious layout structures reduce cognitive load and prevent visual over-stimulation.",
    welcomeBack: "Welcome back, parent",
    clinicAlertText: "Dr. Sarah Miller updated Liam's communication scorecard.",
    dailyNoiseText: "Daily sensory soundscapes checked and updated.",
    pinkNoiseText: "Acoustic pink-noise calibrator auto-synced.",
    unlockedMsg: "Workspace authorized successfully.",
    lockMsg: "Workspace locked securely.",
    // New Home Screen keys
    todaysMission: "TODAY'S ADVENTURE",
    locationLabel: "Location",
    timeLabel: "Time Window",
    goalLabel: "Primary Goal",
    startAdventure: "Start Adventure",
    activeAdventure: "Active Adventure",
    backToHome: "Back to Home",
    completeMission: "Complete & Sync Adventure",
    recentProgress: "Recent Progress",
    continueYesterday: "Continue Yesterday",
    upcomingMission: "Next Adventure",
    adventureTitle: "The Whispering Woods Journey",
    adventureLocation: "Carkeek Park Coastal Trails",
    adventureTime: "10:00 AM – 11:30 AM (Soft Light Window)",
    adventureGoal: "Focus on tracking auditory patterns (birds, waves) and practice 4-7-8 grounding breaths by the shoreline.",
    step1: "Find a smooth, flat stone with Liam.",
    step2: "Listen for distant birds & close eyes (30 seconds).",
    step3: "Sync with the co-regulation breathing circle.",
    missionLogged: "Today's adventure has been completed and securely synced with Dr. Sarah Miller.",
    recentProgressDesc: "Liam's sensory resilience is up 14% this week. Daily streak: 5 days.",
    continueYesterdayTitle: "Tactile Sensory Sandplay",
    continueYesterdayDesc: "Continue tracking reactions to wet sand textures. Completed 80% of the therapy checklist.",
    upcomingMissionTitle: "Echo Chamber Exploration",
    upcomingMissionDesc: "Auditory space isolation and vocal projection pacing. Quiet Hours: 8:30 AM.",
    soundscapeHeader: "Ambient Soundscape Calibration",
    soundscapeDesc: "Calibrate house audio with acoustic filters before starting.",
  },
  es: {
    dashboard: "Inicio",
    anywhere: "Aventuras",
    scanRoom: "Escanear",
    whisperMode: "Modo Susurro",
    progressTab: "Camino",
    profileTab: "Perfil",
    sensory: "Espacio Sensorial",
    sharing: "Centro de Compartir",
    browse: "Portal de Exploración",
    clinicalSync: "Sincronización Clínica Activa",
    clinicalSyncDesc: "Sincronizando con portal clínico.",
    searchPlaceholder: "Buscar espacio de trabajo, métricas...",
    notificationsTitle: "Actualizaciones",
    clearAll: "Limpiar todo",
    noNotifications: "Sin nuevas notificaciones",
    profileTitle: "Perfil de Cuidado",
    profileRecipient: "Liam Henderson",
    profileRole: "Cuidador Principal",
    profileStatus: "Sincronización Activa",
    profileAction: "Bloquear Espacio",
    themeLabel: "Tema",
    themeLight: "Luz de AutisticPath",
    themeDark: "Oscuro de AutisticPath",
    langLabel: "Idioma",
    langEN: "English",
    langES: "Español",
    langSP: "Sensorial Simple",
    workspaceTitle: "Inicio",
    breadcrumbsRoot: "AutisticPath",
    breadcrumbsCurrent: "Aventura del Día",
    shellController: "Consola de Simulación",
    shellControllerDesc: "Simule y pruebe componentes, estados de navegación y alertas en tiempo real.",
    triggerAlert: "Simular Alerta Clínica",
    triggerAlertDesc: "Simula un nuevo mensaje de la terapeuta, la Dra. Miller.",
    toggleSidebar: "Alternar Barra Lateral",
    toggleSidebarDesc: "Alternar entre barra lateral completa y compacta.",
    clearLogs: "Borrar Registro de Eventos",
    clearLogsDesc: "Borra el historial de interacciones a continuación.",
    eventLedger: "Registro de Eventos",
    eventLedgerDesc: "Historial en tiempo real de transiciones y cambios de estado del shell.",
    eventEmpty: "Realice acciones para llenar el registro de eventos.",
    layoutCardTitle: "Métricas Estructurales de AutisticPath",
    layoutCardDesc: "Evaluación en tiempo real del espacio en blanco, densidad visual y contraste.",
    whitespaceRatio: "Proporción de Espacio",
    whitespaceDesc: "Espacio negativo optimizado para facilitar la lectura.",
    sensoryCalmText: "Calma Sensorial",
    sensoryCalmDesc: "Calidez visual y filtro de luz azul.",
    syncStability: "Estabilidad de Sincronización",
    syncStabilityDesc: "Conexión encriptada con el portal clínico.",
    activeState: "Activo",
    inactiveState: "Inactivo",
    sensoryTip: "Consejo Sensorial",
    sensoryTipText: "Los diseños espaciosos reducen la fatiga mental y evitan la sobreestimulación visual.",
    welcomeBack: "Bienvenido, cuidador",
    clinicAlertText: "La Dra. Sarah Miller actualizó la tarjeta de progreso de Liam.",
    dailyNoiseText: "Sonidos sensoriales diarios verificados y actualizados.",
    pinkNoiseText: "Calibrador de ruido rosa acústico auto-sincronizado.",
    unlockedMsg: "Espacio de trabajo autorizado con éxito.",
    lockMsg: "Espacio de trabajo bloqueado con seguridad.",
    // New Home Screen keys
    todaysMission: "AVENTURA DEL DÍA",
    locationLabel: "Ubicación",
    timeLabel: "Horario Recomendado",
    goalLabel: "Meta Principal",
    startAdventure: "Iniciar Aventura",
    activeAdventure: "Aventura Activa",
    backToHome: "Volver al Inicio",
    completeMission: "Completar y Sincronizar Aventura",
    recentProgress: "Progreso Reciente",
    continueYesterday: "Continuar Ayer",
    upcomingMission: "Próxima Aventura",
    adventureTitle: "El Camino de los Bosques Susurrantes",
    adventureLocation: "Senderos Costeros de Carkeek Park",
    adventureTime: "10:00 AM – 11:30 AM (Luz suave del día)",
    adventureGoal: "Concéntrese en rastrear patrones auditivos (pájaros, olas) y practique respiraciones 4-7-8 en la orilla.",
    step1: "Encuentre una piedra plana y suave con Liam.",
    step2: "Escuche los pájaros lejanos con los ojos cerrados (30 segundos).",
    step3: "Sincronice la respiración con el círculo de regulación.",
    missionLogged: "La aventura de hoy se ha completado y sincronizado con la Dra. Sarah Miller.",
    recentProgressDesc: "La resiliencia sensorial de Liam subió un 14% esta semana. Racha: 5 días.",
    continueYesterdayTitle: "Juego de Arena Sensorial Táctil",
    continueYesterdayDesc: "Siga registrando las reacciones a las texturas de la arena húmeda. 80% completado.",
    upcomingMissionTitle: "Exploración de la Cámara de Eco",
    upcomingMissionDesc: "Aislamiento de espacio auditivo y ritmo de proyección de voz. Horas tranquilas: 8:30 AM.",
    soundscapeHeader: "Calibración de Paisaje Sonoro",
    soundscapeDesc: "Calibre el audio del hogar con filtros acústicos antes de iniciar.",
  },
  sp: {
    dashboard: "🏠 Inicio",
    anywhere: "🚀 Aventuras",
    scanRoom: "📷 Escanear",
    whisperMode: "🤫 Modo Susurro",
    progressTab: "📈 Camino",
    profileTab: "👤 Perfil",
    sensory: "🔆 Espacio de Calma",
    sharing: "👥 Compartir",
    browse: "🔍 Buscar",
    clinicalSync: "🟢 Conectado",
    clinicalSyncDesc: "Conectado al doctor.",
    searchPlaceholder: "Buscar...",
    notificationsTitle: "🔔 Mensajes",
    clearAll: "Limpiar",
    noNotifications: "No hay mensajes nuevos",
    profileTitle: "👤 Mi Cuenta",
    profileRecipient: "Liam Henderson",
    profileRole: "Mamá/Papá",
    profileStatus: "🟢 Listo",
    profileAction: "🔒 Cerrar Sesión",
    themeLabel: "Fondo",
    themeLight: "🔆 Claro",
    themeDark: "🌙 Calmado",
    langLabel: "Idioma",
    langEN: "English",
    langES: "Español",
    langSP: "Sensorial Simple",
    workspaceTitle: "🏠 Inicio",
    breadcrumbsRoot: "Hogar",
    breadcrumbsCurrent: "Juego de Hoy",
    shellController: "🎮 Botones de Control",
    shellControllerDesc: "Pruebe y cambie el diseño tocando los botones de abajo.",
    triggerAlert: "🔔 Probar Alerta",
    triggerAlertDesc: "Crea una alerta de ejemplo de nuestro doctor.",
    toggleSidebar: "↔️ Barra Lateral",
    toggleSidebarDesc: "Cambia el ancho de la barra lateral.",
    clearLogs: "🗑️ Borrar Historial",
    clearLogsDesc: "Borra la lista de historial que se muestra abajo.",
    eventLedger: "📝 Historial de Toques",
    eventLedgerDesc: "Muestra las cosas que ha tocado recientemente.",
    eventEmpty: "Toque algo para comenzar.",
    layoutCardTitle: "📊 Información de la Pantalla",
    layoutCardDesc: "Verificamos que todo esté cómodo para la vista.",
    whitespaceRatio: "↔️ Espacio Cómodo",
    whitespaceDesc: "Mucho espacio en blanco para descansar los ojos.",
    sensoryCalmText: "🔆 Calma de la Vista",
    sensoryCalmDesc: "Colores suaves y amigables.",
    syncStability: "🔒 Seguridad",
    syncStabilityDesc: "Conexión segura.",
    activeState: "Listo",
    inactiveState: "Apagado",
    sensoryTip: "💡 Consejo",
    sensoryTipText: "Las pantallas con mucho espacio libre ayudan a estar más concentrados y tranquilos.",
    welcomeBack: "¡Hola, familia!",
    clinicAlertText: "La doctora Sarah envió una actualización del ejercicio de hoy.",
    dailyNoiseText: "Nivel de sonido en casa configurado correctamente.",
    pinkNoiseText: "Filtro de ruido rosa se encuentra encendido.",
    unlockedMsg: "Espacio de trabajo abierto y listo.",
    lockMsg: "Espacio de trabajo guardado y cerrado.",
    // New Home Screen keys
    todaysMission: "🔆 JUEGO DE HOY",
    locationLabel: "📍 Lugar",
    timeLabel: "⏰ Hora Cómoda",
    goalLabel: "🎯 Meta de Hoy",
    startAdventure: "🟢 Comenzar Juego",
    activeAdventure: "🎮 Juego de Hoy Activo",
    backToHome: "🏠 Volver al Inicio",
    completeMission: "🟢 Guardar y Sincronizar",
    recentProgress: "📊 Progreso Reciente",
    continueYesterday: "📝 Continuar Ayer",
    upcomingMission: "📅 Próximo Juego",
    adventureTitle: "🌲 Paseo por el Bosque Mágico",
    adventureLocation: "🏖️ Playa y Senderos de Carkeek Park",
    adventureTime: "⏰ Mañana de 10:00 a 11:30 (Poca Luz)",
    adventureGoal: "Escuchar el viento, los pájaros y el mar. Respirar juntos de forma calmada.",
    step1: "🌲 Buscar una piedra suave en el camino.",
    step2: "👂 Escuchar los pajaritos por 30 segundos.",
    step3: "🔆 Respirar con el círculo que se agranda y se achica.",
    missionLogged: "¡Juego completado con éxito! Se guardó para el doctor.",
    recentProgressDesc: "Liam se siente 14% más tranquilo hoy. Racha de 5 días seguidos.",
    continueYesterdayTitle: "🏖️ Arena Divertida",
    continueYesterdayDesc: "Seguir jugando con la arena húmeda. Falta muy poco para terminar.",
    upcomingMissionTitle: "📚 Visita a la Biblioteca",
    upcomingMissionDesc: "Escuchar los sonidos de la biblioteca. Mañana temprano a las 8:30 AM.",
    soundscapeHeader: "🎵 Sonido de Fondo",
    soundscapeDesc: "Poner un sonido suave en casa antes de empezar.",
  },
  hi: {
    dashboard: "होम",
    anywhere: "रोमांच",
    scanRoom: "स्कैन",
    whisperMode: "अभिभावक मोड",
    progressTab: "यात्रा",
    profileTab: "प्रोफ़ाइल",
    sensory: "संवेदी स्थान",
    sharing: "साझाकरण",
    browse: "ब्राउज़ करें",
    clinicalSync: "चिकित्सीय सिंक सक्रिय",
    clinicalSyncDesc: "क्लीनिक पोर्टल के साथ सिंक हो रहा है।",
    searchPlaceholder: "खोजें...",
    notificationsTitle: "अपडेट",
    clearAll: "सभी साफ़ करें",
    noNotifications: "कोई नया अपडेट नहीं है",
    profileTitle: "प्रोफ़ाइल",
    profileRecipient: "लियाम हेंडरसन",
    profileRole: "मुख्य अभिभावक",
    profileStatus: "सिंक सक्रिय",
    profileAction: "लॉक करें",
    themeLabel: "थीम",
    themeLight: "लाइट मोड",
    themeDark: "डार्क मोड",
    langLabel: "भाषा",
    langEN: "English",
    langES: "Español",
    langSP: "Sensory Plain",
    langHI: "हिन्दी",
    workspaceTitle: "होम",
    breadcrumbsRoot: "AutisticPath",
    breadcrumbsCurrent: "आज का रोमांच",
    shellController: "सिमुलेशन कंसोल",
    shellControllerDesc: "घटक और नोटिफिकेशन का परीक्षण करें।",
    triggerAlert: "सिमुलेट अलर्ट",
    triggerAlertDesc: "डॉ. मिलर से एक नया अलर्ट भेजें।",
    toggleSidebar: "साइडबार बदलें",
    toggleSidebarDesc: "साइडबार चौड़ाई बदलें।",
    clearLogs: "लॉग्स साफ़ करें",
    clearLogsDesc: "लॉग साफ़ करें।",
    eventLedger: "घटना लॉग",
    eventLedgerDesc: "रीयल-टाइम घटना और परिवर्तन सूची।",
    eventEmpty: "शुरू करने के लिए कुछ क्लिक करें।",
    layoutCardTitle: "संरचनात्मक मैट्रिक्स",
    layoutCardDesc: "नकारात्मक स्थान और कंट्रास्ट की जांच।",
    whitespaceRatio: "रिक्त स्थान",
    whitespaceDesc: "नेत्र स्वास्थ्य के लिए नकारात्मक स्थान।",
    sensoryCalmText: "संवेदी शांति",
    sensoryCalmDesc: "नीली रोशनी का नियंत्रण।",
    syncStability: "सिंक स्थिरता",
    syncStabilityDesc: "सुरक्षित संबंध।",
    activeState: "सक्रिय",
    inactiveState: "निष्क्रिय",
    sensoryTip: "संवेदी सुझाव",
    sensoryTipText: "अधिक स्थान वाली स्क्रीन आंखों के लिए आरामदायक होती हैं।",
    welcomeBack: "नमस्ते, परिवार!",
    clinicAlertText: "डॉ. सारा मिलर ने लियाम का स्कोरकार्ड अपडेट किया।",
    dailyNoiseText: "घर के संगीत स्तर की जांच की गई।",
    pinkNoiseText: "गुलाबी शोर फ़िल्टर सक्रिय है।",
    unlockedMsg: "कार्यस्थान सफलतापूर्वक अधिकृत।",
    lockMsg: "कार्यस्थान सुरक्षित रूप से लॉक किया गया।",
    todaysMission: "आज का रोमांच",
    locationLabel: "स्थान",
    timeLabel: "समय सीमा",
    goalLabel: "मुख्य लक्ष्य",
    startAdventure: "रोमांच शुरू करें",
    activeAdventure: "सक्रिय रोमांच",
    backToHome: "होम पर वापस जाएं",
    completeMission: "रोमांच पूरा और सिंक करें",
    recentProgress: "हालिया प्रगति",
    continueYesterday: "कल का कार्य जारी रखें",
    upcomingMission: "अगला रोमांच",
    adventureTitle: "फुसफुसाते जंगलों की यात्रा",
    adventureLocation: "कारकीक पार्क तटीय रास्ते",
    adventureTime: "सुबह 10:00 - 11:30 (धीमी धूप)",
    adventureGoal: "पक्षियों और लहरों की आवाजें सुनें और समुद्र तट पर 4-7-8 सांसों का अभ्यास करें।",
    step1: "लियाम के साथ एक चिकना पत्थर ढूंढें।",
    step2: "आँखें बंद करके दूर के पक्षियों की आवाज़ सुनें (30 सेकंड)।",
    step3: "साँस चक्र के साथ तालमेल बिठाएं।",
    missionLogged: "आज का रोमांच पूरा हो गया है और सुरक्षित रूप से सिंक किया गया है।",
    recentProgressDesc: "इस सप्ताह लियाम की संवेदी शक्ति में 14% सुधार हुआ। दैनिक र streak: 5 दिन।",
    continueYesterdayTitle: "रेत का खेल",
    continueYesterdayDesc: "गीली रेत की बनावट पर नज़र रखें। 80% चेकलिस्ट पूरी।",
    upcomingMissionTitle: "गूंजने वाले कमरे की खोज",
    upcomingMissionDesc: "ध्वни नियंत्रण और आवाज़ का अभ्यास। शांत घंटे: सुबह 8:30।",
    soundscapeHeader: "ध्वनि अनुकूलन",
    soundscapeDesc: "शुरू करने से पहले घर के ध्वनि फिल्टर चालू करें।"
  }
};

const INSPIRATIONAL_QUOTES = [
  {
    en: {
      text: "Autism is not a processing error. It's a different operating system.",
      author: "Sarah Hendrickx"
    },
    es: {
      text: "El autismo no es un error de procesamiento. Es un sistema operativo diferente.",
      author: "Sarah Hendrickx"
    },
    sp: {
      text: "✨ ¡Nuestra mente vuela con su propio sistema de superpoderes mágicos!",
      author: "Sarah Hendrickx"
    },
    hi: {
      text: "ऑटिज़्म कोई प्रोसेसिंग एरर नहीं है। यह एक अलग ऑपरेटिंग सिस्टम है।",
      author: "सारा हेंड्रिक्स"
    }
  },
  {
    en: {
      text: "Your child is unique, not broken. Celebrate who they are and watch them thrive.",
      author: "Therapeutic Wisdom"
    },
    es: {
      text: "Su hijo es único, no defectuoso. Celebre quién es y véalo prosperar.",
      author: "Sabiduría Terapéutica"
    },
    sp: {
      text: "🌸 ¡Eres una estrella única y brillante! ¡Brilla con tu propia luz hoy!",
      author: "Sabiduría Mágica"
    },
    hi: {
      text: "आपका बच्चा अनोखा है, टूटा हुआ नहीं। वे जो हैं उसका जश्न मनाएं और उन्हें फलते-फूलते देखें।",
      author: "चिकित्सीय ज्ञान"
    }
  },
  {
    en: {
      text: "Children are like wet cement, whatever falls on them makes an impression.",
      author: "Haim Ginott"
    },
    es: {
      text: "Los niños son como el cemento fresco, todo lo que cae sobre ellos deja una huella.",
      author: "Haim Ginott"
    },
    sp: {
      text: "🎨 ¡Somos como lienzos mágicos, cada palabra dulce pinta un hermoso color!",
      author: "Haim Ginott"
    },
    hi: {
      text: "बच्चे गीले सीमेंट की तरह होते हैं, उन पर जो कुछ भी गिरता है वह छाप छोड़ जाता है।",
      author: "हैम गिनोट"
    }
  },
  {
    en: {
      text: "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.",
      author: "Joyce Meyer"
    },
    es: {
      text: "La paciencia no es la capacidad de esperar, sino de mantener una buena actitud mientras se espera.",
      author: "Joyce Meyer"
    },
    sp: {
      text: "🐢 ¡La paciencia es respirar suave y sonreír mientras esperamos nuestra siguiente aventura!",
      author: "Joyce Meyer"
    },
    hi: {
      text: "धैर्य केवल प्रतीक्षा करने की क्षमता नहीं है, बल्कि प्रतीक्षा करते समय अच्छा दृष्टिकोण बनाए रखने की क्षमता है।",
      author: "जॉयस मेयर"
    }
  },
  {
    en: {
      text: "Mindfulness is a way of befriending ourselves and our experience.",
      author: "Jon Kabat-Zinn"
    },
    es: {
      text: "La atención plena es una forma de hacernos amigos de nosotros mismos y de nuestra experiencia.",
      author: "Jon Kabat-Zinn"
    },
    sp: {
      text: "🌬️ ¡Sentir nuestra respiración es la mejor forma de abrazar nuestro corazón!",
      author: "Jon Kabat-Zinn"
    },
    hi: {
      text: "माइंडफुलनेस खुद से और अपने अनुभवों से दोस्ती करने का एक तरीका है।",
      author: "जॉन कबाट-ज़िन"
    }
  },
  {
    en: {
      text: "Encouragement is to the child what water is to the plant.",
      author: "Rudolf Dreikurs"
    },
    es: {
      text: "El estímulo es para el niño lo que el agua es para la planta.",
      author: "Rudolf Dreikurs"
    },
    sp: {
      text: "💧 ¡Tus dulces palabras son como agüita fresca para que nuestro arbolito crezca feliz!",
      author: "Rudolf Dreikurs"
    },
    hi: {
      text: "प्रोत्साहन बच्चे के लिए वही है जो पौधे के लिए पानी है।",
      author: "रुडोल्फ ड्रेइकुर्स"
    }
  }
];

export default function App() {
  const {
    user,
    loading: saasLoading,
    parent: saasParent,
    children: saasChildren,
    activeChildId: saasActiveChildId,
    sessionLogs,
    milestones,
    customStories,
    notificationsConfig,
    bookmarks,
    readingHistory,
    darkMode,
    logOut,
    updateParentProfile,
    updateChildProfile,
    addChild,
    deleteChild,
    todaysSession,
    generateNewSession,
    completeSession,
    weeklyProgress,
    goalCompletedThisWeek,
    generateNextWeeklyGoal,
    addCustomMilestone,
    submitStory,
    likeStory,
    toggleBookmark,
    addReadingHistory,
    updateNotificationsConfig,
    deleteUserAccount,
    setDarkMode,
    resetDemoData
  } = useSaas();

  // Simple, robust mappings to our context state
  const parent = saasParent;
  const children = saasChildren;
  const activeChildId = saasActiveChildId;

  const setParent = (p: ParentProfile | null) => {
    if (p) updateParentProfile(p);
  };

  const setChildren = (c: ChildProfile[]) => {
    // Managed via context
  };

  const setActiveChildId = (id: string | null) => {
    if (id) updateChildProfile(id, {});
  };

  const activeChild = children.find(c => c.id === activeChildId) || children[0] || null;
  const childName = activeChild?.name || "Aarav";
  const parentName = parent?.parentName || "Sarah";

  // Form states for editing profiles in Profile page
  const [isEditingChild, setIsEditingChild] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [editingParent, setEditingParent] = useState(false);
  
  const [childForm, setChildForm] = useState({
    id: "",
    name: "",
    nickname: "",
    age: "",
    dob: "",
    gender: "",
    diagnosis: "Autism Spectrum Disorder",
    therapyGoals: [] as string[],
    interests: [] as string[],
    favoriteToys: "",
    favoriteFoods: "",
    thingsThatCalm: "",
    thingsThatUpset: "",
    communicationLevel: "Non-verbal",
    currentTherapy: "Speech Therapy",
    therapyFrequency: "Weekly",
    currentChallenges: [] as string[],
    weeklyGoal: "Improve Eye Contact"
  });

  const [parentForm, setParentForm] = useState({
    parentName: "",
    relationship: "Mother",
    language: "en" as "en" | "es" | "sp" | "hi",
    country: "",
    timezone: ""
  });

  const handleEditChildInit = (child: ChildProfile) => {
    setChildForm({
      id: child.id,
      name: child.name,
      nickname: child.nickname || "",
      age: child.age || "",
      dob: child.dob || "",
      gender: child.gender || "",
      diagnosis: child.diagnosis || "Autism Spectrum Disorder",
      therapyGoals: child.therapyGoals || [],
      interests: child.interests || [],
      favoriteToys: child.favoriteToys || "",
      favoriteFoods: child.favoriteFoods || "",
      thingsThatCalm: child.thingsThatCalm || "",
      thingsThatUpset: child.thingsThatUpset || "",
      communicationLevel: child.communicationLevel || "Non-verbal",
      currentTherapy: child.currentTherapy || "Speech Therapy",
      therapyFrequency: child.therapyFrequency || "Weekly",
      currentChallenges: child.currentChallenges || [],
      weeklyGoal: child.weeklyGoal || "Improve Eye Contact"
    });
    setIsEditingChild(true);
    setIsAddingChild(false);
  };

  const handleSaveChildEdit = async () => {
    await updateChildProfile(childForm.id, childForm);
    setIsEditingChild(false);
    logEvent("success", `Updated child profile for ${childForm.name}.`);
  };

  const handleAddChildInit = () => {
    setChildForm({
      id: Math.random().toString(),
      name: "",
      nickname: "",
      age: "",
      dob: "",
      gender: "",
      diagnosis: "Autism Spectrum Disorder",
      therapyGoals: ["Speech"],
      interests: ["Animals"],
      favoriteToys: "",
      favoriteFoods: "",
      thingsThatCalm: "",
      thingsThatUpset: "",
      communicationLevel: "Non-verbal",
      currentTherapy: "Speech Therapy",
      therapyFrequency: "Weekly",
      currentChallenges: [],
      weeklyGoal: "Improve Eye Contact"
    });
    setIsAddingChild(true);
    setIsEditingChild(false);
  };

  const handleSaveNewChild = async () => {
    if (!childForm.name) return;
    await addChild(childForm);
    setIsAddingChild(false);
    logEvent("success", `Added new child profile for ${childForm.name}.`);
  };

  const handleDeleteChild = async (id: string) => {
    await deleteChild(id);
    logEvent("success", "Child profile deleted.");
  };

  const handleEditParentInit = () => {
    if (parent) {
      setParentForm({ ...parent });
      setEditingParent(true);
    }
  };

  const handleSaveParentEdit = async () => {
    await updateParentProfile(parentForm);
    setEditingParent(false);
    logEvent("success", "Parent profile updated successfully.");
  };

  const sanitizeText = (txt: string) => {
    if (!txt) return "";
    let s = txt;
    s = s.replace(/Liam Henderson/g, childName);
    s = s.replace(/Liam/g, childName);
    s = s.replace(/Sarah Hendrickx/g, "AutisticPath Author");
    s = s.replace(/Dr\. Miller/g, "Connected Therapist");
    s = s.replace(/Dra\. Miller/g, "Terapeuta Asociada");
    s = s.replace(/Sarah/g, parentName);
    return s;
  };

  // Shell core state parameters
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"en" | "es" | "sp" | "hi">("en");
  
  // Dynamic language alignment with parent preferences
  useEffect(() => {
    if (parent?.language) {
      setLang(parent.language);
    }
  }, [parent]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [showMobileNav, setShowMobileNav] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setShowMobileNav(true);
      } else if (currentScrollY > prevScrollY) {
        setShowMobileNav(false);
      } else {
        setShowMobileNav(true);
      }
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);
  const isSignedIn = !!user;
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive Today's Mission Adventure State
  const [selectedAdventureId, setSelectedAdventureId] = useState<string>("forest");
  const [isAdventureActive, setIsAdventureActive] = useState(false);
  const [adventureCompleted, setAdventureCompleted] = useState(false);
  const [adventureChecked, setAdventureChecked] = useState<boolean[]>([false, false, false]);
  const [adventureActiveStep, setAdventureActiveStep] = useState(0);
  const [currentCalmProgress, setCurrentCalmProgress] = useState(91); // initial calm score
  const [activeCalmSound, setActiveCalmSound] = useState<string | null>(null);
  
  // Rotating Quote state
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Dialog & dropdown states
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notifications state
  const rawT = translations[lang];
  const t = useMemo(() => {
    const sanitized: any = {};
    for (const key of Object.keys(rawT)) {
      const val = (rawT as any)[key];
      if (typeof val === "string") {
        sanitized[key] = sanitizeText(val);
      } else {
        sanitized[key] = val;
      }
    }
    return sanitized;
  }, [rawT, childName, parentName]);
  const currentAdventure = STORYBOOK_ADVENTURES.find(a => a.id === selectedAdventureId) || STORYBOOK_ADVENTURES[5];
  const [notifications, setNotifications] = useState([
    { id: "1", text: t.clinicAlertText, time: "10m ago", read: false },
    { id: "2", text: t.dailyNoiseText, time: "1h ago", read: false },
    { id: "3", text: t.pinkNoiseText, time: "3h ago", read: true }
  ]);

  // Event Ledger list
  const [events, setEvents] = useState<ShellEvent[]>([
    {
      id: "initial-event",
      timestamp: new Date().toLocaleTimeString(),
      type: "info",
      message: "AutisticPath Application Shell initialized successfully."
    }
  ]);

  // Ref container helpers for clicking outside
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Synchronize language text when it changes
  useEffect(() => {
    setNotifications([
      { id: "1", text: t.clinicAlertText, time: "10m ago", read: false },
      { id: "2", text: t.dailyNoiseText, time: "1h ago", read: false },
      { id: "3", text: t.pinkNoiseText, time: "3h ago", read: true }
    ]);
  }, [lang]);

  // Page title configuration & Dynamic favicon
  useEffect(() => {
    document.title = "AutisticPath • Workspace Shell";
    const link = (document.querySelector("link[rel~='icon']") || document.createElement('link')) as HTMLLinkElement;
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    const svgFavicon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#2563EB" />
      </svg>
    `;
    link.href = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgFavicon);
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  // Click outside listener for dropdown overlays
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Rotate Inspirational Quotes automatically every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Helper helper to append items to the Shell Event Ledger
  const logEvent = (type: "info" | "success" | "warning", message: string) => {
    const newEvent: ShellEvent = {
      id: Math.random().toString(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  // Switch Theme handler
  const handleThemeToggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    logEvent("success", `Theme dynamically swapped to: ${nextTheme === "light" ? "AutisticPath Light" : "AutisticPath Dark"}`);
  };

  // Switch Language handler
  const handleLanguageToggle = (languageCode: "en" | "es" | "sp" | "hi") => {
    setLang(languageCode);
    setLangDropdownOpen(false);
    const langNames = { en: "English", es: "Español", sp: "Sensory Plain", hi: "हिन्दी" };
    logEvent("success", `Language dynamically swapped to: ${langNames[languageCode]}`);
  };

  // Trigger Mock Notification handler
  const triggerMockNotification = () => {
    const phrases = {
      en: sanitizeText("Clinical Alert: Dr. Miller posted real-time sensory thresholds."),
      es: sanitizeText("Alerta Clínica: Dra. Miller publicó umbrales sensoriales en tiempo real."),
      sp: sanitizeText("🔔 Alerta de Doctor: El doctor te ha enviado un nuevo mensaje de apoyo."),
      hi: sanitizeText("चिकित्सीय चेतावनी: डॉ. मिलer ने वास्तविक समय संवेदी सीमाएँ पोस्ट कीं।")
    };
    const newNotif = {
      id: Math.random().toString(),
      text: phrases[lang] || phrases["en"],
      time: "Just now",
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
    logEvent("warning", "Simulated clinic notification received and queued in top navigation.");
  };

  // Clear all notifications helper
  const clearNotifications = () => {
    setNotifications([]);
    logEvent("info", "Notification list cleared.");
  };

  // Set individual notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    logEvent("info", `Notification marked as read.`);
  };

  // Lock workspace mock interaction
  const [isWorkspaceLocked, setIsWorkspaceLocked] = useState(false);

  const handleLockWorkspace = () => {
    setIsWorkspaceLocked(true);
    logEvent("info", t.lockMsg);
  };

  const handleUnlockWorkspace = () => {
    setIsWorkspaceLocked(false);
    logEvent("success", t.unlockedMsg);
  };

  // Breathe cycle simulator for active adventure co-regulation
  const [breathState, setBreathState] = useState("Breathe In");
  const [breathScale, setBreathScale] = useState(1);

  useEffect(() => {
    if (!isAdventureActive) return;
    const interval = setInterval(() => {
      setBreathState((prev) => {
        if (prev === "Breathe In") {
          setBreathScale(1.4);
          return "Hold";
        } else if (prev === "Hold") {
          setBreathScale(1.0);
          return "Breathe Out";
        } else {
          setBreathScale(1.15);
          return "Breathe In";
        }
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isAdventureActive]);

  // Dynamic header titles based on active tab
  const getTabTitles = () => {
    switch (activeTab) {
      case "overview":
        return {
          root: t.breadcrumbsRoot,
          current: t.breadcrumbsCurrent,
          title: t.workspaceTitle,
        };
      case "anywhere":
        return {
          root: t.breadcrumbsRoot,
          current: t.anywhere,
          title: t.anywhere,
        };
      case "scan":
        return {
          root: t.breadcrumbsRoot,
          current: t.scanRoom,
          title: t.scanRoom,
        };
      case "progress":
        return {
          root: t.breadcrumbsRoot,
          current: t.progressTab,
          title: t.progressTab,
        };
      case "profile":
        return {
          root: t.breadcrumbsRoot,
          current: t.profileTab,
          title: t.profileTab,
        };
      default:
        return {
          root: t.breadcrumbsRoot,
          current: t.breadcrumbsCurrent,
          title: t.workspaceTitle,
        };
    }
  };

  // Clean layout style maps depending on the selected theme
  const shellBgClass = theme === "light" ? "bg-[#F4F3F6]" : "bg-[#0B0F19]";
  const cardBgClass = theme === "light" ? "bg-white border-gray-100" : "bg-[#161D30] border-gray-800";
  const textPrimaryClass = theme === "light" ? "text-gray-900" : "text-[#ECF0F1]";
  const textSecondaryClass = theme === "light" ? "text-gray-500" : "text-[#94A3B8]";
  const borderClass = theme === "light" ? "border-gray-150" : "border-gray-800";
  const headerBgClass = theme === "light" ? "bg-white/90 backdrop-blur-md" : "bg-[#111827]/90 backdrop-blur-md";

  // Navigation Items - Exactly 5 primary items for AutisticPath
  const navItems = [
    { id: "overview", label: t.dashboard, icon: Home },
    { id: "anywhere", label: t.anywhere, icon: Sparkles },
    { id: "scan", label: t.scanRoom, icon: Camera },
    { id: "progress", label: t.progressTab, icon: Sprout },
    { id: "profile", label: t.profileTab, icon: User }
  ];

  // Mobile Floating Bottom Navigation - Exactly 5 items
  const mobileNavItems = [
    { id: "overview", label: t.dashboard, icon: Home },
    { id: "anywhere", label: t.anywhere, icon: Sparkles },
    { id: "scan", label: t.scanRoom, icon: Camera },
    { id: "progress", label: t.progressTab, icon: Sprout },
    { id: "profile", label: t.profileTab, icon: User }
  ];

  // Render Lock Screen if clicked Lock Workspace
  if (isWorkspaceLocked) {
    return (
      <div className={`min-h-screen ${shellBgClass} flex items-center justify-center p-6 font-sans select-none transition-colors duration-500`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-full max-w-md ${cardBgClass} rounded-premium border p-8 shadow-premium-lg flex flex-col items-center space-y-8`}
        >
          {/* Logo element */}
          <div className="text-center space-y-2">
            <Logo variant="full" />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'light' ? 'text-brand-primary' : 'text-teal-400'}`}>
              Care System Lock
            </span>
          </div>

          {/* Secure details info */}
          <div className="text-center space-y-1.5 px-4">
            <h3 className={`text-lg font-extrabold ${textPrimaryClass} font-display tracking-tight`}>
              Workspace is Locked
            </h3>
            <p className={`text-xs ${textSecondaryClass} leading-relaxed`}>
              This clinic-connected workspace contains sensitive therapeutic milestones. Unlock to return to {childName}'s records.
            </p>
          </div>

          {/* Action unlock button */}
          <button
            onClick={handleUnlockWorkspace}
            className={`w-full py-3 px-4 rounded-premium text-xs font-bold font-display uppercase tracking-wider cursor-pointer shadow-premium-sm transition-all flex items-center justify-center gap-2 ${
              theme === "light"
                ? "bg-brand-primary hover:bg-brand-primary-hover text-white"
                : "bg-teal-500 hover:bg-teal-600 text-gray-900"
            }`}
          >
            <Lock className="h-4 w-4 stroke-[2.5px]" />
            Authorize & Unlock Shell
          </button>

          {/* Clinical certification sign */}
          <div className="flex items-center gap-1.5 text-[9px] font-semibold tracking-wider uppercase text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            HIPAA Privacy Encrypted
          </div>
        </motion.div>
      </div>
    );
  }

  if (saasLoading) {
    return (
      <div className={`min-h-screen ${theme === "dark" ? "bg-[#0B0F19]" : "bg-[#FAF9F6]"} flex items-center justify-center p-6`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-[#00828A] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Syncing Clinical Records...</span>
        </div>
      </div>
    );
  }

  // Render Onboarding Screen if parent is not configured
  if (!parent) {
    return (
      <Onboarding
        theme={theme}
        onComplete={async (newParent, newChild) => {
          await updateParentProfile(newParent);
          await addChild(newChild);
          setLang(newParent.language);
          logEvent("success", `Onboarding completed! Welcome ${newParent.parentName} and ${newChild.name}!`);
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen ${shellBgClass} flex flex-col font-sans transition-colors duration-500 select-none ${theme === "dark" ? "dark" : ""}`}>
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav id="top-nav" className={`fixed top-0 left-0 right-0 h-16 ${headerBgClass} border-b ${borderClass} px-4 lg:px-8 z-50 transition-colors duration-500`}>
        <div className="h-full w-full max-w-7xl mx-auto flex items-center justify-between md:grid md:grid-cols-3">
          
          {/* Column 1: Brand Logo - Left Aligned */}
          <div className="flex items-center justify-start">
            <Logo variant="horizontal" className="scale-95 origin-left" />
          </div>

          {/* Column 2: Center Navigation Links */}
          <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const isActive = item.id === activeTab;
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    logEvent("info", `Navigated to shell viewport: ${item.label}`);
                  }}
                  className={`flex items-center gap-2 text-xs font-bold transition-all duration-300 relative py-1.5 px-3 rounded-full cursor-pointer ${
                    isActive
                      ? theme === "light"
                        ? "bg-gray-100 text-brand-primary"
                        : "bg-gray-800 text-teal-400"
                      : theme === "light"
                        ? "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full ${
                        theme === "light" ? "bg-brand-primary" : "bg-teal-400"
                      }`}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Column 3: Right side controls - Right Aligned */}
          <div className="flex items-center justify-end gap-2 md:gap-3">
                {/* 1. Language Switcher Dropdown */}
                <div className="relative hidden md:block" ref={langRef}>
                  <button
                    onClick={() => {
                      setLangDropdownOpen(!langDropdownOpen);
                      setNotifDropdownOpen(false);
                      setProfileDropdownOpen(false);
                    }}
                    className={`h-9 px-3 rounded-full border ${borderClass} ${
                      theme === "light" ? "bg-white text-gray-700 hover:bg-gray-50" : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                    } text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 smooth-transition cursor-pointer`}
                    title="Switch Language"
                  >
                    <Globe className="h-3.5 w-3.5 text-gray-400" />
                    <span>{lang === "hi" ? "हिन्दी" : "EN"}</span>
                  </button>

                  <AnimatePresence>
                    {langDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute right-0 mt-2 w-44 rounded-2xl border ${borderClass} ${
                          theme === "light" ? "bg-white shadow-premium-md" : "bg-[#161D30] shadow-2xl"
                        } p-1.5 z-50`}
                      >
                        {[
                          { code: "en", name: "English (EN)" },
                          { code: "hi", name: "हिन्दी (Hindi)" }
                        ].map((l) => (
                          <button
                            key={l.code}
                            onClick={() => {
                              handleLanguageToggle(l.code as any);
                              setLangDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer ${
                              lang === l.code
                                ? theme === "light"
                                  ? "bg-brand-primary-soft text-brand-primary"
                                  : "bg-teal-500/10 text-teal-400"
                                : theme === "light"
                                  ? "text-gray-700 hover:bg-gray-50"
                                  : "text-gray-300 hover:bg-gray-800"
                            }`}
                          >
                            <span>{l.name}</span>
                            {lang === l.code && <Check className="h-3.5 w-3.5 stroke-[2.5px]" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. Light/Dark Mode Toggle */}
                <button
                  onClick={handleThemeToggle}
                  className={`h-9 w-9 rounded-full border ${borderClass} ${
                    theme === "light" ? "bg-white text-gray-700 hover:bg-gray-50" : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                  } hidden md:flex items-center justify-center smooth-transition cursor-pointer`}
                  title="Toggle Light/Dark Theme"
                >
                  {theme === "light" ? (
                    <Moon className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Sun className="h-4 w-4 text-gray-300" />
                  )}
                </button>

                {/* 3. Notifications with Dropdown - NO FAKE COUNT BADGES */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setProfileDropdownOpen(false);
                      setLangDropdownOpen(false);
                    }}
                    className={`h-9 w-9 rounded-full border ${borderClass} ${
                      theme === "light" ? "bg-white text-gray-700 hover:bg-gray-50" : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                    } flex items-center justify-center smooth-transition cursor-pointer relative`}
                    title="Recent Alerts"
                  >
                    <Bell className="h-4 w-4" />
                  </button>

                  <AnimatePresence>
                    {notifDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute right-0 mt-2 w-80 rounded-2xl border ${borderClass} ${
                          theme === "light" ? "bg-white shadow-premium-md" : "bg-[#161D30] shadow-2xl"
                        } p-4 z-50`}
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-2">
                          <span className={`text-xs font-bold font-display uppercase tracking-wider ${textPrimaryClass}`}>
                            {t.notificationsTitle}
                          </span>
                          {notifications.length > 0 && (
                            <button
                              onClick={clearNotifications}
                              className="text-[10px] font-bold text-rose-500 hover:underline uppercase tracking-wider cursor-pointer"
                            >
                              {t.clearAll}
                            </button>
                          )}
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {notifications.length === 0 ? (
                            <div className="py-6 text-center text-xs text-gray-400 font-sans font-medium">
                              {t.noNotifications}
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <div
                                key={notif.id}
                                onClick={() => markAsRead(notif.id)}
                                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col space-y-1 ${
                                  notif.read
                                    ? theme === "light"
                                      ? "bg-white border-gray-100 opacity-60"
                                      : "bg-[#1E293B]/40 border-gray-800 opacity-50"
                                    : theme === "light"
                                      ? "bg-brand-primary-soft/30 border-blue-100 hover:bg-brand-primary-soft/50"
                                      : "bg-teal-500/5 border-teal-500/20 hover:bg-teal-500/10"
                                }`}
                              >
                                <p className={`text-xs font-semibold leading-relaxed ${textPrimaryClass}`}>
                                  {notif.text}
                                </p>
                                <div className="flex items-center justify-between text-[9px] text-gray-400 font-bold font-mono">
                                  <span>{notif.time}</span>
                                  {!notif.read && (
                                    <span className="flex items-center gap-0.5 text-brand-primary dark:text-teal-400 uppercase tracking-widest text-[8px]">
                                      <span className="h-1.5 w-1.5 rounded-full bg-brand-primary dark:bg-teal-400 inline-block" />
                                      New
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 4. Settings Button */}
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    logEvent("info", "Navigated to Settings tab.");
                  }}
                  className={`h-9 w-9 rounded-full border ${borderClass} ${
                    theme === "light" ? "bg-white text-gray-700 hover:bg-gray-50" : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                  } hidden md:flex items-center justify-center smooth-transition cursor-pointer`}
                  title="Settings & Preferences"
                >
                  <Settings className="h-4 w-4" />
                </button>

                {/* 5. Minimal Profile circular icon dropdown */}
                <div className="relative hidden md:block" ref={profileRef}>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotifDropdownOpen(false);
                      setLangDropdownOpen(false);
                    }}
                    className={`h-9 w-9 rounded-full border ${borderClass} ${
                      theme === "light" ? "bg-white text-gray-700 hover:bg-gray-50" : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                    } flex items-center justify-center smooth-transition cursor-pointer`}
                    title="Caretaker Profile"
                  >
                    <User className="h-4 w-4" />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute right-0 mt-2 w-72 rounded-2xl border ${borderClass} ${
                          theme === "light" ? "bg-white shadow-premium-md" : "bg-[#161D30] shadow-2xl"
                        } p-5 z-50`}
                      >
                        <div className="flex flex-col space-y-1 pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'light' ? 'text-brand-primary' : 'text-teal-400'}`}>
                            Registered Caretaker
                          </span>
                          <span className="text-xs text-gray-400 font-medium">
                            Clinical Connected Account
                          </span>
                        </div>

                        <div className="space-y-3.5">
                          <div className="p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                            <span className={`text-[9px] font-bold uppercase tracking-wider block mb-0.5 text-gray-400`}>
                              Clinical Portal
                            </span>
                            <span className={`text-[11px] font-bold block ${textPrimaryClass}`}>
                              Integrated Path Clinic
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-bold text-teal-500 dark:text-teal-400 px-1">
                            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                            <span>Clinical Sync Active</span>
                          </div>

                          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
                            <button
                              onClick={() => {
                                setActiveTab("profile");
                                setProfileDropdownOpen(false);
                              }}
                              className={`w-full text-left py-2 px-3 rounded-lg text-xs font-bold transition-all hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 ${textPrimaryClass}`}
                            >
                              <Settings className="h-3.5 w-3.5 text-gray-400" />
                              Settings & Preferences
                            </button>

                            <button
                              onClick={() => {
                                resetDemoData();
                                setProfileDropdownOpen(false);
                                logEvent("success", "Pristine demo state restored successfully.");
                              }}
                              className="w-full text-center py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all cursor-pointer text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 mt-1"
                            >
                              <RefreshCw className="h-3.5 w-3.5 stroke-[2.5px]" />
                              Reset Demo State
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

            {/* Mobile Menu Icon for small screens */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`h-9 w-9 md:hidden rounded-full border ${borderClass} ${
                theme === "light" ? "bg-white text-gray-700 hover:bg-gray-50" : "bg-gray-900 text-gray-300 hover:bg-gray-800"
              } flex items-center justify-center cursor-pointer`}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

        </div>

        {/* 1.1 MOBILE EXPANDED MENU DRAWER */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`md:hidden absolute top-18 right-4 left-4 ${
                theme === "light" ? "bg-white/95 shadow-premium-lg" : "bg-[#161D30]/95 shadow-2xl"
              } backdrop-blur-md border border-gray-200/50 dark:border-gray-800/80 rounded-3xl p-5 z-50 space-y-5 overflow-hidden`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-150 dark:border-gray-800/50">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'light' ? 'text-brand-primary' : 'text-teal-400'}`}>
                  System Settings & Actions
                </span>
                <span className="text-[10px] font-mono text-gray-400 font-bold">AutisticPath v2.5</span>
              </div>

              {/* iOS-Style Sensory & Localization Section */}
              <div className="space-y-3">
                <h4 className={`text-xs font-extrabold ${textPrimaryClass} flex items-center gap-1.5`}>
                  <Globe className="h-3.5 w-3.5 text-gray-400" />
                  Sensory Preferences
                </h4>
                
                {/* Language Switcher Button Row */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { code: "en", label: "English (EN)" },
                    { code: "hi", label: "हिन्दी (Hindi)" }
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        handleLanguageToggle(item.code as any);
                        logEvent("info", `Changed language on mobile to: ${item.code}`);
                      }}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        lang === item.code
                          ? "bg-[#00828A] border-transparent text-white shadow-sm"
                          : theme === "light"
                            ? "bg-gray-50 border-gray-150 text-gray-600 hover:bg-gray-100"
                            : "bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Theme Contrast Switcher */}
                <button
                  onClick={() => {
                    handleThemeToggle();
                    logEvent("info", "Changed theme on mobile.");
                  }}
                  className={`w-full py-2.5 px-3 text-xs font-bold rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    theme === 'dark'
                      ? "bg-gray-800/40 border-gray-700 text-teal-400"
                      : "bg-gray-50 border-gray-150 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    <span>{theme === 'dark' ? t.themeDark : t.themeLight}</span>
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </div>

              {/* Community Integration Box for Share Your Path */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/5 to-teal-500/5 dark:from-blue-500/10 dark:to-teal-500/10 border border-blue-100/40 dark:border-blue-900/40 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Heart className="h-4 w-4 fill-current" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-extrabold ${textPrimaryClass}`}>
                      Share Your Path
                    </h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Caretaker Network</p>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  Contribute real stories, helpful tips, and track community-backed autistic progress.
                </p>
                <button
                  onClick={() => {
                    setActiveTab("sharing");
                    setMobileMenuOpen(false);
                    logEvent("info", "Opened Share Your Path from Mobile drawer menu.");
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Open Community Portal</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Clinical Connection details */}
              <div className="p-3.5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100/80 dark:border-gray-800 flex items-center justify-between">
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Clinical Portal Connection</span>
                  <span className={`text-[11px] font-extrabold block ${textPrimaryClass}`}>Integrated Path Clinic</span>
                </div>
                <span className="text-[9px] bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2.5 py-0.5 rounded-full font-extrabold font-mono uppercase tracking-wider">
                  Sync Active
                </span>
              </div>

              {/* iOS Sign Out Button */}
              <button
                onClick={() => {
                  resetDemoData();
                  setMobileMenuOpen(false);
                  logEvent("success", "Pristine demo state restored successfully.");
                }}
                className="w-full text-center py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold transition-all cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4 stroke-[2.5px]" />
                Reset Demo State
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 3. MAIN WORKSPACE / CONTENT AREA */}
      <main className="flex-1 pt-24 pb-32 lg:pb-24 px-4 md:px-8 max-w-5xl mx-auto w-full flex flex-col space-y-12">
        
        {/* AutisticPath Header - High typography, generous spacing, date focus */}
        <header className={`border-b ${borderClass} pb-6 space-y-2 transition-colors duration-500`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Title Area */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${theme === 'light' ? 'text-brand-primary' : 'text-teal-400'} font-mono`}>
                  {getTabTitles().root} &bull; {getTabTitles().current}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h1 className={`text-3xl md:text-4xl font-extrabold font-display tracking-tight ${textPrimaryClass} leading-tight`}>
                {getTabTitles().title}
              </h1>
            </div>

            {/* Premium date and time visual tag */}
            <div className="flex items-center gap-2.5 bg-white dark:bg-[#161D30] px-4 py-2.5 rounded-premium border border-gray-100 dark:border-gray-800 shadow-premium-sm transition-colors duration-500">
              <div className="text-right">
                <span className={`text-[9px] font-bold uppercase tracking-wider block ${textSecondaryClass}`}>
                  {new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { weekday: 'long' }).toUpperCase()}
                </span>
                <span className={`text-xs font-bold font-mono ${textPrimaryClass}`}>
                  {new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* ------------------------- 1. HOME SCREEN (activeTab === "overview") ------------------------- */}
        {activeTab === "overview" && (
          <div className="space-y-10">

            {/* 1. PREMIUM PERSONALIZED GREETING & SESSION CARD */}
            {!isAdventureActive ? (
              <div className="space-y-8">
                {/* Above the Fold: Welcoming Greeting */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1.5 text-left"
                >
                  <h2 className={`text-2xl sm:text-3xl font-black font-display tracking-tight ${textPrimaryClass}`}>
                    {(() => {
                      const hour = new Date().getHours();
                      if (hour < 12) return lang === 'es' ? `Buenos Días, ${parentName} 👋` : `Good Morning, ${parentName} 👋`;
                      if (hour < 18) return lang === 'es' ? `Buenas Tardes, ${parentName} 👋` : `Good Afternoon, ${parentName} 👋`;
                      return lang === 'es' ? `Buenas Noches, ${parentName} 👋` : `Good Evening, ${parentName} 👋`;
                    })()}
                  </h2>
                  <p className={`text-sm ${textSecondaryClass}`}>
                    {lang === 'es' ? 'Aquí está tu sesión de terapia guiada para hoy.' : "Here is your curated, therapeutic home connection session for today."}
                  </p>
                </motion.div>

                {/* Today's Guided Therapy Session Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`p-6 sm:p-8 rounded-[32px] border ${cardBgClass} shadow-premium-lg relative overflow-hidden flex flex-col md:flex-row gap-8 items-stretch`}
                >
                  {/* Visual gradient background */}
                  <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#00828A]/10 blur-3xl pointer-events-none" />

                  {/* Left Side: Goal, Estimated Time, Difficulty, Start Button */}
                  <div className="flex-1 flex flex-col justify-between space-y-6 relative z-10">
                    <div className="space-y-2 text-left">
                      <span className="px-3 py-1 bg-[#00828A]/10 text-[#00828A] dark:text-teal-400 rounded-full text-xs font-bold uppercase tracking-wider">
                        Today's Guided Therapy Session
                      </span>
                    </div>

                    <div className="space-y-4 text-left">
                      <p className={`text-lg md:text-xl font-extrabold ${textPrimaryClass} leading-snug`}>
                        Goal: Help {childName} ask for favorite toys using two-word phrases.
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-[#00828A]" />
                          Estimated Time: {activeChild?.preferredSessionDuration || "8 Minutes"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-rose-500" />
                          Difficulty: Gentle / Warm
                        </span>
                      </div>
                    </div>

                    <div className="text-left pt-2">
                      <button
                        onClick={() => {
                          setIsAdventureActive(true);
                          setAdventureCompleted(false);
                          setAdventureChecked([false, false, false]);
                          setAdventureActiveStep(0); // Reset to first step
                          logEvent("success", `Personalized Session Started for ${childName}`);
                        }}
                        className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#00828A] hover:bg-[#00666C] text-white text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-premium-md flex items-center justify-center gap-2"
                      >
                        <Play className="h-4 w-4 fill-white" />
                        Start Session
                      </button>
                    </div>
                  </div>

                  {/* Right side: Onboarding based summary checklist */}
                  <div className={`md:w-80 rounded-[24px] border ${theme === 'light' ? 'bg-gray-50/50 border-gray-150' : 'bg-gray-950/40 border-gray-800/40'} p-6 flex flex-col justify-center space-y-4 relative z-10 text-left`}>
                    <h3 className={`text-xs font-mono font-bold text-gray-400 uppercase tracking-widest`}>
                      Onboarding Alignment:
                    </h3>
                    <div className="space-y-2.5 text-xs font-semibold">
                      <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-4 w-4 stroke-[3px]" />
                        <span className={`${textPrimaryClass}`}>Personalized for {childName}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-4 w-4 stroke-[3px]" />
                        <span className={`${textPrimaryClass}`}>Goal: {activeChild?.weeklyGoal || "Improve Communication"}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-4 w-4 stroke-[3px]" />
                        <span className={`${textPrimaryClass}`}>Supports communication level: {activeChild?.communicationLevel || "Non-verbal"}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Below the Fold: Goal of the Week, Continue Yesterday, Create Session, Practice Anywhere, Daily Inspiration */}
                <div className="space-y-8 pt-4">

                  {/* 1. GOAL OF THE WEEK */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className={`p-6 sm:p-8 rounded-[32px] border ${borderClass} ${cardBgClass} shadow-premium-sm relative overflow-hidden text-left`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800/80">
                      <div className="space-y-2 flex-1">
                        <span className="text-xs font-mono font-extrabold text-[#00828A] dark:text-teal-400 uppercase tracking-widest">
                          🌟 Goal of the Week
                        </span>
                        <h3 className={`text-xl sm:text-2xl font-black ${textPrimaryClass} font-display`}>
                          {activeChild?.weeklyGoal || "Improve Communication & Connection"}
                        </h3>
                        <p className={`text-xs sm:text-sm ${textSecondaryClass} font-medium`}>
                          Focus on building confidence and joint attention through playful daily interactions.
                        </p>
                      </div>
                      
                      <div className="px-4 py-2 bg-teal-500/10 text-[#00828A] dark:text-teal-400 rounded-2xl text-xs font-bold border border-teal-500/20 shadow-premium-sm self-start md:self-center">
                        Streak: 4 Days Strong 🔥
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                          💡 Weekly Tip
                        </span>
                        <p className={`text-xs font-semibold ${textPrimaryClass}`}>
                          Encourage {childName} to lead the play. Mirror their actions and narrate their play with simple words to foster engagement.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                          ✨ Message of Encouragement
                        </span>
                        <p className={`text-xs ${textSecondaryClass} italic font-medium`}>
                          "Patience and daily consistency are your greatest strengths. Small, gentle moments build a beautiful journey of progress together."
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* 2. CONTINUE YESTERDAY & CREATE SESSION FROM MY ROOM & PRACTICE ANYWHERE GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* CONTINUE YESTERDAY */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className={`p-6 rounded-[28px] border ${borderClass} ${cardBgClass} shadow-premium-sm text-left flex flex-col justify-between space-y-4`}
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
                          ⏮️ Continue Yesterday
                        </span>
                        <h4 className={`text-base font-extrabold ${textPrimaryClass}`}>
                          Resume Yesterday's Session
                        </h4>
                        <p className={`text-xs ${textSecondaryClass} font-semibold leading-relaxed`}>
                          Pick up right where you and {childName} left off. Continue the tactile play checklist and solidify yesterday's communication milestones.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsAdventureActive(true);
                          setAdventureCompleted(false);
                          setAdventureChecked([true, false, false]); // Start from step 2
                          setAdventureActiveStep(1); // Set directly to step 2
                          logEvent("success", "Resumed yesterday's session from Step 2.");
                        }}
                        className="w-full py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-premium-sm"
                      >
                        <Play className="h-3.5 w-3.5 fill-white" />
                        Resume Practice
                      </button>
                    </motion.div>

                    {/* CREATE SESSION FROM MY ROOM */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className={`p-6 rounded-[28px] border ${borderClass} ${cardBgClass} shadow-premium-sm text-left flex flex-col justify-between space-y-4`}
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold text-[#00828A] dark:text-teal-400 uppercase tracking-widest block">
                          📸 Create Session From My Room
                        </span>
                        <h4 className={`text-base font-extrabold ${textPrimaryClass}`}>
                          Create Session from My Room
                        </h4>
                        <p className={`text-xs ${textSecondaryClass} font-semibold leading-relaxed`}>
                          Point your camera around your room. We'll use everyday objects to create a personalized, distraction-free therapy session.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab("scan");
                          logEvent("info", "Navigated to Create Session From My Room.");
                        }}
                        className="w-full py-2.5 rounded-full bg-[#00828A] hover:bg-[#00666C] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-premium-sm"
                      >
                        <Camera className="h-3.5 w-3.5" />
                        Create Session
                      </button>
                    </motion.div>

                    {/* PRACTICE ANYWHERE */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`p-6 rounded-[28px] border ${borderClass} ${cardBgClass} shadow-premium-sm text-left flex flex-col justify-between space-y-4`}
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
                          🌍 Practice Anywhere
                        </span>
                        <h4 className={`text-base font-extrabold ${textPrimaryClass}`}>
                          Practice Anywhere
                        </h4>
                        <p className={`text-xs ${textSecondaryClass} font-semibold leading-relaxed`}>
                          Adapt sensory guidance on the go. Customize goals and pacing for environments like cars, stores, or outdoor visits.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab("anywhere");
                          logEvent("info", "Navigated to Practice Anywhere.");
                        }}
                        className="w-full py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-premium-sm"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Explore Anywhere
                      </button>
                    </motion.div>

                  </div>

                  {/* 3. DAILY INSPIRATION (Rotating Quote) */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className={`p-8 rounded-[32px] border ${borderClass} ${cardBgClass} shadow-premium-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-6 justify-between text-left`}
                  >
                    <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-[#00828A]/5 dark:bg-teal-500/5 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-indigo-500/5 dark:bg-indigo-500/5 blur-2xl pointer-events-none" />

                    <div className="flex items-start gap-4 md:gap-5 flex-1 w-full relative z-10">
                      <div className="h-10 w-10 rounded-full bg-teal-500/10 dark:bg-teal-500/20 text-[#00828A] dark:text-teal-400 flex items-center justify-center shrink-0">
                        <Quote className="h-4.5 w-4.5 transform -scale-x-100" />
                      </div>
                      <div className="space-y-2 flex-1 min-w-0">
                        <span className="text-[9px] font-extrabold text-[#00828A] dark:text-teal-400 uppercase tracking-widest block">
                          Daily Inspiration
                        </span>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentQuoteIndex}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.35 }}
                            className="space-y-1.5"
                          >
                            <p className={`text-sm md:text-base font-medium italic leading-relaxed ${textPrimaryClass}`}>
                              "{INSPIRATIONAL_QUOTES[currentQuoteIndex][lang]?.text || INSPIRATIONAL_QUOTES[currentQuoteIndex]['en'].text}"
                            </p>
                            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
                              — {INSPIRATIONAL_QUOTES[currentQuoteIndex][lang]?.author || INSPIRATIONAL_QUOTES[currentQuoteIndex]['en'].author}
                            </p>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center relative z-10">
                      {INSPIRATIONAL_QUOTES.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentQuoteIndex(idx);
                            logEvent("info", `Selected inspirational quote ${idx + 1}`);
                          }}
                          className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            currentQuoteIndex === idx
                              ? "w-6 bg-[#00828A] dark:bg-teal-400"
                              : "w-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                          }`}
                          title={`Quote ${idx + 1}`}
                        />
                      ))}
                      <button
                        onClick={() => {
                          const nextIdx = (currentQuoteIndex + 1) % INSPIRATIONAL_QUOTES.length;
                          setCurrentQuoteIndex(nextIdx);
                          logEvent("info", "Rotated daily quote manually.");
                        }}
                        className={`ml-2 h-8 w-8 rounded-full border ${borderClass} flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all active:scale-95 cursor-pointer`}
                        title="Next Quote"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>

                </div>
              </div>
            ) : (
              /* 2. MINIMAL THERAPY SESSION PLAYER (ONE STEP AT A TIME) */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`p-8 sm:p-12 rounded-[36px] border ${borderClass} ${cardBgClass} shadow-premium-xl max-w-3xl mx-auto text-left relative overflow-hidden`}
              >
                {/* Minimal background visual circles */}
                <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

                {/* Progress Indicators */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800/80 mb-8 relative z-10">
                  <span className="text-[10px] font-mono font-extrabold text-[#00828A] dark:text-teal-400 uppercase tracking-widest">
                    {adventureActiveStep < 3 ? `Step ${adventureActiveStep + 1} of 3` : "Session Complete"}
                  </span>
                  
                  {/* Progress dots */}
                  <div className="flex gap-2">
                    {[0, 1, 2].map((stepIdx) => (
                      <div
                        key={stepIdx}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          adventureActiveStep === stepIdx
                            ? "w-8 bg-[#00828A] dark:bg-teal-400"
                            : stepIdx < adventureActiveStep
                              ? "w-2 bg-emerald-500"
                              : "w-2 bg-gray-200 dark:bg-gray-800"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setIsAdventureActive(false);
                      logEvent("info", "Closed session player.");
                    }}
                    className={`text-[10px] font-mono font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 uppercase tracking-widest cursor-pointer`}
                  >
                    Exit
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {adventureActiveStep < 3 ? (
                    <motion.div
                      key={adventureActiveStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8 relative z-10 min-h-[220px] flex flex-col justify-between"
                    >
                      {/* Step Text - Massive high-contrast */}
                      <div className="space-y-4">
                        <span className="text-xs font-bold text-[#00828A] dark:text-teal-400 uppercase tracking-widest block">
                          Current Guideline
                        </span>
                        <h3 className={`text-xl sm:text-2xl lg:text-3xl font-black ${textPrimaryClass} leading-relaxed`}>
                          {sanitizeText(currentAdventure.steps[lang]?.[adventureActiveStep] || currentAdventure.steps['en']?.[adventureActiveStep] || "")}
                        </h3>
                      </div>

                      {/* Warm Support Insight */}
                      <div className="p-5 rounded-2xl bg-[#00828A]/5 dark:bg-teal-500/5 border border-[#00828A]/10 dark:border-teal-500/15">
                        <p className={`text-xs md:text-sm font-medium leading-relaxed italic ${textPrimaryClass}`}>
                          {adventureActiveStep === 0 && `✨ "Take all the time you need, ${parentName}. Slow, peaceful pauses help ${childName} process sensory cues comfortably."`}
                          {adventureActiveStep === 1 && `✨ "You're doing beautifully. Mirroring ${childName}'s direct movements builds a gentle, reassuring connection."`}
                          {adventureActiveStep === 2 && `✨ "Final stretch! Your calm energy is the perfect support. Celebrate this lovely moment of connection together."`}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    /* Final Completion Step */
                    <motion.div
                      key="completion"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="text-center space-y-6 py-4 relative z-10"
                    >
                      <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-premium-sm">
                        <Check className="h-8 w-8 stroke-[3.5px]" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className={`text-2xl sm:text-3xl font-black font-display tracking-tight text-emerald-600 dark:text-emerald-400`}>
                          Wonderful Job! 🎉
                        </h3>
                        <p className={`text-sm md:text-base ${textSecondaryClass} max-w-lg mx-auto leading-relaxed`}>
                          Today's therapy session with <strong>{childName}</strong> is complete. Rhythms and engagement metrics are ready to be securely logged.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/25 max-w-md mx-auto text-left flex items-start gap-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Clinical Sync Ready</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                            Secured connection validated. Results will automatically populate your caretaker journal.
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Back and Next Buttons */}
                <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between relative z-10">
                  <button
                    onClick={() => {
                      if (adventureActiveStep > 0) {
                        setAdventureActiveStep(prev => prev - 1);
                        logEvent("info", `Returned to Step ${adventureActiveStep}`);
                      }
                    }}
                    disabled={adventureActiveStep === 0}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-1 cursor-pointer ${
                      adventureActiveStep === 0
                        ? "opacity-30 border-transparent text-gray-400 cursor-not-allowed"
                        : `${theme === 'light' ? 'bg-white hover:bg-gray-50 border-gray-200' : 'bg-gray-800 hover:bg-gray-700 border-gray-700'} ${textPrimaryClass}`
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>

                  {adventureActiveStep < 3 ? (
                    <button
                      onClick={() => {
                        const copy = [...adventureChecked];
                        copy[adventureActiveStep] = true;
                        setAdventureChecked(copy);
                        setAdventureActiveStep(prev => prev + 1);
                        logEvent("success", `Completed Step ${adventureActiveStep + 1}`);
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#00828A] hover:bg-[#00666C] text-white text-xs font-extrabold uppercase tracking-widest shadow-premium-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                    >
                      Next Step
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsAdventureActive(false);
                        setAdventureCompleted(true);
                        setCurrentCalmProgress(94); // update score
                        logEvent("success", `Caretaker logged today's session for ${childName}. Progress synchronized at 94% sensory resiliency.`);
                        
                        // Append clinician success message
                        const syncMsg = {
                          en: `Clinic Feed: Today's home play logs for ${childName} verified successfully! Wonderful alignment on communication goals.`,
                          es: `Portal Clínico: ¡Registros de juego en casa de hoy para ${childName} verificados con éxito!`
                        };
                        setNotifications((prev) => [
                          {
                            id: Math.random().toString(),
                            text: syncMsg[lang] || syncMsg.en,
                            time: "Just now",
                            read: false
                          },
                          ...prev
                        ]);
                      }}
                      className="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest shadow-premium-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 animate-bounce"
                    >
                      <Check className="h-4 w-4 stroke-[3px]" />
                      Complete & Sync
                    </button>
                  )}
                </div>

              </motion.div>
            )}

          </div>
        )}

        {/* ------------------------- 1.5. MISSION ANYWHERE SCREEN (activeTab === "anywhere") ------------------------- */}
        {activeTab === "anywhere" && (
          <MissionAnywhere
            theme={theme}
            lang={lang}
            logEvent={logEvent}
            setNotifications={setNotifications}
            setCurrentCalmProgress={setCurrentCalmProgress}
          />
        )}

        {/* ------------------------- 1.6. SCAN YOUR ROOM SCREEN (activeTab === "scan") ------------------------- */}
        {activeTab === "scan" && (
          <ScanYourRoom
            theme={theme}
            lang={lang}
            logEvent={logEvent}
            setNotifications={setNotifications}
            setCurrentCalmProgress={setCurrentCalmProgress}
          />
        )}

        {/* ------------------------- 1.7. SHARE YOUR PATH SCREEN (activeTab === "sharing") ------------------------- */}
        {activeTab === "sharing" && (
          <ShareYourPath
            theme={theme}
            lang={lang}
            logEvent={logEvent}
            setNotifications={setNotifications}
            onStartTherapyAdventure={() => {
              setActiveTab("anywhere");
              logEvent("info", "Navigated to Adventures from Recommended Activity.");
            }}
          />
        )}

        {/* ------------------------- 1.8. PROGRESS SCREEN (activeTab === "progress") ------------------------- */}
        {activeTab === "progress" && (
          <ProgressScreen
            theme={theme}
            lang={lang}
            logEvent={logEvent}
            setNotifications={setNotifications}
            onNavigateToTab={setActiveTab}
            childName={childName}
            parentName={parentName}
          />
        )}

        {/* ------------------------- 1.8. PROFILE & SETTINGS SCREEN (activeTab === "profile") ------------------------- */}
        {activeTab === "profile" && (
          <div className="space-y-10 max-w-5xl mx-auto py-4">
            
            {/* Top Profile Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800/60">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-brand-primary to-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-premium-md shrink-0">
                  {parentName.slice(0, 2).toUpperCase()}
                </div>
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-mono font-bold text-[#00828A] dark:text-teal-400 uppercase tracking-widest block">
                    {lang === 'sp' ? "MAMÁ Y PAPÁ" : lang === 'es' ? "PERFIL DEL CUIDADOR" : "PRIMARY CARETAKER PROFILE"}
                  </span>
                  <h2 className={`text-2xl font-extrabold font-display tracking-tight leading-none ${textPrimaryClass}`}>
                    {parentName}
                  </h2>
                  <p className={`text-xs ${textSecondaryClass} font-medium`}>
                    {parent?.relationship || "Caretaker"} &bull; {parent?.country || "United States"}
                  </p>
                </div>
              </div>

              {/* Child Switcher top Pill */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${textSecondaryClass}`}>Active Child:</span>
                <select
                  value={activeChildId || ""}
                  onChange={(e) => {
                    setActiveChildId(e.target.value);
                    localStorage.setItem("autisticpath_active_child_id", e.target.value);
                    logEvent("info", `Switched active child context to ${children.find(c => c.id === e.target.value)?.name}.`);
                  }}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold border ${cardBgClass} ${textPrimaryClass} shadow-premium-sm cursor-pointer focus:outline-none`}
                >
                  {children.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Editing states block */}
            {editingParent ? (
              /* EDIT PARENT PROFILE FORM */
              <div className={`p-8 rounded-premium border ${cardBgClass} shadow-premium-md space-y-6`}>
                <div className="border-b border-gray-100 dark:border-gray-800/60 pb-3">
                  <h3 className={`text-lg font-extrabold ${textPrimaryClass} font-display`}>Edit Caretaker Profile</h3>
                  <p className={`text-xs ${textSecondaryClass}`}>Modify parent details and regional preferences.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Caretaker Name</label>
                    <input
                      type="text"
                      value={parentForm.parentName}
                      onChange={(e) => setParentForm({ ...parentForm, parentName: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Relationship</label>
                    <select
                      value={parentForm.relationship}
                      onChange={(e) => setParentForm({ ...parentForm, relationship: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none cursor-pointer`}
                    >
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Other">Other Caregiver</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Preferred Language</label>
                    <select
                      value={parentForm.language}
                      onChange={(e) => setParentForm({ ...parentForm, language: e.target.value as any })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none cursor-pointer`}
                    >
                      <option value="en">English (Default)</option>
                      <option value="es">Español (Clinical)</option>
                      <option value="sp">Kid Mode (Simplified)</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Country</label>
                    <input
                      type="text"
                      value={parentForm.country}
                      onChange={(e) => setParentForm({ ...parentForm, country: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none`}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveParentEdit}
                    className="py-2 px-5 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingParent(false)}
                    className={`py-2 px-5 rounded-full border ${borderClass} ${textPrimaryClass} text-xs font-bold transition-all cursor-pointer`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : isEditingChild || isAddingChild ? (
              /* CHILD EDIT/ADD FORM */
              <div className={`p-8 rounded-premium border ${cardBgClass} shadow-premium-md space-y-6`}>
                <div className="border-b border-gray-100 dark:border-gray-800/60 pb-3">
                  <h3 className={`text-lg font-extrabold ${textPrimaryClass} font-display`}>
                    {isAddingChild ? "Add a New Child Profile" : `Edit Profile for ${childForm.name}`}
                  </h3>
                  <p className={`text-xs ${textSecondaryClass}`}>
                    Configure therapy goals, unique interests, and calming anchors for your child.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Child Name</label>
                    <input
                      type="text"
                      placeholder="Enter child's full name"
                      value={childForm.name}
                      onChange={(e) => setChildForm({ ...childForm, name: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Nickname (Optional)</label>
                    <input
                      type="text"
                      placeholder="Enter a preferred nickname"
                      value={childForm.nickname}
                      onChange={(e) => setChildForm({ ...childForm, nickname: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Age</label>
                    <input
                      type="text"
                      placeholder="e.g. 6"
                      value={childForm.age}
                      onChange={(e) => setChildForm({ ...childForm, age: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Date of Birth</label>
                    <input
                      type="date"
                      value={childForm.dob}
                      onChange={(e) => setChildForm({ ...childForm, dob: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Primary Diagnosis</label>
                    <select
                      value={childForm.diagnosis}
                      onChange={(e) => setChildForm({ ...childForm, diagnosis: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none cursor-pointer`}
                    >
                      <option value="Autism Spectrum Disorder">Autism Spectrum Disorder</option>
                      <option value="Speech Delay">Speech Delay</option>
                      <option value="ADHD">ADHD</option>
                      <option value="Dyslexia">Dyslexia</option>
                      <option value="Global Developmental Delay">Global Developmental Delay</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Communication Level</label>
                    <select
                      value={childForm.communicationLevel}
                      onChange={(e) => setChildForm({ ...childForm, communicationLevel: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none cursor-pointer`}
                    >
                      <option value="Non-verbal">Non-verbal</option>
                      <option value="Emerging (Single words)">Emerging (Single words)</option>
                      <option value="Conversational (Multi-word strings)">Conversational</option>
                      <option value="AAC / Gestural communication">AAC / Gestural</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Current Therapy Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Speech & Occupational"
                      value={childForm.currentTherapy}
                      onChange={(e) => setChildForm({ ...childForm, currentTherapy: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Therapy Frequency</label>
                    <input
                      type="text"
                      placeholder="e.g. Twice weekly"
                      value={childForm.therapyFrequency}
                      onChange={(e) => setChildForm({ ...childForm, therapyFrequency: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Child's Interests / Favorites (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Dinosaurs, Space, Trains"
                      value={childForm.interests.join(", ")}
                      onChange={(e) => setChildForm({ ...childForm, interests: e.target.value.split(",").map(i => i.trim()).filter(Boolean) })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Goal of the Week</label>
                    <input
                      type="text"
                      placeholder="e.g. Improve Eye Contact"
                      value={childForm.weeklyGoal}
                      onChange={(e) => setChildForm({ ...childForm, weeklyGoal: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Favorite Toys</label>
                    <input
                      type="text"
                      placeholder="e.g. blue sensory train"
                      value={childForm.favoriteToys}
                      onChange={(e) => setChildForm({ ...childForm, favoriteToys: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Favorite Foods / Snacks</label>
                    <input
                      type="text"
                      placeholder="e.g. apple slices"
                      value={childForm.favoriteFoods}
                      onChange={(e) => setChildForm({ ...childForm, favoriteFoods: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Things That Calm Your Child</label>
                    <input
                      type="text"
                      placeholder="e.g. weighted blanket, soft classical music"
                      value={childForm.thingsThatCalm}
                      onChange={(e) => setChildForm({ ...childForm, thingsThatCalm: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${textSecondaryClass}`}>Things That Upset Your Child</label>
                    <input
                      type="text"
                      placeholder="e.g. loud sirens, flickering fluorescent lights"
                      value={childForm.thingsThatUpset}
                      onChange={(e) => setChildForm({ ...childForm, thingsThatUpset: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl border ${borderClass} bg-transparent text-sm ${textPrimaryClass} focus:ring-1 focus:ring-brand-primary outline-none`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={isAddingChild ? handleSaveNewChild : handleSaveChildEdit}
                    className="py-2.5 px-6 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    {isAddingChild ? "Create Child Profile" : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingChild(false);
                      setIsEditingChild(false);
                    }}
                    className={`py-2.5 px-6 rounded-full border ${borderClass} ${textPrimaryClass} text-xs font-bold transition-all cursor-pointer`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* PROFILE GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left Column: Parent Details & Children List */}
                <div className="md:col-span-1 space-y-6">
                  
                  {/* Parent Card */}
                  <div className={`p-6 rounded-premium border ${cardBgClass} shadow-premium-sm space-y-4`}>
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/40 pb-3">
                      <h3 className={`text-sm font-extrabold ${textPrimaryClass}`}>Caretaker</h3>
                      <button
                        onClick={handleEditParentInit}
                        className="text-xs font-bold text-brand-primary hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800/20">
                        <span className="text-gray-400 font-medium">Name</span>
                        <span className={`font-bold ${textPrimaryClass}`}>{parentName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800/20">
                        <span className="text-gray-400 font-medium">Relation</span>
                        <span className={`font-bold ${textPrimaryClass}`}>{parent?.relationship || "Mother"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800/20">
                        <span className="text-gray-400 font-medium">Country</span>
                        <span className={`font-bold ${textPrimaryClass}`}>{parent?.country || "United States"}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-400 font-medium">Language</span>
                        <span className={`font-bold ${textPrimaryClass} uppercase`}>{parent?.language || "en"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Children Profiles switcher lists */}
                  <div className={`p-6 rounded-premium border ${cardBgClass} shadow-premium-sm space-y-4`}>
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/40 pb-3">
                      <h3 className={`text-sm font-extrabold ${textPrimaryClass}`}>Children Profiles</h3>
                      <button
                        onClick={handleAddChildInit}
                        className="text-xs font-extrabold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                      >
                        + Add New
                      </button>
                    </div>

                    <div className="space-y-2">
                      {children.map((child) => {
                        const isActive = child.id === activeChildId;
                        return (
                          <div
                            key={child.id}
                            onClick={() => {
                              setActiveChildId(child.id);
                              localStorage.setItem("autisticpath_active_child_id", child.id);
                              logEvent("info", `Switched active profile to ${child.name}.`);
                            }}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              isActive
                                ? "border-teal-500 bg-teal-500/5 shadow-sm"
                                : "border-gray-100 dark:border-gray-800 hover:bg-gray-50/10"
                            }`}
                          >
                            <div className="space-y-0.5">
                              <span className={`text-xs font-bold block ${textPrimaryClass}`}>{child.name}</span>
                              <span className="text-[10px] text-gray-400 font-medium">{child.age} years old &bull; {child.diagnosis}</span>
                            </div>
                            {isActive && (
                              <Check className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 stroke-[2.5px]" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clinical Connection sync card */}
                  <div className={`p-6 rounded-premium border ${cardBgClass} shadow-premium-sm space-y-4`}>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-extrabold ${textPrimaryClass}`}>
                          Connected Clinic
                        </h4>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">HIPAA SECURE</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 text-xs">
                      <div className="flex justify-between items-center py-1.5 border-b border-gray-50 dark:border-gray-800/40">
                        <span className="text-gray-400 font-medium">Center</span>
                        <span className={`font-bold ${textPrimaryClass}`}>Integrated Path Clinic</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-gray-50 dark:border-gray-800/40">
                        <span className="text-gray-400 font-medium">Sync Status</span>
                        <span className="text-[#00828A] dark:text-teal-400 font-bold flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#00828A] dark:bg-teal-400 animate-ping inline-block" />
                          Connected
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5">
                        <span className="text-gray-400 font-medium">Assigned Provider</span>
                        <span className={`font-bold ${textPrimaryClass}`}>Clinical Care Specialist</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Active Child Therapy Details */}
                <div className="md:col-span-2 space-y-8">
                  {activeChild ? (
                    <div className={`p-8 rounded-premium border ${cardBgClass} shadow-premium-sm space-y-6`}>
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/60 pb-4">
                        <div className="space-y-0.5">
                          <h3 className={`text-xl font-bold font-display ${textPrimaryClass}`}>{activeChild.name}</h3>
                          <p className={`text-xs ${textSecondaryClass}`}>Nickname: {activeChild.nickname || "None"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditChildInit(activeChild)}
                            className="py-1.5 px-4 rounded-full border border-gray-200 hover:bg-gray-50/5 text-xs font-bold transition-all cursor-pointer text-gray-600 dark:text-gray-300"
                          >
                            Edit Profile
                          </button>
                          <button
                            onClick={() => handleDeleteChild(activeChild.id)}
                            className="py-1.5 px-4 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                        <div className="space-y-1">
                          <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">DIAGNOSIS</span>
                          <span className={`font-extrabold text-sm ${textPrimaryClass}`}>{activeChild.diagnosis}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">COMMUNICATION LEVEL</span>
                          <span className={`font-extrabold text-sm ${textPrimaryClass}`}>{activeChild.communicationLevel}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">DIETARY & SNACK COMFORT</span>
                          <span className={`font-semibold ${textPrimaryClass}`}>{activeChild.favoriteFoods || "None specified"}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">SENSORY FAVORITE TOY</span>
                          <span className={`font-semibold ${textPrimaryClass}`}>{activeChild.favoriteToys || "None specified"}</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-800/40 pt-6 space-y-4">
                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-mono font-bold text-[#00828A] dark:text-teal-400 uppercase tracking-widest">
                            🌟 UNIQUE THERAPEUTIC INTEREST
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {activeChild.interests.map((interest, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-teal-500/15 border border-teal-500/20 rounded-full text-xs font-bold text-teal-600 dark:text-teal-400 capitalize"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1">
                            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">THINGS THAT CALM</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">{activeChild.thingsThatCalm || "None configured"}</p>
                          </div>
                          <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-1">
                            <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider block">THINGS THAT UPSET</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">{activeChild.thingsThatUpset || "None configured"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-800/40 pt-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-5 w-5 text-[#00828A]" />
                          <h4 className={`text-sm font-extrabold ${textPrimaryClass}`}>🤫 Parent Whisper Co-regulation Mode</h4>
                        </div>
                        <p className={`text-xs ${textSecondaryClass} leading-relaxed font-semibold`}>
                          Access smart tips tailored dynamically to {activeChild.name}'s current challenges, favorite sensory toys, and daily rhythms.
                        </p>
                        <div className={`p-1.5 rounded-[24px] border ${cardBgClass} overflow-hidden shadow-sm`}>
                          <ParentWhisperMode
                            theme={theme}
                            lang={lang}
                            logEvent={logEvent}
                            setNotifications={setNotifications}
                            childName={childName}
                          />
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className={`p-8 rounded-premium border ${cardBgClass} text-center space-y-4`}>
                      <p className="text-xs text-gray-500">No child profiles found. Create one to begin.</p>
                      <button
                        onClick={handleAddChildInit}
                        className="py-2 px-5 rounded-full bg-brand-primary text-white font-bold text-xs cursor-pointer"
                      >
                        Create Child Profile
                      </button>
                    </div>
                  )}

                  {/* Diagnostic shell control panel */}
                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800/80">
                    <div className="flex items-center gap-2">
                      <Sliders className="h-5 w-5 text-indigo-500" />
                      <h3 className={`text-lg font-extrabold ${textPrimaryClass} font-display`}>
                        {lang === 'sp' ? "🛠️ Herramientas de Prueba" : lang === 'es' ? "🛠️ Herramientas de Simulación Clínica" : "🛠️ Clinical Simulator & Diagnostics"}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Trigger Clinic Alert Widget */}
                      <div className={`p-5 rounded-premium border ${cardBgClass} shadow-premium-sm flex flex-col justify-between space-y-4`}>
                        <div className="space-y-1">
                          <h4 className={`text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400`}>
                            {t.triggerAlert}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            {t.triggerAlertDesc}
                          </p>
                        </div>
                        <button
                          onClick={triggerMockNotification}
                          className="py-2 px-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold transition-all cursor-pointer text-xs flex items-center justify-center gap-2 self-start"
                        >
                          <Bell className="h-3.5 w-3.5" />
                          Fire Alert Trigger
                        </button>
                      </div>

                      {/* Clear event log ledger */}
                      <div className={`p-5 rounded-premium border ${cardBgClass} shadow-premium-sm flex flex-col justify-between space-y-4`}>
                        <div className="space-y-1">
                          <h4 className={`text-xs font-bold uppercase tracking-wider text-rose-500`}>
                            {t.clearLogs}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            {t.clearLogsDesc}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setEvents([]);
                            logEvent("info", "Event ledger reset.");
                          }}
                          className="py-2 px-4 rounded-full border border-rose-200 text-rose-500 hover:bg-rose-50/10 font-extrabold transition-all cursor-pointer text-xs flex items-center justify-center gap-2 self-start"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Reset Event Logs
                        </button>
                      </div>
                    </div>

                    {/* Scrollable Shell Event Ledger */}
                    <div className={`p-5 rounded-premium border ${cardBgClass} shadow-premium-sm space-y-4`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest font-mono">
                          {t.eventLedger}
                        </span>
                        <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded font-mono font-bold">
                          {events.length} events
                        </span>
                      </div>

                      <div className="max-h-48 overflow-y-auto pr-1 space-y-2 scrollbar-thin">
                        {events.length === 0 ? (
                          <p className="text-xs text-gray-400 font-sans italic py-4 text-center">
                            {t.eventEmpty}
                          </p>
                        ) : (
                          events.map((evt) => (
                            <div
                              key={evt.id}
                              className="text-[10px] font-mono leading-relaxed p-2 rounded bg-gray-50/65 dark:bg-gray-900/60 border border-gray-100/50 dark:border-gray-800/45 flex items-start gap-2.5"
                            >
                              <span className="text-gray-400 font-bold shrink-0">[{evt.timestamp}]</span>
                              <span className={`font-semibold shrink-0 ${
                                evt.type === 'success' ? 'text-emerald-500' : evt.type === 'warning' ? 'text-rose-400' : 'text-blue-400'
                              }`}>
                                {evt.type.toUpperCase()}:
                              </span>
                              <span className={`${textPrimaryClass} font-medium`}>{evt.message}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>
        )}



        {/* Dynamic brand footer */}
        <footer className={`pt-12 border-t ${borderClass} pb-12 text-xs text-gray-400 font-sans select-none transition-colors duration-500`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Logo variant="horizontal" className="scale-90 origin-left" />
            </div>
            <div className="text-center sm:text-right space-y-1">
              <p className="font-semibold text-gray-500">&copy; 2026 AutisticPath</p>
              <p className="text-[10px] text-gray-400 font-medium">Personalized Therapy. Real Progress.</p>
            </div>
          </div>
          <div className="mt-8 text-center text-[12px] md:text-[13px] text-[#9CA3AF] font-sans font-normal">
            Designed & Developed by <span className="font-mono"><span className="text-[#22C55E] font-semibold">{"</>"}</span><span className="text-[#111827] dark:text-[#ECF0F1] font-semibold"> newtocode</span></span>
          </div>
        </footer>

      </main>

      {/* 4. MOBILE TAB NAVIGATION BAR (FLOATING NATIVE iOS STYLE) */}
      <nav
        id="mobile-nav"
        className={`fixed left-4 right-4 max-w-md mx-auto z-50 lg:hidden flex items-center justify-around px-2 py-2.5 rounded-[24px] border transition-all duration-300 ease-in-out ${
          theme === "light"
            ? "bg-white/80 border-gray-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-gray-700"
            : "bg-[#161D30]/80 border-gray-800/60 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-gray-300"
        } backdrop-blur-lg ${
          showMobileNav
            ? "bottom-5 translate-y-0 opacity-100 scale-100"
            : "bottom-5 translate-y-28 opacity-0 scale-95 pointer-events-none"
        } mb-[env(safe-area-inset-bottom,0px)] pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]`}
      >
        {mobileNavItems.map((item) => {
          const isActive = item.id === activeTab;
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                logEvent("info", `Navigated to mobile view: ${item.label}`);
              }}
              className="flex-1 flex flex-col items-center justify-center h-14 cursor-pointer relative select-none"
              style={{ minWidth: "48px", minHeight: "48px" }}
              title={item.label}
            >
              {/* Highlight background on active */}
              {isActive && (
                <motion.div
                  layoutId="mobileActiveBg"
                  className={`absolute inset-0 rounded-2xl ${
                    theme === "light"
                      ? "bg-brand-primary-soft/40"
                      : "bg-teal-500/10"
                  }`}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              <IconComponent
                className={`h-5 w-5 smooth-transition z-10 ${
                  isActive
                    ? theme === "light"
                      ? "text-brand-primary scale-110"
                      : "text-teal-400 scale-110"
                    : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                }`}
              />
              <span
                className={`text-[10px] font-bold mt-1 z-10 transition-colors duration-200 ${
                  isActive
                    ? theme === "light"
                      ? "text-brand-primary font-extrabold"
                      : "text-teal-400 font-extrabold"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
