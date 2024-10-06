import { useCycleStore } from "../../state/stores/cycleStore";
import { useUserStore } from "../../state/stores/userStore";
import { Cycle } from "../../types/cycle.types";
import { LogEventType } from "../../types/user.types";
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

  const { data: logData, error: logError } = await supabase
    .from("logs")
    .insert([
      {
        user_id: cycle.userId,
        data_id: cycle.id,
        type: LogEventType.NEW_CYCLE,
      },
    ])
    .select("*")
    .single();

  if (logError) {
    console.error("Error adding log:", logError.message);
    return { data: null, error };
  }
  if (logData) {
    console.log("Added log:", logData);
    useUserStore.getState().addLog(logData);
  }

  if (error) {
    console.error("Error adding cycle:", error.message);
    return { data: null, error };
  }
  useCycleStore.getState().addCycle(cycle);

  return { data, error };
};

export const loadUserCycles = async (userId: string) => {
  const { data: cycles, error } = await supabase
    .from("cycles")
    .select("*")
    .eq("userId", userId);

  if (error) {
    console.error("Error getting cycles:", error.message);
    return { cycles: null, error };
  }
  if (!cycles) {
    return { cycles: null, error };
  }

  for (const cycle of cycles) {
    const { data: cycleItems, error } = await supabase
      .from("cycle_items")
      .select("*")
      .eq("cycle_id", cycle.id);

    cycle.items = cycleItems;
  }

  return { cycles, error };
};
