import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { fastStorage } from "../store";
import { immer } from "zustand/middleware/immer";
import { UserStore } from "../../types/user.types";
import { Event } from "../../types/user.types";

export const useUserStore = create<UserStore>(
  persist(
    immer((set) => ({
      user: null,
      logs: [],
      session: null,

      setLogs: (logs: Event[]) => set({ logs }),
      addLog: (log: Event) =>
        set((state: { logs: Event[] }) => {
          [...state.logs, log];
        }),
      setSession: (session: null) => set({ session }),
      setUser: (user: null) => set({ user }),
    })),
    {
      name: "user-storage",
      storage: createJSONStorage(() => fastStorage),
    },
  ) as any,
);
