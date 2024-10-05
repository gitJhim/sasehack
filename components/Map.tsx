import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useEffect, useRef } from 'react';
import { View, Button, StyleSheet, Dimensions, Pressable, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import  Modal from 'react-native-modal';

interface Marker {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  id: number;
}

export default function Map() {
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
  const mapRef = useRef<MapView>(null);;
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if(status !== 'granted'){ 
      console.warn('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setMyLocation(location.coords);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const goToCurrentLocation = () => {
    if (myLocation.latitude && myLocation.longitude){
      const newRegion = {
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
      mapRef.current?.animateToRegion(newRegion)
    }
  }

  const addMarker = () => {
    const newMarker = {
      coordinate: {
        latitude: myLocation.latitude,
        longitude: myLocation.longitude
      },
      id: markers.length,
    };
    setMarkers(prevMarkers => [...prevMarkers, newMarker]);
    setModalVisible(false);
  };

  const renderMarkers = () => {
    return markers.map((marker) => {
      return (
        (marker.coordinate.latitude === myLocation.latitude && marker.coordinate.longitude === myLocation.longitude) ? 
        <Marker 
          key={marker.id}
          coordinate={{
            latitude: marker.coordinate.latitude,
            longitude: marker.coordinate.longitude+0.0002,
          }}
          title={`Bin ${marker.id}`}
          image={require('../assets/marker.png')}
        />
        :
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          title={`Bin ${marker.id}`}
          image={require('../assets/marker.png')}
        />
      );
    });
  };

  return (
    <View className='flex flex-col justify-center items-center'>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View className="p-4 justify-center items-center">
          <View className="flex-col justify-stretch items-center bg-white rounded-lg w-6/12 p-4">
            <TouchableOpacity 
              onPress={addMarker}
              className="bg-blue-500 py-2 px-4 rounded-lg mb-5"
            >
              <Text className="text-white font-semibold">Add Bin</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              className="bg-red-500 py-2 px-4 rounded-lg"
            >
              <Text className="text-white font-semibold">Cancel</Text>
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
        <Marker 
          coordinate={myLocation}
          title='My Location'
        />
        {renderMarkers()}
      </MapView>
      <View className='absolute bottom-20'>
        <View className='flex flex-row justify-center items-center'>
          <Button title='Go to current location' onPress={goToCurrentLocation} />
          <Button title='Add Marker' onPress={() => setModalVisible(true)} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});