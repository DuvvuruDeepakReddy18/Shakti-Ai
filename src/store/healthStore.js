import { create } from 'zustand';

const useHealthStore = create((set, get) => ({
  todayMood: null,
  todayEnergy: 7,
  moodHistory: [
    { date: new Date(Date.now() - 86400000).toISOString(), mood: 'good', energy: 8, notes: 'Feeling productive today!' },
    { date: new Date(Date.now() - 172800000).toISOString(), mood: 'okay', energy: 6, notes: 'A bit tired but managing.' },
  ],
  menstrualData: {
    lastPeriod: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
    cycleLength: 28,
    periodLength: 5,
    symptoms: ['cramps', 'bloating']
  },
  chatHistory: [
    { role: 'assistant', content: "Hi! I'm your AI health companion. How are you feeling today?" }
  ],
  wellnessStreak: 3,

  // Mood
  setTodayMood: (mood) => set({ todayMood: mood }),
  setTodayEnergy: (energy) => set({ todayEnergy: energy }),
  addMoodEntry: (entry) => set((state) => ({ 
    moodHistory: [entry, ...state.moodHistory] 
  })),

  // Menstrual
  updateMenstrualData: (data) => set((state) => ({
    menstrualData: { ...state.menstrualData, ...data }
  })),

  // Chat
  addChatMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, message]
  })),
  clearChat: () => set({ chatHistory: [] }),

  // Streak
  incrementStreak: () => set((state) => ({ wellnessStreak: state.wellnessStreak + 1 })),
  resetStreak: () => set({ wellnessStreak: 0 }),
}));

export default useHealthStore;
