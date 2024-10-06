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
  | "Plastic Bottle"
  | "Cardboard Box"
  | "Aluminum Can"
  | "Glass Bottle"
  | "Plastic Bag"
  | "Soda Can"
  | "Paper Cup";

export type CycleStore = {
  cycles: Cycle[];

  addCycle: (cycle: Cycle) => void;
  setCycles: (cycles: Cycle[]) => void;
};
