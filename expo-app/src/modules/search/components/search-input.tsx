import React, { useEffect } from "react";
import { View, TextInput, Pressable } from "react-native";
import { Search, X } from "lucide-react-native";
import { useSearchStore } from "../stores/use-search-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function SearchInput() {
  const { top } = useSafeAreaInsets();
  const { query, setQuery, addRecentSearch } = useSearchStore();
  const debouncedQuery = useDebounce(query, 500);

  // Trigger search on debounce or submit
  useEffect(() => {
    if (debouncedQuery.length > 2) {
      // Logic to trigger search (handled by the screen via store subscription)
    }
  }, [debouncedQuery]);

  return (
    <View 
      style={{ paddingTop: top + 10 }} 
      className="px-4 pb-4 bg-black/80 backdrop-blur-md sticky top-0 z-50"
    >
      <View className="flex-row items-center bg-gray-800/80 rounded-full px-4 py-2 border border-white/10">
        <Search size={20} color="#9ca3af" />
        <TextInput
          className="flex-1 text-white ml-2 text-base font-medium h-10"
          placeholder="Search movies, tv shows..."
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={() => addRecentSearch(query)}
          autoCorrect={false}
          selectionColor="#E50914" 
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")}>
            <X size={18} color="#9ca3af" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
