import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import  Modal from 'react-native-modal';
import { useMapStore } from "../state/stores/mapStore";
import { useUserStore } from "../state/stores/userStore";

export default function AddBinModal({
  isVisible,
  setModalVisible,
  latitude,
  longitude,
}: {
  isVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  latitude: number;
  longitude: number;
}) {
  const [markerName, setMarkerName] = useState('');
  const [fullness, setFullness] = useState('empty');
  const user = useUserStore((state) => state.user);
  const options = ["Empty", "Half full", "Full"];
  const addMarker = () => {
    if (!user) {
      return;
    }
    const newMarker = {
      id: null,
      title: markerName,
      userId: user.id,
      latitude: latitude,
      longitude: longitude,
    };
    useMapStore.getState().addMarker(newMarker);
    setModalVisible(false);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => setModalVisible(false)}
    >
      <View className="p-4 w-full flex-col bg-white rounded-[25] py-8 px-5 h-4/5 justify-evenly">
        <View>
        <Text className='text-black font-semibold text-2xl pb-2'>New Bin Name</Text>
        <TextInput className="bg-gray-300 rounded-lg p-2 w-full mb-5" placeholder="Marker Name" onChangeText={(text) => setMarkerName(text)} />
        </View>
        <View>
          <Text className='text-black font-semibold text-2xl pb-2'>How full is it?</Text>
          {options.map((option) => (
            <TouchableOpacity 
              onPress={() => setFullness(option)}
              className={`${option === fullness ? 'bg-[#17A773] text-white' : 'bg-gray-300 text-black'} rounded-lg p-2 w-full mb-5`}
            >
              <Text className="text-black font-semibold text-lg">{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="flex flex-row justify-evenly items-center">
          <TouchableOpacity 
            onPress={addMarker}
            className="bg-[#17A773] py-4 px-8 rounded-full"
          >
            <Text className="text-white font-semibold text-xl">Create</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setModalVisible(false)}
            className="bg-gray-300 py-4 px-8 rounded-full"
          >
            <Text className="text-white font-semibold text-xl">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}