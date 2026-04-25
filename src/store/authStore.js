import { create } from 'zustand';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return key && key !== 'your_firebase_key' && key.length > 10;
};

// Demo user data for when Firebase isn't configured
const DEMO_USER = {
  uid: 'demo-user-001',
  email: 'demo@shakti.ai',
  displayName: 'Shakti Warrior',
  photoURL: null,
};

const calculateLevel = (points) => {
  if (points >= 5000) return 'Shakti Champion';
  if (points >= 2000) return 'Leader';
  if (points >= 800) return 'Protector';
  if (points >= 200) return 'Explorer';
  return 'Beginner';
};

const DEMO_PROFILE = {
  uid: 'demo-user-001',
  name: 'Shakti Warrior',
  email: 'demo@shakti.ai',
  phone: '+91 9876543210',
  photoURL: '',
  mode: 'student',
  emergencyContacts: [
    { name: 'Mom', phone: '+91 9000000001', relation: 'Mother' },
    { name: 'Best Friend', phone: '+91 9000000002', relation: 'Friend' },
  ],
  location: { lat: 12.9716, lng: 77.5946 },
  isVolunteer: false,
  skills: ['Coding', 'Design', 'Writing'],
  interests: ['AI', 'Web Dev'],
  safetyScore: 100,
  moodHistory: [],
  menstrualData: { lastPeriod: null, cycleLength: 28, periodLength: 5 },
  onboardingComplete: false,
  ageRange: '18-24',
  city: 'Bangalore',
  shePoints: 60,
  sheLevel: 'Beginner',
};

