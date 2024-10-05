import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import SignInPage from "./SignInPage";

export default function SignInModal({
  isVisible,
  setModalVisible,
}: {
  isVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}) {
  return (
    <Modal isVisible={isVisible} onBackdropPress={() => setModalVisible(false)}>
      <View className="p-4 justify-center items-center">
        <View className="flex-col justify-stretch items-center bg-white rounded-[25] w-6/12 py-8 px-2">
          <SignInPage />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="bg-gray-300 py-2 px-4 rounded-full"
          >
            <Text className="text-white font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

