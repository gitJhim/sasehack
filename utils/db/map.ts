import { Marker } from "../../types/map.types";
import { supabase } from "../supabase";
import { useMapStore } from "../../state/stores/mapStore";

export const addNewMarker = async (marker: Marker) => {
  const { data, error } = await supabase
    .from("markers")
    .insert([
      {
        user_id: marker.userId,
        longitude: marker.longitude,
        latitude: marker.latitude,
      },
    ])
    .select("*")
    .single();

  useMapStore.getState().addMarker({ ...marker, id: data?.id });

  return { data, error };
};

export const getMarkers = async () => {
  const { data, error } = await supabase.from("markers").select("*");
  return { data: data as Marker[], error };
};
