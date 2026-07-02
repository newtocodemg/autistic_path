import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  User, 
  Baby, 
  Smile, 
  Calendar, 
  Target,
  BookOpen,
  Clock,
  Eye,
  MapPin,
  Check,
  Shield,
  Briefcase,
  Volume2,
  Lock,
  Globe,
  Mail,
  Phone,
  Activity,
  Award
} from "lucide-react";
import { ChildProfile, ParentProfile, generateWeeklyPlan } from "../lib/personalization";

interface OnboardingProps {
  onComplete: (parent: ParentProfile, child: ChildProfile) => void;
  theme: "light" | "dark";
}

const INTERESTS_OPTIONS = [
  "Dinosaurs", "Cars", "Animals", "Music", "Drawing", "Books", 
  "Space", "Nature", "Building Blocks", "Trains", "Princesses", 
  "Letters", "Numbers", "Water Play", "Pretend Play", "Sports"
];

const GOALS_OPTIONS = [
  { id: "Communication", label: "Communication" },
  { id: "Speech", label: "Speech & Language" },
  { id: "Eye Contact", label: "Eye Contact" },
  { id: "Reading", label: "Reading & Literacy" },
  { id: "Writing", label: "Writing & Motor Skills" },
  { id: "Social Skills", label: "Social Skills" },
  { id: "Emotional Regulation", label: "Emotional Regulation" },
  { id: "Attention", label: "Attention & Focus" },
  { id: "Fine Motor Skills", label: "Fine Motor Skills" },
  { id: "Gross Motor Skills", label: "Gross Motor Skills" },
  { id: "Sensory Processing", label: "Sensory Processing" },
  { id: "Daily Living Skills", label: "Daily Living Skills" },
  { id: "School Readiness", label: "School Readiness" }
];

const THINGS_TO_KNOW_OPTIONS = [
  "Sensitive to loud sounds",
  "Loves music",
  "Needs visual cues",
  "Enjoys routines",
  "Gets overwhelmed easily",
  "Responds well to praise",
  "Short attention span",
  "Prefers morning activities"
];

const WEEKLY_GOAL_OPTIONS = [
  "Improve Communication",
  "Improve Eye Contact",
  "Develop Social Skills",
  "Improve Reading",
  "Improve Sensory Integration",
  "Develop Focus"
];

