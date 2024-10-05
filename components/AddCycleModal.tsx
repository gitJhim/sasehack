import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import { ValueType } from "react-native-dropdown-picker";

type RecycleItem = {
  id: string;
  type: ValueType | null;
  count: string;
  isOpen: boolean;
};

export default function AddCycleModal({
  isVisible,
  setModalVisible,
}: {
  isVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}) {
  const [isOpened, setIsOpened] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Bottle", value: 1 },
    { label: "Bag", value: 2 },
    { label: "Can", value: 3 },
  ]);
  const [itemsCount, setItemsCount] = useState(1);
  const [recycleItems, setRecycleItems] = useState<RecycleItem[]>([
    { id: Date.now().toString(), type: null, count: '', isOpen: false }
  ]);

  const addItem = () => {
    if (recycleItems.length < 5) {
      setRecycleItems(prevItems => [
        ...prevItems, 
        { id: Date.now().toString(), type: null, count: '', isOpen: false }
      ]);
    }
  };

  const handleItemChange = (id: string, field: 'type' | 'count' | 'isOpen', value: ValueType | string | boolean | any) => {
    setRecycleItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const renderItems = () => {
    return recycleItems.map((item) => {
      return (
        <View key={item.id} className="flex flex-row justify-between items-center mx-auto pb-4">
          <DropDownPicker 
            open={item.isOpen}
            setOpen={(isOpen) => handleItemChange(item.id, 'isOpen', isOpen)}
            items={items}
            value={item.type}
            setValue={(value) => handleItemChange(item.id, 'type', value)}
            setItems={setItems}
            containerStyle={{ width: 150 }}
            zIndex={5000 - recycleItems.indexOf(item)}
            zIndexInverse={5000 - recycleItems.indexOf(item)}
          />
          <TextInput
            className="bg-gray-300 rounded-lg p-2 w-20 ml-2"
            keyboardType="numeric"
            value={item.count}
            onChangeText={(value) => handleItemChange(item.id, 'count', value)}
          />
        </View>
      );
    });
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => setModalVisible(false)}
    >
      <View className="p-4 justify-center items-center w-11/12">
        <View className="flex-col justify-stretch items-center  bg-white rounded-[25] py-8 px-2 w-11/12">
          <Text className="text-black font-bold text-2xl">Recycle List</Text>
          <View className="flex flex-row justify-between items-center">
            <View className="flex flex-col justify-center items-center">
              <View className="flex flex-row justify-between items-center mx-auto">
                <Text className="flex text-black font-semibold text-lg">Item</Text>
                <Text className="flex text-black font-semibold text-lg">Count:</Text>
              </View>
              {renderItems()}
              <TouchableOpacity onPress={addItem} className="flex flex-row justify-center items-center ">
                <Ionicons name="add-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}