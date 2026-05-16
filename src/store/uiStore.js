import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUiStore = create(
  persist(
    (set) => ({
      darkMode: false,
      // Theme toggle is disabled — app is light-only.
      // Keeping the methods so no call sites break.
      toggleDarkMode: () => {},
      setDarkMode: () => {},
      fakeCallActive: false,
      triggerFakeCall: () => set({ fakeCallActive: true }),
      endFakeCall: () => set({ fakeCallActive: false }),
    }),
    {
      name: 'shakti-ui-v2',
      // Force darkMode to false on every rehydration so
      // users who previously toggled dark mode get reset.
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.darkMode = false;
        }
      },
    }
  )
);

export const initTheme = () => {
  // Always enforce light mode — remove any lingering dark class
  document.documentElement.classList.remove('dark');

  // Also nuke the old persisted state if it had darkMode: true
  try {
    const raw = localStorage.getItem('shakti-ui-v2');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.darkMode) {
        parsed.state.darkMode = false;
        localStorage.setItem('shakti-ui-v2', JSON.stringify(parsed));
      }
    }
  } catch (_) {
    // ignore
  }
};

export default useUiStore;
