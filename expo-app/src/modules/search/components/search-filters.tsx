import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useSearchStore } from "../stores/use-search-store";
import { genreIndexApi } from "@modules/genres/apis/genre.index.api";
import { X } from "lucide-react-native";

export function SearchFilters() {
  const { filters, setFilters, isFiltersOpen, setFiltersOpen } = useSearchStore();
  const { data: genres } = genreIndexApi();

  if (!isFiltersOpen) return null;

  const toggleGenre = (id: number) => {
    setFilters({ 
      ...filters, 
      genre_id: filters.genre_id === id ? undefined : id 
    });
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl p-6 border-t border-white/10 z-50 pb-10 shadow-2xl">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-white text-xl font-bold">Filters</Text>
        <Pressable onPress={() => setFiltersOpen(false)}>
           <X size={24} color="white" />
        </Pressable>
      </View>
      
      <Text className="text-gray-400 mb-3 font-semibold uppercase text-xs tracking-wider">Genres</Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {genres?.results.map((genre: any) => (
          <Pressable
            key={genre.id}
            onPress={() => toggleGenre(genre.id)}
            className={`px-4 py-2 rounded-full border ${
              filters.genre_id === genre.id
                ? "bg-red-600 border-red-600"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <Text 
              className={`${
                filters.genre_id === genre.id ? "text-white" : "text-gray-300"
              } font-medium`}
            >
              {genre.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable 
        className="bg-white rounded-xl py-4 items-center mt-4"
        onPress={() => setFiltersOpen(false)}
      >
        <Text className="text-black font-bold text-base">Show Results</Text>
      </Pressable>
    </View>
  );
}
