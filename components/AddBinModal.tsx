import { useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import Modal from "react-native-modal";
import { useUserStore } from "../state/stores/userStore";
import { addNewMarker, uploadMarkerImage } from "../utils/db/map";
import * as ImagePicker from "expo-image-picker";

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
  const [markerName, setMarkerName] = useState("");

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
  const user = useUserStore((state) => state.user);

  const onSubmit = async () => {
    if (!user) {
      return;
    }
    const newMarker = {
      id: null,
      title: markerName,
      userId: user.id,
      latitude: latitude,
      longitude: longitude,
      createdAt: null,
    };

    const { data, error } = await addNewMarker(newMarker);
    await uploadMarkerImage(data?.id, image.uri);
    setModalVisible(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => setModalVisible(false)}
      className="flex items-center justify-center"
    >
      <View className="w-11/12 bg-white rounded-3xl p-6 max-h-[90%]">
        <Text className="text-green-800 font-bold text-2xl mb-4">New Bin</Text>

        <TextInput
          className="bg-green-100 rounded-lg p-3 mb-4"
          placeholder="Bin Name"
          value={markerName}
          onChangeText={setMarkerName}
        />

        <View className="mb-4">
          <TouchableOpacity
            onPress={takePhoto}
            className="bg-green-600 py-3 px-4 rounded-lg mb-2"
          >
            <Text className="text-white font-semibold text-center">
              Take Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={pickImage}
            className="bg-green-500 py-3 px-4 rounded-lg mb-2"
          >
            <Text className="text-white font-semibold text-center">
              Choose from Gallery
            </Text>
          </TouchableOpacity>

          {image && (
            <View className="mt-2">
              <Image
                source={{ uri: image.uri }}
                style={{ width: "100%", height: 200, borderRadius: 10 }}
                resizeMode="cover"
              />
              <Text className="text-center mt-1 text-green-600">
                Photo Preview
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row justify-evenly">
          <TouchableOpacity
            onPress={onSubmit}
            className="bg-green-600 py-3 px-6 rounded-full"
          >
            <Text className="text-white font-semibold text-lg">Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="bg-gray-300 py-3 px-6 rounded-full"
          >
            <Text className="text-gray-700 font-semibold text-lg">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
