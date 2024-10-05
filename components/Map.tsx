import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Pressable, Text, View, Button } from 'react-native';
import * as Location from 'expo-location';

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
    <View>
      <MapView
        className='w-full h-full'
        region={region}
        onRegionChangeComplete={setRegion}
        ref={mapRef}
        provider='google'
      >
        <Marker 
          coordinate={myLocation}
          title='My Location'
        />
        {renderMarkers()}
      </MapView>
      <View className=''>
        <Button title='Go to current location' onPress={goToCurrentLocation} />
        <Button title='Add Marker' onPress={addMarker} />
      </View>
    </View>
  )
}