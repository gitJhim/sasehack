import { ContributionGraph } from "react-native-chart-kit";
import { View } from "react-native";

const RecycleChart = () => {
  const chartConfig = {
    backgroundGradientFrom: "transparent",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "transparent",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(127, 57, 230, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
  };

  const tootltipDataAttrs: any = {};

  const chartData = () => {
    const data = [
      { date: "2017-01-02", count: 1 },
      { date: "2017-01-03", count: 2 },
      { date: "2017-01-04", count: 3 },
      { date: "2017-01-05", count: 4 },
      { date: "2017-01-06", count: 5 },
      { date: "2017-01-30", count: 2 },
      { date: "2017-01-31", count: 3 },
      { date: "2017-03-01", count: 2 },
      { date: "2017-04-02", count: 4 },
      { date: "2017-03-05", count: 2 },
      { date: "2017-02-30", count: 4 },
    ];
    return data;
  };

  return (
    <View className="mx-6 justify-center">
      <ContributionGraph
        values={chartData()}
        endDate={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)}
        numDays={90}
        width={350}
        height={220}
        chartConfig={chartConfig}
        showOutOfRangeDays={true}
        onDayPress={(date) => {
          console.log(date);
        }}
        showMonthLabels={false}
        tooltipDataAttrs={(_) => tootltipDataAttrs}
      />
    </View>
  );
};

export default RecycleChart;
