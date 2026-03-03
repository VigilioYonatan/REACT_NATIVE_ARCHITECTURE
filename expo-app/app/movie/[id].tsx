import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Play } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";

import ParallaxScrollView from "@modules/ui/components/parallax-scroll-view";
import { ExpandableText } from "@modules/ui/components/expandable-text";
import { InfoRow } from "@modules/movies/components/info-row";
import { ActionButtons } from "@modules/movies/components/action-buttons";
import { CastList } from "@modules/movies/components/cast-list";
import { TrailerPlayer } from "@modules/movies/components/trailer-player";
import { PosterCard } from "@modules/movies/components/poster-card";

import { movieShowApi } from "@modules/movies/apis/movie.show.api";
import { movieGetMoreLikeThisApi } from "@modules/movies/apis/movie.more-like-this.api";
import { Pressable } from "react-native";

export default function MovieDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    const { data: movieData, isLoading, isError } = movieShowApi(Number(id));
    
    // Fetch more like this only if we have a genre_id. 
    // We need to handle this conditionally or inside the component if data is available.
    // For now, we'll optimistically fetch if we had the genre, but since we rely on `movieData`, 
    // we might need a separate component or just pass `enabled: !!movieData` if using robust query.
    // simpler: just render it when movieData is ready.
    
    const movie = movieData?.movie;

    if (isLoading) {
        return (
            <View style={[styles.center, { backgroundColor: "#000" }]}>
                <ActivityIndicator size="large" color="#e50914" />
            </View>
        );
    }

    if (isError || !movie) {
        return (
            <View style={[styles.center, { backgroundColor: "#000" }]}>
                <Text style={{ color: "white" }}>Error loading movie</Text>
            </View>
        );
    }

    // Prepare header image
    const HeaderImage = (
        <Image
            source={{ uri: movie.poster_url }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={500}
        />
    );

    return (
        <ParallaxScrollView
            headerImage={HeaderImage}
            headerBackgroundColor={{ dark: "#000", light: "#000" }}
            headerHeight={550}
        >
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Gradient Overlay for Text Readability */}
            <LinearGradient
                colors={["transparent", "#000"]}
                style={styles.gradient}
                locations={[0, 0.9]}
            />

            <View style={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}>
                {/* Title & Meta */}
                <Text style={styles.title}>{movie.title}</Text>
                
                <InfoRow 
                    year={String(movie.year)} 
                    duration={`${movie.duration_minutes}m`} 
                    rating={movie.rating || 0}
                    matchPercentage={95} // Mock data for now
                />

                {/* Play Button - Big & Sticky-ish feel */}
                <Pressable 
                    style={styles.playButton} 
                    onPress={() => router.push(`/player/${movie.id}`)}
                >
                    <Play fill="#000" color="#000" size={24} />
                    <Text style={styles.playText}>Play</Text>
                </Pressable>

                {/* Synopsis */}
                <ExpandableText text={movie.description} />

                {/* Actions */}
                <ActionButtons 
                    onMyListPress={() => console.log("List")}
                    onRatePress={() => console.log("Rate")}
                    onSharePress={() => console.log("Share")}
                />

                {/* Cast */}
                 {/* Adapt movie_actors to CastMember interface if needed */}
                <CastList cast={movie.movie_actors?.map(ma => ({
                    id: ma.actor_id,
                    name: ma.actor?.name || "Unknown",
                    character: ma.character,
                    profile_path: ma.actor?.profile_path || null
                })) || []} />

                 {/* Trailer */}
                 {movie.trailer_url && movie.trailer_url.includes("youtube") ? (
                      // Extract ID roughly or assume logic. For demo, avoiding regex complexity validation unless needed.
                      // Assuming trailer_url is full url, we'd need ID. 
                      // Let's assume the mock puts the ID or we extract it.
                      // Simple split for demo:
                      <TrailerPlayer videoId={movie.trailer_url.split("v=")[1] || ""} />
                 ) : null}


                {/* More Like This */}
                <MoreLikeThisSection genreId={movie.genre_id} />
                
            </View>
        </ParallaxScrollView>
    );
}

function MoreLikeThisSection({ genreId }: { genreId: number }) {
    const { data } = movieGetMoreLikeThisApi(genreId);
    
    if (!data?.results?.length) return null;

    return (
        <View style={{ marginTop: 24 }}>
             <Text style={styles.sectionTitle}>More Like This</Text>
             <FlashList
                data={data.results}
                numColumns={3}
                estimatedItemSize={150}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <View style={{ flex: 1, margin: 4, aspectRatio: 2/3 }}>
                        <PosterCard movie={item} />
                    </View>
                )}
             />
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    gradient: {
        position: "absolute",
        top: -200, // Pull up to blend with header
        left: 0,
        right: 0,
        height: 250,
        zIndex: 1,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 20,
        backgroundColor: "#000",
        minHeight: 800,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 8,
    },
    playButton: {
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 4,
        gap: 8,
        marginBottom: 20,
    },
    playText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    }
});
