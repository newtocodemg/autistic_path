import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  Bookmark,
  Award,
  Check,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Upload,
  BookOpen,
  Sparkles,
  Lock,
  Globe,
  ArrowLeft,
  Smile,
  User,
  MapPin,
  Clock,
  Compass,
  Eye,
  EyeOff,
  HelpCircle,
  Send,
  Quote,
  Info,
  ShieldCheck,
  MessageCircle,
  Share2,
  AlertCircle,
  X
} from "lucide-react";

// Predefined Soft Gradient Cover Illustrations for the stories
const PRESET_COVERS = [
  "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)", // Soft blue
  "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)", // Gentle emerald
  "linear-gradient(135deg, #FDF4FF 0%, #F3E8FF 100%)", // Hopeful lavender
  "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)", // Warm peach
  "linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)"  // Serene cyan
];

// Rich custom-crafted initial stories
interface Story {
  id: string;
  title: string;
  author: string;
  age: string;
  country: string;
  readTime: string;
  category: string;
  excerpt: string;
  coverStyle: string; // CSS style gradient or decorative pattern
  content: {
    challenges: string;
    whatHelped: string;
    turningPoint: string;
    advice: string;
  };
  likes: number;
  likedByUser?: boolean;
  bookmarkedByUser?: boolean;
  encouragements: string[];
  privacy: "Public" | "Anonymous" | "Friends Only";
  isUserStory?: boolean;
  photos?: string[];
}

const INITIAL_STORIES: Story[] = [
  {
    id: "story-1",
    title: "Finding Our Rhythm: How Melodies Unlocked Aarav's Voice",
    author: "Priya (Mother of Aarav)",
    age: "5 Years Old",
    country: "India",
    readTime: "4 min read",
    category: "🌟 First Words",
    excerpt: "For four years, we lived in a quiet house. Then, a simple toy keyboard and a repetitive humming game changed everything for our sweet boy.",
    coverStyle: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
    content: {
      challenges: "Aarav struggled deeply with expressive speech. He would become highly frustrated when he couldn't express simple needs, often leading to sensory overloads. Communication was limited to leading us by the hand or crying in distress. We felt completely isolated, wondering if we would ever hear his beautiful voice.",
      whatHelped: "We discovered his love for structural sound patterns. His therapist suggested a co-regulation rhythm exercise. Instead of prompting him to 'say' words, we sang them. We used simple three-tone melodies on a small musical keyboard to represent daily routines: eating, walking outside, or sleeping.",
      turningPoint: "One evening, the humming game became collaborative. I played a C-major tone and hummed 'wa-ter'. Aarav, who had never vocalized intentionally in this way, crawled over, pressed the exact key, and matched the tone perfectly, saying 'ah-ter' with an bright, shining smile. It was the first time sound had a communicative spark for him.",
      advice: "Never underestimate the power of alternative channels. If spoken words feel like a mountain, try song, rhythm, or physical cues. Meet them in their comfort zone—Aarav's was sound, and music became the bridge that we walked together."
    },
    likes: 42,
    encouragements: ["Your story gives hope", "Thank you for sharing"],
    privacy: "Public"
  },
  {
    id: "story-2",
    title: "The Safe Harbor: Navigating the Kindergarten Playground",
    author: "Sarah (Mother of Leo)",
    age: "6 Years Old",
    country: "Canada",
    readTime: "5 min read",
    category: "🏫 School Journey",
    excerpt: "Recess used to be an overwhelming storm of noise and movement. Creating a structured sensory recess map gave Leo the confidence to explore.",
    coverStyle: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
    content: {
      challenges: "School recess was a chaotic, unpredictable sensory nightmare for Leo. The screaming, running children, and sudden movements would trigger immediate flight responses. He would hide beneath the wooden stairs, shivering and plugging his ears, completely exhausted by the time class resumed.",
      whatHelped: "Together with his occupational therapist, we designed a simple, illustrated pocket map of the school playground. We designated three visual zones: 'The Active Zone' (swings/slides), 'The Observation Zone' (benches under the shade), and 'The Safe Harbor' (a quiet, grassy alcove behind the library wall with smooth stones).",
      turningPoint: "We practiced using the map during weekend quiet hours when the school was empty, so he knew exactly where to go. On Tuesday of the second week, Leo's teacher sent a picture of him sitting calmly in the Safe Harbor, holding a smooth river stone, watching two children play nearby. He was regulated, comfortable, and present.",
      advice: "Structure is a powerful shield against anxiety. By mapping out the chaos of the world into visual choices, we give our children agency. Leo didn't have to flee the playground because he knew he had a pocket map and a designated harbor waiting for him."
    },
    likes: 58,
    encouragements: ["Congratulations", "Thinking of you"],
    privacy: "Public"
  },
  {
    id: "story-3",
    title: "Unlocking Connection Through AAC and Quiet Walks",
    author: "David (Father of Zoe)",
    age: "8 Years Old",
    country: "United Kingdom",
    readTime: "6 min read",
    category: "🗣 Communication",
    excerpt: "When we stopped fighting the silence and introduced a high-contrast visual speech board, Zoe started sharing her wonderful world.",
    coverStyle: "linear-gradient(135deg, #FDF4FF 0%, #F3E8FF 100%)",
    content: {
      challenges: "Zoe is minimally verbal, and for years we tried traditional speech therapy that focused heavily on physical vocal production. The pressure to speak created immense performance anxiety, causing her to withdraw from conversations entirely, retreating into her iPad or repetitive toy stacking.",
      whatHelped: "We pivoted entirely. We took off the pressure to speak vocally and introduced a tablet with high-contrast, beautiful visual symbols (AAC). Simultaneously, we established 'Quiet Trail Walks' in a nearby pine forest where there was no pressure to perform—just silent companionship and the AAC device in hand.",
      turningPoint: "On a rainy Sunday stroll, we saw a glistening spiderweb filled with water drops. Zoe stopped, stared intensely for a full minute, tapped her device button for 'GLITTERING', then 'CASTLE'. She looked at me, took my hand, and let out a deep, relaxed breath. She had shared her imagination with me for the very first time.",
      advice: "Speech is not the same as communication. A child who cannot speak still has a mind full of poetry, ideas, and observations. Remove the demand for vocal compliance, provide visual tools, and you will be amazed by the beautiful things they choose to tell you."
    },
    likes: 81,
    encouragements: ["Your story gives hope", "🌟 Thank you for sharing"],
    privacy: "Public"
  },
  {
    id: "story-4",
    title: "Our Transition Success: The Joy of Daily Small Steps",
    author: "Mateo (Father of Lucas)",
    age: "7 Years Old",
    country: "Spain",
    readTime: "3 min read",
    category: "✨ Everyday Wins",
    excerpt: "Switching from school clothes to pajamas used to trigger major sensory distress. Here's how a custom sensory fabric test resolved our evenings.",
    coverStyle: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
    content: {
      challenges: "Every evening at 7:00 PM was a battlefield. The tactile sensation of removing school uniform fabric and putting on loose cotton pajamas would cause Lucas to cry, scream, and scratch his arms in frustration. The sensory transition from structured, tight clothes to light fabrics felt highly unstable to him.",
      whatHelped: "We created a 'Fabric Playground' board. We pasted swatches of 10 different textures (fleece, silk, flannel, heavy bamboo, cotton, velvet) on a board and let Lucas touch them when he was calm and playful. He consistently gravitated towards heavy, weighted bamboo and tight flannel rather than loose, light cotton.",
      turningPoint: "We replaced his pajamas with snug-fitting, sensory-friendly weighted flannel garments. The very first evening he wore them, he didn't cry. He looked at himself in the mirror, patted his arms to feel the tight pressure, and lay down on the bed peacefully. Our evening transition routine went from 90 stressful minutes to 5 calm ones.",
      advice: "Transitions aren't just mental; they are deeply tactile. What looks like 'defiance' or 'tantrums' is often a neurological distress signal from the skin. Let your child select their tactile environment during quiet, non-stressful hours."
    },
    likes: 31,
    encouragements: ["Your story gives hope", "👏 Congratulations"],
    privacy: "Public"
  }
];

