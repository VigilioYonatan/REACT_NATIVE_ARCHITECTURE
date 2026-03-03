import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { genreIndexApi } from "@src/modules/genres/apis/genre.index.api";

export function CategoryPills() {
  const query = genreIndexApi();

  if (query.isLoading || query.isError || !query.data?.results.length) {
    return null; // Or skeleton
  }

  const genres = query.data.results;

  return (
    <View style={{ marginVertical: 16 }}>
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        >
            {genres.map((genre) => (
                <BlurView 
                    intensity={20} 
                    tint="light" 
                    key={genre.id} 
                    style={{ borderRadius: 20, overflow: "hidden" }}
                >
                    <Pressable 
                        style={{ 
                            flexDirection: "row", 
                            alignItems: "center", 
                            paddingHorizontal: 16, 
                            paddingVertical: 8,
                            gap: 8,
                            backgroundColor: "rgba(255,255,255,0.1)"
                        }}
                    >
                         {genre.icon_url && (
                             <Image 
                                source={{ uri: genre.icon_url }} 
                                style={{ width: 20, height: 20 }} 
                                contentFit="contain"
                             />
                         )}
                        <Text style={{ color: "white", fontWeight: "600" }}>{genre.name}</Text>
                    </Pressable>
                </BlurView>
            ))}
        </ScrollView>
    </View>
  );
}
