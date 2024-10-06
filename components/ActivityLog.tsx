import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Event, LogEventType } from "../types/user.types";
import { Cycle, CycleItemType } from "../types/cycle.types";
import { useUserStore } from "../state/stores/userStore";
import { Marker } from "../types/map.types";

const ActivityLog = ({
  cycles,
  markers,
}: {
  cycles: Cycle[];
  markers: Marker[];
}) => {
  const logs = useUserStore((state) => state.logs);

  const sortedLogs = useMemo(() => {
    return [...logs].sort(
      (a, b) =>
        new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime(),
    );
  }, [logs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderEventItem = (item: Event) => {
    const date = formatDate(item.created_at!);
    const time = formatTime(item.created_at!);
    let eventDescription = "";
    let details = "";

    if (item.type === LogEventType.NEW_MARKER) {
      const dataId = item.data_id;

      const marker = markers.find((m) => m.id == dataId);
      eventDescription = marker?.title
        ? `Added bin: ${marker.title}`
        : "Added new bin";
      details = marker
        ? `Location: (${marker.latitude.toFixed(4)}, ${marker.longitude.toFixed(4)})`
        : "Location: Unknown";
    } else if (item.type === LogEventType.NEW_CYCLE) {
      const cycle = cycles.find((c) => c.id == item.data_id);
      if (cycle) {
        const itemCounts = cycle.items.reduce(
          (acc, item) => {
            acc[item.type] = (acc[item.type] || 0) + item.quantity;
            return acc;
          },
          {} as { [key in CycleItemType]: number },
        );

        const itemDescriptions = Object.entries(itemCounts)
          .map(([type, count]) => `${count} ${type}${count > 1 ? "s" : ""}`)
          .join(", ");

        eventDescription = `Recycled items`;
        details = itemDescriptions;
      } else {
        eventDescription = "Recycled items";
        details = "Details unavailable";
      }
    }

    return (
      <View key={item.id} className="mb-4 p-4 bg-white rounded-lg shadow-md">
        <Text className="text-lg font-bold text-green-600">
          {eventDescription}
        </Text>
        <Text className="text-sm text-gray-700 mt-1">{details}</Text>
        <View className="flex-row justify-between mt-2">
          <Text className="text-xs text-gray-500">{date}</Text>
          <Text className="text-xs text-gray-500">{time}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-100 p-4 mt-4">
      <Text className="text-2xl font-bold mb-4 text-green-700">
        Activity Log
      </Text>
      {sortedLogs.map(renderEventItem)}
    </View>
  );
};

export default ActivityLog;
