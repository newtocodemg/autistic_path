import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  auth, 
  db, 
  onAuthStateChanged,
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy,
  deleteDoc,
  User
} from "./firebase";
import { ChildProfile, ParentProfile, TherapySession, generateWeeklyPlan } from "./personalization";

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
  addChild: (childData: Omit<ChildProfile, "id" | "sessions" | "completedSessions">) => Promise<void>;
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
}

const SaasContext = createContext<SaasContextType | undefined>(undefined);

const DEFAULT_NOTIFICATIONS = {
  dailyReminder: true,
  weeklyReminder: true,
  goalCompleted: true,
  journeyMilestone: true,
  newStory: true
};

export const SaasProvider: React.FC<{ children: React.ReactNode }> = ({ children: reactChildren }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [parent, setParent] = useState<ParentProfile | null>(null);
  const [childrenList, setChildrenList] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [customStories, setCustomStories] = useState<SharedStory[]>([]);
  const [notificationsConfig, setNotificationsConfig] = useState<Record<string, boolean>>(DEFAULT_NOTIFICATIONS);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [readingHistory, setReadingHistory] = useState<string[]>([]);
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [todaysSession, setTodaysSession] = useState<TherapySession | null>(null);

  // Compute Active Child
  const activeChild = childrenList.find(c => c.id === activeChildId) || childrenList[0] || null;

  // Compute Weekly Progress
  const weeklyProgress = activeChild 
    ? Math.min(100, Math.round((sessionLogs.filter(log => activeChild.sessions.some(s => s.id === log.sessionId)).length / 3) * 100)) 
    : 0;

  const goalCompletedThisWeek = weeklyProgress >= 100;

  // Dark mode effect
  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
    localStorage.setItem("autisticpath_dark", dark ? "true" : "false");
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const isDarkCached = localStorage.getItem("autisticpath_dark") === "true";
    setDarkMode(isDarkCached);
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserData(currentUser);
      } else {
        // Reset state on logout
        setParent(null);
        setChildrenList([]);
        setActiveChildId(null);
        setSessionLogs([]);
        setMilestones([]);
        setTodaysSession(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load SaaS dynamic user data from Firestore
  const loadUserData = async (currentUser: User) => {
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setParent(userData.parent || null);
        setChildrenList(userData.children || []);
        setActiveChildId(userData.activeChildId || null);
        setBookmarks(userData.bookmarks || []);
        setReadingHistory(userData.readingHistory || []);
        setNotificationsConfig(userData.notificationsConfig || DEFAULT_NOTIFICATIONS);
        
        // Load sessions, logs, milestones
        await loadSubcollections(currentUser.uid, userData.children || []);
      } else {
        // Look in localStorage for guest migration if they just registered
        const localParent = localStorage.getItem("autisticpath_parent");
        const localChildren = localStorage.getItem("autisticpath_children");
        const localActiveChildId = localStorage.getItem("autisticpath_active_child_id");

        if (localParent && localChildren) {
          const parsedParent = JSON.parse(localParent);
          const parsedChildren = JSON.parse(localChildren);
          const activeId = localActiveChildId || parsedChildren[0]?.id || "child-active";

          // Save guest data directly to firestore
          const initialData = {
            parent: parsedParent,
            children: parsedChildren,
            activeChildId: activeId,
            bookmarks: [],
            readingHistory: [],
            notificationsConfig: DEFAULT_NOTIFICATIONS,
            createdAt: new Date().toISOString()
          };

          await setDoc(userDocRef, initialData);
          setParent(parsedParent);
          setChildrenList(parsedChildren);
          setActiveChildId(activeId);
          await loadSubcollections(currentUser.uid, parsedChildren);
        }
      }
      
      // Load global stories
      await fetchGlobalStories();
    } catch (err) {
      console.error("Error loading secure SaaS data: ", err);
    }
  };

  // Load logs, milestones and current therapy session recommendations
  const loadSubcollections = async (userId: string, currentChildren: ChildProfile[]) => {
    try {
      // 1. Logs
      const logsSnap = await getDocs(collection(db, "users", userId, "logs"));
      const logsList = logsSnap.docs.map(d => ({ id: d.id, ...d.data() } as SessionLog));
      setSessionLogs(logsList);

      // 2. Milestones
      const milestonesSnap = await getDocs(collection(db, "users", userId, "milestones"));
      const mList = milestonesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Milestone));
      setMilestones(mList);

      // 3. Resolve active session from child's generated sessions
      const activeChildObj = currentChildren.find(c => c.id === activeChildId) || currentChildren[0];
      if (activeChildObj) {
        if (!activeChildObj.sessions || activeChildObj.sessions.length === 0) {
          // Generate active session list dynamically
          const generated = generateWeeklyPlan(activeChildObj);
          activeChildObj.sessions = generated;
          // Save back
          await updateChildInList(userId, activeChildObj.id, { sessions: generated }, currentChildren);
        }

        // Today's session is the first incomplete session
        const completedIds = logsList.map(l => l.sessionId);
        const incomplete = activeChildObj.sessions.find(s => !completedIds.includes(s.id));
        setTodaysSession(incomplete || activeChildObj.sessions[0] || null);
      }
    } catch (err) {
      console.error("Error fetching secure logs/milestones: ", err);
    }
  };

  // Helper: update child profile directly inside user children array
  const updateChildInList = async (userId: string, childId: string, updates: Partial<ChildProfile>, currentList: ChildProfile[]) => {
    const updatedList = currentList.map(c => {
      if (c.id === childId) {
        return { ...c, ...updates };
      }
      return c;
    });
    setChildrenList(updatedList);
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { children: updatedList });
  };

  // Fetch Global Shared Stories
  const fetchGlobalStories = async () => {
    try {
      const storiesSnap = await getDocs(collection(db, "stories"));
      const storiesList = storiesSnap.docs.map(d => ({ id: d.id, ...d.data() } as SharedStory));
      setCustomStories(storiesList);
    } catch (err) {
      console.error("Error loading public stories: ", err);
    }
  };

  // ACTIONS
  const signUp = async (displayName: string) => {
    // Registered successfully. Handle display name mapping if needed.
  };

  const logOut = async () => {
    await auth.signOut();
  };

  const updateParentProfile = async (data: Partial<ParentProfile>) => {
    if (!user) return;
    const newParent = { ...parent, ...data } as ParentProfile;
    setParent(newParent);
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { parent: newParent });
  };

  const updateChildProfile = async (childId: string, data: Partial<ChildProfile>) => {
    if (!user) return;
    await updateChildInList(user.uid, childId, data, childrenList);
  };

  const addChild = async (childData: Omit<ChildProfile, "id" | "sessions" | "completedSessions">) => {
    if (!user) return;
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
    
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { 
      children: newList,
      activeChildId: childId
    });

    // Auto milestone for adding new child profile
    await addCustomMilestone(
      `Welcome, ${childData.name}!`, 
      `Registered a therapy-aligned path for ${childData.name}. Let's make progress!`, 
      "manual"
    );
  };

  const deleteChild = async (childId: string) => {
    if (!user) return;
    const newList = childrenList.filter(c => c.id !== childId);
    setChildrenList(newList);
    const nextActive = newList[0]?.id || null;
    setActiveChildId(nextActive);
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { 
      children: newList,
      activeChildId: nextActive
    });
  };

  // Generate Tomorrow's Recommendation
  const generateNewSession = async () => {
    if (!user || !activeChild) return;
    // Append or cycle sessions
    const generated = generateWeeklyPlan(activeChild);
    // Shuffle or customize to ensure it's not repetitive
    const shuffled = [...generated].sort(() => Math.random() - 0.5);
    // Assign new IDs
    const refreshed = shuffled.map((s, idx) => ({
      ...s,
      id: `session-fresh-${idx}-${Date.now()}`
    }));

    await updateChildInList(user.uid, activeChild.id, { sessions: refreshed }, childrenList);
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
    if (!user || !activeChild) return;

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

    // Save to subcollection
    const logDocRef = doc(db, "users", user.uid, "logs", logId);
    await setDoc(logDocRef, newLog);
    setSessionLogs(prev => [...prev, newLog]);

    // Update child progress metrics
    const newCount = (activeChild.completedAdventuresCount || 0) + 1;
    const updatedCompletedSessions = [...(activeChild.completedSessions || []), sessionId];
    
    // Auto-update score (adds +4 resilience, max 100)
    const newScore = Math.min(100, (activeChild.progressScore || 85) + 4);

    await updateChildInList(user.uid, activeChild.id, {
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
    const completedIds = [...sessionLogs.map(l => l.sessionId), sessionId];
    const incomplete = activeChild.sessions.find(s => !completedIds.includes(s.id));
    if (incomplete) {
      setTodaysSession(incomplete);
    } else {
      await generateNewSession();
    }
  };

  const generateNextWeeklyGoal = async (currentGoal: string) => {
    if (!user || !activeChild) return;
    const goalPool = [
      "Improve Communication",
      "Improve Eye Contact",
      "Improve Sensory Integration",
      "Develop Social Skills",
      "Develop Focus"
    ].filter(g => g !== currentGoal);
    
    const nextGoal = goalPool[Math.floor(Math.random() * goalPool.length)];
    await updateChildInList(user.uid, activeChild.id, { weeklyGoal: nextGoal }, childrenList);
    
    // Clear logs for new weekly cycle
    setSessionLogs([]);
    await addCustomMilestone("New Weekly Track Set!", `Transitioned to: ${nextGoal}`, "goal");
  };

  const addCustomMilestone = async (title: string, description: string, category: any = "manual") => {
    if (!user) return;
    const mId = "m-" + Math.random().toString(36).substring(2, 9);
    const newM: Milestone = {
      id: mId,
      title,
      description,
      date: new Date().toLocaleDateString(),
      category,
      isCustom: true
    };

    const docRef = doc(db, "users", user.uid, "milestones", mId);
    await setDoc(docRef, newM);
    setMilestones(prev => [newM, ...prev]);
  };

  // STORIES ACTIONS
  const submitStory = async (storyData: Omit<SharedStory, "id" | "likes" | "encouragements" | "status" | "userId">) => {
    const sId = "story-" + Math.random().toString(36).substring(2, 9);
    const newStory: SharedStory = {
      ...storyData,
      id: sId,
      likes: 1,
      encouragements: [],
      status: "pending_moderation", // default to pending moderation
      userId: user?.uid || "guest"
    };

    const docRef = doc(db, "stories", sId);
    await setDoc(docRef, newStory);
    setCustomStories(prev => [newStory, ...prev]);
  };

  const approveStory = async (storyId: string) => {
    const docRef = doc(db, "stories", storyId);
    await updateDoc(docRef, { status: "approved" });
    setCustomStories(prev => prev.map(s => s.id === storyId ? { ...s, status: "approved" } : s));
  };

  const likeStory = async (storyId: string) => {
    const target = customStories.find(s => s.id === storyId);
    if (!target) return;
    const docRef = doc(db, "stories", storyId);
    const liked = !target.likedByUser;
    const newLikes = liked ? target.likes + 1 : Math.max(0, target.likes - 1);
    await updateDoc(docRef, { 
      likes: newLikes,
      likedByUser: liked 
    });
    setCustomStories(prev => prev.map(s => s.id === storyId ? { ...s, likedByUser: liked, likes: newLikes } : s));
  };

  const toggleBookmark = async (storyId: string) => {
    if (!user) return;
    const isBookmarked = bookmarks.includes(storyId);
    const updated = isBookmarked 
      ? bookmarks.filter(id => id !== storyId) 
      : [...bookmarks, storyId];
    
    setBookmarks(updated);
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { bookmarks: updated });
  };

  const addReadingHistory = async (storyId: string) => {
    if (!user) return;
    if (readingHistory.includes(storyId)) return;
    const updated = [...readingHistory, storyId];
    setReadingHistory(updated);
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { readingHistory: updated });
  };

  const updateNotificationsConfig = async (config: Record<string, boolean>) => {
    if (!user) return;
    setNotificationsConfig(config);
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { notificationsConfig: config });
  };

  const deleteUserAccount = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);
      // Try to delete current user auth record
      await user.delete();
    } catch (err) {
      console.error("Account deletion: ", err);
    }
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
      deleteUserAccount
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
