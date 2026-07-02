// AutisticPath Personalization Engine
// Highly tailored therapy generation based on parent & child profile details.

export interface ChildProfile {
  id: string;
  name: string;
  nickname?: string;
  age: string;
  dob: string;
  gender?: string;
  diagnosis: string;
  therapyGoals: string[];
  interests: string[];
  favoriteToys: string;
  favoriteFoods: string;
  thingsThatCalm: string;
  thingsThatUpset: string;
  communicationLevel: string;
  currentTherapy: string;
  therapyFrequency: string;
  currentChallenges: string[];
  weeklyGoal: string;
  progressScore: number;
  completedAdventuresCount: number;
  sessions: TherapySession[];
  completedSessions: string[]; // e.g. ["day-1", "day-3"]
  preferredSessionDuration?: string;
}

export interface ParentProfile {
  parentName: string;
  relationship: "Mother" | "Father" | "Guardian" | string;
  language: "en" | "es" | "sp" | "hi";
  country: string;
  timezone: string;
  email?: string;
  phone?: string;
}

export interface TherapySession {
  id: string;
  dayName: string; // e.g. "Monday", "Day 1"
  title: {
    en: string;
    es: string;
    sp: string;
    hi: string;
  };
  goal: {
    en: string;
    es: string;
    sp: string;
    hi: string;
  };
  duration: string;
  location: {
    en: string;
    es: string;
    sp: string;
    hi: string;
  };
  iconName: "Sparkles" | "Eye" | "Activity" | "BookOpen" | "Heart" | "ShieldCheck" | "Search";
  accentColor: "purple" | "cyan" | "emerald" | "amber" | "rose" | "teal";
  steps: {
    en: string[];
    es: string[];
    sp: string[];
    hi: string[];
  };
}

// Map the Weekly Goal value to descriptive titles
export function getGoalLabel(goal: string, lang: string): string {
  const map: Record<string, Record<string, string>> = {
    "Improve Communication": {
      en: "Speech & Communication",
      es: "Habla y Comunicación",
      sp: "🗣️ Hablar y Expresarse",
      hi: "भाषण और संचार"
    },
    "Improve Eye Contact": {
      en: "Eye Contact & Attention",
      es: "Contacto Visual y Atención",
      sp: "👀 Miradas de Cariño",
      hi: "आँखों का संपर्क और ध्यान"
    },
    "Improve Emotional Regulation": {
      en: "Sensory & Emotional Calming",
      es: "Calma Sensorial y Emocional",
      sp: "🧘 Sentirse en Calma",
      hi: "संवेदी और भावनात्मक शांति"
    },
    "Improve Reading": {
      en: "Reading & Cognitive Focus",
      es: "Lectura y Foco Cognitivo",
      sp: "📖 Leer y Jugar",
      hi: "पढ़ना और संज्ञानात्मक ध्यान"
    },
    "Develop Daily Living Skills": {
      en: "Independent Living Tasks",
      es: "Tareas de Vida Independiente",
      sp: "💪 Cosas de Niño Grande",
      hi: "दैनिक जीवन कौशल"
    }
  };
  
  const key = Object.keys(map).find(k => k.toLowerCase() === goal.toLowerCase() || goal.toLowerCase().includes(k.toLowerCase())) || "Improve Communication";
  return map[key]?.[lang] || map[key]?.["en"] || goal;
}

