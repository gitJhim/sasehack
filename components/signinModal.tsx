import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

export default function SigninModal() {
  const [modalVisible, setModalVisible] = useState(false);
  
  return (
    <Modal
      isVisible={modalVisible}
      onBackdropPress={() => setModalVisible(false)}
    >
      <View className="p-4 justify-center items-center">
        <View className="flex-col justify-stretch items-center bg-white rounded-[25] w-6/12 py-8 px-2">
          <Text className="text-white font-semibold">Sign up</Text>
          <TextInput className="bg-gray-300 rounded-lg p-2 mt-2" placeholder="Email" />
          <Text className="text-white font-semibold">Password</Text>
          <TextInput className="bg-gray-300 rounded-lg p-2 mt-2" placeholder="Password" />
          <TouchableOpacity 
            onPress={() => setModalVisible(false)}
            className="bg-[#17A773] py-2 px-4 rounded-full"
          >
            <Text className="text-white font-semibold">Sign In</Text>
          </TouchableOpacity>
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