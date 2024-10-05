import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
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
import { addNewMarker, getMarkers } from "../utils/db/map";

export default function Map() {
  const markers = useMapStore((state) => state.markers);
  const setMarkers = useMapStore((state) => state.setMarkers);
  const user = useUserStore((state) => state.user);


  
  const initialLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
  };
  const [myLocation, setMyLocation] = useState(initialLocation);
  const [region, setRegion] = useState({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef<MapView>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [signInModalVisible, setSignInModalVisible] = useState(false);

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
    if (myLocation.latitude && myLocation.longitude) {
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
    if (!user) {
      setSignInModalVisible(true);
      return;
    }

    let newMarker = {
      id: null,
      userId: user.id,
      latitude: myLocation.latitude,
      longitude: myLocation.longitude,
    };

    await addNewMarker(newMarker);
  };

  const renderMarkers = () => {
    return markers.map((marker) => {
      return marker.latitude === myLocation.latitude &&
        marker.longitude === myLocation.longitude ? (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude + 0.0002,
          }}
          title={`Bin ${marker.id}`}
          image={require("../assets/marker.png")}
        />
      ) : (
        <Marker
          key={marker.id}
          // get the marker's coordinate from the marker object
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={`Bin ${marker.id}`}
          image={require("../assets/marker.png")}
        />
      );
    });
  };

  return (
    <View className="flex flex-col justify-center items-center">
      <SignInModal
        isVisible={signInModalVisible}
        setModalVisible={setSignInModalVisible}
      />
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View className="p-4 justify-center items-center">
          <View className="flex-col justify-stretch items-center bg-white rounded-lg w-6/12 p-4">
            <TouchableOpacity
              onPress={onAddMarker}
              className="bg-blue-500 py-2 px-4 rounded-lg mb-5"
            >
              <Text className="text-white font-semibold">Add Bin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-[#17A773] py-2 px-4 rounded-full"
            >
              <Text className="text-white font-semibold">Add Cycle</Text>
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
      >
        <Marker coordinate={myLocation} title="My Location" />
        {renderMarkers()}
      </MapView>
      <TouchableOpacity
        onPress={goToCurrentLocation}
        className="bg-gray-300 rounded-3xl p-4 absolute bottom-[13%] right-5"
      >
        <Image
          source={require("../assets/self.png")}
          style={{ width: 40, height: 40 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-[#17A773] p-4 rounded-3xl absolute bottom-5 right-5"
      >
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
});
