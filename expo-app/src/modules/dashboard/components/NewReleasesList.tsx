import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { movieIndexApi } from "@src/modules/movies/apis/movie.index.api";
import { Link } from "expo-router";

export function NewReleasesList() {
    // Fetch New Releases (ordered by release_date desc)
  const query = movieIndexApi({ _sort: "release_date", _order: "desc", limit: 10 });

  if (query.isLoading) return null;
  if (query.isError) return null;

  const movies = query.data?.results || [];

  return (
    <View style={{ marginVertical: 24 }}>
        <Text style={styles.sectionTitle}>New Releases</Text>
        <View style={{ height: 180, width: "100%" }}>
            <FlashList
                data={movies}
                horizontal
                showsHorizontalScrollIndicator={false}
                estimatedItemSize={120}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                     <Link href={`/movie/${item.id}` as any} asChild>
                        <Pressable style={{ marginRight: 12 }}>
                            <Image
                                source={{ uri: item.poster_url }}
                                style={{ width: 120, height: 180, borderRadius: 8 }}
                                contentFit="cover"
                                transition={500}
                            />
                        </Pressable>
                    </Link>
                )}
            />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    sectionTitle: {
        color: "white",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 16,
        paddingHorizontal: 16,
    }
});
