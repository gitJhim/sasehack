import { View, Text } from "react-native";
import TopBar from "../components/TopBar";
import Map from "../components/Map";

const Index = () => {
  return (
    <View>
      <TopBar userLevel={100} userProfile={require("../assets/dummyProfile.png")}></TopBar>
      <Text className="text-blue-500">Hello World!</Text>
      <Map />
    </View>
  );
};

export default Index;
