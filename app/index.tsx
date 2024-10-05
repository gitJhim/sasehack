import { View, Text } from "react-native";
import TopBar from "../components/TopBar";
import Map from "../components/Map";

const Index = () => {
  return (
    <View>
      <TopBar
        userLevel={69}
        userProfile={require("../assets/dummyProfile.png")}
      />
      <Map />
    </View>
  );
};

export default Index;
