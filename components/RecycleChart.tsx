import { ContributionGraph } from "react-native-chart-kit";
import { Dimensions, View } from "react-native";

const RecycleChart = () => {
  const chartConfig = {
    backgroundGradientFrom: "transparent",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "transparent",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(47, 152, 74, ${opacity})`,
    labelColor: () => "#000000",
    strokeWidth: 3, // optional, default 3
  };

  const screenWidth = Dimensions.get("screen").width;

  const tootltipDataAttrs: any = {};

  const chartData = () => {
    const data = [
      { date: "2024-10-05", count: 2 },
      { date: "2024-09-05", count: 0 },
      { date: "2024-08-05", count: 1 },
      { date: "2024-09-15", count: 4 },
      { date: "2024-08-15", count: 3 },
      { date: "2024-10-15", count: 2 },
    ];
    return data;
  };

  return (
    <View className=" flex-1 items-center justify-center">
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
