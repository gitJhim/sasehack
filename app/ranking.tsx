import { Text, View, Pressable } from "react-native";
import TopBar from "../components/TopBar";
import { useState } from "react";

const Ranking = () => {
  const catagories = ["City", "User", "Bin", "School"];
  const [selectedCatagory, setSelectedCatagory] = useState("City");
  const items = ["University of Dayton", "University of Cincinnati", "Write State University", "University of Florida", "University of Kentucky", "University of Louisville", "University of Memphis", "University of Mississippi", "University of Missouri", "University of Nebraska", "University of North Carolina", "University of Oklahoma", "University of Richmond", "University of South Carolina", "University of Tennessee", "University of Texas", "University of Virginia", "Western Carolina University", "Western Michigan University", "Western Washington University"];
  return (
    <View className="bg-gray-200 h-full">
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
        <View className="bg-[#16A34A] flex-col justify-center items-center w-11/12 p-5 h-[420px] rounded-b-3xl">
          {items.slice(0, 5).map((item) => (
            <View className="bg-[#a5e5bd] w-full p-5 m-2">
              <Text className="font-semibold text-lg">{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default Ranking;