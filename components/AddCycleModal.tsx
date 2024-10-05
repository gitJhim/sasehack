import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import Modal from "react-native-modal";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";
import { ValueType } from "react-native-dropdown-picker";
import { Cycle, CycleItem } from "../types/cycle.types";

export default function AddCycleModal({
  isVisible,
  setModalVisible,
}: {
  isVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {
      label: "Plastic",
      value: "plastic",
      icon: () => (
        <Image source={{ uri: "/api/placeholder/50/50" }} className="w-6 h-6" />
      ),
    },
    {
      label: "Paper",
      value: "paper",
      icon: () => (
        <Image source={{ uri: "/api/placeholder/50/50" }} className="w-6 h-6" />
      ),
    },
    {
      label: "Glass",
      value: "glass",
      icon: () => (
        <Image source={{ uri: "/api/placeholder/50/50" }} className="w-6 h-6" />
      ),
    },
    {
      label: "Metal",
      value: "metal",
      icon: () => (
        <Image source={{ uri: "/api/placeholder/50/50" }} className="w-6 h-6" />
      ),
    },
  ]);

  const [recycleItems, setRecycleItems] = useState([] as CycleItem[]);

  const addRecycleItem = () => {
    if (value) {
      setRecycleItems([
        ...recycleItems,
        {
          type: value,
          quantity: 1,
          id: null,
          cycleId: null,
        },
      ]);
      setValue(null);
    }
  };

  const removeRecycleItem = (index: number) => {
    const newItems = recycleItems.filter((_, i) => i !== index);
    setRecycleItems(newItems);
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    const newItems = recycleItems.map((item, i) =>
      i === index ? { ...item, quantity: Math.max(1, newQuantity) } : item,
    );
    setRecycleItems(newItems);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => setModalVisible(false)}
      className="m-0"
    >
      <View className="bg-white rounded-t-3xl p-6 h-3/4 absolute bottom-0 left-0 right-0">
        <Text className="text-2xl font-bold mb-4">Recycling Items</Text>

        <View className="flex-row items-center mb-4">
          <View className="flex-1 mr-2">
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select an item"
            />
          </View>
          <TouchableOpacity
            onPress={addRecycleItem}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Add</Text>
          </TouchableOpacity>
        </View>

        {recycleItems.map((item, index) => (
          <View
            key={index}
            className="flex-row items-center justify-between mb-2 bg-gray-100 p-2 rounded-lg"
          >
            <View className="flex-row items-center">
              <Image
                source={{ uri: "/api/placeholder/50/50" }}
                className="w-8 h-8 mr-2"
              />
              <Text className="font-semibold">{item.type}</Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => updateQuantity(index, item.quantity - 1)}
                className="bg-gray-300 w-8 h-8 rounded-full items-center justify-center"
              >
                <Text className="text-lg font-bold">-</Text>
              </TouchableOpacity>
              <Text className="mx-3 font-semibold">{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => updateQuantity(index, item.quantity + 1)}
                className="bg-gray-300 w-8 h-8 rounded-full items-center justify-center"
              >
                <Text className="text-lg font-bold">+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeRecycleItem(index)}
                className="ml-4"
              >
                <Text className="text-lg font-bold">x</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          className="bg-blue-500 px-4 py-3 rounded-lg mt-4"
        >
          <Text className="text-white font-semibold text-center">Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
