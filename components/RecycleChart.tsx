import { ContributionGraph } from "react-native-chart-kit";
import { Dimensions, View } from "react-native";
import { Cycle } from "../types/cycle.types";

const RecycleChart = ({ cycles }: { cycles: Cycle[] }) => {
  const chartConfig = {
    backgroundGradientFrom: "transparent",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "transparent",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(47, 152, 74, ${opacity})`,
    labelColor: () => "#000000",
    strokeWidth: 3,
  };

  const screenWidth = Dimensions.get("screen").width;

  const tootltipDataAttrs: any = {};

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const chartData = () => {
    const data = [] as any[];
    for (const cycle of cycles) {
      let count = 0;
      for (const item of cycle.items) {
        count += item.quantity;
      }
      data.push({
        date: formatDate(cycle.created_at!),
        count,
      });
    }
    console.log(data);
    return data;
  };

  return (
    <View className=" flex-1 items-center justify-center mt-4">
      <ContributionGraph
        values={chartData()}
        endDate={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)}
        numDays={90}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        showMonthLabels={true}
        tooltipDataAttrs={(_) => tootltipDataAttrs}
        gutterSize={5}
      />
    </View>
  );
};

export default RecycleChart;
