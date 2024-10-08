import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import * as Location from "expo-location";
import { useMapStore } from "../state/stores/mapStore";
import { useUserStore } from "../state/stores/userStore";
import SignInModal from "./SignInModal";
import { getMarkerPhoto, getMarkers } from "../utils/db/map";
import AddCycleModal from "./AddCycleModal";
import { Marker as MarkerType } from "../types/map.types";
import uuid from "react-native-uuid";
import { analyzeImage } from "../utils/ai/analysis";
import Modal from "react-native-modal";
import AddBinModal from "./AddBinModal";

export default function Map() {
  const markers = useMapStore((state) => state.markers);
  const setMarkers = useMapStore((state) => state.setMarkers);
  const user = useUserStore((state) => state.user);
  const initialLocation = {
    latitude: 39.75,
    longitude: -84.19,
  };
  const [myLocation, setMyLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [region, setRegion] = useState({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef<MapView>(null);
  const [signInModalVisible, setSignInModalVisible] = useState(false);
  const [recycleModalVisible, setRecycleModalVisible] = useState(false);
  const [addBinModalVisible, setAddBinModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.warn("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setMyLocation(location.coords);
  };

  useEffect(() => {
    const loadMarkers = async () => {
      const { data: markers, error } = await getMarkers();
      if (error) {
        console.error("Error loading markers:", error.message);
      } else {
        setMarkers(markers);
      }
    };

    loadMarkers();
    getCurrentLocation();
  }, []);

  const goToCurrentLocation = () => {
    if (myLocation) {
      const newRegion = {
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      mapRef.current?.animateToRegion(newRegion);
    }
  };

  const onAddMarker = async () => {
    console.log(user);
    if (!user) {
      setSignInModalVisible(true);
      return;
    }
    setAddBinModalVisible(true);
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => {
    return (
      <View className="flex-row justify-between items-center">
        <Text className="text-sm font-semibold text-gray-600">{label}:</Text>
        <Text className="text-sm font-bold text-gray-800">{value}</Text>
      </View>
    );
  };

  const renderMarkers = () => {
    return markers.map((marker) => (
      <BinMarker marker={marker} key={marker.id} />
    ));
  };

  const BinMarker = ({ marker }: { marker: MarkerType }) => {
    const [imageUri, setImageUri] = useState<string>("a");

    useEffect(() => {
      const loadImage = async () => {
        if (!marker.id) return;
        const image = await getMarkerPhoto(marker.id);
        setImageUri(image);
      };
      loadImage();
      analyzeImage(imageUri);
    }, []);

    return (
      <Marker
        key={marker.id}
        coordinate={{
          latitude: marker.latitude,
          longitude: marker.longitude,
        }}
        image={require("../assets/marker.png")}
        onPress={() => setSelectedMarker(marker)}
        onDeselect={() => setSelectedMarker(null)}
      >
        <Callout onPress={() => setRecycleModalVisible(true)}>
          <View className="bg-white rounded-2xl overflow-hidden shadow-lg w-72">
            <Text className="">
              <Image
                style={{ height: 400, width: 400 }}
                source={{ uri: imageUri }}
                resizeMode="repeat"
              />
            </Text>
            <View className="p-4">
              <Text className="text-2xl font-bold mb-3 text-center text-green-700">
                Recycling Bin
              </Text>
              <View className="space-y-2">
                <InfoRow label="Estimated Capacity" value={"100"} />
                <InfoRow label="Items Recycled" value={"100"} />
                <InfoRow label="Est. Weight Recycled" value={"100"} />
              </View>
              <View className="bg-green-600 py-3 px-4 rounded-xl mt-4 shadow-md">
                <Text className="text-white font-bold text-center text-lg">
                  Recycle Now
                </Text>
              </View>
            </View>
          </View>
        </Callout>
      </Marker>
    );
  };
  return (
    <View className="flex flex-col justify-center items-center">
      <SignInModal
        isVisible={signInModalVisible}
        setModalVisible={setSignInModalVisible}
      />
      <AddCycleModal
        isVisible={recycleModalVisible}
        setModalVisible={setRecycleModalVisible}
        markerId={selectedMarker?.id || ""}
        cycleId={uuid.v4().toString()}
      />
      <AddBinModal
        longitude={myLocation?.longitude || 0}
        latitude={myLocation?.latitude || 0}
        isVisible={addBinModalVisible}
        setModalVisible={setAddBinModalVisible}
      />
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        onMapReady={() => {
          getCurrentLocation();
          goToCurrentLocation();
        }}
      >
        {renderMarkers()}
      </MapView>
      <TouchableOpacity
        onPress={goToCurrentLocation}
        style={styles.relocateButton}
      >
        <Image
          source={require("../assets/self.png")}
          style={{ width: 40, height: 40 }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onAddMarker()} style={styles.addButton}>
        <Image
          source={require("../assets/add_2.png")}
          style={{ width: 40, height: 40 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  addButton: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.18,
    right: Dimensions.get("window").width * 0.05,
    backgroundColor: "#17A773",
    padding: 16,
    borderRadius: 24,
  },
  relocateButton: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.3,
    right: Dimensions.get("window").width * 0.05,
    backgroundColor: "#e2e8f0",
    padding: 16,
    borderRadius: 24,
  },
});
