import { ScrollView, Text, View, Image } from "react-native";
import { useUserStore } from "../state/stores/userStore";
import RecycleChart from "../components/RecycleChart";
import XpBar from "../components/XpBar";
import ActivityLog from "../components/ActivityLog";
import { useEffect, useState } from "react";
import { checkAndUpdateUser, loadLogs } from "../utils/db/auth";
import { loadUserCycles } from "../utils/db/cycle";
import { Cycle } from "../types/cycle.types";
import { Marker } from "../types/map.types";
import { loadUserMarkers } from "../utils/db/map";

const Profile = () => {
  const user = useUserStore((state) => state.user);
  const session = useUserStore((state) => state.session);

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [markers, setMarkers] = useState<Marker[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await loadLogs(user?.id!);
      const cycles = await loadUserCycles(user?.id!);
      setCycles(cycles.cycles!);
      const markers = await loadUserMarkers(user?.id!);
      setMarkers(markers.data!);
    };

    loadData();

    if (session) {
      console.log("Checking and updating user...");
      checkAndUpdateUser(session);
    }
  }, []);

  return (
    <View className="h-full">
      <ScrollView
        className="flex-1 bg-backgroundLight dark:bg-backgroundDark"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <View className="h-56 bg-[#17A773] items-center justify-end "></View>
        <View className="flex-1 bg-backgroundLight dark:bg-backgroundDark bg-opacity-10 items-center">
          <Image
            source={{ uri: user?.avatar_url || "" }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 4,
              borderColor: "white",
              top: -60,
            }}
            className="bg-white"
          />
          <Text className="text-black text-xl -mt-16">@{user?.name}</Text>
        </View>
        <View className="flex-1 mt-4">
          <XpBar />
        </View>
        <RecycleChart cycles={cycles} />
        <ActivityLog cycles={cycles} markers={markers} />
      </ScrollView>
    </View>
  );
};

export default Profile;
