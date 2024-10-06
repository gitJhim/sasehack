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
import Modal from "react-native-modal";
import { useMapStore } from "../state/stores/mapStore";
import { useUserStore } from "../state/stores/userStore";
import SignInModal from "./SignInModal";
import { getMarkers } from "../utils/db/map";
import AddCycleModal from "./AddCycleModal";
import AddBinModal from "./AddBinModal";
import { router } from "expo-router";
import { Marker as MarkerType } from "../types/map.types";
import uuid from "react-native-uuid";

export default function Map() {
  const markers = useMapStore((state) => state.markers);
  const setMarkers = useMapStore((state) => state.setMarkers);
  const user = useUserStore((state) => state.user);
  const initialLocation = {
    latitude: 39.75,
    longitude: -84.19,
  };
  const [myLocation, setMyLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [region, setRegion] = useState({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef<MapView>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [signInModalVisible, setSignInModalVisible] = useState(false);
  const [recycleModalVisible, setRecycleModalVisible] = useState(false);
  const [addBinModalVisible, setAddBinModalVisible] = useState(false);
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

  const renderMarkers = () => {
    return markers.map((marker) => (
      <Marker
        key={marker.id}
        coordinate={{
          latitude: marker.latitude,
          longitude: marker.longitude,
        }}
        image={require("../assets/marker.png")}
      >
        <Callout onPress={() => setRecycleModalVisible(true)}>
          <View className="bg-white rounded-xl p-4 w-64 justify-center">
            <Text className="text-xl font-bold mb-2 text-center">Bin</Text>
            <Text className="text-md font-bold mb-2 text-left">
              Estimated Capacity:{" "}
            </Text>
            <Text className="text-md font-bold mb-2 text-left">
              No. items recycles:{" "}
            </Text>
            <Text className="text-md font-bold mb-2 text-left">
              Estimated weight recycled:{" "}
            </Text>
            <Text className="text-md font-bold mb-2 text-left">
              No. people recycled:{" "}
            </Text>
            <TouchableOpacity className="bg-[#17A773] py-2 px-4 rounded-xl">
              <Text className="text-white font-semibold text-center">
                Recycle Now
              </Text>
            </TouchableOpacity>
          </View>
        </Callout>
      </Marker>
    ));
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
        markerId={selectedMarker}
        cycleId={uuid.v4().toString()}
      />
      {myLocation && (
      <AddBinModal
        isVisible={addBinModalVisible}
        setModalVisible={setAddBinModalVisible}
        latitude={myLocation.latitude}
        longitude={myLocation.longitude}
      />
      )}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View className="p-4 justify-center items-center">
          <View className="flex-col justify-stretch items-center bg-white rounded-3xl w-6/12 py-8 px-4">
            <TouchableOpacity
              onPress={onAddMarker}
              className="bg-[#17A773] py-2 px-4 rounded-[15] mb-5"
            >
              <Text className="text-white font-semibold">Add Bin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onAddRecycle}
              className="bg-[#17A773] py-2 px-4 rounded-[15]"
            >
              <Text className="text-white font-semibold">Add Recycle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
        {myLocation && (
        <Marker coordinate={{ latitude: myLocation.latitude, longitude: myLocation.longitude }} title="My Location" />)}
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