const CATEGORIES = [
  { id: "all", label: "✨ All Stories", icon: Compass },
  { id: "first-words", label: "🌟 First Words", icon: Sparkles },
  { id: "school", label: "🏫 School Journey", icon: Award },
  { id: "communication", label: "🗣 Communication", icon: BookOpen },
  { id: "social", label: "😊 Social Skills", icon: Smile },
  { id: "parent-exp", label: "💙 Parent Experiences", icon: User },
  { id: "reading", label: "📖 Reading Journey", icon: BookOpen },
  { id: "milestones", label: "🏆 Milestones", icon: Award },
  { id: "wins", label: "✨ Everyday Wins", icon: Sparkles }
];

const INSPIRATIONAL_QUOTES = [
  {
    text: "Neurodiversity is not a word of deficit. It is a word of beautiful human variation, honoring the diverse paths our minds walk.",
    author: "Care Team Inspiration"
  },
  {
    text: "When a flower doesn't bloom, you change the environment in which it grows, not the flower itself.",
    author: "Alexander Den Heijer"
  },
  {
    text: "Patience is not the ability to wait, but the ability to maintain a calm, hopeful perspective while taking small steps together.",
    author: "AutisticPath Community"
  }
];

interface ShareYourPathProps {
  theme: "light" | "dark";
  lang: "en" | "es" | "sp" | "hi";
  logEvent: (type: "info" | "success" | "warning", message: string) => void;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  onStartTherapyAdventure?: () => void; // Callback to navigate or open therapy tab
}

