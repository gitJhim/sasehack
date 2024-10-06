export type MapStore = {
  markers: Marker[];

  addMarker: (marker: Marker) => void;
  setMarkers: (markers: Marker[]) => void;
};

// TODO: Add title and save to db
export type Marker = {
  id: string | null;
  userId: string | null;
  latitude: number;
  longitude: number;
  createdAt: string | null;
};
