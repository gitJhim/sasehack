import { View, Text } from "react-native";
import TopBar from "../components/TopBar";
import Map from "../components/Map";
import XpBar from "../components/XpBar";
import { UserStore } from "../types/user.types";
import { useUserStore } from "../state/stores/userStore";
const Index = () => {
  return (
    <View>
      <TopBar />
      <Map />
    </View>
  );
};

export default Index;
