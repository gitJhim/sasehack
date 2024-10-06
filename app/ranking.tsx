import { Text, View, Pressable } from "react-native";
import TopBar from "../components/TopBar";
import { useState } from "react";

const Ranking = () => {
  const catagories = ["City", "User", "Bin", "School"];
  const [selectedCatagory, setSelectedCatagory] = useState("City");


  return (
    <View>
      <TopBar />
      <View className="flex-col items-center">
        <Text className="text-4xl font-bold p-4">Rankings</Text>
        <View className="flex-row justify-evenly bg-[#a5e5bd] w-11/12 p-5 rounded-t-3xl">
          {catagories.map((catagory) => (
            <Pressable
              key={catagory}
              onPress={() => setSelectedCatagory(catagory)}
              className={`${
                selectedCatagory === catagory
                  ? "bg-[#17A773]"
                  : " text-black"
              } rounded-lg py-2 px-4`}
            >
              <Text className="font-semibold text-lg">{catagory}</Text>
            </Pressable>
          ))}
        </View>
        <View className="bg-[#16A34A] flex-row justify-center items-center w-11/12 p-5 h-[420px] rounded-b-3xl">

        </View>
      </View>
    </View>
  );
}

export default Ranking;