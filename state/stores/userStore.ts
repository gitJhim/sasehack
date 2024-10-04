import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { fastStorage } from "../store";
import { immer } from "zustand/middleware/immer";
import { UserStore } from "../../types/user.types";

export const useUserStore = create<UserStore>(
  persist(
    immer((set) => ({
      user: null,
      setUser: (user: null) => set({ user }),
    })),
    {
      name: "user-storage",
      storage: createJSONStorage(() => fastStorage),
    },
  ) as any,
);
