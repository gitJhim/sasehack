import { useState } from 'react';
import { Text, View, Pressable, Image } from "react-native";
import TopBar from "../components/TopBar";

const Ranking = () => {
  const categories = ["City", "User", "Bin", "School"];
  const [selectedCategory, setSelectedCategory] = useState("City");

  return (
    <View className="flex-1 bg-gray-100">
      <TopBar />
      <View className="flex-1 items-center">
        <View className="flex-row content-center">
          <Image source={require("../assets/ecovision.png")} alt="logo" style={{ width: 40, height: 40 }} resizeMode="contain"/>
          <Text className="text-4xl font-sans p-4">Rankings</Text>
        </View>
        <View className="flex-row w-11/12 mb-[-1px]">
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`
                flex-1 items-center justify-center py-2 px-1
                ${selectedCategory === category
                  ? 'bg-[#16A34A] rounded-t-lg z-10'
                  : 'bg-[#a5e5bd] rounded-t-md'}
              `}
              style={{
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                borderWidth: 1,
                borderColor: selectedCategory === category ? '#16A34A' : '#a5e5bd',
                borderBottomWidth: selectedCategory === category ? 0 : 1,
                marginHorizontal: 0, 
              }}
            >
              <Text
                className={`text-center ${
                  selectedCategory === category
                    ? "text-white font-semibold"
                    : "text-gray-700"
                }`}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </View>
        <View className="bg-[#16A34A] w-11/12 p-5 h-[420px] rounded-b-3xl">
          {/* Content for the selected category */}
        </View>
      </View>
    </View>
  );
}

export default Ranking;