const useAuthStore = create((set, get) => ({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  isDemo: false,

  // Initialize auth listener
  initAuth: () => {
    if (!isFirebaseConfigured()) {
      // Demo mode — skip Firebase entirely
      console.log('🟡 SHAKTI AI running in DEMO mode (Firebase not configured). Data persists locally.');
      const savedUser = localStorage.getItem('shakti_demo_user');
      if (savedUser) {
        const demoUser = JSON.parse(savedUser);
        const savedProfile = localStorage.getItem(`shakti_demo_profile_${demoUser.email}`);
        const demoProfile = savedProfile ? JSON.parse(savedProfile) : { ...DEMO_PROFILE, email: demoUser.email };
        set({ user: demoUser, userProfile: demoProfile, loading: false, isDemo: true });
      } else {
        set({ user: null, userProfile: null, loading: false, isDemo: true });
      }
      return;
    }

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profileDoc = await getDoc(doc(db, 'users', user.uid));
          const userProfile = profileDoc.exists() ? profileDoc.data() : null;
          set({ user, userProfile, loading: false });
        } catch {
          set({ user, userProfile: null, loading: false });
        }
      } else {
        set({ user: null, userProfile: null, loading: false });
      }
    });
  },

  // Email/Password Sign Up
  signUp: async (email, password, name) => {
    set({ error: null, loading: true });

    if (!isFirebaseConfigured()) {
      // Demo mode signup
      const demoUser = { ...DEMO_USER, email, displayName: name };
      const demoProfile = { ...DEMO_PROFILE, email, name };
      localStorage.setItem('shakti_demo_user', JSON.stringify(demoUser));
      localStorage.setItem(`shakti_demo_profile_${email}`, JSON.stringify(demoProfile));
      set({ user: demoUser, userProfile: demoProfile, loading: false, isDemo: true });
      return demoUser;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        phone: '',
        photoURL: result.user.photoURL || '',
        mode: 'student',
        emergencyContacts: [],
        location: { lat: 0, lng: 0 },
        isVolunteer: false,
        skills: [],
        interests: [],
        safetyScore: 100,
        moodHistory: [],
        menstrualData: {},
        onboardingComplete: false,
        shePoints: 10,
        sheLevel: 'Beginner',
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp()
      });

      const profileDoc = await getDoc(doc(db, 'users', result.user.uid));
      set({ user: result.user, userProfile: profileDoc.data(), loading: false });
      return result.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Email/Password Sign In
  signIn: async (email, password) => {
    set({ error: null, loading: true });

    if (!isFirebaseConfigured()) {
      // Demo mode signin
      const savedUser = localStorage.getItem('shakti_demo_user');
      const demoUser = savedUser ? JSON.parse(savedUser) : { ...DEMO_USER, email };
      demoUser.email = email; // Ensure email matches
      
      const savedProfile = localStorage.getItem(`shakti_demo_profile_${email}`);
      const demoProfile = savedProfile ? JSON.parse(savedProfile) : { ...DEMO_PROFILE, email, name: email.split('@')[0] };
      
      localStorage.setItem('shakti_demo_user', JSON.stringify(demoUser));
      localStorage.setItem(`shakti_demo_profile_${email}`, JSON.stringify(demoProfile));
      set({ user: demoUser, userProfile: demoProfile, loading: false, isDemo: true });
      return demoUser;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const profileDoc = await getDoc(doc(db, 'users', result.user.uid));
      set({ user: result.user, userProfile: profileDoc.exists() ? profileDoc.data() : null, loading: false });
      return result.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Google Sign In
  signInWithGoogle: async () => {
    set({ error: null, loading: true });

    if (!isFirebaseConfigured()) {
      // Demo mode Google signin
      const email = 'google-demo@shakti.ai';
      const demoUser = { ...DEMO_USER, email, displayName: 'Google User' };
      const savedProfile = localStorage.getItem(`shakti_demo_profile_${email}`);
      const demoProfile = savedProfile ? JSON.parse(savedProfile) : { ...DEMO_PROFILE, email, name: 'Google User' };
      
      localStorage.setItem('shakti_demo_user', JSON.stringify(demoUser));
      localStorage.setItem(`shakti_demo_profile_${email}`, JSON.stringify(demoProfile));
      
      set({ user: demoUser, userProfile: demoProfile, loading: false, isDemo: true });
      return demoUser;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const profileDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!profileDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          name: result.user.displayName || '',
          email: result.user.email || '',
          phone: result.user.phoneNumber || '',
          photoURL: result.user.photoURL || '',
          mode: 'student',
          emergencyContacts: [],
          location: { lat: 0, lng: 0 },
          isVolunteer: false,
          skills: [],
          interests: [],
          safetyScore: 100,
          moodHistory: [],
          menstrualData: {},
          onboardingComplete: false,
          shePoints: 10,
          sheLevel: 'Beginner',
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp()
        });
      }

      const updatedProfile = await getDoc(doc(db, 'users', result.user.uid));
      set({ user: result.user, userProfile: updatedProfile.data(), loading: false });
      return result.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Sign Out (aliased as both signOut and logout)
  signOut: async () => {
    try {
      if (isFirebaseConfigured()) {
        await firebaseSignOut(auth);
      } else {
        localStorage.removeItem('shakti_demo_user');
      }
      set({ user: null, userProfile: null, isDemo: false });
    } catch (error) {
      set({ error: error.message });
    }
  },

  logout: async () => {
    return get().signOut();
  },

  // Reset Password
  resetPassword: async (email) => {
    if (!isFirebaseConfigured()) return;
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (data) => {
    const { user, isDemo } = get();
    if (!user) return;

    if (isDemo || !isFirebaseConfigured()) {
      // Demo mode — merge into local state and persist
      set(state => {
        const updatedProfile = { ...state.userProfile, ...data };
        localStorage.setItem(`shakti_demo_profile_${state.user.email}`, JSON.stringify(updatedProfile));
        return { userProfile: updatedProfile };
      });
      return;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...data,
        lastActive: serverTimestamp()
      }, { merge: true });
      const profileDoc = await getDoc(doc(db, 'users', user.uid));
      set({ userProfile: profileDoc.data() });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Award ShePoints and calculate level
  awardPoints: async (pointsToAdd, reason) => {
    const { user, userProfile, isDemo } = get();
    if (!user || !userProfile) return;

    const newPoints = (userProfile.shePoints || 0) + pointsToAdd;
    const newLevel = calculateLevel(newPoints);
    
    // Create transaction log
    const transaction = {
      points: pointsToAdd,
      reason,
      timestamp: new Date().toISOString()
    };

    if (isDemo || !isFirebaseConfigured()) {
      set(state => {
        const updatedProfile = {
          ...state.userProfile,
          shePoints: newPoints,
          sheLevel: newLevel,
          shePointsHistory: [...(state.userProfile?.shePointsHistory || []), transaction]
        };
        localStorage.setItem(`shakti_demo_profile_${state.user.email}`, JSON.stringify(updatedProfile));
        return { userProfile: updatedProfile };
      });
      return { newPoints, newLevel };
    }

    try {
      // Keep only last 20 transactions to save space
      const history = [...(userProfile.shePointsHistory || []), transaction].slice(-20);
      
      await setDoc(doc(db, 'users', user.uid), {
        shePoints: newPoints,
        sheLevel: newLevel,
        shePointsHistory: history,
        lastActive: serverTimestamp()
      }, { merge: true });

      const profileDoc = await getDoc(doc(db, 'users', user.uid));
      set({ userProfile: profileDoc.data() });
      
      return { newPoints, newLevel };
    } catch (error) {
      console.error("Failed to award points:", error);
      return null;
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useAuthStore;
