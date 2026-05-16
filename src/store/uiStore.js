import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUiStore = create(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((state) => {
        const newMode = !state.darkMode;
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { darkMode: newMode };
      }),
      setDarkMode: (mode) => set((state) => {
        if (mode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { darkMode: mode };
      }),
      fakeCallActive: false,
      triggerFakeCall: () => set({ fakeCallActive: true }),
      endFakeCall: () => set({ fakeCallActive: false }),
    }),
    {
      name: 'shakti-ui-v2',
    }
  )
);

export const initTheme = () => {
  const isDark = useUiStore.getState().darkMode;
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export default useUiStore;
