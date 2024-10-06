import { ScrollView, Text, View, Image } from "react-native";
import { useUserStore } from "../state/stores/userStore";
import RecycleChart from "../components/RecycleChart";

const Profile = () => {
  const user = useUserStore((state) => state.user);
  return (
    <View className="h-full">
      <ScrollView
        className="flex-1 bg-backgroundLight dark:bg-backgroundDark"
        contentContainerStyle={{
          paddingBottom: 150,
        }}
      >
        <View className="h-1/4 bg-[#17A773] items-center justify-end pb-48 pt-4"></View>
        <View className="flex-1 bg-backgroundLight dark:bg-backgroundDark bg-opacity-10 items-center pt-16">
          <Image
            source={{ uri: user?.avatar_url || "" }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 4,
              borderColor: "white",
              position: "absolute",
              top: -60,
            }}
            className="bg-white"
          />
          <Text className="text-black dark:text-white text-xl">
            @{user?.name}
          </Text>
        </View>
        <RecycleChart />
      </ScrollView>
    </View>
  );
};

export default Profile;
