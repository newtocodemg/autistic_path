import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  db, 
  doc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  User
} from "./firebase";
import { ChildProfile, ParentProfile, TherapySession, generateWeeklyPlan } from "./personalization";
import { 
  MOCK_PARENT, 
  MOCK_CHILD, 
  MOCK_SESSION_LOGS, 
  MOCK_MILESTONES, 
  MOCK_STORIES 
} from "./demoData";

// Interfaces for our SaaS database
export interface SessionLog {
  id: string;
  sessionId: string;
  sessionTitle: string;
  completionTime: string;
  duration: number; // in minutes
  activitiesCompleted: string[];
  childMood: string; // e.g. "Happy", "Calm", "Overwhelmed"
  parentNotes: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  category: "session" | "streak" | "goal" | "manual" | "other";
  iconName?: string;
  isCustom?: boolean;
}

export interface SharedStory {
  id: string;
  title: string;
  author: string;
  age: string;
  country: string;
  readTime: string;
  category: string;
  excerpt: string;
  coverStyle: string;
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
  status: "approved" | "pending_moderation";
  isUserStory?: boolean;
  userId?: string;
}

interface SaasContextType {
  user: User | null;
  loading: boolean;
  parent: ParentProfile | null;
  children: ChildProfile[];
  activeChildId: string | null;
  sessionLogs: SessionLog[];
  milestones: Milestone[];
  customStories: SharedStory[];
  notificationsConfig: Record<string, boolean>;
  bookmarks: string[];
  readingHistory: string[];
  darkMode: boolean;
  
