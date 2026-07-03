import { ChildProfile, ParentProfile, TherapySession } from "./personalization";
import { SessionLog, Milestone, SharedStory } from "./SaasContext";

export const MOCK_PARENT: ParentProfile = {
  parentName: "Sarah",
  relationship: "Mother",
  language: "en",
  country: "United States",
  timezone: "PST"
};

export const MOCK_CHILD: Omit<ChildProfile, "sessions"> = {
  id: "aarav-child-123",
  name: "Aarav",
  nickname: "Aaru",
  age: "6",
  dob: "2020-05-15",
  gender: "Male",
  diagnosis: "Autism Spectrum Disorder (Level 1)",
  therapyGoals: ["Improve verbal expression", "Self-regulation during transitions", "Social eye contact"],
  interests: ["Space", "Nature"],
  favoriteToys: "Glowing Star Projector & Magnetic Blocks",
  favoriteFoods: "Crispy Apple Slices & Crackers",
  thingsThatCalm: "Gentle humming, deep-pressure hugs, dimming lights",
  thingsThatUpset: "High-pitched alarms, wet hands, sudden load transitions",
  communicationLevel: "Uses short phrases & picture cards",
  currentTherapy: "Speech & Occupational Therapy",
  therapyFrequency: "3 times a week",
  currentChallenges: ["Transitions", "Sensory processing of loud sounds"],
  weeklyGoal: "Improve Communication",
  progressScore: 85,
  completedAdventuresCount: 3,
  completedSessions: ["day-1", "day-2"]
};

export const MOCK_SESSION_LOGS: SessionLog[] = [
  {
    id: "log-1",
    sessionId: "session-1",
    sessionTitle: "🗣️ Jugar con 🦁 El Reino Animal",
    completionTime: "2026-06-30, 4:15 PM",
    duration: 15,
    activitiesCompleted: ["Hold lion plush", "Wait 4 seconds for sound/gesture", "Reward with apple slice"],
    childMood: "Calm",
    parentNotes: "Aarav loved the lion plush and made 'roar' vocalizations when prompted! Excellent eye contact today."
  },
  {
    id: "log-2",
    sessionId: "session-2",
    sessionTitle: "🗣️ Naming the Space",
    completionTime: "2026-07-01, 3:30 PM",
    duration: 20,
    activitiesCompleted: ["Turn on star projector", "Name colors of stars", "High-five praise"],
    childMood: "Happy",
    parentNotes: "Extremely engaged with the projector. Pointed at the green stars and repeated 'star' twice."
  },
  {
    id: "log-3",
    sessionId: "session-3",
    sessionTitle: "🧘 Calming Deep Breathing Wave",
    completionTime: "2026-07-02, 5:10 PM",
    duration: 10,
    activitiesCompleted: ["Follow visual wave pattern", "Inhale/Exhale 5 cycles", "Warm praise"],
    childMood: "Calm",
    parentNotes: "Successfully followed 3 breath cycles independently before transitioning to dinner."
  }
];

export const MOCK_MILESTONES: Milestone[] = [
  {
    id: "m-1",
    title: "First Conversation Goal Met!",
    description: "Successfully named three animal shapes during the Lion Adventure session!",
    date: "2026-06-30",
    category: "session",
    isCustom: true
  },
  {
    id: "m-2",
    title: "3-Day Learning Streak!",
    description: "Successfully engaged in home-based therapeutic activities for three consecutive days.",
    date: "2026-07-01",
    category: "streak",
    isCustom: true
  },
  {
    id: "m-3",
    title: "Self-Regulation Triumph",
    description: "Independently asked for the Breathing wave exercise when sensory overloaded.",
    date: "2026-07-02",
    category: "goal",
    isCustom: true
  }
];

export const MOCK_STORIES: SharedStory[] = [
  {
    id: "demo-story-1",
    title: "Connecting Through Space Projectors",
    author: "Elena (Mom)",
    age: "5",
    country: "Canada",
    readTime: "3 min read",
    category: "Sensory Play",
    excerpt: "How a simple 10-dollar glowing star projector opened the floodgates of communication for my non-verbal son Lucas.",
    coverStyle: "from-purple-600 to-indigo-800",
    content: {
      challenges: "Lucas was completely non-verbal and rarely maintained eye contact. Traditional cards caused sensory distress.",
      whatHelped: "We introduced a dark-room star projector. The calming visual rhythm kept him regulated, allowing us to slowly introduce speech play.",
      turningPoint: "One evening, Lucas pointed at the projected ceiling and clearly said 'star' while looking directly into my eyes.",
      advice: "Follow your child's interest. Do not force standard tools if they enjoy something specific. Turn that interest into a therapeutic canvas."
    },
    likes: 42,
    likedByUser: false,
    encouragements: ["Inspirational!", "Lucas is amazing!"],
    privacy: "Public",
    status: "approved"
  },
  {
    id: "demo-story-2",
    title: "The Power of Visual Cooking Therapy",
    author: "David (Dad)",
    age: "7",
    country: "United Kingdom",
    readTime: "4 min read",
    category: "Life Skills",
    excerpt: "Using visual recipes with animal characters to teach sequencing and coordination to my daughter Chloe.",
    coverStyle: "from-teal-500 to-emerald-700",
    content: {
      challenges: "Chloe struggled with fine motor coordination, multi-step directions, and sensory aversion to new foods.",
      whatHelped: "We created simplified, visual step-by-step cartoon guides for baking. She could match the physical ingredients to the drawings.",
      turningPoint: "She successfully chopped soft bananas, counted out the oats, and proudly served her creation to her brother.",
      advice: "Cooking is occupational therapy. Slow down, make every step a puzzle, and let them touch, smell, and experience food at their own pace."
    },
    likes: 29,
    likedByUser: false,
    encouragements: ["A brilliant approach!", "Cooking together rules!"],
    privacy: "Public",
    status: "approved"
  }
];
