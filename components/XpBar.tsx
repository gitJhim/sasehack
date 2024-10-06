import XpToLevel from "./XpToLevel";
import { View, Text, Image } from "react-native";
import * as Progress from "react-native-progress";
import { useUserStore } from "../state/stores/userStore";

export default function XpBar() {
  const user = useUserStore((state) => state.user);

  if (!user || user.level == null || user.xp == null) {
    return (
      <View>
        <Text>None</Text>
      </View>
    );
  }

  const xpNeeded = XpToLevel({ level: user.level, xp: user.xp });
  const progress = user.xp / xpNeeded;

  return (
    <View className="p-4 flex-1 justify-center items-center">
      <View className="flex-row p-2 h-12 w-40 rounded-full items-center bg-[#B1ECC8]">
        <Image
          source={require("../assets/kid_star.png")}
          alt="star"
          width={20}
          height={20}
          className="mx-2"
        />
        <Text className="font-bold items-center text-lg">
          Level: {user.level}
        </Text>
      </View>
      <View className="mt-4">
        <Progress.Bar progress={progress} width={200} color="#B1ECC8" />
      </View>
      <Text className="font-semibold">
        XP: {user.xp} / {xpNeeded}
      </Text>
    </View>
  );
}
