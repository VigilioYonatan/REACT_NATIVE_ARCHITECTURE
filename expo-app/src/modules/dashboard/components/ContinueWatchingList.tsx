import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { watchHistoryIndexApi } from "@src/modules/users/apis/watch-history.index.api";
import { Link } from "expo-router";
import { Play } from "lucide-react-native";

export function ContinueWatchingList() {
    // Fetch Watch History
  const query = watchHistoryIndexApi({ _expand: "movie", _sort: "last_watched_at", _order: "desc" });

  if (query.isLoading) return null;
  if (query.isError || !query.data?.results.length) return null;

  const history = query.data.results;

  return (
    <View style={{ marginVertical: 24 }}>
        <Text style={styles.sectionTitle}>Continue Watching</Text>
        <View style={{ height: 160, width: "100%" }}>
            <FlashList
                data={history}
                horizontal
                showsHorizontalScrollIndicator={false}
                estimatedItemSize={200}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => {
                    const movie = item.movie;
                    if (!movie) return null;
                    
                    // Safe handling of null movie
                    // progress percentage
                    const progress = item.progress_seconds / (movie.duration_minutes * 60) * 100;

                    return (
                     <Link href={`/player/${movie.id}` as any} asChild>
                        <Pressable style={{ marginRight: 16, width: 200, height: 140 }}>
                            <View style={{ position: "relative", borderRadius: 8, overflow: 'hidden' }}>
                                {/* Backdrop/Thumbnail */}
                                <Image
                                    source={{ uri: movie.backdrop_url || movie.poster_url }}
                                    style={{ width: 200, height: 110 }}
                                    contentFit="cover"
                                    transition={500}
                                />
                                
                                {/* Overlay Play Icon */}
                                <View style={StyleSheet.absoluteFill}>
                                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" }}>
                                        <Play size={32} color="white" fill="white" />
                                    </View>
                                </View>

                                {/* Progress Bar */}
                                <View style={{ height: 4, backgroundColor: "rgba(255,255,255,0.3)" }}>
                                    <View style={{ height: 4, backgroundColor: "#E50914", width: `${Math.min(progress, 100)}%` }} />
                                </View>
                            </View>

                            <View style={{marginTop: 8, flexDirection: "row", justifyContent: "space-between" }}>
                                <Text numberOfLines={1} style={{ color: "white", fontWeight: "600", fontSize: 14 }}>{movie.title}</Text>
                            </View>

                        </Pressable>
                    </Link>
                )}}
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
