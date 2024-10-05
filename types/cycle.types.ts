export type Cycle = {
  id: string | null;
  userId: string | null;
  markerId: string | null;
  item: CycleItem;
  createdAt: string | null;
};

export type CycleItem = {
  id: string | null;
  name: string;
  description: string;
  createdAt: string | null;
};

export type CycleStore = {
  cycles: Cycle[];

  addCycle: (cycle: Cycle) => void;
  setCycles: (cycles: Cycle[]) => void;
};
