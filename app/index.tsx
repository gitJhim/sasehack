import React from "react";
import { View, Text } from "react-native";
import Map from "../components/Map";
import { ModalPortal } from "react-native-modals";

const Index = () => {
  return (
    <View>
      <Text className="text-blue-500">Hello World</Text>
      <Map />
      <ModalPortal />
    </View>
  );
};

export default Index;