  // Actions
  signUp: (displayName: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateParentProfile: (data: Partial<ParentProfile>) => Promise<void>;
  updateChildProfile: (childId: string, data: Partial<ChildProfile>) => Promise<void>;
  addChild: (childData: Omit<ChildProfile, "id" | "sessions" | "completedSessions" | "progressScore" | "completedAdventuresCount">) => Promise<void>;
  deleteChild: (childId: string) => Promise<void>;
  
  // Today's Session Engine
  todaysSession: TherapySession | null;
  generateNewSession: () => Promise<void>;
  completeSession: (
    sessionId: string, 
    sessionTitle: string, 
    duration: number, 
    activitiesCompleted: string[], 
    childMood: string, 
    parentNotes: string
  ) => Promise<void>;
  
  // Goals
  weeklyProgress: number;
  goalCompletedThisWeek: boolean;
  generateNextWeeklyGoal: (currentGoal: string) => Promise<void>;
  
  // Milestones
  addCustomMilestone: (title: string, description: string, category?: string) => Promise<void>;
  
  // Stories
  submitStory: (storyData: Omit<SharedStory, "id" | "likes" | "encouragements" | "status" | "userId">) => Promise<void>;
  likeStory: (storyId: string) => Promise<void>;
  toggleBookmark: (storyId: string) => Promise<void>;
  addReadingHistory: (storyId: string) => Promise<void>;
  approveStory: (storyId: string) => Promise<void>; // moderation simulation
  
  // Settings
  setDarkMode: (dark: boolean) => void;
  updateNotificationsConfig: (config: Record<string, boolean>) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  resetApplicationData: () => void;
}

const SaasContext = createContext<SaasContextType | undefined>(undefined);

const DEFAULT_NOTIFICATIONS = {
  dailyReminder: true,
  weeklyReminder: true,
  goalCompleted: true,
  journeyMilestone: true,
  newStory: true
};

const ACTIVE_USER: User = {
  uid: "parent-user-789",
  email: "parent@autisticpath.com",
  displayName: "Sarah"
};

export const SaasProvider: React.FC<{ children: React.ReactNode }> = ({ children: reactChildren }) => {
  // Constant mock user to bypass all auth screen logic
  const [user] = useState<User | null>(ACTIVE_USER);
  const [loading, setLoading] = useState(true);
  
  // Localized states
  const [parent, setParentState] = useState<ParentProfile | null>(null);
  const [childrenList, setChildrenList] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [customStories, setCustomStories] = useState<SharedStory[]>(MOCK_STORIES);
  const [notificationsConfig, setNotificationsConfig] = useState<Record<string, boolean>>(DEFAULT_NOTIFICATIONS);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [readingHistory, setReadingHistory] = useState<string[]>([]);
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [todaysSession, setTodaysSession] = useState<TherapySession | null>(null);

  // Compute Active Child
  const activeChild = childrenList.find(c => c.id === activeChildId) || childrenList[0] || null;

  // Compute Weekly Progress
  const weeklyProgress = activeChild 
    ? Math.min(100, Math.round((sessionLogs.filter(log => activeChild.sessions?.some(s => s.id === log.sessionId)).length / 3) * 100)) 
    : 0;

  const goalCompletedThisWeek = weeklyProgress >= 100;

  // Dark mode handler
  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
    localStorage.setItem("autisticpath_dark", dark ? "true" : "false");
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // 1. Initial Load of Demo & Local Data
  useEffect(() => {
    // Light/Dark mode
    const isDarkCached = localStorage.getItem("autisticpath_dark") === "true";
    setDarkMode(isDarkCached);

    // Initial load from localStorage with fallback to pristine demo state
    const cachedParent = localStorage.getItem("demo_parent");
    const cachedChildren = localStorage.getItem("demo_children");
    const cachedActiveId = localStorage.getItem("demo_active_child_id");
    const cachedLogs = localStorage.getItem("demo_session_logs");
    const cachedMilestones = localStorage.getItem("demo_milestones");
    const cachedBookmarks = localStorage.getItem("demo_bookmarks");
    const cachedReadingHistory = localStorage.getItem("demo_reading_history");
    const cachedNotifications = localStorage.getItem("demo_notifications_config");

    let loadedParent: ParentProfile | null = null;
    if (cachedParent) {
      loadedParent = JSON.parse(cachedParent);
      setParentState(loadedParent);
    } else {
      setParentState(null);
    }

    let loadedChildren: ChildProfile[] = [];
    if (cachedChildren) {
      loadedChildren = JSON.parse(cachedChildren);
      setChildrenList(loadedChildren);
    } else {
      setChildrenList([]);
    }

    let loadedActiveId = cachedActiveId || (loadedChildren.length > 0 ? loadedChildren[0].id : null);
    setActiveChildId(loadedActiveId);

    let loadedLogs: SessionLog[] = [];
    if (cachedLogs) {
      loadedLogs = JSON.parse(cachedLogs);
      setSessionLogs(loadedLogs);
    } else {
      setSessionLogs([]);
    }

    let loadedMilestones: Milestone[] = [];
    if (cachedMilestones) {
      loadedMilestones = JSON.parse(cachedMilestones);
      setMilestones(loadedMilestones);
    } else {
      setMilestones([]);
    }

    if (cachedBookmarks) setBookmarks(JSON.parse(cachedBookmarks));
    if (cachedReadingHistory) setReadingHistory(JSON.parse(cachedReadingHistory));
    if (cachedNotifications) setNotificationsConfig(JSON.parse(cachedNotifications));

    // Load active therapy session
    if (loadedChildren.length > 0) {
      const activeChildObj = loadedChildren.find(c => c.id === loadedActiveId) || loadedChildren[0];
      if (activeChildObj && activeChildObj.sessions) {
        const completedIds = loadedLogs.map(l => l.sessionId);
        const incomplete = activeChildObj.sessions.find(s => !completedIds.includes(s.id));
        setTodaysSession(incomplete || activeChildObj.sessions[0] || null);
      }
    } else {
      setTodaysSession(null);
    }

    // Attempt to load live community stories from firestore if possible, otherwise rely on MOCK_STORIES
    const loadLiveStories = async () => {
      try {
        const storiesSnap = await getDocs(collection(db, "stories"));
        if (!storiesSnap.empty) {
          const storiesList = storiesSnap.docs.map(d => ({ id: d.id, ...d.data() } as SharedStory));
          setCustomStories(storiesList);
        }
      } catch (err) {
        console.info("[Local Mode] Firestore stories fetching bypassed. Using high-fidelity local stories.");
      }
    };
    loadLiveStories();

    // End loading with a professional delay to simulate clinical system syncing
    const timer = setTimeout(() => {
      setLoading(false);
    }, 750);

    return () => clearTimeout(timer);
  }, []);

  // Reset Application Data helper
  const resetApplicationData = () => {
    localStorage.removeItem("demo_parent");
    localStorage.removeItem("demo_children");
    localStorage.removeItem("demo_active_child_id");
    localStorage.removeItem("demo_session_logs");
    localStorage.removeItem("demo_milestones");
    localStorage.removeItem("demo_bookmarks");
    localStorage.removeItem("demo_reading_history");
    localStorage.removeItem("demo_notifications_config");

    // Clear state completely so the app redirects to onboarding flow
    setParentState(null);
    setChildrenList([]);
    setActiveChildId(null);
    setSessionLogs([]);
    setMilestones([]);
    setBookmarks([]);
    setReadingHistory([]);
    setNotificationsConfig(DEFAULT_NOTIFICATIONS);
    setTodaysSession(null);
  };

  // Helper: update child profile directly inside state and localStorage
  const updateChildInListLocal = (childId: string, updates: Partial<ChildProfile>, currentList: ChildProfile[]) => {
    const updatedList = currentList.map(c => {
      if (c.id === childId) {
        const updated = { ...c, ...updates };
        // If interests or weekly goal changed, let's regenerate sessions dynamically
        if (updates.weeklyGoal || updates.interests) {
          updated.sessions = generateWeeklyPlan(updated);
        }
        return updated;
      }
      return c;
    });
    setChildrenList(updatedList);
    localStorage.setItem("demo_children", JSON.stringify(updatedList));

    // Also update today's session based on current logs
    const activeChildObj = updatedList.find(c => c.id === activeChildId) || updatedList[0];
    if (activeChildObj && activeChildObj.sessions) {
      const completedIds = sessionLogs.map(l => l.sessionId);
      const incomplete = activeChildObj.sessions.find(s => !completedIds.includes(s.id));
      setTodaysSession(incomplete || activeChildObj.sessions[0] || null);
    }
  };

  // ACTIONS
  const signUp = async (displayName: string) => {
    // No-op for demo mode
  };

  const logOut = async () => {
    // Lock/Sign out resets the state so a new session is clean!
    resetApplicationData();
  };

  const updateParentProfile = async (data: Partial<ParentProfile>) => {
    const newParent = { ...parent, ...data } as ParentProfile;
    setParentState(newParent);
    localStorage.setItem("demo_parent", JSON.stringify(newParent));
  };

  const updateChildProfile = async (childId: string, data: Partial<ChildProfile>) => {
    updateChildInListLocal(childId, data, childrenList);
  };

  const addChild = async (childData: Omit<ChildProfile, "id" | "sessions" | "completedSessions" | "progressScore" | "completedAdventuresCount">) => {
    const childId = "child-" + Math.random().toString(36).substring(2, 9);
    const newChild: ChildProfile = {
      ...childData,
      id: childId,
      sessions: [],
      completedSessions: [],
      progressScore: 100,
      completedAdventuresCount: 0
    };
    
    // Generate sessions immediately
    const generated = generateWeeklyPlan(newChild);
    newChild.sessions = generated;

    const newList = [...childrenList, newChild];
    setChildrenList(newList);
    setActiveChildId(childId);
    localStorage.setItem("demo_children", JSON.stringify(newList));
    localStorage.setItem("demo_active_child_id", childId);
    
    // Set today's session
    setTodaysSession(generated[0]);

    // Auto milestone for adding new child profile
    await addCustomMilestone(
      `Welcome, ${childData.name}!`, 
      `Registered a therapy-aligned path for ${childData.name}. Let's make progress!`, 
      "manual"
    );
  };

  const deleteChild = async (childId: string) => {
    const newList = childrenList.filter(c => c.id !== childId);
    setChildrenList(newList);
    const nextActive = newList[0]?.id || null;
    setActiveChildId(nextActive);
    localStorage.setItem("demo_children", JSON.stringify(newList));
    if (nextActive) {
      localStorage.setItem("demo_active_child_id", nextActive);
    } else {
      localStorage.removeItem("demo_active_child_id");
    }
  };

  // Generate Tomorrow's Recommendation
  const generateNewSession = async () => {
    if (!activeChild) return;
    const generated = generateWeeklyPlan(activeChild);
    const shuffled = [...generated].sort(() => Math.random() - 0.5);
    const refreshed = shuffled.map((s, idx) => ({
      ...s,
      id: `session-fresh-${idx}-${Date.now()}`
    }));

    updateChildInListLocal(activeChild.id, { sessions: refreshed }, childrenList);
    setTodaysSession(refreshed[0]);
  };

  // Complete Today's Therapy Session
  const completeSession = async (
    sessionId: string, 
    sessionTitle: string, 
    duration: number, 
    activitiesCompleted: string[], 
    childMood: string, 
    parentNotes: string
  ) => {
    if (!activeChild) return;

    const logId = "log-" + Math.random().toString(36).substring(2, 9);
    const newLog: SessionLog = {
      id: logId,
      sessionId,
      sessionTitle,
      completionTime: new Date().toLocaleString(),
      duration,
      activitiesCompleted,
      childMood,
      parentNotes
    };

    const updatedLogs = [...sessionLogs, newLog];
    setSessionLogs(updatedLogs);
    localStorage.setItem("demo_session_logs", JSON.stringify(updatedLogs));

    // Update child progress metrics
    const newCount = (activeChild.completedAdventuresCount || 0) + 1;
    const updatedCompletedSessions = [...(activeChild.completedSessions || []), sessionId];
    
    // Auto-update score
    const newScore = Math.min(100, (activeChild.progressScore || 85) + 4);

    updateChildInListLocal(activeChild.id, {
      completedAdventuresCount: newCount,
      completedSessions: updatedCompletedSessions,
      progressScore: newScore
    }, childrenList);

    // Dynamic Journey milestones automatically
    if (newCount === 1) {
      await addCustomMilestone("First Therapy Goal Met!", `Completed first therapeutic home session: "${sessionTitle}"!`, "session");
    } else if (newCount === 5) {
      await addCustomMilestone("5-Day Calming Streak!", `Successfully maintained daily sessions for 5 consecutive days.`, "streak");
    } else if (newCount === 10) {
      await addCustomMilestone("Sensory Milestones Master!", `Completed 10 collaborative sessions.`, "goal");
    }

    // Refresh today's recommendations
    const completedIds = [...updatedLogs.map(l => l.sessionId)];
    const incomplete = activeChild.sessions?.find(s => !completedIds.includes(s.id));
    if (incomplete) {
      setTodaysSession(incomplete);
    } else {
      await generateNewSession();
    }
  };

  const generateNextWeeklyGoal = async (currentGoal: string) => {
    if (!activeChild) return;
    const goalPool = [
      "Improve Communication",
      "Improve Eye Contact",
      "Improve Sensory Integration",
      "Develop Social Skills",
      "Develop Focus"
    ].filter(g => g !== currentGoal);
    
    const nextGoal = goalPool[Math.floor(Math.random() * goalPool.length)];
    updateChildInListLocal(activeChild.id, { weeklyGoal: nextGoal }, childrenList);
    
    // Clear logs for new weekly cycle
    setSessionLogs([]);
    localStorage.setItem("demo_session_logs", JSON.stringify([]));
    await addCustomMilestone("New Weekly Track Set!", `Transitioned to: ${nextGoal}`, "goal");
  };

  const addCustomMilestone = async (title: string, description: string, category: any = "manual") => {
    const mId = "m-" + Math.random().toString(36).substring(2, 9);
    const newM: Milestone = {
      id: mId,
      title,
      description,
      date: new Date().toLocaleDateString(),
      category,
      isCustom: true
    };

    const updatedM = [newM, ...milestones];
    setMilestones(updatedM);
    localStorage.setItem("demo_milestones", JSON.stringify(updatedM));
  };

  // STORIES ACTIONS
  const submitStory = async (storyData: Omit<SharedStory, "id" | "likes" | "encouragements" | "status" | "userId">) => {
    const sId = "story-" + Math.random().toString(36).substring(2, 9);
    const newStory: SharedStory = {
      ...storyData,
      id: sId,
      likes: 1,
      encouragements: [],
      status: "approved", // auto approved for local demo ease
      userId: user?.uid || "guest"
    };

    const updatedStories = [newStory, ...customStories];
    setCustomStories(updatedStories);

    // Soft online push
    try {
      const docRef = doc(db, "stories", sId);
      await setDoc(docRef, newStory);
    } catch {
      // safe fallback
    }
  };

  const approveStory = async (storyId: string) => {
    setCustomStories(prev => prev.map(s => s.id === storyId ? { ...s, status: "approved" } : s));
  };

  const likeStory = async (storyId: string) => {
    const updated = customStories.map(s => {
      if (s.id === storyId) {
        const liked = !s.likedByUser;
        const newLikes = liked ? s.likes + 1 : Math.max(0, s.likes - 1);
        return { ...s, likedByUser: liked, likes: newLikes };
      }
      return s;
    });
    setCustomStories(updated);
  };

  const toggleBookmark = async (storyId: string) => {
    const isBookmarked = bookmarks.includes(storyId);
    const updated = isBookmarked 
      ? bookmarks.filter(id => id !== storyId) 
      : [...bookmarks, storyId];
    
    setBookmarks(updated);
    localStorage.setItem("demo_bookmarks", JSON.stringify(updated));
  };

  const addReadingHistory = async (storyId: string) => {
    if (readingHistory.includes(storyId)) return;
    const updated = [...readingHistory, storyId];
    setReadingHistory(updated);
    localStorage.setItem("demo_reading_history", JSON.stringify(updated));
  };

  const updateNotificationsConfig = async (config: Record<string, boolean>) => {
    setNotificationsConfig(config);
    localStorage.setItem("demo_notifications_config", JSON.stringify(config));
  };

  const deleteUserAccount = async () => {
    resetApplicationData();
  };

  return (
    <SaasContext.Provider value={{
      user,
      loading,
      parent,
      children: childrenList,
      activeChildId,
      sessionLogs,
      milestones,
      customStories,
      notificationsConfig,
      bookmarks,
      readingHistory,
      darkMode,
      
      signUp,
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
      approveStory,
      
      setDarkMode,
      updateNotificationsConfig,
      deleteUserAccount,
      resetApplicationData
    }}>
      {reactChildren}
    </SaasContext.Provider>
  );
};

export const useSaas = () => {
  const context = useContext(SaasContext);
  if (!context) {
    throw new Error("useSaas must be used within a SaasProvider");
  }
  return context;
};
