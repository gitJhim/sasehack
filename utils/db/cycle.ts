import { useCycleStore } from "../../state/stores/cycleStore";
import { Cycle } from "../../types/cycle.types";
import { supabase } from "../supabase";

export const addNewMarker = async (cycle: Cycle) => {
  const { data, error } = await supabase
    .from("markers")
    .insert([
      {
        userid: cycle.userId,
        markerid: cycle.markerId,
      },
    ])
    .select("*")
    .single();

  useCycleStore.getState().addCycle({ ...cycle, id: data?.id });

  return { data, error };
};

export const getCycles = async () => {
  const { data, error } = await supabase
    .from("cycles")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
};
