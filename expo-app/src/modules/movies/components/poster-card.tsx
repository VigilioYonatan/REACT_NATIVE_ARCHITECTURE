import React from "react";
import { Pressable, View, Text } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import type { MovieSchema } from "../schemas/movie.schema";

interface PosterCardProps {
  movie: MovieSchema;
  style?: object;
}

export function PosterCard({ movie, style }: PosterCardProps) {
  return (
    <Link href={`/movie/${movie.id}`} asChild>
      <Pressable 
        style={[{ flex: 1, margin: 4 }, style]}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalles de ${movie.title}`}
      >
        <Image
          source={{ uri: movie.poster_url }}
          style={{ 
            width: "100%", 
            aspectRatio: 2/3, 
            borderRadius: 8,
            backgroundColor: "#2a2a2a" // skeleton/placeholder color
          }}
          contentFit="cover"
          transition={200}
        />
        <Text 
          numberOfLines={1} 
          style={{ 
            marginTop: 4, 
            color: "white", 
            fontSize: 12, 
            fontWeight: "500" 
          }}
        >
          {movie.title}
        </Text>
      </Pressable>
    </Link>
  );
}
