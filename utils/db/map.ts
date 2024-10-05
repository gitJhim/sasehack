import { Marker } from "../../types/map.types";
import { supabase } from "../supabase";

export const addNewMarker = async (marker: Marker) => {
  const { data, error } = await supabase
    .from("markers")
    .insert([
      {
        user_id: marker.userId,
        longitude: marker.coordinate.longitude,
        latitude: marker.coordinate.latitude,
      },
    ])
    .select("*")
    .single();

  return { user: data, error };
};
