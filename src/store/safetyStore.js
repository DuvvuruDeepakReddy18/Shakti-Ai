import { create } from 'zustand';

const useSafetyStore = create((set, get) => ({
  sosActive: false,
  sosTimer: null,
  isRecording: false,
  liveLocation: { lat: 40.7128, lng: -74.0060 },
  nearbyVolunteers: [
    { id: 1, name: 'Sarah M.', distance: '0.2 mi', rating: 4.9, active: true },
    { id: 2, name: 'Jessica K.', distance: '0.5 mi', rating: 4.8, active: true },
    { id: 3, name: 'Priya R.', distance: '0.8 mi', rating: 5.0, active: true },
  ],
  safetyScore: { score: 8.5, label: 'Safe', color: '#10B981' },
  sosProgress: 0,
  shakeCount: 0,
  lastShakeTime: 0,

  // SOS Actions
  startSOSCountdown: () => {
    set({ sosProgress: 0 });
    const interval = setInterval(() => {
      const { sosProgress } = get();
      if (sosProgress >= 100) {
        clearInterval(interval);
        get().activateSOS();
      } else {
        set({ sosProgress: sosProgress + 3.33 });
      }
    }, 100);
    set({ sosTimer: interval });
  },

  cancelSOSCountdown: () => {
    const { sosTimer } = get();
    if (sosTimer) clearInterval(sosTimer);
    set({ sosTimer: null, sosProgress: 0 });
  },

  activateSOS: () => {
    set({ sosActive: true, sosProgress: 100 });
    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          set({ liveLocation: { lat: pos.coords.latitude, lng: pos.coords.longitude } });
        },
        () => console.log('Location access denied')
      );
    }
  },

  deactivateSOS: () => {
    const { sosTimer } = get();
    if (sosTimer) clearInterval(sosTimer);
    set({ 
      sosActive: false, 
      sosTimer: null, 
      sosProgress: 0, 
      isRecording: false 
    });
  },

  // Recording
  startRecording: () => set({ isRecording: true }),
  stopRecording: () => set({ isRecording: false }),

  // Location
  updateLocation: (location) => set({ liveLocation: location }),

  // Safety Score
  setSafetyScore: (score) => set({ safetyScore: score }),

  // Shake detection
  registerShake: () => {
    const now = Date.now();
    const { lastShakeTime, shakeCount } = get();
    
    if (now - lastShakeTime < 1000) {
      const newCount = shakeCount + 1;
      set({ shakeCount: newCount, lastShakeTime: now });
      if (newCount >= 3) {
        get().activateSOS();
        set({ shakeCount: 0 });
      }
    } else {
      set({ shakeCount: 1, lastShakeTime: now });
    }
  },

  // Volunteers
  setNearbyVolunteers: (volunteers) => set({ nearbyVolunteers: volunteers }),
}));

export default useSafetyStore;
