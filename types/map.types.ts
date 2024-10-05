export type MapStore = {
  markers: Marker[];

  addMarker: (marker: Marker) => void;
  setMarkers: (markers: Marker[]) => void;
};

export type Marker = {
  id: string | null;
  userId: string | null;
  coordinate: {
    latitude: number;
    longitude: number;
  };
};