export function ShareYourPath({
  theme,
  lang,
  logEvent,
  setNotifications,
  onStartTherapyAdventure
}: ShareYourPathProps) {
  // Navigation & States
  const [stories, setStories] = useState<Story[]>(() => {
    const cached = localStorage.getItem("autisticpath_shared_stories");
    return cached ? JSON.parse(cached) : INITIAL_STORIES;
  });

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [moreTopicsOpen, setMoreTopicsOpen] = useState(false);
  
  // Wizard States
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  
  // New Story Form Fields
  const [nickname, setNickname] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [storyLang, setStoryLang] = useState("English");
  const [diagnosis, setDiagnosis] = useState("");
  const [privacy, setPrivacy] = useState<"Public" | "Anonymous" | "Friends Only">("Public");
  const [chosenType, setChosenType] = useState("First Words");
  
  // Guided Questions
  const [qChallenge, setQChallenge] = useState("");
  const [qWhatHelped, setQWhatHelped] = useState("");
  const [qTurningPoint, setQTurningPoint] = useState("");
  const [qFeel, setQFeel] = useState("");
  const [qAdvice, setQAdvice] = useState("");
  
  // Preset Cover and Photo selections for mockup
  const [selectedCoverIndex, setSelectedCoverIndex] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
    "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
    "linear-gradient(135deg, #FDF4FF 0%, #F3E8FF 100%)"
  ]);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState(0);

  // Quote rotation
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Sync back to localstorage whenever stories modify
  useEffect(() => {
    localStorage.setItem("autisticpath_shared_stories", JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    // Softly rotate the inspiration quote
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const handleLike = (storyId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          const liked = !s.likedByUser;
          logEvent(liked ? "success" : "info", `Story interaction: ${liked ? "Liked" : "Unliked"} "${s.title}"`);
          return {
            ...s,
            likedByUser: liked,
            likes: liked ? s.likes + 1 : s.likes - 1
          };
        }
        return s;
      })
    );
  };

  const handleBookmark = (storyId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          const bookmarked = !s.bookmarkedByUser;
          logEvent("success", `Story interaction: ${bookmarked ? "Bookmarked" : "Removed bookmark from"} "${s.title}"`);
          return {
            ...s,
            bookmarkedByUser: bookmarked
          };
        }
        return s;
      })
    );
  };

  const handleSendEncouragement = (storyId: string, text: string) => {
    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          logEvent("success", `Sent encouragement phrase to "${s.title}": "${text}"`);
          
          // Trigger a beautiful notification
          setNotifications((prevNotif) => [
            {
              id: Math.random().toString(),
              text: `💙 Thank you! Your encouragement was sent to ${s.author.split(" ")[0]}.`,
              time: "Just now",
              read: false
            },
            ...prevNotif
          ]);

          return {
            ...s,
            encouragements: s.encouragements.includes(text) 
              ? s.encouragements 
              : [...s.encouragements, text]
          };
        }
        return s;
      })
    );
  };

  const handleSubmitStory = () => {
    // Synthesize fields into a beautiful user story
    const title = qChallenge.length > 20 
      ? `Our Path: Overcoming ${qChallenge.substring(0, 30)}...`
      : `My Child's ${chosenType} Journey`;

    const wordCount = (qChallenge + qWhatHelped + qTurningPoint + qAdvice).split(/\s+/).length;
    const readMinutes = Math.max(1, Math.round(wordCount / 180));

    const newStory: Story = {
      id: `user-story-${Date.now()}`,
      title: title || "A Hopeful Milestone Story",
      author: privacy === "Anonymous" ? "Anonymous Parent" : `${nickname || "A Proud Caretaker"} (${country || "Global"})`,
      age: age ? `${age} Years Old` : "Child",
      country: country || "Global",
      readTime: `${readMinutes} min read`,
      category: `🌟 ${chosenType}`,
      excerpt: qChallenge.substring(0, 120) + (qChallenge.length > 120 ? "..." : ""),
      coverStyle: PRESET_COVERS[selectedCoverIndex],
      content: {
        challenges: qChallenge || "We faced sensory and transition hurdles.",
        whatHelped: qWhatHelped || "We adapted his routine and focused on co-regulation.",
        turningPoint: qTurningPoint || "He showed sudden connection during a relaxed interactive play.",
        advice: qAdvice || "Be patient, listen to their signs, and celebrate every win."
      },
      likes: 1,
      encouragements: [],
      privacy,
      isUserStory: true
    };

    setStories((prev) => [newStory, ...prev]);
    logEvent("success", `New story submitted! "${newStory.title}" is queued for review.`);
    setWizardStep(6);

    setNotifications((prev) => [
      {
        id: Math.random().toString(),
        text: `✨ Your story "${newStory.title}" has been securely logged and is pending review!`,
        time: "Just now",
        read: false
      },
      ...prev
    ]);
  };

  const filteredStories = stories.filter((s) => {
    if (activeCategory === "all") return true;
    const cat = CATEGORIES.find((c) => c.id === activeCategory);
    if (!cat) return true;
    // Strip emojis for matching
    const cleanLabel = cat.label.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim().toLowerCase();
    const cleanStoryCat = s.category.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim().toLowerCase();
    return cleanStoryCat.includes(cleanLabel) || cleanLabel.includes(cleanStoryCat);
  });

  const activeQuote = INSPIRATIONAL_QUOTES[quoteIndex];

  // Helper styles based on theme
  const cardBg = theme === "light" ? "bg-white border-gray-100" : "bg-[#1E293B] border-gray-800";
  const textPrimary = theme === "light" ? "text-gray-900" : "text-[#ECF0F1]";
  const textSecondary = theme === "light" ? "text-gray-500" : "text-[#94A3B8]";
  const borderClass = theme === "light" ? "border-gray-150" : "border-gray-800";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-12 select-none">
      
      {/* ------------------------- A. STORY DETAIL VIEW ------------------------- */}
      {selectedStory ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="space-y-10"
        >
          {/* Back Navigation Bar */}
          <button
            onClick={() => {
              setSelectedStory(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex items-center gap-2.5 text-xs font-bold transition-all py-2 px-4 rounded-full cursor-pointer ${
              theme === "light" ? "bg-white hover:bg-gray-50 text-gray-700 shadow-premium-sm" : "bg-gray-900 text-gray-300 hover:bg-gray-800"
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Stories Journey
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Story Content Column (Left, 2/3) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Massive Story Header & Card */}
              <div className={`rounded-premium-lg border ${cardBg} overflow-hidden shadow-premium-lg`}>
                
                {/* Cover Hero with calm gradient & stylized family trail vector */}
                <div
                  className="h-72 w-full relative flex items-end p-8"
                  style={{ background: selectedStory.coverStyle }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Absolute path decoration */}
                  <svg className="absolute bottom-0 right-0 w-1/2 h-full text-white/10 dark:text-teal-400/5 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,100 Q40,50 100,80 L100,100 Z" fill="currentColor" />
                  </svg>

                  <span className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                    theme === "light" ? "bg-white/80 text-brand-primary" : "bg-gray-900/80 text-teal-400"
                  }`}>
                    {selectedStory.category}
                  </span>
                </div>

                {/* Meta details */}
                <div className="p-8 space-y-6">
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-blue-500" />
                      {selectedStory.author}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                      {selectedStory.country}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      {selectedStory.readTime}
                    </span>
                  </div>

                  <h1 className={`text-3xl lg:text-4xl font-extrabold font-display tracking-tight leading-tight ${textPrimary}`}>
                    {selectedStory.title}
                  </h1>

                  {/* Emotional segments layout - structured healthcare quality */}
                  <div className="space-y-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                    
                    {/* Part 1: Challenges */}
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-extrabold text-blue-600 dark:text-teal-400 uppercase tracking-widest font-display">
                        The Challenges We Faced
                      </h3>
                      <p className={`text-sm leading-relaxed font-medium ${textSecondary}`}>
                        {selectedStory.content.challenges}
                      </p>
                    </div>

                    {/* Part 2: What Helped */}
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-extrabold text-emerald-600 dark:text-teal-400 uppercase tracking-widest font-display">
                        What Helped Us Through
                      </h3>
                      <p className={`text-sm leading-relaxed font-medium ${textSecondary}`}>
                        {selectedStory.content.whatHelped}
                      </p>
                    </div>

                    {/* Part 3: The Turning Point */}
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-extrabold text-indigo-600 dark:text-purple-400 uppercase tracking-widest font-display">
                        The Turning Point
                      </h3>
                      <p className={`text-sm leading-relaxed font-medium ${textSecondary}`}>
                        {selectedStory.content.turningPoint}
                      </p>
                    </div>

                    {/* Part 4: Advice for Parents */}
                    <div className="p-6 rounded-premium bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 space-y-2">
                      <h3 className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest font-display flex items-center gap-1.5">
                        <Award className="h-4 w-4" />
                        Our Advice For Families
                      </h3>
                      <p className={`text-sm leading-relaxed italic font-medium ${textPrimary}`}>
                        &ldquo;{selectedStory.content.advice}&rdquo;
                      </p>
                    </div>

                  </div>

                </div>

                {/* Quick Interactive Actions */}
                <div className={`p-6 border-t ${borderClass} flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    
                    <button
                      onClick={() => handleLike(selectedStory.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold py-2 px-3.5 rounded-full cursor-pointer transition-all ${
                        selectedStory.likedByUser
                          ? "bg-rose-50 dark:bg-rose-950/20 text-rose-500 scale-105"
                          : "text-gray-400 hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/10"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${selectedStory.likedByUser ? "fill-current" : ""}`} />
                      <span>{selectedStory.likedByUser ? "Liked Story" : "Appreciate"}</span>
                    </button>

                    <button
                      onClick={() => handleBookmark(selectedStory.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold py-2 px-3.5 rounded-full cursor-pointer transition-all ${
                        selectedStory.bookmarkedByUser
                          ? "bg-blue-50 dark:bg-blue-950/20 text-blue-500 scale-105"
                          : "text-gray-400 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/10"
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${selectedStory.bookmarkedByUser ? "fill-current" : ""}`} />
                      <span>{selectedStory.bookmarkedByUser ? "Saved to Profile" : "Bookmark"}</span>
                    </button>

                  </div>

                  <span className="text-[10px] text-gray-400 font-mono font-bold tracking-widest uppercase flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    Review Verified
                  </span>
                </div>

              </div>

              {/* Predefined Quiet Encouragement Section */}
              <div className={`p-8 rounded-premium-lg border ${cardBg} shadow-premium-md space-y-6`}>
                <div className="space-y-1">
                  <h3 className={`text-lg font-bold font-display ${textPrimary}`}>
                    💙 Send Encouragement
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold">
                    Support this family in their journey. Pre-written messages protect privacy and remove public comments.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    "❤️ Thinking of you",
                    "🌟 Thank you for sharing",
                    "👏 Congratulations",
                    "💙 Your story gives hope"
                  ].map((phrase) => {
                    const isSelected = selectedStory.encouragements.includes(phrase);
                    return (
                      <button
                        key={phrase}
                        onClick={() => handleSendEncouragement(selectedStory.id, phrase)}
                        className={`py-3.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 text-blue-600 dark:text-blue-400 shadow-premium-sm scale-105"
                            : "bg-white dark:bg-gray-900/40 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-blue-200 hover:bg-blue-50/20 dark:hover:bg-blue-950/10"
                        }`}
                      >
                        <span>{phrase}</span>
                        {isSelected ? (
                          <Check className="h-4 w-4 stroke-[3px]" />
                        ) : (
                          <Send className="h-3.5 w-3.5 text-gray-300" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedStory.encouragements.length > 0 && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                    <span className="text-[9px] font-bold font-mono tracking-wider uppercase text-gray-400">
                      Care Community Encouragement Sent:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedStory.encouragements.map((enc, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30"
                        >
                          {enc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Sidebar Column (Right, 1/3) */}
            <div className="space-y-8">
              
              {/* Inspiration Widget */}
              <div className={`p-8 rounded-premium-lg border ${cardBg} shadow-premium-md relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-emerald-500/5`}>
                <Quote className="absolute top-4 right-4 h-12 w-12 text-blue-500/10 pointer-events-none" />
                <div className="space-y-4">
                  <span className="text-[10px] font-extrabold font-mono text-[#00828A] uppercase tracking-widest block">
                    ✨ TODAY'S INSPIRATION
                  </span>
                  <p className={`text-sm leading-relaxed italic font-medium ${textPrimary}`}>
                    &ldquo;{activeQuote.text}&rdquo;
                  </p>
                  <span className="text-[11px] font-bold text-gray-400 block">
                    &mdash; {activeQuote.author}
                  </span>
                </div>
              </div>

              {/* Try this at home - Related Therapy Adventure */}
              <div className={`p-8 rounded-premium-lg border ${cardBg} shadow-premium-md space-y-6`}>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                    RECOMMENDED THERAPY ACTIVITY
                  </span>
                  <h3 className={`text-base font-extrabold font-display ${textPrimary}`}>
                    The Whispering Woods Journey
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                    Co-regulate sensory auditives and practice 4-7-8 breathing shoreline pacing. Sourced from Seattle Children's Clinic.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (onStartTherapyAdventure) {
                      onStartTherapyAdventure();
                    } else {
                      logEvent("success", "Navigated to Therapy Adventure: Whispering Woods.");
                    }
                  }}
                  className={`w-full py-3.5 px-4 rounded-premium text-xs font-bold font-display uppercase tracking-wider cursor-pointer shadow-premium-sm transition-all text-center ${
                    theme === "light"
                      ? "bg-brand-primary hover:bg-brand-primary-hover text-white"
                      : "bg-teal-500 hover:bg-teal-600 text-gray-900"
                  }`}
                >
                  🚀 Start Therapy Adventure
                </button>
              </div>

              {/* Moderation Community Guidelines */}
              <div className={`p-8 rounded-premium-lg border ${cardBg} shadow-premium-md space-y-4`}>
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                  <Info className="h-4.5 w-4.5 text-[#00828A]" />
                  <h3 className={`text-xs font-bold font-display uppercase tracking-wider ${textPrimary}`}>
                    Community Guidelines
                  </h3>
                </div>
                <ul className="space-y-3 text-xs font-medium text-gray-400 list-none pl-0">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>All stories undergo professional pediatric screening and moderation before publishing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Personal logs and parent experiences do not constitute formal clinical or medical advice.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Respect every family's timeline, developmental pacing, and absolute child privacy.</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* Related Stories list */}
          <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <h2 className={`text-xl font-bold font-display tracking-tight ${textPrimary}`}>
              Related Family Journeys
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stories
                .filter((s) => s.id !== selectedStory.id)
                .slice(0, 3)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedStory(item);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`group rounded-premium border ${cardBg} overflow-hidden shadow-premium-sm hover:shadow-premium-md cursor-pointer transition-all duration-300 flex flex-col justify-between h-[400px]`}
                  >
                    <div>
                      <div
                        className="h-40 w-full relative"
                        style={{ background: item.coverStyle }}
                      >
                        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md ${
                          theme === "light" ? "bg-white/80 text-brand-primary" : "bg-gray-900/80 text-teal-400"
                        }`}>
                          {item.category}
                        </span>
                      </div>
                      
                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-400">
                          <span>{item.author.split(" ")[0]}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-200" />
                          <span>{item.age}</span>
                        </div>
                        <h3 className={`text-sm font-bold font-display leading-snug tracking-tight line-clamp-2 ${textPrimary}`}>
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-semibold">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className={`p-5 pt-0 border-t ${borderClass} flex items-center justify-between`}>
                      <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                        Read Story &rarr;
                      </span>
                      <span className="text-[10px] font-mono text-gray-300 font-bold">{item.readTime}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </motion.div>
      ) : (
        // ------------------------- B. MAIN STORIES JOURNEY PAGE -------------------------
        <div className="space-y-12">
          
          {/* Top Hero Section */}
          <div className={`p-8 lg:p-12 rounded-premium-lg border ${cardBg} shadow-premium-lg flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden relative bg-gradient-to-br from-blue-500/5 to-emerald-500/5`}>
            
            {/* Absolute decorative artwork elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />

            <div className="space-y-6 max-w-xl text-center lg:text-left relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-blue-600 dark:text-teal-400 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30">
                <Compass className="h-4 w-4 animate-spin-slow" />
                Premium Journey Platform
              </span>
              
              <div className="space-y-2">
                <h1 className={`text-4xl lg:text-5xl font-extrabold font-display tracking-tight leading-tight ${textPrimary}`}>
                  💙 Share Your Path
                </h1>
                <p className={`text-base font-semibold leading-relaxed ${textSecondary}`}>
                  Every family has a unique journey. Your story could give another parent hope, a moment of comfort, or a therapeutic spark.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setIsWizardOpen(true);
                    setWizardStep(1);
                    logEvent("info", "Opened 'Share Your Story' wizard steps.");
                  }}
                  className={`w-full sm:w-auto py-3.5 px-8 rounded-premium text-xs font-bold font-display uppercase tracking-wider cursor-pointer shadow-premium-md transition-all ${
                    theme === "light"
                      ? "bg-brand-primary hover:bg-brand-primary-hover text-white hover:scale-[1.02]"
                      : "bg-teal-500 hover:bg-teal-600 text-gray-900 hover:scale-[1.02]"
                  }`}
                >
                  ✨ Share Your Story
                </button>
              </div>
            </div>

            {/* Interactive illustration path walk */}
            <div className="relative w-full max-w-sm lg:w-96 h-64 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 rounded-premium-lg border border-gray-100 dark:border-gray-800" />
              
              {/* Illustrated landscape trail in high quality */}
              <svg className="w-full h-full text-blue-500/20 dark:text-teal-400/10" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Rolling hills */}
                <path d="M0,80 Q20,60 50,75 T100,65 L100,100 L0,100 Z" fill="currentColor" opacity="0.3" />
                <path d="M0,90 Q40,75 80,88 T100,80 L100,100 L0,100 Z" fill="currentColor" opacity="0.5" />
                
                {/* Winding trail path */}
                <path d="M50,100 C30,85 70,65 50,45" stroke={theme === "light" ? "#2563EB" : "#2DD4BF"} strokeWidth="3" fill="none" strokeDasharray="3,3" opacity="0.8" />
                
                {/* Illustrated family circles */}
                <circle cx="50" cy="45" r="4" fill={theme === "light" ? "#2563EB" : "#2DD4BF"} />
                <circle cx="45" cy="48" r="3" fill={theme === "light" ? "#10B981" : "#34D399"} />
                <circle cx="55" cy="49" r="2.5" fill={theme === "light" ? "#2563EB" : "#2DD4BF"} />
              </svg>

              <div className="absolute bottom-6 text-center space-y-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider font-display block ${textPrimary}`}>
                  Interactive Family Trail
                </span>
                <span className="text-[9px] text-gray-400 font-semibold block">
                  340+ shared medical-checked stories
                </span>
              </div>
            </div>

          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className={`text-xs font-extrabold font-mono text-[#00828A] dark:text-teal-400 uppercase tracking-widest block`}>
                  STORY CATEGORIES
                </h3>
                <p className="text-xs text-gray-400 font-semibold">
                  Filter by therapeutic milestones or family triumphs
                </p>
              </div>

              {/* Toggle secondary topics */}
              <button
                onClick={() => setMoreTopicsOpen(!moreTopicsOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  moreTopicsOpen || !["all", "first-words", "school", "wins"].includes(activeCategory)
                    ? theme === "light"
                      ? "bg-brand-primary-soft text-brand-primary border-transparent"
                      : "bg-teal-500/10 text-teal-400 border-transparent"
                    : theme === "light"
                      ? "bg-white border-gray-150 text-gray-600 hover:bg-gray-50"
                      : "bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800"
                }`}
              >
                <span>More Topics</span>
                <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-200 ${moreTopicsOpen || !["all", "first-words", "school", "wins"].includes(activeCategory) ? "rotate-90" : ""}`} />
              </button>
            </div>

            {/* Minimalist Segmented Control for Core Categories */}
            <div className={`p-1.5 rounded-3xl border ${borderClass} ${
              theme === "light" ? "bg-gray-100/60" : "bg-gray-900/60"
            } flex flex-col md:flex-row gap-1.5`}>
              <div className="flex-1 grid grid-cols-2 md:flex md:flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: "All Stories", icon: Compass },
                  { id: "first-words", label: "First Words", icon: Sparkles },
                  { id: "school", label: "School Journey", icon: Award },
                  { id: "wins", label: "Everyday Wins", icon: Sparkles }
                ].map((item) => {
                  const isActive = activeCategory === item.id;
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveCategory(item.id);
                        logEvent("info", `Filtered stories by: ${item.label}`);
                      }}
                      className={`relative flex items-center justify-center md:justify-start gap-2.5 py-3 px-5 rounded-2xl text-xs font-bold transition-all duration-300 select-none cursor-pointer flex-1 md:flex-initial min-h-[48px] ${
                        isActive
                          ? theme === "light"
                            ? "bg-white text-brand-primary shadow-premium-sm font-extrabold"
                            : "bg-gray-800 text-teal-400 shadow-premium-md font-extrabold"
                          : theme === "light"
                            ? "text-gray-500 hover:text-gray-800 hover:bg-white/40"
                            : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeCategoryPill"
                          className={`absolute inset-0 rounded-2xl ${
                            theme === "light" ? "bg-white shadow-premium-sm" : "bg-white/10"
                          }`}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          style={{ zIndex: 0 }}
                        />
                      )}
                      <IconComponent className={`h-4 w-4 relative z-10 ${
                        isActive 
                          ? theme === "light" ? "text-brand-primary" : "text-teal-400"
                          : "text-gray-400"
                      }`} />
                      <span className="relative z-10">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Collapsible/Expandable Tray for Secondary Categories */}
            <AnimatePresence>
              {(moreTopicsOpen || !["all", "first-words", "school", "wins"].includes(activeCategory)) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden animate-none"
                >
                  <div className={`p-5 rounded-2xl border ${borderClass} ${
                    theme === "light" ? "bg-gray-50/50" : "bg-gray-900/40"
                  } grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-2`}>
                    {[
                      { id: "communication", label: "Communication", icon: BookOpen },
                      { id: "social", label: "Social Skills", icon: Smile },
                      { id: "parent-exp", label: "Parent Exp", icon: User },
                      { id: "reading", label: "Reading Journey", icon: BookOpen },
                      { id: "milestones", label: "Milestones", icon: Award }
                    ].map((item) => {
                      const isActive = activeCategory === item.id;
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveCategory(item.id);
                            logEvent("info", `Filtered stories by: ${item.label}`);
                          }}
                          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                            isActive
                              ? theme === "light"
                                ? "bg-brand-primary text-white shadow-premium-sm scale-102"
                                : "bg-teal-500 text-gray-900 shadow-premium-sm scale-102"
                              : theme === "light"
                                ? "bg-white border border-gray-150 text-gray-600 hover:bg-gray-50"
                                : "bg-gray-800/80 border border-gray-700 text-gray-300 hover:bg-gray-800"
                          }`}
                        >
                          <IconComponent className="h-3.5 w-3.5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Story Cards List Layout - Clean, whitespace-focused, non-cluttered */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredStories.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-16 text-center space-y-3"
                >
                  <p className="text-sm font-semibold text-gray-400">
                    No verified family stories in this category yet.
                  </p>
                  <button
                    onClick={() => {
                      setIsWizardOpen(true);
                      setWizardStep(1);
                    }}
                    className="text-xs font-bold text-blue-500 hover:underline cursor-pointer uppercase tracking-wider"
                  >
                    Be the first to share &rarr;
                  </button>
                </motion.div>
              ) : (
                filteredStories.map((story) => (
                  <motion.div
                    layout
                    key={story.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      setSelectedStory(story);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`group rounded-premium-lg border ${cardBg} overflow-hidden shadow-premium-sm hover:shadow-premium-lg cursor-pointer transition-all duration-300 flex flex-col justify-between h-[480px]`}
                  >
                    <div>
                      {/* Stylized premium cover background */}
                      <div
                        className="h-44 w-full relative flex items-end p-6"
                        style={{ background: story.coverStyle }}
                      >
                        <span className={`absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md ${
                          theme === "light" ? "bg-white/80 text-brand-primary" : "bg-gray-900/80 text-teal-400"
                        }`}>
                          {story.category}
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="p-6 space-y-3.5">
                        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5 text-blue-500/80" />
                            {story.author.split(" ")[0]}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-gray-200" />
                          <span>{story.age}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-200" />
                          <span>{story.country}</span>
                        </div>

                        <h2 className={`text-xl font-extrabold font-display leading-snug tracking-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors ${textPrimary}`}>
                          {story.title}
                        </h2>

                        <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed font-semibold">
                          {story.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Footer Actions */}
                    <div className={`p-6 pt-0 border-t ${borderClass} flex items-center justify-between`}>
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-wider group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                        Read Full Story &rarr;
                      </span>

                      {/* Quiet Micro Interactions */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleLike(story.id, e)}
                          className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                            story.likedByUser
                              ? "text-rose-500 bg-rose-50 dark:bg-rose-950/20"
                              : "text-gray-300 hover:text-rose-500 hover:bg-rose-50/20"
                          }`}
                          title="Like Journey"
                        >
                          <Heart className={`h-4.5 w-4.5 ${story.likedByUser ? "fill-current" : ""}`} />
                        </button>

                        <button
                          onClick={(e) => handleBookmark(story.id, e)}
                          className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                            story.bookmarkedByUser
                              ? "text-blue-500 bg-blue-50 dark:bg-blue-950/20"
                              : "text-gray-300 hover:text-blue-500 hover:bg-blue-50/20"
                          }`}
                          title="Save Bookmark"
                        >
                          <Bookmark className={`h-4.5 w-4.5 ${story.bookmarkedByUser ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

        </div>
      )}

      {/* ------------------------- C. MULTI-STEP STORY WIZARD MODAL ------------------------- */}
      <AnimatePresence>
        {isWizardOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className={`w-full max-w-2xl rounded-premium-lg border ${cardBg} shadow-premium-lg overflow-hidden flex flex-col justify-between max-h-[90vh]`}
            >
              
              {/* Header */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-extrabold font-mono text-[#00828A] dark:text-teal-400 uppercase tracking-widest block">
                    STEP {wizardStep} OF 6
                  </span>
                  <h2 className={`text-lg font-bold font-display ${textPrimary}`}>
                    Share Your Path Journey
                  </h2>
                </div>
                <button
                  onClick={() => setIsWizardOpen(false)}
                  className={`h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                    theme === "light" ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                
                {/* STEP 1: ABOUT YOUR STORY */}
                {wizardStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-premium bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/40 text-xs text-gray-500 leading-relaxed font-semibold">
                      🔒 This form is HIPAA compliant and fully confidential. Tell us about your story setup.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase">Child Nickname (Optional)</label>
                        <input
                          type="text"
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          placeholder="e.g. Leo, Liam"
                          className={`w-full p-3 rounded-premium border text-xs font-medium bg-transparent focus:outline-none focus:border-blue-500 ${borderClass} ${textPrimary}`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase">Country</label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="e.g. United States, Spain"
                          className={`w-full p-3 rounded-premium border text-xs font-medium bg-transparent focus:outline-none focus:border-blue-500 ${borderClass} ${textPrimary}`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase">Child Age during story</label>
                        <input
                          type="text"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="e.g. 5, 7"
                          className={`w-full p-3 rounded-premium border text-xs font-medium bg-transparent focus:outline-none focus:border-blue-500 ${borderClass} ${textPrimary}`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase">Language</label>
                        <select
                          value={storyLang}
                          onChange={(e) => setStoryLang(e.target.value)}
                          className={`w-full p-3 rounded-premium border text-xs font-medium bg-transparent focus:outline-none focus:border-blue-500 ${borderClass} ${textPrimary}`}
                        >
                          <option value="English">English (EN)</option>
                          <option value="Español">Español (ES)</option>
                          <option value="Hindi">हिन्दी (HI)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Diagnosis / Developmental Note (Optional)</label>
                        <input
                          type="text"
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          placeholder="e.g. Autistic (Level 1), Sensory Processing Sensitivity"
                          className={`w-full p-3 rounded-premium border text-xs font-medium bg-transparent focus:outline-none focus:border-blue-500 ${borderClass} ${textPrimary}`}
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2 pt-2">
                        <label className="text-xs font-bold text-gray-400 uppercase block">Privacy Level</label>
                        <div className="grid grid-cols-3 gap-2.5">
                          {[
                            { id: "Public", icon: Globe, desc: "Public View" },
                            { id: "Anonymous", icon: EyeOff, desc: "No Name" },
                            { id: "Friends Only", icon: Lock, desc: "Encrypted" }
                          ].map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setPrivacy(p.id as any)}
                              className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                privacy === p.id
                                  ? "bg-blue-50 dark:bg-blue-950/20 border-blue-500 text-blue-600 dark:text-blue-400"
                                  : "bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40 text-gray-400"
                              }`}
                            >
                              <p.icon className="h-4 w-4" />
                              <span>{p.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* STEP 2: CHOOSE STORY TYPE */}
                {wizardStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <label className="text-xs font-extrabold text-gray-400 uppercase block">
                      Select developmental focus category
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        "First Words",
                        "School",
                        "Communication",
                        "Reading",
                        "Friendship",
                        "Daily Living",
                        "Sensory",
                        "Milestone",
                        "Other"
                      ].map((type) => {
                        const isSelected = chosenType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setChosenType(type)}
                            className={`py-4 px-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-blue-50 dark:bg-blue-950/20 border-blue-500 text-blue-600 dark:text-blue-400 scale-102 shadow-premium-sm"
                                : "bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/40 text-gray-500"
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: TELL YOUR STORY (GUIDED QUESTIONS) */}
                {wizardStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-5"
                  >
                    <div className="p-3.5 rounded-premium bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 text-xs text-gray-500 leading-relaxed font-semibold">
                      💡 Guided questions help organize your insights clearly without any writer's block.
                    </div>

                    <div className="space-y-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-blue-600 dark:text-teal-400 uppercase tracking-wider block">
                          1. What challenge were you facing?
                        </label>
                        <textarea
                          rows={3}
                          value={qChallenge}
                          onChange={(e) => setQChallenge(e.target.value)}
                          placeholder="e.g. Leo felt completely overwhelmed by the recess chaos..."
                          className={`w-full p-3.5 rounded-premium border text-xs font-medium bg-transparent focus:outline-none focus:border-blue-500 leading-relaxed resize-none ${borderClass} ${textPrimary}`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-emerald-600 dark:text-teal-400 uppercase tracking-wider block">
                          2. What helped?
                        </label>
                        <textarea
                          rows={3}
                          value={qWhatHelped}
                          onChange={(e) => setQWhatHelped(e.target.value)}
                          placeholder="e.g. We created a small visual playground pocket map..."
                          className={`w-full p-3.5 rounded-premium border text-xs font-medium bg-transparent focus:outline-none focus:border-blue-500 leading-relaxed resize-none ${borderClass} ${textPrimary}`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-indigo-600 dark:text-purple-400 uppercase tracking-wider block">
                          3. What changed? (The Turning Point)
                        </label>
                        <textarea
                          rows={3}
                          value={qTurningPoint}
                          onChange={(e) => setQTurningPoint(e.target.value)}
                          placeholder="e.g. He sat calmly holding a smooth stone behind the library..."
                          className={`w-full p-3.5 rounded-premium border text-xs font-medium bg-transparent focus:outline-none focus:border-blue-500 leading-relaxed resize-none ${borderClass} ${textPrimary}`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                          4. How did you feel?
                        </label>
                        <textarea
                          rows={2}
                          value={qFeel}
                          onChange={(e) => setQFeel(e.target.value)}
                          placeholder="e.g. Exhausted but deeply hopeful..."
                          className={`w-full p-3.5 rounded-premium border text-xs font-medium bg-transparent focus:outline-none focus:border-blue-500 leading-relaxed resize-none ${borderClass} ${textPrimary}`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                          5. What advice would you give another family?
                        </label>
                        <textarea
                          rows={3}
                          value={qAdvice}
                          onChange={(e) => setQAdvice(e.target.value)}
                          placeholder="e.g. Break transitions down tactilely. Let your child select..."
                          className={`w-full p-3.5 rounded-premium border text-xs font-medium bg-transparent focus:outline-none focus:border-blue-500 leading-relaxed resize-none ${borderClass} ${textPrimary}`}
                        />
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* STEP 4: UPLOAD PHOTOS */}
                {wizardStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase block">
                        Story Cover Theme & Presets
                      </label>
                      <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                        To maintain sensory safety, select an elegant calm gradient cover to represent your child's journey trail.
                      </p>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                      {PRESET_COVERS.map((cov, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedCoverIndex(idx)}
                          className={`h-14 rounded-xl relative transition-all cursor-pointer ${
                            selectedCoverIndex === idx 
                              ? "ring-2 ring-blue-500 scale-105" 
                              : "opacity-80 hover:opacity-100"
                          }`}
                          style={{ background: cov }}
                        >
                          {selectedCoverIndex === idx && (
                            <span className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                              <Check className="h-4 w-4 text-white stroke-[3px]" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-bold text-gray-400 uppercase block">
                        Upload Optional Photos (Drag & Drop Mock)
                      </label>
                      
                      <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-premium p-8 text-center space-y-3 hover:border-blue-300 dark:hover:border-teal-500 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-300 mx-auto" />
                        <div className="space-y-1">
                          <p className={`text-xs font-bold ${textPrimary}`}>Drag & drop pediatric story photos here</p>
                          <p className="text-[10px] text-gray-400">Supported formats: JPG, PNG. Max 5 images.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1">
                        {uploadedPhotos.map((ph, idx) => (
                          <div
                            key={idx}
                            onClick={() => setCoverPhotoIndex(idx)}
                            className={`h-16 w-16 rounded-xl relative cursor-pointer flex-shrink-0 transition-all ${
                              coverPhotoIndex === idx 
                                ? "ring-2 ring-blue-500 scale-102 shadow-premium-sm" 
                                : "opacity-60 hover:opacity-100"
                            }`}
                            style={{ background: ph }}
                          >
                            <span className="absolute bottom-1 right-1 text-[8px] font-bold uppercase tracking-wider text-white px-1 rounded bg-black/30">
                              {coverPhotoIndex === idx ? "Cover" : `Img ${idx + 1}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: PREVIEW STORY */}
                {wizardStep === 5 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-5"
                  >
                    <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-premium border border-blue-100/30 text-[11px] text-gray-500 font-semibold leading-relaxed">
                      🔍 Story Preview: Review your layout before sending to the pediatric moderation portal.
                    </div>

                    <div className={`rounded-premium border ${borderClass} overflow-hidden bg-white dark:bg-gray-900`}>
                      <div
                        className="h-36 w-full relative p-6 flex items-end"
                        style={{ background: PRESET_COVERS[selectedCoverIndex] }}
                      >
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-white/90 text-brand-primary">
                          🌟 {chosenType}
                        </span>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                          <span>{privacy === "Anonymous" ? "Anonymous" : nickname || "Caretaker"}</span>
                          <span>•</span>
                          <span>{country || "Global"}</span>
                          <span>•</span>
                          <span>{age ? `${age} yrs` : "Child"}</span>
                        </div>

                        <h2 className={`text-lg font-extrabold font-display leading-tight ${textPrimary}`}>
                          {qChallenge.length > 20 
                            ? `Our Path: Overcoming ${qChallenge.substring(0, 30)}...`
                            : `My Child's ${chosenType} Journey`}
                        </h2>

                        <div className="space-y-3.5 pt-3 border-t border-gray-150 dark:border-gray-800 text-[11px] leading-relaxed text-gray-500">
                          <div>
                            <span className="font-extrabold text-blue-500 block">The Challenge:</span>
                            <p className="line-clamp-2">{qChallenge || "No description provided."}</p>
                          </div>
                          <div>
                            <span className="font-extrabold text-emerald-500 block">What Helped:</span>
                            <p className="line-clamp-2">{qWhatHelped || "No description provided."}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 6: SUBMIT (THANK YOU) */}
                {wizardStep === 6 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-10 text-center space-y-6 flex flex-col items-center"
                  >
                    <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-premium-md animate-bounce">
                      <Check className="h-8 w-8 stroke-[3px]" />
                    </div>

                    <div className="space-y-2 max-w-md">
                      <h2 className={`text-2xl font-extrabold font-display tracking-tight ${textPrimary}`}>
                        Thank you ❤️
                      </h2>
                      <p className={`text-xs ${textSecondary} leading-relaxed font-semibold`}>
                        Your story has been logged and sent to the clinical panel. It will be reviewed before publishing to inspire other families.
                      </p>
                    </div>

                    <div className="p-4 rounded-premium bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 font-medium">
                      HIPAA Reference Code: AP-{Math.floor(100000 + Math.random() * 900000)}
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Footer Controls */}
              <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                {wizardStep > 1 && wizardStep < 6 ? (
                  <button
                    onClick={() => setWizardStep((prev) => prev - 1)}
                    className={`flex items-center gap-1.5 py-2.5 px-4 rounded-full text-xs font-bold border cursor-pointer transition-colors ${
                      theme === "light" ? "bg-white hover:bg-gray-50 border-gray-200 text-gray-700" : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {wizardStep < 5 ? (
                  <button
                    onClick={() => setWizardStep((prev) => prev + 1)}
                    className={`flex items-center gap-1.5 py-2.5 px-6 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                      theme === "light"
                        ? "bg-brand-primary hover:bg-brand-primary-hover text-white"
                        : "bg-teal-500 hover:bg-teal-600 text-gray-900"
                    }`}
                  >
                    Next Step
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : wizardStep === 5 ? (
                  <button
                    onClick={handleSubmitStory}
                    className={`flex items-center gap-1.5 py-2.5 px-6 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                      theme === "light"
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-teal-500 hover:bg-teal-600 text-gray-900"
                    }`}
                  >
                    Submit Story
                    <Check className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsWizardOpen(false)}
                    className={`py-2.5 px-6 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                      theme === "light"
                        ? "bg-brand-primary hover:bg-brand-primary-hover text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Close Window
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
