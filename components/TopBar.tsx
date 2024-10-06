import { View, Image, Text, TextInput } from "react-native";
import { useUserStore } from "../state/stores/userStore";

export default function TopBar() {
  const user = useUserStore((state) => state.user);

  return (
    <View className="flex-row items-center h-36 bg-[#17A773] justify-evenly">
      <View className="flex-row items-center justify-evenly w-11/12 mt-10">
        <View className="flex-row w-40 max-w-40 h-12 items-center p-2 rounded-full bg-[#B1ECC8] ">
          <Image
            source={require("../assets/search_check.png")}
            alt="search"
            width={20}
            height={20}
          />
          <TextInput className="mr-9" placeholder="Search" />
        </View>
        <View className="flex-row items-center mx-auto">
          <Image
            source={{ uri: user?.avatar_url || "" }}
            alt="profile"
            width={40}
            height={40}
          />
        </View>
        <View className="flex-row p-2 h-12 w-40 rounded-full items-center bg-[#B1ECC8]">
          <Image
            source={require("../assets/kid_star.png")}
            alt="star"
            width={20}
            height={20}
          />
          <Text className="font-bold items-center text-lg">Level: 1 </Text>
        </View>
      </View>
    </View>
  );
}
