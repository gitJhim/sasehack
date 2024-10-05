import { Text, TextInput, View } from "react-native";
import Modal from "react-native-modal";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

export default function AddCycleModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Bottle", value: 1 },
    { label: "Bag", value: 2 },
    { label: "Can", value: 3 },
  ]);

  return (
    <Modal
      isVisible={modalVisible}
      onBackdropPress={() => setModalVisible(false)}
    >
      <View className="p-4 justify-center items-center">
        <View className="flex-col justify-stretch items-center  bg-white rounded-[25] w-6/12 py-8 px-2">
          <Text className="text-black font-bold text-5xl">Recycle List</Text>
          <View className="flex flex-row justify-between items-center">
            <View className="flex flex-col justify-center items-center">
              <Text className="text-black font-semibold text-3xl">Item</Text>
              <DropDownPicker 
                open={isOpened}
                setOpen={setIsOpened}
                items={items}
                value={value}
                setValue={setValue}
                setItems={setItems}
              />
            </View>
            <View className="flex flex-col justify-center items-center">
              <Text className="text-black font-semibold text-3xl">Quantity</Text>
              <TextInput className="bg-gray-300 rounded-lg p-2 mt-2" placeholder="Quantity" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}