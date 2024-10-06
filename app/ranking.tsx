import React, { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";
import TopBar from "../components/TopBar";
import Geocoder from 'react-native-geocoding';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { useMapStore } from "../state/stores/mapStore";
import { Marker } from "../types/map.types";

Geocoder.init(`${GOOGLE_MAPS_API_KEY}`);

type Location = {
  id: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  fullAddress: string;
}

const Ranking = () => {
  const categories = ["City", "State", "User", "Bin"];
  const [selectedCategory, setSelectedCategory] = useState("City");
  const markers = useMapStore((state) => state.markers);
  const [locations, setLocations] = useState<Location[]>([]);
  const [top5, setTop5] = useState<{name: string, count: number}[]>([]);

  const getLocation = async (location: Marker) => {
    try {
      const json = await Geocoder.from(location.latitude, location.longitude);
      const address = json.results[0].address_components;
      const city = address.find((item) => item.types.includes("locality"))?.long_name;
      const state = address.find((item) => item.types.includes("administrative_area_level_1"))?.long_name;

      if (city && state) {
        setLocations(prevLocations => 
          prevLocations.map(loc => 
            loc.id === location.id 
              ? { ...loc, address: `${city}, ${state}` } 
              : loc
          )
        );
      }
    } catch (error) {
      console.warn('Error fetching address:', error);
    }
  };

  const filterTop5ByCategory = (category: string) => {
    let frequencyMap: Record<string, number> = {};
    
    switch (category) {
      case 'City':
        frequencyMap = locations.reduce((acc, location) => {
          acc[location.city] = (acc[location.city] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        break;
      case 'State':
        frequencyMap = locations.reduce((acc, location) => {
          acc[location.state] = (acc[location.state] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        break;
      case 'User':
        // Assuming user information is stored in the location.id
        frequencyMap = locations.reduce((acc, location) => {
          acc[location.id] = (acc[location.id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        break;
      case 'Bin':
        // Assuming bin information is stored somewhere in the location object
        // You may need to adjust this based on your actual data structure
        frequencyMap = locations.reduce((acc, location) => {
          const binId = location.id; // Replace with actual bin identifier
          acc[binId] = (acc[binId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        break;
      default:
        frequencyMap = locations.reduce((acc, location) => {
          acc[location.fullAddress] = (acc[location.fullAddress] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
    }

    const sortedLocations = Object.entries(frequencyMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    setTop5(sortedLocations);
  };

  useEffect(() => {
    const loadLocations = async () => {
      setLocations([]); // Reset locations
      await Promise.all(markers.map(marker => getLocation(marker)));
    };

    loadLocations();
  }, [markers]);

  useEffect(() => {
    if (locations.length > 0) {
      filterTop5ByCategory(selectedCategory);
    }
  }, [locations, selectedCategory]);

  const onChangeCategory = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <View className="bg-gray-200 h-full">
      <TopBar />
      <View className="flex-col items-center">
        <Text className="text-4xl font-bold p-4">Rankings</Text>
        <View className="flex-row justify-evenly bg-[#a5e5bd] w-11/12 p-5 rounded-t-3xl">
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => onChangeCategory(category)}
              className={`${
                selectedCategory === category
                  ? "bg-[#17A773]"
                  : " text-black"
              } rounded-lg py-2 px-4`}
            >
              <Text className="font-semibold text-lg">{category}</Text>
            </Pressable>
          ))}
        </View>
        <View className="bg-[#16A34A] flex-col justify-center items-center w-11/12 p-5 h-[420px] rounded-b-3xl">
          {top5.map((item, index) => (
            <View key={item.name} className="bg-[#a5e5bd] w-full p-5 m-2">
              <Text className="font-semibold text-lg">{`${index + 1}. ${item.name} (Count: ${item.count})`}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default Ranking;