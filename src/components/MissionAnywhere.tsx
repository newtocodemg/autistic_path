import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Utensils,
  Bed,
  Trees,
  Car as CarIcon,
  ShowerHead,
  School as SchoolIcon,
  Store as StoreIcon,
  Clock,
  Target,
  Check,
  Award,
  ChevronRight,
  ArrowLeft,
  Volume2,
  Mic,
  Users,
  BookOpen,
  Eye,
  Activity,
  MessageSquare,
  Play,
  RotateCcw,
  Sparkle
} from "lucide-react";

interface MissionAnywhereProps {
  theme: "light" | "dark";
  lang: "en" | "es" | "sp" | "hi";
  logEvent: (type: "info" | "success" | "warning", message: string) => void;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  setCurrentCalmProgress: React.Dispatch<React.SetStateAction<number>>;
}

// Data structures for selectors
const locations = [
  { id: "Kitchen", icon: Utensils, labelEn: "Kitchen", labelEs: "Cocina", labelSp: "Cocina", color: "from-amber-400 to-orange-500", descEn: "Smells, textures, and rhythmic cooking sounds.", descEs: "Olores, texturas y sonidos rítmicos de cocina.", descSp: "¡Donde se hace la comida rica!" },
  { id: "Bedroom", icon: Bed, labelEn: "Bedroom", labelEs: "Dormitorio", labelSp: "Cuarto", color: "from-indigo-400 to-purple-500", descEn: "Soft surfaces, cozy blankets, and quiet lighting.", descEs: "Superficies suaves, mantas cómodas y luz suave.", descSp: "Tu espacio feliz y suavecito." },
  { id: "Park", icon: Trees, labelEn: "Park", labelEs: "Parque", labelSp: "Parque", color: "from-emerald-400 to-teal-500", descEn: "Natural wind, leaves rustling, and open ground.", descEs: "Viento natural, hojas crujientes y suelo libre.", descSp: "Pastito, árboles y aire fresco." },
  { id: "Car", icon: CarIcon, labelEn: "Car", labelEs: "Automóvil", labelSp: "Carro", color: "from-blue-400 to-indigo-500", descEn: "Rhythmic hums, passing lights, and cozy safety.", descEs: "Zumbido constante, luces que pasan y seguridad.", descSp: "Un viaje divertido sobre ruedas." },
  { id: "Bathroom", icon: ShowerHead, labelEn: "Bathroom", labelEs: "Baño", labelSp: "Baño", color: "from-cyan-400 to-blue-500", descEn: "Soothing water sounds, bubbly warmth, and mirrors.", descEs: "Sonidos de agua relajantes, burbujas y espejos.", descSp: "Burbujas mágicas y agua calientita." },
  { id: "School", icon: SchoolIcon, labelEn: "School", labelEs: "Escuela", labelSp: "Escuela", color: "from-rose-400 to-pink-500", descEn: "Structured cues, peer friendship, and learning games.", descEs: "Señales estructuradas, amigos y juegos de aprendizaje.", descSp: "Aprender con amigos y profes." },
  { id: "Store", icon: StoreIcon, labelEn: "Store", labelEs: "Tienda", labelSp: "Tienda / Super", color: "from-violet-400 to-fuchsia-500", descEn: "Bright colors, structured rows, and decision play.", descEs: "Colores brillantes, pasillos y elecciones.", descSp: "Explorar estantes llenos de sorpresas." }
];

const durations = [
  { value: 5, labelEn: "5 Mins", labelEs: "5 Minutos", labelSp: "5 Minutos (Rápido)", descEn: "Perfect for quick regulation transitions.", descEs: "Perfecto para transiciones rápidas.", descSp: "Un juego súper rápido." },
  { value: 10, labelEn: "10 Mins", labelEs: "10 Minutos", labelSp: "10 Minutos (Normal)", descEn: "A balanced calm-down break.", descEs: "Un descanso de calma equilibrado.", descSp: "Un ratito de diversión." },
  { value: 15, labelEn: "15 Mins", labelEs: "15 Minutos", labelSp: "15 Minutos (Profundo)", descEn: "Immersive sensory sensory calibration.", descEs: "Calibración sensorial inmersiva.", descSp: "Para jugar con calma." },
  { value: 20, labelEn: "20 Mins", labelEs: "20 Minutos", labelSp: "20 Minutos (Completo)", descEn: "Comprehensive therapeutic path.", descEs: "Trayecto terapéutico completo.", descSp: "La gran aventura del día." }
];

