import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Pressable, Text, View, Button } from 'react-native';
import * as Location from 'expo-location';

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

  return (
    <View>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        ref={mapRef}
        provider='google'
      >

        { myLocation.latitude && myLocation.longitude &&
          <Marker
            coordinate={{
              latitude: myLocation.latitude,
              longitude: myLocation.longitude
            }}
            title='My current location'
            description='I am here'
          />
        }
      </MapView>
      <Pressable style={styles.button} onPress={goToCurrentLocation}>
        <Button title='Get Location' onPress={goToCurrentLocation} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  map : {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  button : {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  }
});