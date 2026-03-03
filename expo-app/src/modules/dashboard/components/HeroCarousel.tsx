import React, { useRef } from "react";
import { View, Text, useWindowDimensions, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Play, Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { movieIndexApi } from "@src/modules/movies/apis/movie.index.api";
import { StyleSheet } from "react-native";

export function HeroCarousel() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  
  // Fetch featured movies
  const query = movieIndexApi({ is_featured: true, limit: 5 });

  if (query.isLoading) {
    // Simple skeleton or loading state
    return <View style={{ width, height: height * 0.7, backgroundColor: "#1a1a1a" }} />;
  }

  if (query.isError || !query.data?.results.length) {
      return null;
  }

  const movies = query.data.results;

  return (
    <View style={{ height: height * 0.8 }}>
      <FlashList
        data={movies}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={width}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ width, height: height * 0.8, position: "relative" }}>
            <Image
              source={{ uri: item.poster_url }} // Should ideally be backdrop for hero, but using poster as fallback or backdrop if available
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={500}
            />
            
            {/* Gradient Overlay */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.8)", "#000"]}
              style={StyleSheet.absoluteFill}
            />

            {/* Content Content */}
            <View style={{ 
                position: "absolute", 
                bottom: 0, 
                left: 0, 
                right: 0, 
                padding: 24,
                gap: 16,
                paddingBottom: 40
            }}>
                {/* Title */}
                <Text style={{ 
                    color: "white", 
                    fontSize: 42, 
                    fontWeight: "900", 
                    textAlign: "center",
                    textShadowColor: 'rgba(0, 0, 0, 0.75)',
                    textShadowOffset: {width: -1, height: 1},
                    textShadowRadius: 10
                }}>
                    {item.title}
                </Text>

                {/* Genres / Tags - Mocked for now or fetched via relation */}
                <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                    <Text style={{ color: "rgba(255,255,255,0.8)" }}>{item.year}</Text>
                    <Text style={{ color: "rgba(255,255,255,0.8)" }}>•</Text>
                    <Text style={{ color: "rgba(255,255,255,0.8)" }}>{item.duration_minutes}m</Text>
                </View>

                {/* Actions */}
                <View style={{ flexDirection: "row", gap: 16, justifyContent: "center", marginTop: 8 }}>
                    
                    {/* My List Button */}
                     <BlurView intensity={20} tint="light" style={{ borderRadius: 8, overflow: "hidden" }}>
                        <Pressable 
                            style={{ 
                                flexDirection: "row", 
                                alignItems: "center", 
                                gap: 8, 
                                paddingVertical: 12, 
                                paddingHorizontal: 24,
                                backgroundColor: "rgba(255,255,255,0.1)"
                            }}
                            onPress={() => console.log("Add to list")}
                        >
                            <Plus size={24} color="#FFF" />
                            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>My List</Text>
                        </Pressable>
                     </BlurView>

                    {/* Play Button */}
                    <Pressable 
                        style={{ 
                            flexDirection: "row", 
                            alignItems: "center", 
                            gap: 8, 
                            backgroundColor: "white", 
                            paddingVertical: 12, 
                            paddingHorizontal: 32, 
                            borderRadius: 8 
                        }}
                        onPress={() => router.push(`/player/${item.id}` as any)}
                    >
                        <Play size={24} color="#000" fill="#000" />
                        <Text style={{ color: "black", fontWeight: "700", fontSize: 16 }}>Play</Text>
                    </Pressable>
                </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