const goals = [
  { id: "Speech", icon: Mic, labelEn: "Speech", labelEs: "Habla y Lenguaje", labelSp: "Hablar y Sonidos", color: "text-amber-500 bg-amber-500/10", descEn: "Focuses on vocalization, imitation, and soft sound play.", descEs: "Enfoque en vocalización, imitación y sonidos suaves.", descSp: "Hacer sonidos divertidos y cantar." },
  { id: "Social", icon: Users, labelEn: "Social", labelEs: "Habilidades Sociales", labelSp: "Compartir / Amigos", color: "text-emerald-500 bg-emerald-500/10", descEn: "Promotes joint attention, sharing, and eye contact play.", descEs: "Promueve atención conjunta, compartir y contacto visual.", descSp: "Hacer muecas, reír y jugar juntos." },
  { id: "Reading", icon: BookOpen, labelEn: "Reading", labelEs: "Comprensión y Lectura", labelSp: "Cuentos y Letras", color: "text-blue-500 bg-blue-500/10", descEn: "Interactive letter shapes, sound pairing, and visual focus.", descEs: "Formas de letras interactivas y enfoque visual.", descSp: "Mirar dibujos lindos y contar cuentos." },
  { id: "Attention", icon: Eye, labelEn: "Attention", labelEs: "Enfoque y Atención", labelSp: "Super Concentrado", color: "text-teal-500 bg-teal-500/10", descEn: "Grounding exercises to capture focus and reduce overloads.", descEs: "Ejercicios de conexión a tierra para enfocar la mente.", descSp: "Buscar objetos escondidos como detective." },
  { id: "Motor Skills", icon: Activity, labelEn: "Motor Skills", labelEs: "Habilidades Motoras", labelSp: "Mover las Manitos", color: "text-rose-500 bg-rose-500/10", descEn: "Tactile finger movements, posture, and fine grip play.", descEs: "Movimientos táctiles de los dedos y agarre fino.", descSp: "Tocar cosas, saltar y aplaudir suave." },
  { id: "Communication", icon: MessageSquare, labelEn: "Communication", labelEs: "Comunicación Interactiva", labelSp: "Hacernos Entender", color: "text-purple-500 bg-purple-500/10", descEn: "Non-verbal gestures, expression cards, and interactive responses.", descEs: "Gestos no verbales, tarjetas de expresión y respuestas.", descSp: "Señalar con el dedito y gesticular." }
];

