import { View, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { movieShowApi } from "../../src/modules/movies/apis/movie.show.api";
import { VideoPlayer } from "../../src/modules/player/components/video-player";

export default function PlayerScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const movieId = Number(id);

    const movieQuery = movieShowApi(movieId);
    const [orientationLocked, setOrientationLocked] = useState(false);

    // Lock to landscape on focus, unlock on blur
    useFocusEffect(
        useCallback(() => {
            async function lockLandscape() {
                await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.LANDSCAPE
                );
                setOrientationLocked(true);
            }
            lockLandscape();

            return () => {
                async function unlockOrientation() {
                    await ScreenOrientation.lockAsync(
                        ScreenOrientation.OrientationLock.PORTRAIT_UP
                    );
                }
                unlockOrientation();
            };
        }, [])
    );

    if (movieQuery.isLoading || !orientationLocked) {
        return (
            <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
                <StatusBar hidden />
                <ActivityIndicator size="large" color="#E50914" />
            </View>
        );
    }

    if (movieQuery.isError) {
        return (
            <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
                <StatusBar hidden />
                <Text style={{ color: "white" }}>Error loading movie</Text>
            </View>
        );
    }

    if (movieQuery.isSuccess && movieQuery.data?.movie) {
        const movie = movieQuery.data.movie;
        return (
            <View style={{ flex: 1, backgroundColor: "black" }}>
                <StatusBar hidden />
                <VideoPlayer
                    uri={movie.video_url}
                    movieId={movie.id}
                    title={movie.title}
                    posterUrl={movie.poster_url}
                    onBack={() => router.back()}
                />
            </View>
        );
    }

    return null;
}
