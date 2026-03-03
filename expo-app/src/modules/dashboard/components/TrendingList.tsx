import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { movieIndexApi } from "@src/modules/movies/apis/movie.index.api";

export function TrendingList() {
    // Fetch Top 10 Trending (ordered by views_count desc)
  const query = movieIndexApi({ _sort: "views_count", _order: "desc", limit: 10 });

  if (query.isLoading) return <Text style={{color:'white'}}>Loading...</Text>;
  if (query.isError) return null;

  const movies = query.data?.results || [];

  return (
    <View style={{ marginVertical: 24 }}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <View style={{ height: 200, width: "100%" }}>
            <FlashList
                data={movies}
                horizontal
                showsHorizontalScrollIndicator={false}
                estimatedItemSize={140}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item, index }) => (
                    <Link href={`/movie/${item.id}` as any} asChild>
                        <Pressable style={{ marginRight: 16, position: "relative", width: 140, height: 200 }}>
                            {/* Rank Number - Simplified SVG SVG/Text overlay */}
                            <Text style={styles.rankNumber}>{index + 1}</Text>
                            
                            <Image
                                source={{ uri: item.poster_url }}
                                style={{ 
                                    width: 120, 
                                    height: 180, 
                                    borderRadius: 8, 
                                    marginLeft: 20, // Offset for number
                                    marginTop: 20   // Offset for number
                                }}
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
    },
    rankNumber: {
        position: "absolute",
        bottom: -20,
        left: -10,
        fontSize: 100,
        fontWeight: "900",
        color: "black",
        textShadowColor: "white",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
        zIndex: -1, // Behind the poster? Actually usually it overlaps.
        // Let's try overlay style like Netflix
        // In react native text stroke is hard. Text shadow is easiest.
    }
});