// Generates cohesive, customized missions based on user selections
function generateMissionData(location: string, time: number, goal: string, lang: "en" | "es" | "sp") {
  // Fun, therapeutic titles
  const titles: Record<string, Record<string, string>> = {
    Kitchen: {
      Speech: "The Whistling Kettle / El Silbido de la Tetera",
      Social: "The Chef's High-Five / El Chócala del Cocinero",
      Reading: "Recipe Hunt Adventure / Aventura de la Receta Secreta",
      Attention: "Spice Detectives / Detectives de Especias",
      "Motor Skills": "Dough Sculpture Master / Escultor del Pan Suave",
      Communication: "Visual Kitchen Bingo / El Bingo de la Cocina"
    },
    Bedroom: {
      Speech: "Pillow Whispering / Susurros de Almohada",
      Social: "Blanket Fort Kingdom / El Fuerte de Mantas",
      Reading: "Shadow Puppet Tales / Cuentos de Sombras",
      Attention: "Stuffed Animal Hide & Seek / Escondite de Peluches",
      "Motor Skills": "Sock Sorting Stars / Estrellas de Calcetines",
      Communication: "Expression Mood Cards / Cartas de Expresiones de Liam"
    },
    Park: {
      Speech: "Echoes of the Forest / Ecos del Viento",
      Social: "Clover Sharing Circle / Compartir Tréboles Mágicos",
      Reading: "Bark and Leaf Patterns / El Libro Oculto del Árbol",
      Attention: "The Cloud Spotter Quest / El Buscador de Nubes",
      "Motor Skills": "Twig Balance Bridge / Equilibrio de Ramitas",
      Communication: "Nature Sound Imitator / Imitando a la Naturaleza"
    },
    Car: {
      Speech: "The Humming Engine Sing-Along / El Canto del Motor",
      Social: "Traffic Light Co-Pilot / Co-Piloto de Semáforos",
      Reading: "Billboard Letter Hunt / Caza de Letras en el Camino",
      Attention: "Color Spotter Grand Prix / El Gran Premio de Colores",
      "Motor Skills": "Dashboard Finger Tap / Toques de Dedos Rítmicos",
      Communication: "Siren Alert Gesture Match / Gestos del Copiloto"
    },
    Bathroom: {
      Speech: "Echo Chamber Sing-Along / Cantando en el Eco",
      Social: "Mirror Mimicry game / Espejo de Muecas Divertidas",
      Reading: "Shampoo Bottle Alphabet / Alfabeto de las Botellas",
      Attention: "Soap Bubble Target / Blanco de Burbujas de Jabón",
      "Motor Skills": "Splash Wave Maker / El Hacedor de Olas Suaves",
      Communication: "Sensory Warm Water Match / Señales de Temperatura"
    },
    School: {
      Speech: "The Whispering Hallways / El Pasillo del Secreto",
      Social: "The Playground Partnership / Socios del Recreo",
      Reading: "Desk Tag Discovery / El Secreto de los Pupitres",
      Attention: "Blackboard Star Focus / Enfoque de la Estrella",
      "Motor Skills": "Pencil Grip Mastery / El Maestro de los Trazos",
      Communication: "Gesture Hello Wave / Saludos Silenciosos"
    },
    Store: {
      Speech: "Checkout Counter Greet / El Saludo del Cajero",
      Social: "Cart Navigator Team / El Equipo del Carrito",
      Reading: "Label Symbol Search / Buscador de Logotipos",
      Attention: "Fruit Color Matcher / El Clasificador de Frutas",
      "Motor Skills": "Shelf Reach Explorer / El Explorador de Estantes",
      Communication: "Visual Shopping Board / Mi Lista con Dibujos"
    }
  };

  // Pre-configured steps for english, spanish, child-friendly spanish
  const stepTemplates: Record<string, Record<string, Record<"en" | "es" | "sp", string[]>>> = {
    Kitchen: {
      Speech: {
        en: ["Sit comfortably and hum with the refrigerator hum.", "Imitate sound pitches with kitchen timers.", "Pronounce 3 ingredient names slowly."],
        es: ["Siéntate cómodamente y tararea con el zumbido del refrigerador.", "Imita tonos de sonido con los temporizadores de cocina.", "Pronuncia el nombre de 3 ingredientes lentamente."],
        sp: ["¡Escucha el zumbido del refrigerador y haz 'mmmmm'!", "Haz pip-pip como el reloj de la cocina.", "Di los nombres de tus comiditas favoritas."]
      },
      Social: {
        en: ["Share a cooking spoon and pass ingredients.", "Take turns stirring sensory mixtures.", "Give a high-five when cookies/bakes complete."],
        es: ["Comparte una cuchara de cocina y pasa los ingredientes.", "Tómense turnos para mezclar ingredientes sensoriales.", "Choca los cinco cuando se complete la preparación."],
        sp: ["Pásale la cuchara suavemente a mamá o papá.", "Revuelvan juntos el tazón, ¡un turno cada uno!", "¡Choca esos cinco bien fuerte al terminar!"]
      },
      Reading: {
        en: ["Trace letters on food packages.", "Point out colored ingredient labels.", "Match visual receipt items to groceries."],
        es: ["Traza letras en los empaques de comida.", "Señala las etiquetas de colores en los frascos.", "Compara la lista de compras con los alimentos reales."],
        sp: ["Busca la letra 'A' en la caja de cereal.", "Señala el frasco que tiene el dibujo rojo.", "Busca los dibujos de las frutas en el empaque."]
      },
      Attention: {
        en: ["Inhale vanilla/spice aromas for grounding.", "Locate 3 yellow kitchen items.", "Track water pouring into a cup without looking away."],
        es: ["Inhala aromas de vainilla o canela para conectarte.", "Encuentra 3 objetos amarillos en la cocina.", "Observa el agua vertiéndose en un vaso con calma."],
        sp: ["Huele la canela o vainilla, ¡qué rico!", "Juega al detective y busca tres cosas amarillas.", "Mira cómo se llena el vasito de agua despacito."]
      },
      "Motor Skills": {
        en: ["Knead a small cup of dough or soft clay.", "Stack 3 plastic cups in a pyramid.", "Pour dry pasta between containers gently."],
        es: ["Amasa una pequeña taza de masa o arcilla suave.", "Apila 3 vasos de plástico en forma de pirámide.", "Vierte pasta seca entre recipientes con cuidado."],
        sp: ["Haz una bolita de masa aplastándola con tus manitos.", "Arma una torre con vasitos de plástico.", "Pasa los fideos secos de un vasito a otro sin tirarlos."]
      },
      Communication: {
        en: ["Point to kitchen board icons to indicate choices.", "Nod for hot versus cold sensations.", "Use hand signs to request 'more' stirring."],
        es: ["Señala los íconos de la cocina para elegir.", "Asiente con la cabeza para indicar frío o caliente.", "Usa señas con las manos para pedir 'más' mezcla."],
        sp: ["Señala con tu dedito lo que quieres comer.", "Di sí o no con tu cabecita si el agua está tibia.", "Haz la seña de 'más' para seguir batiendo."]
      }
    },
    Bedroom: {
      Speech: {
        en: ["Speak secrets softly into a fluffy pillow.", "Make animals sounds tucked in bed.", "Spell your name under a warm reading light."],
        es: ["Habla secretos suavemente en una almohada mullida.", "Haz sonidos de animales tapado en la cama.", "Deletrea tu nombre bajo la luz de lectura."],
        sp: ["Cuéntale un secreto bajito a tu almohada suave.", "Haz como un gatito que duerme: 'miau'.", "Di tu nombre cantando bajito."]
      },
      Social: {
        en: ["Build a cozy blanket fort with support.", "Take turns choosing bedtime toys.", "Look into eyes while sharing a bedtime story."],
        es: ["Construye un fuerte de sábanas cómodo con ayuda.", "Tómense turnos para elegir los juguetes de dormir.", "Mírense a los ojos al compartir una historia."],
        sp: ["¡Hagamos una casita mágica con las sábanas!", "Elige tu peluche favorito y compártelo un ratito.", "Mira las imágenes del cuento con mamá."]
      },
      Reading: {
        en: ["Look at ceiling stars and map patterns.", "Trace soft fabric letters on pillows.", "Find repeating words in a picture book."],
        es: ["Observa estrellas en el techo o patrones en las sábanas.", "Traza letras de tela en los cojines.", "Busca palabras que se repiten en un libro ilustrado."],
        sp: ["Busca dibujos divertidos en tus cobijas.", "Toca las letras bordadas de tu almohada.", "Encuentra el dibujo del osito en el cuento."]
      },
      Attention: {
        en: ["Listen to bedroom white noise clock rhythms.", "Count 5 deep breaths in a dim environment.", "Focus on a glowing nightlight for 30 seconds."],
        es: ["Escucha el ritmo del reloj en el dormitorio.", "Cuenta 5 respiraciones profundas con luz tenue.", "Enfócate en la luz de noche durante 30 segundos."],
        sp: ["Escucha el tictac del reloj en silencio.", "Respira hondo como un globo que se infla y desinfla 5 veces.", "Mira la lucecita de noche y relaja tus ojitos."]
      },
      "Motor Skills": {
        en: ["Sort socks into matched color pairs.", "Fold a small hand towel carefully.", "Button or unbutton a pajama top."],
        es: ["Organiza calcetines por parejas de colores.", "Dobla una toalla de mano pequeña con cuidado.", "Abotona o desabotona una pijama."],
        sp: ["Junta los calcetines que tengan el mismo color.", "Dobla tu mantita favorita con tus manos.", "Intenta abotonar un botón de tu pijama."]
      },
      Communication: {
        en: ["Use soft touch gestures to describe comfort.", "Point to favorite pajamas.", "Express cozy levels using non-verbal thumb signs."],
        es: ["Usa gestos de tacto suave para describir comodidad.", "Señala tu pijama favorita.", "Expresa tu nivel de comodidad con los pulgares."],
        sp: ["Abraza a tu peluche para mostrar que estás feliz.", "Señala cuál pijama te quieres poner hoy.", "Haz dedito arriba si estás súper cómodo."]
      }
    },
    Park: {
      Speech: {
        en: ["Call out like forest birds in the open air.", "Blow a dandelion and whistle.", "Echo soft rustling leaves sounds: 'shhh'."],
        es: ["Llama como los pájaros del bosque al aire libre.", "Sopla un diente de león e intenta silbar.", "Imita el sonido de las hojas al viento: 'shhh'."],
        sp: ["¡Canta como un pajarito al aire libre!", "Sopla una flor de diente de león muy fuerte.", "Haz 'shhh' como el viento en los árboles."]
      },
      Social: {
        en: ["Find pretty leaves and hand them over.", "Walk side-by-side matching paces.", "Point out running pets together."],
        es: ["Encuentra hojas bonitas y dáselas al cuidador.", "Caminen juntos al mismo ritmo.", "Observen mascotas corriendo en el parque juntos."],
        sp: ["Busca la hoja más bonita del suelo y dásela a papá.", "Caminen de la mano contando los pasos: 1, 2, 3.", "Mira al perrito correr y señálalo con alegría."]
      },
      Reading: {
        en: ["Point to letters on trail markers.", "Examine tree bark patterns like lines.", "Spot directional arrows in the park."],
        es: ["Señala letras en los marcadores del sendero.", "Examina patrones en la corteza de los árboles.", "Encuentra flechas de dirección en el parque."],
        sp: ["Encuentra letras en los carteles del parque.", "Toca las rayitas de la madera del árbol.", "Busca flechas dibujadas en el camino."]
      },
      Attention: {
        en: ["Listen to distant wind chimes or birds.", "Touch dry versus wet grass blades.", "Track a falling leaf with your eyes."],
        es: ["Escucha pájaros o campanas de viento lejanas.", "Toca hojas de hierba secas contra húmedas.", "Sigue con la mirada una hoja que cae del árbol."],
        sp: ["Cierra los ojos y escucha el canto de un pájaro.", "Toca el pastito seco y el pastito húmedo.", "Mira cómo cae una hojita bailando en el aire."]
      },
      "Motor Skills": {
        en: ["Collect 5 smooth twigs of different lengths.", "Balance on a low secure tree log.", "Squeeze damp soil or sand grains gently."],
        es: ["Reúne 5 ramitas suaves de diferentes tamaños.", "Mantén el equilibrio sobre un tronco seguro.", "Presiona tierra húmeda o granos de arena."],
        sp: ["Recoge 5 palitos del suelo para tu colección.", "Camina sobre la línea dibujada en el suelo.", "Toca la tierrita o arena suavemente."]
      },
      Communication: {
        en: ["Point to trail direction choices.", "Show expressions for wind warmth.", "Signal when sensory levels feel perfect."],
        es: ["Señala las direcciones del sendero.", "Muestra gestos sobre la calidez del viento.", "Haz una seña cuando el ambiente se sienta perfecto."],
        sp: ["Señala si quieres ir por el camino izquierdo o derecho.", "Haz cara de frío o calor según el viento.", "Pon tus manos en el corazón si estás feliz aquí."]
      }
    }
  };

  // Fallback defaults if specific combination is not mapped
  const fallbackTitles: Record<string, string> = {
    Kitchen: "Kitchen Culinary Explorers",
    Bedroom: "Bedroom Cloud Dreamers",
    Park: "Park Nature Expedition",
    Car: "Car Co-Pilot Cruisers",
    Bathroom: "Bathroom Bubble Adventure",
    School: "School Classroom Heros",
    Store: "Store Supermarket Hunters"
  };

  const currentTitle = titles[location]?.[goal] || `${fallbackTitles[location]} (${goal})`;
  
  // Custom tasks fallback generator
  const tasks = stepTemplates[location]?.[goal]?.[lang] || [
    lang === 'en' ? `Complete a therapeutic task focused on ${goal} in the ${location}.` : `Completa una tarea enfocada en ${goal} en la ${location}.`,
    lang === 'en' ? `Incorporate sensory-friendly materials matching ${time} minutes duration.` : `Usa materiales táctiles aptos para la duración de ${time} minutos.`,
    lang === 'en' ? "Verify the clinical progress with your therapist." : "Registra los resultados para compartirlos con el doctor."
  ];

  return {
    title: currentTitle,
    duration: time,
    location,
    goal,
    tasks,
    sensoryCalibration: Math.min(98, 85 + (time * 0.5) + (location.length * 0.5))
  };
}

