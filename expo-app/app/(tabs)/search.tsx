import React, { useEffect } from "react";
import { View, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSearchStore } from "@modules/search/stores/use-search-store";
import { movieIndexApi } from "@modules/movies/apis/movie.index.api";
import { SearchInput } from "@modules/search/components/search-input";
import { RecentHistory } from "@modules/search/components/recent-history";
import { SearchFilters } from "@modules/search/components/search-filters";
import { ResultGrid } from "@modules/search/components/result-grid";
import { EmptyState } from "@modules/search/components/empty-state";
import { StatusBar } from "expo-status-bar";

export default function SearchScreen() {
  const { top } = useSafeAreaInsets();
  const { query, filters, recentSearches } = useSearchStore();

  const { data, isLoading, isError, refetch } = movieIndexApi({
    search: query,
    ...filters,
    limit: 20,
  });

  // Refetch when query or filters change
  useEffect(() => {
    if (query.length > 0 || Object.keys(filters).length > 0) {
      refetch();
    }
  }, [query, filters]);

  const showResults = query.length > 0 || Object.keys(filters).length > 0;
  const hasResults = data && data.results.length > 0;

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      
      {/* Background with subtle gradient */}
      <ImageBackground
        source={{ uri: "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg" }} // Placeholder blur
        style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.1 }}
        blurRadius={50}
      />
      <LinearGradient
        colors={["transparent", "#000000"]}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />

      <SearchInput />

      <View className="flex-1">
        {!showResults && recentSearches.length > 0 && (
          <RecentHistory />
        )}

        {showResults && !isLoading && !hasResults && (
           <EmptyState query={query} />
        )}

        {showResults && (
          <ResultGrid 
            results={data?.results || []} 
            isLoading={Boolean(isLoading)} 
          />
        )}
        
        {/* Initial Empty State when no interaction yet */}
        {!showResults && recentSearches.length === 0 && (
            <EmptyState />
        )}
      </View>

      <SearchFilters />
    </View>
  );
}
