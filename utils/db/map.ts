import { Marker } from "../../types/map.types";
import { supabase } from "../supabase";
import { useMapStore } from "../../state/stores/mapStore";
import { LogEventType } from "../../types/user.types";

export const addNewMarker = async (marker: Marker) => {
  const { data, error } = await supabase
    .from("markers")
    .insert([
      {
        title: marker.title,
        user_id: marker.userId,
        longitude: marker.longitude,
        latitude: marker.latitude,
      },
    ])
    .select("*")
    .single();

  const { data: logData, error: logError } = await supabase
    .from("logs")
    .insert([
      {
        user_id: marker.userId,
        data_id: data?.id,
        type: LogEventType.NEW_MARKER,
      },
    ]);

  if (logError) {
    console.error("Error adding log:", logError.message);
    return { data: null, error };
  }

  useMapStore.getState().addMarker({ ...marker, id: data?.id });

  return { data, error };
};

export const getMarkers = async () => {
  const { data, error } = await supabase.from("markers").select("*");
  return { data: data as Marker[], error };
};
