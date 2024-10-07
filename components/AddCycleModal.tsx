import { Text, TouchableOpacity, View, Image, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { CycleItem } from "../types/cycle.types";
import { useUserStore } from "../state/stores/userStore";
import { addNewCycle } from "../utils/db/cycle";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { addXP } from "../utils/db/auth";
import { calculateXp } from "../components/XpToLevel";
import { useRouter } from "expo-router";

export default function AddCycleModal({
  isVisible,
  setModalVisible,
  markerId,
  cycleId,
}: {
  isVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  markerId: string | null;
  cycleId?: string;
}) {
  const user = useUserStore((state) => state.user);
  if (!user) {
    return null;
  }
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {
      label: "Plastic Bottle",
      value: "plastic bottle",
      icon: () => (
        <Image source={{ uri: "/api/placeholder/50/50" }} className="w-6 h-6" />
      ),
    },
    {
      label: "Cardboard Box",
      value: "cardboard box",
      icon: () => (
        <Image source={{ uri: "/api/placeholder/50/50" }} className="w-6 h-6" />
      ),
    },

    {
      label: "Aluminum Can",
      value: "aluminum can",
      icon: () => (
        <Image source={{ uri: "/api/placeholder/50/50" }} className="w-6 h-6" />
      ),
    },
    {
      label: "Glass Bottle",
      value: "glass bottle",
      icon: () => (
        <Image source={{ uri: "/api/placeholder/50/50" }} className="w-6 h-6" />
      ),
    },
    {
      label: "Plastic Bag",
      value: "plastic bag",
      icon: () => (
        <Image source={{ uri: "/api/placeholder/50/50" }} className="w-6 h-6" />
      ),
    },
    {
      label: "Soda Can",
      value: "soda can",
      icon: () => (
        <Image source={{ uri: "/api/placeholder/50/50" }} className="w-6 h-6" />
      ),
    },

    {
      label: "Paper Cup",
      value: "paper cup",
      icon: () => (
        <Image source={{ uri: "/api/placeholder/50/50" }} className="w-6 h-6" />
      ),
    },
  ]);

  const [recycleItems, setRecycleItems] = useState([] as CycleItem[]);

  const addRecycleItem = () => {
    if (value && cycleId) {
      setRecycleItems([
        ...recycleItems,
        {
          type: value,
          quantity: 1,
          id: null,
          cycleId: cycleId,
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

  const onSubmit = async () => {
    if (!cycleId) {
      return;
    }
    const newCycle = {
      id: cycleId,
      userId: user.id,
      markerId: markerId,
      items: recycleItems,
      created_at: null,
    };

    await addNewCycle(newCycle);
    const { leveledUp } = await addXP(user, calculateXp(newCycle.items));

    if (leveledUp) {
      router.push("/levelup");
    }
    setModalVisible(false);
  };

  useEffect(() => {
    if (value) {
      addRecycleItem();
    }
  }, [value]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => setModalVisible(false)}
      backdropTransitionOutTiming={0}
      style={{ margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View className="bg-white rounded-t-3xl p-6 h-5/6 absolute bottom-0 left-0 right-0 shadow-lg">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-green-800">
            Recycling Items
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <MaterialCommunityIcons name="close" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Select an item"
            style={{
              borderRadius: 12,
              borderColor: "#4CAF50",
              minHeight: 50,
              backgroundColor: "#F1F8E9",
            }}
            dropDownContainerStyle={{
              borderColor: "#4CAF50",
              backgroundColor: "#F1F8E9",
            }}
            textStyle={{ fontSize: 16, fontWeight: "600", color: "#2E7D32" }}
            placeholderStyle={{ color: "#7CB342" }}
            ArrowUpIconComponent={({ style }) => (
              <MaterialCommunityIcons
                name="chevron-up"
                size={24}
                color="#4CAF50"
              />
            )}
            ArrowDownIconComponent={({ style }) => (
              <MaterialCommunityIcons
                name="chevron-down"
                size={24}
                color="#4CAF50"
              />
            )}
          />
        </View>

        <ScrollView className="flex-grow mb-4">
          {recycleItems.map((item, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between mb-4 bg-green-50 p-4 rounded-xl shadow-sm"
            >
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-green-200 rounded-full items-center justify-center mr-4">
                  <MaterialCommunityIcons
                    name="recycle"
                    size={24}
                    color="#4CAF50"
                  />
                </View>
                <Text className="font-semibold text-lg text-green-800 flex-1">
                  {item.type}
                </Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => updateQuantity(index, item.quantity - 1)}
                  className="w-8 h-8 rounded-full items-center justify-center bg-green-200"
                >
                  <MaterialCommunityIcons
                    name="minus"
                    size={20}
                    color="#4CAF50"
                  />
                </TouchableOpacity>
                <Text className="mx-4 text-lg font-semibold text-green-800">
                  {item.quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(index, item.quantity + 1)}
                  className="w-8 h-8 rounded-full items-center justify-center bg-green-200"
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={20}
                    color="#4CAF50"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeRecycleItem(index)}
                  className="ml-4"
                >
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={24}
                    color="#E57373"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={onSubmit}
          className="bg-green-600 px-6 py-4 rounded-full shadow-md"
        >
          <Text className="text-white font-bold text-lg text-center">
            Submit Recycling
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
