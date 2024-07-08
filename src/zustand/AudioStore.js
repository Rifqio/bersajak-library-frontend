import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAudioStore = create(
  persist(
    (set) => ({
      isAudioEnabled: false,
      firstVisit: true,
      setIsAudioEnabled: (value) => set({ isAudioEnabled: value, firstVisit: false }),
    }),
    { name: "audio-state", storage: createJSONStorage(() => localStorage) }
  )
);

export default useAudioStore;