export const MissionAnywhere: React.FC<MissionAnywhereProps> = ({
  theme,
  lang,
  logEvent,
  setNotifications,
  setCurrentCalmProgress
}) => {
  // Navigation wizard states
  const [step, setStep] = useState<"location" | "duration" | "goal" | "generating" | "card">("location");
  
  // Selections
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  
  // Generated active mission card
  const [mission, setMission] = useState<any>(null);
  const [checkedTasks, setCheckedTasks] = useState<boolean[]>([false, false, false]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timerCount, setTimerCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Localization strings
  const strings = {
    title: { en: "Adventure Anywhere", es: "Aventura Anywhere", sp: "Juego en Cualquier Lugar" },
    subtitle: { 
      en: "Design an instant therapeutic game for Liam based on where you are.", 
      es: "Diseña un juego terapéutico al instante para Liam según donde se encuentren.", 
      sp: "¡Elige opciones divertidas para crear un juego mágico para ti!" 
    },
    q1: { en: "1. Where are you right now?", es: "1. ¿Dónde se encuentran ahora?", sp: "1. ¿Dónde estás jugando hoy?" },
    q2: { en: "2. How much play time?", es: "2. ¿De cuánto tiempo disponen?", sp: "2. ¿Cuánto tiempo quieres jugar?" },
    q3: { en: "3. Choose today's sensory goal", es: "3. Elige el objetivo sensorial de hoy", sp: "3. ¿Qué poder mágico quieres usar?" },
    next: { en: "Continue", es: "Continuar", sp: "Siguiente" },
    back: { en: "Back", es: "Atrás", sp: "Volver" },
    generating: { en: "Calibrating sensory parameters...", es: "Alineando parámetros sensoriales...", sp: "¡Cargando magia en tu pantalla!..." },
    generatingSub: { 
      en: "Dr. Miller's framework is crafting a neurodivergent-friendly path.", 
      es: "El sistema está adaptando actividades aprobadas por terapeutas clínicos.", 
      sp: "Espera un ratito mientras preparamos cosas muy divertidas." 
    },
    cardHeader: { en: "Live Active Adventure", es: "Aventura Activa de Hoy", sp: "¡Tu Tarjeta de Superpoderes!" },
    locLabel: { en: "Location", es: "Ubicación", sp: "Lugar" },
    timeLabel: { en: "Duration", es: "Duración", sp: "Tiempo" },
    goalLabel: { en: "Symptom Focus", es: "Foco Clínico", sp: "Tu Poder" },
    calibLabel: { en: "Sensory Resilience Goal", es: "Meta de Resiliencia", sp: "Medidor de Calma" },
    startPlay: { en: "Activate Timer", es: "Activar Cronómetro", sp: "¡Empezar a Jugar!" },
    pausePlay: { en: "Pause Timer", es: "Pausar", sp: "Pausar Juego" },
    completedBtn: { en: "Log Successful Adventure", es: "Registrar Aventura Completada", sp: "¡Completé la Aventura!" },
    resetBtn: { en: "New Adventure", es: "Nueva Aventura", sp: "Crear Otro Juego" },
    successHeader: { en: "MAGICAL PERFORMANCE COMPLETED!", es: "¡AVENTURA COMPLETADA CON ÉXITO!", sp: "¡Felicidades, Campeón!" },
    successMsg: {
      en: "Liam successfully calibrated sensory thresholds! Dr. Miller has been notified.",
      es: "¡Liam logró equilibrar sus estímulos! El reporte clínico fue enviado.",
      sp: "¡Lo lograste! Ganaste una estrella mágica y el doctor está súper feliz contigo."
    }
  };

  // Timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount((prev) => prev - 1);
      }, 1000);
    } else if (timerCount === 0 && isPlaying) {
      setIsPlaying(false);
      logEvent("success", `Timer completed for "${mission?.title}"!`);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timerCount]);

  // Handle generation flow
  const handleLocationSelect = (loc: string) => {
    setSelectedLocation(loc);
    logEvent("info", `Adventure Location Selected: "${loc}"`);
    setStep("duration");
  };

  const handleDurationSelect = (dur: number) => {
    setSelectedDuration(dur);
    logEvent("info", `Adventure Duration Selected: ${dur} minutes`);
    setStep("goal");
  };

  const handleGoalSelect = (gl: string) => {
    setSelectedGoal(gl);
    logEvent("info", `Adventure Goal Selected: "${gl}"`);
    setStep("generating");
    
    // Whimsical magical generation delay
    setTimeout(() => {
      const generated = generateMissionData(selectedLocation, selectedDuration, gl, lang === "hi" ? "en" : lang);
      setMission(generated);
      setCheckedTasks([false, false, false]);
      setTimerCount(selectedDuration * 60);
      setIsPlaying(false);
      setIsCompleted(false);
      setStep("card");
      logEvent("success", `Magical Adventure Card Generated: "${generated.title}"`);
    }, 2200);
  };

  const handleReset = () => {
    setSelectedLocation("");
    setSelectedDuration(0);
    setSelectedGoal("");
    setMission(null);
    setIsPlaying(false);
    setIsCompleted(false);
    setStep("location");
    logEvent("info", "Reset Adventure Anywhere tool.");
  };

  const handleLogMission = () => {
    setIsCompleted(true);
    setIsPlaying(false);
    setCurrentCalmProgress((prev) => Math.min(100, prev + 2.5));
    
    // Add beautiful system notification
    const messages: Record<string, string> = {
      en: `Adventure Log Sync: Liam completed "${mission.title}" in the ${mission.location}!`,
      es: `Registro de Aventura: ¡Liam completó "${mission.title}" en la ${mission.location}!`,
      sp: `🏆 ¡Aventura completada! Liam usó el poder de ${mission.goal} en la ${mission.location}.`,
      hi: `🏆 रोमांच पूरा हुआ! लियाम ने रोमांच पूरा किया।`
    };

    setNotifications((prev) => [
      {
        id: Math.random().toString(),
        text: messages[lang] || messages.en,
        time: "Just now",
        read: false
      },
      ...prev
    ]);

    logEvent("success", `Adventure completed together: "${mission.title}" completed with beautiful focus.`);
  };

  const formattedTime = () => {
    const mins = Math.floor(timerCount / 60);
    const secs = timerCount % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Styles based on theme
  const cardBgClass = theme === "light" ? "bg-white border-gray-150" : "bg-[#161D30] border-gray-800";
  const textPrimaryClass = theme === "light" ? "text-gray-900" : "text-[#ECF0F1]";
  const textSecondaryClass = theme === "light" ? "text-gray-500" : "text-[#94A3B8]";
  const borderClass = theme === "light" ? "border-gray-150" : "border-gray-800";

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Title block */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-teal-500 animate-pulse" />
          <h2 className={`text-2xl font-extrabold font-display ${textPrimaryClass}`}>
            {strings.title[lang]}
          </h2>
        </div>
        <p className={`text-sm ${textSecondaryClass} leading-relaxed`}>
          {strings.subtitle[lang]}
        </p>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: WHERE ARE YOU? */}
        {step === "location" && (
          <motion.div
            key="location-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: -20, x: -20 }}
            className={`p-6 md:p-8 rounded-premium border ${cardBgClass} shadow-premium-sm space-y-6`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-gray-100 dark:border-gray-800">
              <h3 className={`text-base font-extrabold font-display ${textPrimaryClass}`}>
                {strings.q1[lang]}
              </h3>
              <span className="text-[10px] font-mono text-gray-400">Step 1 of 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {locations.map((loc) => {
                const IconComponent = loc.icon;
                return (
                  <button
                    key={loc.id}
                    onClick={() => handleLocationSelect(loc.id)}
                    className={`p-4 rounded-premium border text-left cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between h-36 ${
                      theme === "light"
                        ? "bg-gray-50/50 hover:bg-white hover:border-teal-500/40"
                        : "bg-gray-800/40 hover:bg-gray-800 hover:border-teal-500/40"
                    } ${borderClass}`}
                  >
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-tr ${loc.color} text-white flex items-center justify-center shadow-premium-sm`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${textPrimaryClass}`}>
                        {lang === "en" ? loc.labelEn : lang === "es" ? loc.labelEs : loc.labelSp}
                      </h4>
                      <p className="text-[10px] text-gray-400 leading-normal mt-1">
                        {lang === "en" ? loc.descEn : lang === "es" ? loc.descEs : loc.descSp}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 2: HOW MUCH TIME? */}
        {step === "duration" && (
          <motion.div
            key="duration-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: -20, x: -20 }}
            className={`p-6 md:p-8 rounded-premium border ${cardBgClass} shadow-premium-sm space-y-6`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep("location")}
                  className={`h-7 w-7 rounded-full border ${borderClass} flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer`}
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h3 className={`text-base font-extrabold font-display ${textPrimaryClass}`}>
                  {strings.q2[lang]}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-gray-400">Step 2 of 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {durations.map((dur) => (
                <button
                  key={dur.value}
                  onClick={() => handleDurationSelect(dur.value)}
                  className={`p-5 rounded-premium border text-left cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between h-36 ${
                    theme === "light"
                      ? "bg-gray-50/50 hover:bg-white hover:border-[#00828A]/40"
                      : "bg-gray-800/40 hover:bg-gray-800 hover:border-[#00828A]/40"
                  } ${borderClass}`}
                >
                  <div className="h-10 w-10 rounded-full bg-[#00828A]/5 text-[#00828A] flex items-center justify-center font-bold font-mono text-xs">
                    <Clock className="h-4 w-4 mr-0.5" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${textPrimaryClass}`}>
                      {lang === "en" ? dur.labelEn : lang === "es" ? dur.labelEs : dur.labelSp}
                    </h4>
                    <p className="text-[10px] text-gray-400 leading-normal mt-1">
                      {lang === "en" ? dur.descEn : lang === "es" ? dur.descEs : dur.descSp}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 3: TODAY'S GOAL */}
        {step === "goal" && (
          <motion.div
            key="goal-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: -20, x: -20 }}
            className={`p-6 md:p-8 rounded-premium border ${cardBgClass} shadow-premium-sm space-y-6`}
          >
            <div className="flex items-center justify-between border-b pb-3 border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep("duration")}
                  className={`h-7 w-7 rounded-full border ${borderClass} flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer`}
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h3 className={`text-base font-extrabold font-display ${textPrimaryClass}`}>
                  {strings.q3[lang]}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-gray-400">Step 3 of 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {goals.map((gl) => {
                const IconComponent = gl.icon;
                return (
                  <button
                    key={gl.id}
                    onClick={() => handleGoalSelect(gl.id)}
                    className={`p-4 rounded-premium border text-left cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between h-36 ${
                      theme === "light"
                        ? "bg-gray-50/50 hover:bg-white hover:border-brand-primary/40"
                        : "bg-gray-800/40 hover:bg-gray-800 hover:border-brand-primary/40"
                    } ${borderClass}`}
                  >
                    <div className={`h-10 w-10 rounded-full ${gl.color} flex items-center justify-center shadow-premium-sm`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${textPrimaryClass}`}>
                        {lang === "en" ? gl.labelEn : lang === "es" ? gl.labelEs : gl.labelSp}
                      </h4>
                      <p className="text-[10px] text-gray-400 leading-normal mt-1">
                        {lang === "en" ? gl.descEn : lang === "es" ? gl.descEs : gl.descSp}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 4: GENERATING SCREEN */}
        {step === "generating" && (
          <motion.div
            key="generating-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`p-12 rounded-premium border ${cardBgClass} shadow-premium-lg flex flex-col items-center justify-center space-y-8 text-center min-h-[350px]`}
          >
            <div className="relative h-24 w-24 flex items-center justify-center">
              {/* Magical spinning particles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-dashed border-teal-400/50"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="h-12 w-12 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-premium-sm"
              >
                <Sparkle className="h-6 w-6 animate-spin-slow" />
              </motion.div>
            </div>

            <div className="space-y-2 max-w-sm">
              <h3 className={`text-lg font-extrabold font-display ${textPrimaryClass}`}>
                {strings.generating[lang]}
              </h3>
              <p className={`text-xs ${textSecondaryClass} leading-relaxed`}>
                {strings.generatingSub[lang]}
              </p>
            </div>
          </motion.div>
        )}

        {/* STEP 5: GENERATED ADVENTURE CARD */}
        {step === "card" && mission && (
          <motion.div
            key="card-step"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            
            {/* Header Alert Card */}
            <div className={`p-6 md:p-8 rounded-premium border ${cardBgClass} shadow-premium-md relative overflow-hidden`}>
              <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-teal-500/5 dark:bg-teal-500/10 blur-2xl" />
              <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-brand-primary-soft dark:bg-brand-primary/5 blur-2xl" />

              <div className="flex items-center justify-between border-b pb-4 border-gray-100 dark:border-gray-800 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                    {strings.cardHeader[lang]}
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  className={`text-[10px] font-extrabold uppercase tracking-wider ${textSecondaryClass} hover:${textPrimaryClass} flex items-center gap-1 cursor-pointer`}
                >
                  <RotateCcw className="h-3 w-3" />
                  {strings.resetBtn[lang]}
                </button>
              </div>

              {/* Core Info */}
              <div className="pt-6 space-y-4 relative z-10">
                <h2 className={`text-xl md:text-2xl font-extrabold font-display leading-snug ${textPrimaryClass}`}>
                  {mission.title}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-y border-gray-100 dark:border-gray-800/60 py-4 my-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-amber-500/5 text-amber-500 flex items-center justify-center shrink-0">
                      <Clock className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">{strings.timeLabel[lang]}</span>
                      <span className={`text-xs font-bold ${textPrimaryClass}`}>{mission.duration} mins</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-500/5 text-blue-500 flex items-center justify-center shrink-0">
                      <Target className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">{strings.goalLabel[lang]}</span>
                      <span className={`text-xs font-bold ${textPrimaryClass}`}>{mission.goal}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-emerald-500/5 text-emerald-500 flex items-center justify-center shrink-0">
                      <Activity className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">{strings.calibLabel[lang]}</span>
                      <span className="text-xs font-bold text-emerald-500 font-mono">+{mission.sensoryCalibration - 80}% boost</span>
                    </div>
                  </div>
                </div>

                {/* Checklist tasks */}
                <div className="space-y-4 pt-4">
                  <h3 className={`text-sm font-extrabold ${textPrimaryClass}`}>
                    {lang === 'es' ? 'Actividades paso a paso:' : lang === 'sp' ? 'Tus misiones mágicas:' : 'Interactive Steps:'}
                  </h3>
                  
                  <div className="space-y-3">
                    {mission.tasks.map((task: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const copy = [...checkedTasks];
                          copy[idx] = !copy[idx];
                          setCheckedTasks(copy);
                          logEvent(copy[idx] ? "success" : "info", `Step ${idx + 1} completed: "${task}"`);
                        }}
                        className={`w-full p-4 rounded-premium border text-left flex items-center justify-between gap-4 cursor-pointer transition-all ${
                          checkedTasks[idx]
                            ? "bg-emerald-500/5 border-emerald-500/25 text-emerald-900 dark:text-emerald-300"
                            : `${theme === 'light' ? 'bg-gray-50/50 border-gray-200' : 'bg-gray-800/20 border-gray-800'} ${textPrimaryClass}`
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold font-mono h-5 w-5 rounded-full ${
                            checkedTasks[idx]
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                          } flex items-center justify-center shrink-0`}>
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold leading-relaxed">{task}</span>
                        </div>
                        <div className={`h-5 w-5 rounded border ${
                          checkedTasks[idx]
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        } flex items-center justify-center shrink-0 smooth-transition`}>
                          {checkedTasks[idx] && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Timer & Action buttons */}
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                  
                  {/* Digital Clock */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`h-11 w-11 rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-all ${
                        isPlaying ? "bg-amber-500 shadow-amber-500/25" : "bg-[#00828A] shadow-teal-500/25"
                      }`}
                    >
                      {isPlaying ? (
                        <div className="flex gap-1">
                          <span className="h-3 w-0.5 bg-white rounded-full" />
                          <span className="h-3 w-0.5 bg-white rounded-full" />
                        </div>
                      ) : (
                        <Play className="h-4.5 w-4.5 fill-white ml-0.5" />
                      )}
                    </button>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Game Counter</span>
                      <span className={`text-xl font-extrabold font-mono ${textPrimaryClass}`}>{formattedTime()}</span>
                    </div>
                  </div>

                  {/* Submission Trigger */}
                  <button
                    onClick={handleLogMission}
                    disabled={!checkedTasks.every((t) => t)}
                    className={`px-8 py-3.5 rounded-full text-xs font-extrabold tracking-wider uppercase shadow-premium-md transition-all cursor-pointer flex items-center gap-2 w-full md:w-auto justify-center ${
                      checkedTasks.every((t) => t)
                        ? "bg-[#00828A] hover:bg-[#00828A]/90 hover:scale-[1.02] active:scale-95 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border border-dashed border-gray-200 dark:border-gray-700 shadow-none"
                    }`}
                  >
                    <Check className="h-4 w-4 stroke-[3.5px]" />
                    {strings.completedBtn[lang]}
                  </button>

                </div>

              </div>
            </div>

            {/* Success Celebration Card */}
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 md:p-8 rounded-premium bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex flex-col md:flex-row items-center gap-6"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 shadow-premium-sm animate-bounce">
                  <Award className="h-9 w-9" />
                </div>
                <div className="space-y-1.5 flex-1 text-center md:text-left">
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                    {strings.successHeader[lang]}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-semibold">
                    {strings.successMsg[lang]}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold tracking-wider uppercase shadow-premium-sm transition-all shrink-0 cursor-pointer"
                >
                  {strings.resetBtn[lang]}
                </button>
              </motion.div>
            )}

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
