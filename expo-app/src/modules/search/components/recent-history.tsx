import React from "react";
import { View, Text, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { X, Clock } from "lucide-react-native";
import { useSearchStore } from "../stores/use-search-store";

export function RecentHistory() {
  const { recentSearches, removeRecentSearch, setQuery, clearHistory } = useSearchStore();

  if (recentSearches.length === 0) return null;

  return (
    <View className="py-4">
      <View className="flex-row justify-between items-center px-4 mb-2">
        <Text className="text-white text-lg font-bold">Recent Searches</Text>
        <Pressable onPress={clearHistory}>
          <Text className="text-gray-400 text-xs">Clear All</Text>
        </Pressable>
      </View>
      <FlashList
        data={recentSearches}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        estimatedItemSize={100}
        renderItem={({ item }) => (
          <View className="mr-3 bg-gray-800 rounded-full flex-row items-center pl-3 pr-2 py-1.5 border border-white/5">
            <Clock size={12} color="#9ca3af" style={{ marginRight: 6 }} />
            <Pressable onPress={() => setQuery(item)}>
              <Text className="text-gray-200 font-medium mr-2">{item}</Text>
            </Pressable>
            <Pressable 
              onPress={() => removeRecentSearch(item)}
              hitSlop={8}
            >
              <View className="bg-gray-700/50 rounded-full p-0.5">
                <X size={12} color="#9ca3af" />
              </View>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
