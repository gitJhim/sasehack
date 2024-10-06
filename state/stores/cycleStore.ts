import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { fastStorage } from "../store";
import { immer } from "zustand/middleware/immer";
import { Cycle, CycleStore } from "../../types/cycle.types";

export const useCycleStore = create<CycleStore>(
  persist(
    immer((set) => ({
      cycles: [],

      setCycles: (cycles: Cycle[]) => set({ cycles }),

      addCycle: (cycle: Cycle) =>
        set((state: { cycles: any }) => ({
          cycles: [...state.cycles, cycle],
        })),
    })),
    {
      name: "cycle-storage",
      storage: createJSONStorage(() => fastStorage),
    },
  ) as any,
);
