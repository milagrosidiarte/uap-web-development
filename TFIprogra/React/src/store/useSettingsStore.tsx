import { create } from "zustand";

type SettingsState = {
  refetchInterval: number;
  setRefetchInterval: (ms: number) => void;
  uppercaseDescriptions: boolean;
  toggleUppercaseDescriptions: () => void;
  setUppercaseDescriptions: (value: boolean) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  refetchInterval: 10000,
  setRefetchInterval: (ms) => set({ refetchInterval: ms }),
  uppercaseDescriptions: false,
  toggleUppercaseDescriptions: () => set((state) => ({ uppercaseDescriptions: !state.uppercaseDescriptions })),
  setUppercaseDescriptions: (value) => set({ uppercaseDescriptions: value }),
}));