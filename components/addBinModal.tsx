import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import  Modal from 'react-native-modal';

export default function AddBinModal({isVisible}: {isVisible: boolean}) {
  const [modalVisible, setModalVisible] = useState(isVisible);

  const addMarker = () => {

    setModalVisible(false);
  };

  return (
    <Modal
      isVisible={modalVisible}
      onBackdropPress={() => setModalVisible(false)}
    >
      <View className="p-4 justify-center items-center">
        <View className="flex-col justify-stretch items-center bg-white rounded-[25] w-6/12 py-8 px-2">
          <TouchableOpacity 
            onPress={addMarker}
            className="bg-[#17A773] py-2 px-4 rounded-full mb-5"
          >
            <Text className="text-white font-semibold">Add Bin</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setModalVisible(false)}
            className="bg-[#17A773] py-2 px-4 rounded-full"
          >
            <Text className="text-white font-semibold">Add Cycle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}