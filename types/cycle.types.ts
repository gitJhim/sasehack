import { LogEvent } from "./user.types";

export type Cycle = {
  id: string | null;
  userId: string | null;
  markerId: string | null;
  items: CycleItem[];
  createdAt: string | null;
};

export type CycleItem = {
  id: string | null;
  cycleId: string | null;
  type: CycleItemType;
  quantity: number;
};
export type CycleItemType = "Bottle" | "Bag" | "Can";

export type CycleStore = {
  cycles: Cycle[];

  addCycle: (cycle: Cycle) => void;
  setCycles: (cycles: Cycle[]) => void;
};
