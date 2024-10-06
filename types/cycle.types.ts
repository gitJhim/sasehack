export type Cycle = {
  id: string | null;
  userId: string | null;
  markerId: string | null;
  items: CycleItem[];
  created_at: string | null;
};

export type CycleItem = {
  id: string | null;
  cycleId: string | null;
  type: CycleItemType;
  quantity: number;
};

export type CycleItemType =
  | "plastic bottle"
  | "cardboard box"
  | "aluminum can"
  | "glass bottle"
  | "plastic bag"
  | "soda can"
  | "paper cup";

export type CycleStore = {
  cycles: Cycle[];

  addCycle: (cycle: Cycle) => void;
  setCycles: (cycles: Cycle[]) => void;
};
