import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { fastStorage } from "../store";
import { immer } from "zustand/middleware/immer";
import { MapStore, Marker } from "../../types/map.types";

export const useMapStore = create<MapStore>(
  persist(
    immer((set) => ({
      markers: [],

      setMarkers: (markers: Marker[]) => set({ markers }),
      // use push
      addMarker: (marker: Marker) =>
        set((state: { markers: any }) => ({
          markers: [...state.markers, marker],
        })),
    })),
    {
      name: "map-storage",
      storage: createJSONStorage(() => fastStorage),
    },
  ) as any,
);
