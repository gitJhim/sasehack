import React, { useEffect, useState } from "react";
import { Text, View, Pressable, ScrollView } from "react-native";
import TopBar from "../components/TopBar";
import Geocoder from "react-native-geocoding";
import { GOOGLE_MAPS_API_KEY } from "@env";
import { useMapStore } from "../state/stores/mapStore";
import { Marker } from "../types/map.types";
import { User } from "../types/user.types";
import { getUsers } from "../utils/db/auth";

type Location = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  fullAddress: string;
  userId: string;
};

const Ranking = () => {
  Geocoder.init(`${GOOGLE_MAPS_API_KEY}`);
  const categories = ["City", "State", "User", "Bin"];
  const [selectedCategory, setSelectedCategory] = useState("City");
  const markers = useMapStore((state) => state.markers);
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [top5, setTop5] = useState<{ name: string; count: number }[]>([]);

  const getLocation = async (location: Marker) => {
    try {
      const json = await Geocoder.from(location.latitude, location.longitude);
      const address = json.results[0].address_components;
      const city = address.find((item) =>
        item.types.includes("locality"),
      )?.long_name;
      const state = address.find((item) =>
        item.types.includes("administrative_area_level_1"),
      )?.long_name;
      const title = location.title;

      if (city && state) {
        return {
          id: location.id,
          latitude: location.latitude,
          longitude: location.longitude,
          city,
          state,
          fullAddress: `${city}, ${state}`,
          title,
        };
      }
    } catch (error) {
      console.warn("Error fetching address:", error);
    }
    return null;
  };

  const filterTop5ByCategory = (category: string, locs: Location[]) => {
    let frequencyMap: Record<string, number> = {};

    switch (category) {
      case "City":
        frequencyMap = locs.reduce(
          (acc, location) => {
            acc[location.city] = (acc[location.city] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );
        break;
      case "State":
        frequencyMap = locs.reduce(
          (acc, location) => {
            acc[location.state] = (acc[location.state] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );
        break;
      case "User":
        const userExperienceMap = users.reduce(
          (acc, user) => {
            if (user && user.name && user.level) {
              acc[user.name] = user.level;
            }
            return acc;
          },
          {} as Record<string, number>,
        );
        const sortedUsers = Object.entries(userExperienceMap)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([name, level]) => ({ name, count: level }));
        setTop5(sortedUsers);
        return;
      case "Bin":
        frequencyMap = locs.reduce(
          (acc, location) => {
            acc[location.title] = (acc[location.title] || 0) + 1;
            console.log(locs);
            return acc;
          },
          {} as Record<string, number>,
        );
        break;
      default:
        frequencyMap = locs.reduce(
          (acc, location) => {
            acc[location.fullAddress] = (acc[location.fullAddress] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );
    }

    const sortedLocations = Object.entries(frequencyMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    setTop5(sortedLocations);
  };

  useEffect(() => {
    const loadLocations = async () => {
      const newLocations = await Promise.all(
        markers.map((marker) => getLocation(marker)),
      );
      const validLocations = newLocations.filter(
        (loc): loc is Location => loc !== null,
      );
      setLocations(validLocations);
      filterTop5ByCategory(selectedCategory, validLocations);
    };

    loadLocations();
  }, [markers]);

  useEffect(() => {
    filterTop5ByCategory(selectedCategory, locations);
  }, [selectedCategory, locations]);

  const onChangeCategory = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const loadUsers = async () => {
      const users = await getUsers();
      console.log(users);
      setUsers(users.data);
    };
    loadUsers();
  }, []);

  const RankingItem = ({
    rank,
    name,
    count,
  }: {
    rank: number;
    name: string;
    count: number;
  }) => (
    <View
      className={`flex-row items-center bg-white rounded-lg shadow-sm p-4 mb-3`}
    >
      <Text
        className={`text-2xl font-bold mr-4 ${rank <= 3 ? "text-green-600" : "text-gray-500"}`}
      >
        {rank}
      </Text>
      <View className="flex-1 ml-3">
        <Text className="text-lg font-semibold text-gray-800">{name}</Text>
        <Text className="text-sm text-gray-600">{count} points</Text>
      </View>
    </View>
  );

  const CategoryButton = ({
    category,
    isSelected,
    onPress,
  }: {
    category: string;
    isSelected: boolean;
    onPress: (category: string) => void;
  }) => (
    <Pressable
      onPress={() => onPress(category)}
      className={`py-2 px-4 rounded-t-lg ${
        isSelected ? "bg-green-600" : "bg-green-100"
      }`}
    >
      <Text
        className={`text-center text-base ${
          isSelected ? "text-white font-semibold" : "text-green-800"
        }`}
      >
        {category}
      </Text>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <TopBar />
      <ScrollView className="flex-1">
        <View className="px-4 pt-6 pb-8">
          <Text className="text-3xl font-bold text-green-800 mb-6">
            Rankings
          </Text>
          <View className="flex-row mb-4">
            {categories.map((category) => (
              <CategoryButton
                key={category}
                category={category}
                isSelected={selectedCategory === category}
                onPress={onChangeCategory}
              />
            ))}
          </View>
          <View className="bg-green-50 rounded-lg p-4">
            {top5.map((item, index) => (
              <RankingItem
                key={item.name}
                rank={index + 1}
                name={item.name}
                count={item.count}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Ranking;