// Generate a fully customized 7-day therapy plan
export function generateWeeklyPlan(child: Omit<ChildProfile, "sessions" | "completedSessions">): TherapySession[] {
  const name = child.name;
  const nickname = child.nickname || name;
  const interest = child.interests[0] || "Animals";
  const toy = child.favoriteToys || "favorite toy";
  const food = child.favoriteFoods || "favorite snack";
  const calmThing = child.thingsThatCalm || "gentle rocking";
  
  const goal = child.weeklyGoal || "Improve Communication";
  
  // Custom generator templates based on Weekly Goal and interests
  const sessions: TherapySession[] = [];
  
  const days = [
    { en: "Monday", es: "Lunes", sp: "Día 1 ☀️", hi: "सोमवार" },
    { en: "Tuesday", es: "Martes", sp: "Día 2 🌸", hi: "मंगलवार" },
    { en: "Wednesday", es: "Miércoles", sp: "Día 3 🍀", hi: "बुधवार" },
    { en: "Thursday", es: "Jueves", sp: "Día 4 🍁", hi: "गुरुवार" },
    { en: "Friday", es: "Viernes", sp: "Día 5 🌈", hi: "शुक्रवार" },
    { en: "Saturday", es: "Sábado", sp: "Día 6 🎈", hi: "शनिवार" },
    { en: "Sunday", es: "Domingo", sp: "Día 7 🧸", hi: "रविवार" }
  ];

  // Tailored themes based on interest
  const interestThemes: Record<string, { en: string; es: string; sp: string; hi: string }> = {
    dinosaurs: { en: "Dinosaur Adventure", es: "Aventura de Dinosaurios", sp: "🦖 El Mundo de los Dinosaurios", hi: "डायनासोर साहसिक" },
    animals: { en: "Friendly Animals", es: "Animales Amigables", sp: "🦁 El Reino Animal", hi: "मित्रवत जानवर" },
    cars: { en: "Racing Track", es: "Pista de Carreras", sp: "🚗 Autos de Carreras", hi: "रेसिंग ट्रैक" },
    space: { en: "Cosmic Journey", es: "Viaje Cósmico", sp: "🚀 El Espacio Brillante", hi: "ब्रह्मांडीय यात्रा" },
    princesses: { en: "Royal Palace", es: "Palacio Real", sp: "👑 El Palacio de Cuentos", hi: "शाही महल" },
    music: { en: "Rhythm Symphony", es: "Sinfonía del Ritmo", sp: "🎵 Música Alegre", hi: "लय सिम्फनी" },
    nature: { en: "Forest Discovery", es: "Descubrimiento del Bosque", sp: "🌳 El Bosque Amigo", hi: "वन की खोज" },
    drawing: { en: "Artistic Canvas", es: "Lienzo Artístico", sp: "🎨 Colores Mágicos", hi: "कलात्मक कैनवास" },
    letters: { en: "Alphabet Quest", es: "Búsqueda del Alfabeto", sp: "🅰️ Letras Divertidas", hi: "वर्णमाला खोज" },
    numbers: { en: "Counting Puzzle", es: "Rompecabezas de Números", sp: "🔢 Números Saltarines", hi: "गिनती पहेली" }
  };

  const selectedTheme = interestThemes[interest.toLowerCase()] || interestThemes.animals;

  for (let i = 0; i < 7; i++) {
    const day = days[i];
    let title: any = {}, sessionGoal: any = {}, steps: any = {}, iconName: any = "Sparkles", accentColor: any = "teal";
    
    if (goal.includes("Communication")) {
      accentColor = "emerald";
      iconName = "Sparkles";
      
      if (i % 2 === 0) {
        title = {
          en: `Naming the ${interest}`,
          es: `Nombrando el ${selectedTheme.es}`,
          sp: `🗣️ Jugar con ${selectedTheme.sp}`,
          hi: `${selectedTheme.hi} का नामकरण`
        };
        sessionGoal = {
          en: `Encourage ${nickname} to communicate using names of their favorite ${interest}.`,
          es: `Fomentar que ${nickname} se comunique usando nombres de sus ${interest} favoritos.`,
          sp: `¡Vamos a usar palabras bonitas para jugar con los ${interest}!`,
          hi: `${nickname} को उनके पसंदीदा ${interest} के नामों का उपयोग करके संवाद करने के लिए प्रोत्साहित करें।`
        };
        steps = {
          en: [
            `Hold the ${toy} or a picture of ${interest} near your face.`,
            `Wait 4 seconds for ${nickname} to vocalize or gesture before giving it.`,
            `Reward ${nickname} with a bite of ${food} and enthusiastic praise!`
          ],
          es: [
            `Sostén el juguete ${toy} o una foto de ${interest} cerca de tu rostro.`,
            `Espera 4 segundos para que ${nickname} vocalice o haga un gesto antes de dárselo.`,
            `¡Premia a ${nickname} con un pedacito de ${food} y un elogio entusiasta!`
          ],
          sp: [
            `👉 Sostén el juguete ${toy} cerca de tus ojos con una sonrisa.`,
            `🤫 Esperamos un ratito a ver si dice su nombre o señala.`,
            `💨 ¡Súper! Dáselo y dile: "¡Qué bien lo hiciste!"`
          ],
          hi: [
            `${toy} या ${interest} की तस्वीर को अपने चेहरे के पास रखें।`,
            `${nickname} के बोलने या इशारा करने के लिए 4 सेकंड प्रतीक्षा करें।`,
            `${nickname} को ${food} के एक टुकड़े और उत्साहपूर्ण प्रशंसा के साथ पुरस्कृत करें!`
          ]
        };
      } else {
        title = {
          en: `Requesting with ${toy}`,
          es: `Solicitud con el Juguete ${toy}`,
          sp: `🦖 Pedir el Juguete ${toy}`,
          hi: `${toy} के साथ अनुरोध करना`
        };
        sessionGoal = {
          en: `Practice requesting behaviors during sensory play.`,
          es: `Practicar comportamientos de solicitud durante el juego sensorial.`,
          sp: `Practicamos pedir el juguete usando sonidos o señas lindas.`,
          hi: `संवेदी खेल के दौरान अनुरोध करने वाले व्यवहार का अभ्यास करें।`
        };
        steps = {
          en: [
            `Place the ${toy} slightly out of reach but visible.`,
            `Model the request phrase (e.g., "${toy}, please").`,
            `Gently prompt ${nickname} to repeat or point before handoff.`
          ],
          es: [
            `Coloca el juguete ${toy} un poco fuera del alcance pero visible.`,
            `Modela la frase de solicitud (ej. "quiero ${toy}").`,
            `Pide suavemente a ${nickname} que repita o señale antes de entregárselo.`
          ],
          sp: [
            `👉 Ponemos el juguete ${toy} en la mesa, un poquito lejos.`,
            `🗣️ Decimos despacito: "¿Me das el juguete, por favor?"`,
            `🌟 Esperamos a que intente señalar o hacer un ruidito y se lo damos.`
          ],
          hi: [
            `${toy} को पहुंच से थोड़ा दूर रखें लेकिन दृश्यमान हो।`,
            `अनुरोध वाक्यांश का मॉडल तैयार करें (जैसे, "${toy}, कृपया")।`,
            `हाथ मिलाने से पहले ${nickname} को दोहराने या इशारा करने के लिए धीरे से कहें।`
          ]
        };
      }
    } else if (goal.includes("Eye Contact")) {
      accentColor = "cyan";
      iconName = "Eye";
      
      title = {
        en: `Gaze Following with ${interest}`,
        es: `Seguimiento de Mirada con ${selectedTheme.es}`,
        sp: `👀 Miradas de Estrella con ${interest}`,
        hi: `${selectedTheme.hi} के साथ टकटकी लगाना`
      };
      sessionGoal = {
        en: `Build eye contact comfort by nesting visual indicators near your eyes during play.`,
        es: `Fomentar el contacto visual cómodo colocando objetos de interés cerca de tus ojos durante el juego.`,
        sp: `Jugamos a mirarnos a los ojos usando cosas brillantes de ${interest}.`,
        hi: `खेल के दौरान अपनी आँखों के पास दृश्य संकेतक लगाकर आँखों के संपर्क को आरामदायक बनाएं।`
      };
      steps = {
        en: [
          `Hold the ${toy} directly in front of your eyes.`,
          `Wait for ${nickname} to make direct eye contact for 2-3 seconds.`,
          `Make a funny face or sound to make ${nickname} laugh, strengthening connection.`
        ],
        es: [
          `Sostén el juguete ${toy} directamente frente a tus ojos.`,
          `Espera a que ${nickname} te mire directamente a los ojos por 2-3 segundos.`,
          `Haz un gesto divertido o un sonido para hacer reír a ${nickname}, fortaleciendo la conexión.`
        ],
        sp: [
          `👉 Ponte el juguete ${toy} cerca de tus ojitos mágicos.`,
          `👀 Espera a que te mire a los ojos y sonríele mucho.`,
          `🦁 ¡Haz un ruidito divertido para que se ría y se sienta feliz!`
        ],
        hi: [
          `${toy} को सीधे अपनी आँखों के सामने रखें।`,
          `2-3 सेकंड के लिए प्रत्यक्ष आँखों का संपर्क बनाने के लिए ${nickname} की प्रतीक्षा करें।`,
          `${nickname} को हँसाने के लिए एक अजीब चेहरा या आवाज़ बनाएं, जिससे संबंध मजबूत हो।`
        ]
      };
    } else if (goal.includes("Regulation")) {
      accentColor = "purple";
      iconName = "Heart";
      
      title = {
        en: `Calming Breathing in the ${selectedTheme.en}`,
        es: `Respiración Calmante en el ${selectedTheme.es}`,
        sp: `🧘 Respiración Calma de ${interest}`,
        hi: `${selectedTheme.hi} में शांत साँस लेना`
      };
      sessionGoal = {
        en: `Help ${nickname} self-regulate and adapt to sensory changes using ${calmThing}.`,
        es: `Ayudar a ${nickname} a autorregularse y adaptarse usando ${calmThing}.`,
        sp: `Aprendemos a respirar suave y lindo usando el poder de ${calmThing}.`,
        hi: `${calmThing} का उपयोग करके ${nickname} को स्व-विनियमित करने और संवेदी परिवर्तनों के अनुकूल होने में मदद करें।`
      };
      steps = {
        en: [
          `Wrap ${nickname} gently in their favorite blanket or offer ${calmThing}.`,
          `Practice 3 deep chest breaths together. Whisper gently to match the rhythm.`,
          `If ${nickname} starts to feel upset, play soft music-based soothing hums.`
        ],
        es: [
          `Envuelve a ${nickname} suavemente en su manta favorita o dale ${calmThing}.`,
          `Practiquen 3 respiraciones profundas juntos. Susurra suavemente para igualar el ritmo.`,
          `Si ${nickname} comienza a sentirse abrumado, entona zumbidos musicales suaves.`
        ],
        sp: [
          `👉 Abrazamos a ${nickname} bien suavecito o usamos ${calmThing}.`,
          `💨 Respiramos hondo juntos como si sopláramos globos de colores.`,
          `🤫 Si se pone nervioso, le cantamos una canción súper bajito.`
        ],
        hi: [
          `${nickname} को धीरे से उनकी पसंदीदा कंबल में लपेटें या ${calmThing} प्रदान करें।`,
          `एक साथ 3 गहरी साँस लेने का अभ्यास करें। लय से मेल खाने के लिए धीरे से फुसफुसाएं।`,
          `यदि ${nickname} परेशान महसूस करने लगे, तो संगीत-आधारित सौम्य गुनगुनाहट चलाएं।`
        ]
      };
    } else if (goal.includes("Reading")) {
      accentColor = "amber";
      iconName = "BookOpen";
      
      title = {
        en: `Visual Exploration of ${selectedTheme.en}`,
        es: `Exploración Visual de ${selectedTheme.es}`,
        sp: `📖 Cuento Mágico de ${interest}`,
        hi: `${selectedTheme.hi} की दृश्य खोज`
      };
      sessionGoal = {
        en: `Practice visual tracking and point-to-identify behavior with interests.`,
        es: `Practicar el seguimiento visual y el gesto de señalar usando intereses del niño.`,
        sp: `Buscamos dibujos lindos de ${interest} en el libro mágico.`,
        hi: `रुचियों के साथ विजुअल ट्रैकिंग और पॉइंट-टू-आइडेंटिफाई व्यवहार का अभ्यास करें।`
      };
      steps = {
        en: [
          `Open a storybook about ${interest} or show pictures of ${interest}.`,
          `Ask ${nickname} to point to their favorite element (e.g. "Where is the ${interest}?").`,
          `Wait 5 seconds. Guide their finger gently if needed, and praise warmly!`
        ],
        es: [
          `Abre un cuento sobre ${interest} o muestra imágenes de ${interest}.`,
          `Pide a ${nickname} que señale su elemento favorito (ej. "¿Dónde está el ${interest}?").`,
          `Espera 5 segundos. Guía su dedo suavemente si es necesario, ¡y felicítalo con cariño!`
        ],
        sp: [
          `👉 Abrimos un libro de cuentos donde salgan ${interest}.`,
          `🔍 Le preguntamos con voz alegre: "¿Dónde está el ${interest}?"`,
          `✨ Esperamos a que señale con su dedito y le damos un gran aplauso.`
        ],
        hi: [
          `${interest} के बारे में कहानी की किताब खोलें या ${interest} की तस्वीरें दिखाएं।`,
          `${nickname} से उनके पसंदीदा तत्व की ओर इशारा करने के लिए कहें (जैसे "यहाँ ${interest} कहाँ है?")।`,
          `5 सेकंड प्रतीक्षा करें। यदि आवश्यक हो तो उनकी उंगली को धीरे से गाइड करें, और गर्मजोशी से प्रशंसा करें!`
        ]
      };
    } else {
      // Daily Living Skills
      accentColor = "rose";
      iconName = "ShieldCheck";
      
      title = {
        en: `Putting Away the ${toy}`,
        es: `Guardando el Juguete ${toy}`,
        sp: `💪 El Reto de Ordenar ${toy}`,
        hi: `${toy} को दूर रखना`
      };
      sessionGoal = {
        en: `Foster independent living routines by cleaning up favorite toys together.`,
        es: `Fomentar rutinas de vida independiente ordenando los juguetes favoritos juntos.`,
        sp: `Aprendemos a guardar el juguete ${toy} en su casita secreta.`,
        hi: `पसंदीदा खिलौनों को एक साथ साफ करके स्वतंत्र जीवन की दिनचर्या को बढ़ावा दें।`
      };
      steps = {
        en: [
          `Play a cheerful clean-up transition song.`,
          `Take ${nickname}'s hand gently and help them put the ${toy} in its box.`,
          `Celebrate completion with high fives and their favorite snack ${food}!`
        ],
        es: [
          `Reproduce una canción alegre para la transición de guardar.`,
          `Toma la mano de ${nickname} suavemente y ayúdalo a poner el ${toy} en su caja.`,
          `¡Celebra con un "choca esos cinco" y su comida favorita ${food}!`
        ],
        sp: [
          `👉 Cantamos una canción divertida de guardar los juguetes.`,
          `📦 Ponemos la manito de ${nickname} suavemente sobre el ${toy} y lo guardamos juntos.`,
          `🏆 ¡Damos un súper aplauso y comemos un rico ${food}!`
        ],
        hi: [
          `एक प्रफुल्लित करने वाला स्वच्छ संक्रमण गीत बजाएं।`,
          `${nickname} का हाथ धीरे से पकड़ें और ${toy} को उसके बॉक्स में रखने में उनकी मदद करें।`,
          `हाई फाइव और उनके पसंदीदा स्नैक ${food} के साथ पूरा होने का जश्न मनाएं!`
        ]
      };
    }
    
    sessions.push({
      id: `day-${i + 1}`,
      dayName: days[i].en,
      title,
      goal: sessionGoal,
      duration: `${6 + (i % 5)} minutes`,
      location: {
        en: i % 2 === 0 ? "Quiet Living Room" : "Comfortable Play Area",
        es: i % 2 === 0 ? "Sala de Estar Tranquila" : "Área de Juego Cómoda",
        sp: i % 2 === 0 ? "Sala de Estar" : "Cuarto de Calma",
        hi: i % 2 === 0 ? "शांत रहने का कमरा" : "आरामदायक खेल क्षेत्र"
      },
      iconName,
      accentColor,
      steps
    });
  }
  
  return sessions;
}
