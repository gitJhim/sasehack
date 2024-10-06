import { Marker } from "../../types/map.types";
import { supabase } from "../supabase";
import { useMapStore } from "../../state/stores/mapStore";
import { LogEventType } from "../../types/user.types";
import { useUserStore } from "../../state/stores/userStore";

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

  useMapStore.getState().addMarker({ ...marker, id: data?.id });

  return { data, error };
};

export const getMarkers = async () => {
  const { data, error } = await supabase.from("markers").select("*");
  return { data: data as Marker[], error };
};

export const loadUserMarkers = async (userId: string) => {
  const { data, error } = await supabase
    .from("markers")
    .select("*")
    .eq("user_id", userId);
  console.log("User markers: ", data);
  return { data: data as Marker[], error };
};

export const uploadMarkerImage = async (markerId: string, path: string) => {
  const { data, error } = await supabase.storage
    .from("bin-photos")
    .upload(markerId + ".jpeg", path, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading marker image:", error.message);
    return { data: null, error };
  }

  console.log("Uploaded marker image:", data);

  return { data, error };
};
