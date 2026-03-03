import { View, StyleSheet, TouchableWithoutFeedback, Dimensions } from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { useState, useCallback, useRef, useEffect } from "react";
import { usePlayer } from "../hooks/use-player";
import { PlayerControls } from "./player-controls";
import { SubtitleRenderer, type Subtitle } from "./subtitle-renderer";
import { useSaveProgress } from "../hooks/use-save-progress";
import { router } from "expo-router";

interface VideoPlayerProps {
    uri: string;
    movieId: number;
    title: string;
    posterUrl?: string;
    initialPosition?: number;
    subtitles?: Subtitle[];
    onBack?: () => void;
}

export function VideoPlayer({
    uri,
    movieId,
    title,
    posterUrl,
    initialPosition = 0,
    subtitles = [],
    onBack,
}: VideoPlayerProps) {
    const {
        videoRef,
        status,
        togglePlay,
        seekTo,
        onPlaybackStatusUpdate,
        positionSignal,
    } = usePlayer();

    // Helper to get status data safely
    const isLoaded = status?.isLoaded;
    const isPlaying = isLoaded ? status.isPlaying : false;
    const positionMillis = isLoaded ? status.positionMillis : 0;
    const durationMillis = isLoaded ? status.durationMillis || 0 : 0;
    const isBuffering = isLoaded ? status.isBuffering : false;

    const [controlsVisible, setControlsVisible] = useState(true);
    const controlsTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

    const safeOnBack = () => {
        if (onBack) onBack();
        else router.back();
    };

    // Auto-hide controls
    const resetControlsTimeout = useCallback(() => {
        if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
        controlsTimeout.current = setTimeout(() => {
            if (isPlaying) {
                setControlsVisible(false);
            }
        }, 3000) as unknown as NodeJS.Timeout;
    }, [isPlaying]);

    useEffect(() => {
        resetControlsTimeout();
        return () => {
             if(controlsTimeout.current) clearTimeout(controlsTimeout.current);
        };
    }, [controlsVisible, isPlaying]);


    const handlePress = () => {
        setControlsVisible(!controlsVisible);
        if (!controlsVisible) resetControlsTimeout();
    };

    // Save Progress Hook
    useSaveProgress({
        movieId,
        positionMillis,
        durationMillis,
        isPlaying,
    });

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={handlePress}>
                <Video
                    ref={videoRef}
                    style={styles.video}
                    source={{ uri }}
                    useNativeControls={false}
                    resizeMode={ResizeMode.CONTAIN}
                    onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                    shouldPlay={true}
                    positionMillis={initialPosition}
                    posterSource={posterUrl ? { uri: posterUrl } : undefined}
                />
            </TouchableWithoutFeedback>

            {/* Subtitles Rendered on top of video, below controls */}
            <SubtitleRenderer 
                currentTime={positionMillis / 1000}
                subtitles={subtitles}
            />

            {/* Controls Overlay */}
            <PlayerControls
                isVisible={controlsVisible}
                isPlaying={isPlaying}
                isLoading={!isLoaded || isBuffering}
                positionMillis={positionMillis}
                durationMillis={durationMillis}
                title={title}
                onPlayPause={() => {
                    togglePlay();
                    resetControlsTimeout();
                }}
                onSeek={seekTo}
                onSeekStart={() => {
                    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
                }}
                onSeekEnd={resetControlsTimeout}
                onBack={safeOnBack}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    video: {
        width: "100%",
        height: "100%",
    },
});
