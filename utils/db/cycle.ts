import { useCycleStore } from "../../state/stores/cycleStore";
import { Cycle } from "../../types/cycle.types";
import { supabase } from "../supabase";

export const addNewCycle = async (cycle: Cycle) => {
  const { data, error } = await supabase
    .from("cycles")
    .insert([
      {
        id: cycle.id,
        userId: cycle.userId,
        markerId: cycle.markerId,
      },
    ])
    .select("*")
    .single();

  for (const cycleItem of cycle.items) {
    const { data: itemData, error } = await supabase
      .from("cycle_items")
      .insert([
        {
          cycle_id: cycle.id,
          type: cycleItem.type,
          quantity: cycleItem.quantity,
        },
      ]);
    if (error) {
      console.error("Error adding cycle item:", error.message);
      return { data: null, error };
    }
  }

  if (error) {
    console.error("Error adding cycle:", error.message);
    return { data: null, error };
  }
  useCycleStore.getState().addCycle(cycle);

  return { data, error };
};

export const getCycles = async () => {
  const { data, error } = await supabase
    .from("cycles")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
};
