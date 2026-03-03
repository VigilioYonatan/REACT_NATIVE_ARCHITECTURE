import React from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { PosterCard } from "@modules/movies/components/poster-card";
import type { MovieSchema } from "@modules/movies/schemas/movie.schema";
import { useSearchStore } from "../stores/use-search-store";

interface ResultGridProps {
  results: MovieSchema[];
  isLoading: boolean;
}

export function ResultGrid({ results, isLoading }: ResultGridProps) {
  const { filters } = useSearchStore();

  return (
    <View className="flex-1 w-full h-full pb-20">
      <FlashList<MovieSchema>
        data={results}
        numColumns={3}
        estimatedItemSize={200}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100, paddingTop: 10 }}
        renderItem={({ item }) => (
          <PosterCard movie={item} style={{ marginBottom: 12 }} />
        )}
        ListEmptyComponent={null} // Handled by parent to show EmptyState
      />
    </View>
  );
}
