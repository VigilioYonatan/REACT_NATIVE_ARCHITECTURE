import React from "react";
import { View, Text } from "react-native";
import { Search } from "lucide-react-native";

export function EmptyState({ query }: { query?: string }) {
  return (
    <View className="flex-1 justify-center items-center mt-20 px-10">
      <View className="bg-gray-800 p-6 rounded-full mb-6 relative">
        <Search size={48} color="#4b5563" />
        <View className="absolute top-0 right-0 bg-red-500 w-4 h-4 rounded-full border-2 border-gray-900" />
      </View>
      <Text className="text-white text-xl font-bold text-center mb-2">
        {query ? `No results for "${query}"` : "Search for movies..."}
      </Text>
      <Text className="text-gray-400 text-center text-sm leading-5">
        {query 
          ? "Try adjusting your search or filters to find what you're looking for." 
          : "Explore our massive library of movies, TV shows, and more."}
      </Text>
    </View>
  );
}