const AVATARS = ["👶", "🧒", "👦", "👧", "🦁", "🦊", "🦖", "🦄", "🐼", "🐨"];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, theme }) => {
  const [step, setStep] = useState<number>(1);
  const isDark = theme === "dark";

  // STEP 2: Parent details
  const [parentName, setParentName] = useState("");
  const [relationship, setRelationship] = useState("Mother");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("United States");
  const [language, setLanguage] = useState<"en" | "es" | "sp" | "hi">("en");
  const [timezone, setTimezone] = useState("PST (Pacific Standard Time)");

  // STEP 3: Child details
  const [childName, setChildName] = useState("");
  const [nickname, setNickname] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("👶");

  // STEP 4: Understanding your child
  const [diagnosis, setDiagnosis] = useState("Autism Spectrum Disorder");
  const [communicationLevel, setCommunicationLevel] = useState("Non-verbal");
  const [currentTherapy, setCurrentTherapy] = useState("Speech Therapy");
  const [therapyFrequency, setTherapyFrequency] = useState("Weekly");
  const [preferredSessionDuration, setPreferredSessionDuration] = useState("8 Minutes");

  // STEP 5: Interests
  const [interests, setInterests] = useState<string[]>(["Dinosaurs", "Music"]);
  const [customInterest, setCustomInterest] = useState("");

  // STEP 6: Goals
  const [therapyGoals, setTherapyGoals] = useState<string[]>(["Communication", "Speech"]);

  // STEP 7: Things to know
  const [thingsToKnow, setThingsToKnow] = useState<string[]>(["Needs visual cues", "Loves music"]);
  const [customNote, setCustomNote] = useState("");

  // STEP 8: Weekly Goal
  const [weeklyGoal, setWeeklyGoal] = useState("Improve Communication");

  // STEP 9: Loading/Generation simulation
  const [generationStep, setGenerationStep] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Dynamic age calculation from DOB
  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge >= 0 ? calculatedAge.toString() : "");
    }
  }, [dob]);

  useEffect(() => {
    if (step === 9) {
      const interval = setInterval(() => {
        setGenerationStep((prev) => {
          if (prev < 3) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setLoadingComplete(true);
            return prev;
          }
        });
      }, 1200);

      return () => clearInterval(interval);
    }
  }, [step]);

  const handleFinish = () => {
    // Generate actual personalized therapy sessions using the personalization library
    const generatedSessions = generateWeeklyPlan({
      id: "child-active",
      name: childName || "Aarav",
      nickname: nickname || childName || "Aarav",
      age: age || "6",
      dob: dob || "2020-01-01",
      gender: gender || "Boy",
      diagnosis,
      therapyGoals,
      interests,
      favoriteToys: customInterest || "Sensory Blocks",
      favoriteFoods: "Fruit slices",
      thingsThatCalm: thingsToKnow.join(", ") || "Soft music",
      thingsThatUpset: "Loud sirens",
      communicationLevel,
      currentTherapy,
      therapyFrequency,
      currentChallenges: thingsToKnow,
      weeklyGoal,
      progressScore: 100,
      completedAdventuresCount: 0
    });

    onComplete(
      {
        parentName: parentName || "Parent",
        relationship,
        language,
        country,
        timezone,
        email,
        phone
      },
      {
        id: "child-active",
        name: childName || "Aarav",
        nickname: nickname || childName || "Aarav",
        age: age || "6",
        dob: dob || "2020-01-01",
        gender: gender || "Boy",
        diagnosis,
        therapyGoals,
        interests,
        favoriteToys: customInterest || "Sensory Blocks",
        favoriteFoods: "Fruit slices",
        thingsThatCalm: thingsToKnow.join(", ") || "Soft music",
        thingsThatUpset: "Loud sirens",
        communicationLevel,
        currentTherapy,
        therapyFrequency,
        currentChallenges: thingsToKnow,
        weeklyGoal,
        progressScore: 100,
        completedAdventuresCount: 0,
        sessions: generatedSessions,
        completedSessions: [],
        preferredSessionDuration
      }
    );
  };

  const handleNext = () => {
    if (step === 2 && !parentName.trim()) return;
    if (step === 3 && !childName.trim()) return;
    if (step < 9) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const toggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const toggleGoal = (item: string) => {
    if (therapyGoals.includes(item)) {
      if (therapyGoals.length > 1) {
        setTherapyGoals(therapyGoals.filter((g) => g !== item));
      }
    } else {
      if (therapyGoals.length < 3) {
        setTherapyGoals([...therapyGoals, item]);
      }
    }
  };

  const toggleThingToKnow = (item: string) => {
    if (thingsToKnow.includes(item)) {
      setThingsToKnow(thingsToKnow.filter((t) => t !== item));
    } else {
      setThingsToKnow([...thingsToKnow, item]);
    }
  };

  // Apple-style Card Container classes
  const cardBg = isDark ? "bg-[#161D30]/90 backdrop-blur-xl border-gray-800/40" : "bg-white/95 backdrop-blur-xl border-gray-100";
  const shellBg = isDark ? "bg-[#0B0F19]" : "bg-[#FAF9F6]";
  const textPrimary = isDark ? "text-slate-100" : "text-gray-900";
  const textSecondary = isDark ? "text-slate-400" : "text-gray-500";
  const inputBg = isDark ? "bg-gray-900/60 border-gray-800" : "bg-gray-50/50 border-gray-200";

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-sans select-none transition-colors duration-500 ${shellBg}`}>
      {/* 1. PROGRESS INDICATOR AT THE TOP (Screens 2-8) */}
      {step > 1 && step < 9 && (
        <div className="w-full max-w-xl mx-auto mb-8 px-4">
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
            <span>Screen {step} of 8</span>
            <span>{Math.round(((step - 1) / 7) * 100)}% Complete</span>
          </div>
          <div className="h-1 w-full bg-gray-200/50 dark:bg-gray-800/40 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#00828A] dark:bg-teal-400 rounded-full"
              initial={{ width: `${((step - 2) / 7) * 100}%` }}
              animate={{ width: `${((step - 1) / 7) * 100}%` }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}

      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          {/* SCREEN 1: WELCOME */}
          {step === 1 && (
            <motion.div
              key="screen-1"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className={`rounded-[32px] border ${cardBg} p-8 sm:p-12 shadow-premium-lg text-center flex flex-col items-center space-y-8`}
            >
              {/* Apple-style premium circular pulse layout */}
              <div className="relative flex items-center justify-center">
                <div className="absolute h-28 w-28 rounded-full bg-teal-500/10 animate-ping duration-1000" />
                <div className="h-20 w-20 rounded-[28px] bg-gradient-to-tr from-[#00828A] to-emerald-400 text-white flex items-center justify-center shadow-premium-md relative z-10">
                  <Heart className="h-9 w-9 fill-current text-white/95" />
                  <Sparkles className="h-4.5 w-4.5 absolute -top-1 -right-1 text-yellow-300 animate-bounce" />
                </div>
              </div>

              <div className="space-y-3.5 max-w-md">
                <h1 className={`text-3xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight ${textPrimary}`}>
                  Welcome to AutisticPath
                </h1>
                <p className={`text-sm sm:text-base ${textSecondary} leading-relaxed font-semibold`}>
                  Helping you continue meaningful therapy at home.
                </p>
              </div>

              {/* Security Banner */}
              <div className={`w-full max-w-sm rounded-2xl border ${isDark ? "bg-gray-900/40 border-gray-800/60" : "bg-gray-50/60 border-gray-150"} p-5 flex items-start gap-3 text-left`}>
                <div className="h-8 w-8 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="space-y-0.5 text-xs">
                  <h4 className={`font-bold ${textPrimary}`}>Private & Secure Workspace</h4>
                  <p className={`${textSecondary} font-medium`}>
                    Your child's information is completely personalized and stored locally on your device.
                  </p>
                </div>
              </div>

              <div className="w-full space-y-3 pt-2">
                <button
                  onClick={handleNext}
                  className="w-full py-4 rounded-full bg-[#00828A] hover:bg-[#00666C] active:scale-[0.99] text-white font-extrabold tracking-wide transition-all shadow-premium-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ChevronRight className="h-4 w-4 stroke-[2.5px]" />
                </button>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                  Estimated completion: 2–3 minutes
                </div>
              </div>
            </motion.div>
          )}

          {/* SCREEN 2: ABOUT THE PARENT */}
          {step === 2 && (
            <motion.div
              key="screen-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className={`rounded-[32px] border ${cardBg} p-8 sm:p-10 shadow-premium-lg space-y-6`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#00828A] dark:text-teal-400 uppercase tracking-widest block">PERSONAL PROFILE</span>
                <h2 className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight ${textPrimary}`}>
                  About the Parent
                </h2>
                <p className={`text-xs sm:text-sm ${textSecondary} font-semibold`}>
                  Tell us a bit about yourself so we can customize your dashboard.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Parent Name</label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Priya"
                      className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] ${inputBg} ${textPrimary}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Relationship</label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] cursor-pointer ${inputBg} ${textPrimary}`}
                    >
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Other">Other Caregiver</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@example.com"
                        className={`w-full py-2.5 pl-10 pr-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] ${inputBg} ${textPrimary}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Phone (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className={`w-full py-2.5 pl-10 pr-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] ${inputBg} ${textPrimary}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] cursor-pointer ${inputBg} ${textPrimary}`}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="sp">Sensory Plain</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. India"
                      className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] ${inputBg} ${textPrimary}`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Timezone</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    placeholder="e.g. IST (Indian Standard Time)"
                    className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] ${inputBg} ${textPrimary}`}
                  />
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleBack}
                  className={`py-3 px-5 rounded-full border ${isDark ? "border-gray-800 text-gray-300 hover:bg-gray-800/40" : "border-gray-200 text-gray-600 hover:bg-gray-50"} text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNext}
                  disabled={!parentName.trim()}
                  className={`flex-1 py-3 px-5 rounded-full bg-[#00828A] hover:bg-[#00666C] disabled:opacity-50 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-premium-sm`}
                >
                  <span>Continue</span>
                  <ChevronRight className="h-4 w-4 stroke-[2.5px]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 3: ABOUT YOUR CHILD */}
          {step === 3 && (
            <motion.div
              key="screen-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className={`rounded-[32px] border ${cardBg} p-8 sm:p-10 shadow-premium-lg space-y-6`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#00828A] dark:text-teal-400 uppercase tracking-widest block">CHILD PROFILE</span>
                <h2 className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight ${textPrimary}`}>
                  About Your Child
                </h2>
                <p className={`text-xs sm:text-sm ${textSecondary} font-semibold`}>
                  All program content will be dynamically generated for your child.
                </p>
              </div>

              <div className="space-y-4">
                {/* Child Name & Nickname */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Child Name</label>
                    <input
                      type="text"
                      required
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="e.g. Aarav"
                      className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] ${inputBg} ${textPrimary}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Nickname (Optional)</label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="e.g. Little Star"
                      className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] ${inputBg} ${textPrimary}`}
                    />
                  </div>
                </div>

                {/* DOB & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] ${inputBg} ${textPrimary}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] cursor-pointer ${inputBg} ${textPrimary}`}
                    >
                      <option value="">Select</option>
                      <option value="Boy">Boy</option>
                      <option value="Girl">Girl</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">No preference</option>
                    </select>
                  </div>
                </div>

                {/* Profile Photo Emoji Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Choose Profile Avatar</label>
                  <div className="flex flex-wrap gap-2.5 p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800">
                    {AVATARS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedAvatar(emoji)}
                        className={`text-2xl h-11 w-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          selectedAvatar === emoji 
                            ? "bg-[#00828A]/15 ring-2 ring-[#00828A] scale-105" 
                            : "hover:bg-gray-100 dark:hover:bg-gray-800/60"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleBack}
                  className={`py-3 px-5 rounded-full border ${isDark ? "border-gray-800 text-gray-300 hover:bg-gray-800/40" : "border-gray-200 text-gray-600 hover:bg-gray-50"} text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNext}
                  disabled={!childName.trim()}
                  className={`flex-1 py-3 px-5 rounded-full bg-[#00828A] hover:bg-[#00666C] disabled:opacity-50 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-premium-sm`}
                >
                  <span>Continue</span>
                  <ChevronRight className="h-4 w-4 stroke-[2.5px]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 4: UNDERSTANDING YOUR CHILD */}
          {step === 4 && (
            <motion.div
              key="screen-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className={`rounded-[32px] border ${cardBg} p-8 sm:p-10 shadow-premium-lg space-y-6`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#00828A] dark:text-teal-400 uppercase tracking-widest block">THERAPEUTIC MATRIX</span>
                <h2 className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight ${textPrimary}`}>
                  Understanding {childName}
                </h2>
                <p className={`text-xs sm:text-sm ${textSecondary} font-semibold`}>
                  Define current clinical pathways and active communication modes.
                </p>
              </div>

              <div className="space-y-4">
                {/* Diagnosis */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Diagnosis (Optional)</label>
                  <select
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] cursor-pointer ${inputBg} ${textPrimary}`}
                  >
                    <option value="">None / Not Diagnosed</option>
                    <option value="Autism Spectrum Disorder">Autism Spectrum Disorder</option>
                    <option value="Speech Delay">Speech Delay</option>
                    <option value="ADHD">ADHD</option>
                    <option value="Dyslexia">Dyslexia</option>
                    <option value="Global Developmental Delay">Global Developmental Delay</option>
                    <option value="Other">Other Delay / Condition</option>
                  </select>
                </div>

                {/* Communication level */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Communication Level</label>
                  <select
                    value={communicationLevel}
                    onChange={(e) => setCommunicationLevel(e.target.value)}
                    className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] cursor-pointer ${inputBg} ${textPrimary}`}
                  >
                    <option value="Non-verbal">Non-verbal</option>
                    <option value="Emerging (Single words)">Emerging (Single words)</option>
                    <option value="Conversational (Multi-word strings)">Conversational (Multi-word strings)</option>
                    <option value="AAC / Gestural communication">AAC / Gestural communication</option>
                  </select>
                </div>

                {/* Therapy & Frequency */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Current Therapy</label>
                    <input
                      type="text"
                      value={currentTherapy}
                      onChange={(e) => setCurrentTherapy(e.target.value)}
                      placeholder="e.g. Speech"
                      className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] ${inputBg} ${textPrimary}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Frequency</label>
                    <select
                      value={therapyFrequency}
                      onChange={(e) => setTherapyFrequency(e.target.value)}
                      className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] cursor-pointer ${inputBg} ${textPrimary}`}
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Twice Weekly">Twice Weekly</option>
                      <option value="Daily">Daily</option>
                      <option value="Monthly">Monthly</option>
                      <option value="None">None</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Session Duration</label>
                    <select
                      value={preferredSessionDuration}
                      onChange={(e) => setPreferredSessionDuration(e.target.value)}
                      className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] cursor-pointer ${inputBg} ${textPrimary}`}
                    >
                      <option value="5 Minutes">5 Minutes</option>
                      <option value="8 Minutes">8 Minutes (Recommended)</option>
                      <option value="10 Minutes">10 Minutes</option>
                      <option value="15 Minutes">15 Minutes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleBack}
                  className={`py-3 px-5 rounded-full border ${isDark ? "border-gray-800 text-gray-300 hover:bg-gray-800/40" : "border-gray-200 text-gray-600 hover:bg-gray-50"} text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNext}
                  className={`flex-1 py-3 px-5 rounded-full bg-[#00828A] hover:bg-[#00666C] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-premium-sm`}
                >
                  <span>Continue</span>
                  <ChevronRight className="h-4 w-4 stroke-[2.5px]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 5: CHILD INTERESTS */}
          {step === 5 && (
            <motion.div
              key="screen-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className={`rounded-[32px] border ${cardBg} p-8 sm:p-10 shadow-premium-lg space-y-6`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#00828A] dark:text-teal-400 uppercase tracking-widest block">INTEREST ENGINES</span>
                <h2 className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight ${textPrimary}`}>
                  {childName}'s Interests
                </h2>
                <p className={`text-xs sm:text-sm ${textSecondary} font-semibold`}>
                  We weave these specific interests directly into daily play-based therapy missions.
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Select Interests</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                  {INTERESTS_OPTIONS.map((item) => {
                    const isSelected = interests.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        className={`py-2 px-3 text-left text-xs font-bold rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#00828A]/10 border-[#00828A] text-[#00828A] dark:text-teal-400"
                            : isDark
                              ? "bg-gray-900/40 border-gray-800 text-slate-400 hover:bg-gray-800/50"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <span className="truncate">{item}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 shrink-0 stroke-[2.5px]" />}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Add Custom Interest</label>
                  <input
                    type="text"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    placeholder="e.g. Kinetic Sand, Puzzles"
                    className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] ${inputBg} ${textPrimary}`}
                  />
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleBack}
                  className={`py-3 px-5 rounded-full border ${isDark ? "border-gray-800 text-gray-300 hover:bg-gray-800/40" : "border-gray-200 text-gray-600 hover:bg-gray-50"} text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNext}
                  disabled={interests.length === 0}
                  className={`flex-1 py-3 px-5 rounded-full bg-[#00828A] hover:bg-[#00666C] disabled:opacity-50 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-premium-sm`}
                >
                  <span>Continue</span>
                  <ChevronRight className="h-4 w-4 stroke-[2.5px]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 6: GOALS */}
          {step === 6 && (
            <motion.div
              key="screen-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className={`rounded-[32px] border ${cardBg} p-8 sm:p-10 shadow-premium-lg space-y-6`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#00828A] dark:text-teal-400 uppercase tracking-widest block">DEVELOPMENTAL TRACKS</span>
                <h2 className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight ${textPrimary}`}>
                  Therapy Goals
                </h2>
                <p className={`text-xs sm:text-sm ${textSecondary} font-semibold`}>
                  Choose up to three current development paths for {childName}.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {GOALS_OPTIONS.map((goal) => {
                    const isSelected = therapyGoals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => toggleGoal(goal.id)}
                        className={`py-3 px-4 text-left text-xs font-bold rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#00828A]/10 border-[#00828A] text-[#00828A] dark:text-teal-400"
                            : isDark
                              ? "bg-gray-900/40 border-gray-800 text-slate-400 hover:bg-gray-800/50"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <span>{goal.label}</span>
                        {isSelected ? (
                          <Check className="h-4 w-4 shrink-0 stroke-[2.5px]" />
                        ) : (
                          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Select</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-wider">
                  Selected: {therapyGoals.length} / 3 goals
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleBack}
                  className={`py-3 px-5 rounded-full border ${isDark ? "border-gray-800 text-gray-300 hover:bg-gray-800/40" : "border-gray-200 text-gray-600 hover:bg-gray-50"} text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNext}
                  disabled={therapyGoals.length === 0}
                  className={`flex-1 py-3 px-5 rounded-full bg-[#00828A] hover:bg-[#00666C] disabled:opacity-50 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-premium-sm`}
                >
                  <span>Continue</span>
                  <ChevronRight className="h-4 w-4 stroke-[2.5px]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 7: THINGS TO KNOW */}
          {step === 7 && (
            <motion.div
              key="screen-7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className={`rounded-[32px] border ${cardBg} p-8 sm:p-10 shadow-premium-lg space-y-6`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#00828A] dark:text-teal-400 uppercase tracking-widest block">SENSORY PARAMETERS</span>
                <h2 className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight ${textPrimary}`}>
                  Things To Know
                </h2>
                <p className={`text-xs sm:text-sm ${textSecondary} font-semibold`}>
                  Tell us about {childName}'s unique sensory response style and calming routines.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {THINGS_TO_KNOW_OPTIONS.map((item) => {
                    const isSelected = thingsToKnow.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleThingToKnow(item)}
                        className={`py-2.5 px-3 text-left text-xs font-bold rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#00828A]/10 border-[#00828A] text-[#00828A] dark:text-teal-400"
                            : isDark
                              ? "bg-gray-900/40 border-gray-800 text-slate-400 hover:bg-gray-800/50"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <span>{item}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 shrink-0 stroke-[2.5px]" />}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Add Custom Notes</label>
                  <textarea
                    rows={2}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g. Prefers dim lighting, highly motivated by trains..."
                    className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#00828A] resize-none ${inputBg} ${textPrimary}`}
                  />
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleBack}
                  className={`py-3 px-5 rounded-full border ${isDark ? "border-gray-800 text-gray-300 hover:bg-gray-800/40" : "border-gray-200 text-gray-600 hover:bg-gray-50"} text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNext}
                  className={`flex-1 py-3 px-5 rounded-full bg-[#00828A] hover:bg-[#00666C] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-premium-sm`}
                >
                  <span>Continue</span>
                  <ChevronRight className="h-4 w-4 stroke-[2.5px]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 8: CHOOSE THIS WEEK'S MAIN GOAL */}
          {step === 8 && (
            <motion.div
              key="screen-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className={`rounded-[32px] border ${cardBg} p-8 sm:p-10 shadow-premium-lg space-y-6`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#00828A] dark:text-teal-400 uppercase tracking-widest block">CALIBRATION GATE</span>
                <h2 className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight ${textPrimary}`}>
                  This Week's Goal
                </h2>
                <p className={`text-xs sm:text-sm ${textSecondary} font-semibold`}>
                  Choose exactly ONE priority goal of the week to align immediate coaching modules.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {WEEKLY_GOAL_OPTIONS.map((item) => {
                    const isSelected = weeklyGoal === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setWeeklyGoal(item)}
                        className={`py-3.5 px-4 text-left text-xs font-bold rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#00828A]/10 border-[#00828A] text-[#00828A] dark:text-teal-400 shadow-sm"
                            : isDark
                              ? "bg-gray-900/40 border-gray-800 text-slate-400 hover:bg-gray-800/50"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <span>{item}</span>
                        {isSelected && <Check className="h-4 w-4 shrink-0 stroke-[2.5px] text-[#00828A]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleBack}
                  className={`py-3 px-5 rounded-full border ${isDark ? "border-gray-800 text-gray-300 hover:bg-gray-800/40" : "border-gray-200 text-gray-600 hover:bg-gray-50"} text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleNext}
                  className={`flex-1 py-3 px-5 rounded-full bg-[#00828A] hover:bg-[#00666C] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-premium-sm`}
                >
                  <span>Build Program</span>
                  <ChevronRight className="h-4 w-4 stroke-[2.5px]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 9: GENERATING YOUR FIRST WEEK */}
          {step === 9 && (
            <motion.div
              key="screen-9"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`rounded-[32px] border ${cardBg} p-8 sm:p-12 shadow-premium-lg text-center flex flex-col items-center space-y-8`}
            >
              {/* Co-regulation Spinning Loader */}
              <div className="relative flex items-center justify-center h-28 w-28">
                {/* Outer Breathing Circle */}
                <motion.div 
                  className="absolute h-24 w-24 rounded-full border-4 border-dashed border-[#00828A]/40"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, ease: "linear", repeat: Infinity }}
                />
                {/* Inner Pulsing Core */}
                <motion.div 
                  className="h-16 w-16 rounded-full bg-gradient-to-tr from-[#00828A] to-emerald-400 text-white flex items-center justify-center shadow-lg relative z-10"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </motion.div>
              </div>

              <div className="space-y-4 max-w-sm">
                <h2 className={`text-xl font-extrabold font-display tracking-tight ${textPrimary}`}>
                  ✨ Preparing a personalized experience for {childName}...
                </h2>
                
                {/* Progressive Checklists with status updates */}
                <div className="space-y-2 px-6 text-left">
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center ${generationStep >= 0 ? "bg-[#00828A]/20 text-[#00828A]" : "bg-gray-100 text-gray-300"}`}>
                      {generationStep > 0 ? <Check className="h-3 w-3 stroke-[2.5px]" /> : <span className="h-1.5 w-1.5 rounded-full bg-[#00828A]" />}
                    </div>
                    <span className={generationStep >= 0 ? textPrimary : "text-gray-300"}>
                      Creating {childName}'s personalized plan...
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center ${generationStep >= 1 ? "bg-[#00828A]/20 text-[#00828A]" : "bg-gray-100 text-gray-300 dark:bg-gray-800"}`}>
                      {generationStep > 1 ? <Check className="h-3 w-3 stroke-[2.5px]" /> : generationStep === 1 ? <span className="h-1.5 w-1.5 rounded-full bg-[#00828A] animate-ping" /> : null}
                    </div>
                    <span className={generationStep >= 1 ? textPrimary : "text-gray-300 dark:text-gray-600"}>
                      Analyzing interests ({interests.slice(0,2).join(", ") || "dinosaurs"})...
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center ${generationStep >= 2 ? "bg-[#00828A]/20 text-[#00828A]" : "bg-gray-100 text-gray-300 dark:bg-gray-800"}`}>
                      {generationStep > 2 ? <Check className="h-3 w-3 stroke-[2.5px]" /> : generationStep === 2 ? <span className="h-1.5 w-1.5 rounded-full bg-[#00828A] animate-ping" /> : null}
                    </div>
                    <span className={generationStep >= 2 ? textPrimary : "text-gray-300 dark:text-gray-600"}>
                      Building adventures & sensory paths...
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center ${generationStep >= 3 ? "bg-[#00828A]/20 text-[#00828A]" : "bg-gray-100 text-gray-300 dark:bg-gray-800"}`}>
                      {generationStep > 3 ? <Check className="h-3 w-3 stroke-[2.5px]" /> : generationStep === 3 ? <span className="h-1.5 w-1.5 rounded-full bg-[#00828A] animate-ping" /> : null}
                    </div>
                    <span className={generationStep >= 3 ? textPrimary : "text-gray-300 dark:text-gray-600"}>
                      Preparing 7 sessions of co-regulation...
                    </span>
                  </div>
                </div>
              </div>

              {/* Enter App Button */}
              <div className="w-full pt-4">
                <button
                  onClick={handleFinish}
                  disabled={!loadingComplete}
                  className="w-full py-4 rounded-full bg-[#00828A] hover:bg-[#00666C] disabled:opacity-50 text-white font-extrabold tracking-wide transition-all shadow-premium-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enter AutisticPath</span>
                  <ChevronRight className="h-4 w-4 stroke-[2.5px]" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
