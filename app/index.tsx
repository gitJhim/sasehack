import React from "react";
import { View, Text } from "react-native";
import TopBar from "../components/TopBar";

const Index = () => {
  return (
    <View>
      <TopBar userLevel={100} userProfile={require("../assets/dummyProfile.png")}></TopBar>
      <Text className="text-blue-500">Hello World!</Text>
    </View>
  );
};

export default Index;
