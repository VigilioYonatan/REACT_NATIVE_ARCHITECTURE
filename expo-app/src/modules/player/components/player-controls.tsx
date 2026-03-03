import React from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Or Lucide
import Slider from "@react-native-community/slider";
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, Maximize, MessageSquare } from "lucide-react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useRouter } from "expo-router";

interface PlayerControlsProps {
    isVisible: boolean;
    isPlaying: boolean;
    isLoading?: boolean;
    positionMillis: number;
    durationMillis: number;
    title: string;
    onPlayPause: () => void;
    onSeek: (value: number) => void;
    onSeekStart?: () => void;
    onSeekEnd?: () => void;
    onBack: () => void;
    onToggleSubtitles?: () => void;
}

export function PlayerControls({
    isVisible,
    isPlaying,
    isLoading,
    positionMillis,
    durationMillis,
    title,
    onPlayPause,
    onSeek,
    onSeekStart,
    onSeekEnd,
    onBack,
    onToggleSubtitles,
}: PlayerControlsProps) {
    if (!isVisible) return null;

    const router = useRouter();

    const formatTime = (millis: number) => {
        const totalSeconds = Math.max(0, Math.floor(millis / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <Animated.View 
            entering={FadeIn.duration(200)} 
            exiting={FadeOut.duration(200)} 
            style={styles.overlay}
        >
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Pressable onPress={onBack} style={styles.iconButton}>
                    <ArrowLeft color="white" size={28} />
                </Pressable>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <View style={{ width: 40 }} /> {/* Spacer */}
            </View>

            {/* Center Controls */}
            <View style={styles.centerControls}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="white" />
                ) : (
                    <>
                        <Pressable 
                            style={styles.controlButton}
                            onPress={() => onSeek(Math.max(0, positionMillis - 10000))}
                        >
                            <SkipBack color="white" size={32} />
                            <Text style={styles.skipText}>-10s</Text>
                        </Pressable>

                        <Pressable 
                            style={styles.playPauseButton} 
                            onPress={onPlayPause}
                        >
                            {isPlaying ? (
                                <Pause color="black" size={32} fill="black" />
                            ) : (
                                <Play color="black" size={32} fill="black" style={{ marginLeft: 4 }} />
                            )}
                        </Pressable>

                        <Pressable 
                            style={styles.controlButton}
                            onPress={() => onSeek(Math.min(durationMillis, positionMillis + 10000))}
                        >
                            <SkipForward color="white" size={32} />
                            <Text style={styles.skipText}>+10s</Text>
                        </Pressable>
                    </>
                )}
            </View>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.timeRow}>
                    <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={durationMillis}
                        value={positionMillis}
                        onSlidingStart={onSeekStart}
                        onSlidingComplete={onSeekEnd}
                        onValueChange={onSeek}
                        minimumTrackTintColor="#E50914" // Netflix Red
                        maximumTrackTintColor="white"
                        thumbTintColor="#E50914"
                    />
                    <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
                </View>

                <View style={styles.actionsRow}>
                    <Pressable onPress={onToggleSubtitles} style={styles.actionButton}>
                        <MessageSquare color="white" size={24} />
                        <Text style={styles.actionText}>Audio & Subtitles</Text>
                    </Pressable>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "space-between",
        paddingHorizontal: 20, // Keep safe areas in mind in parent
        paddingVertical: 20,
        zIndex: 20,
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 10,
    },
    title: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
    centerControls: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
    },
    controlButton: {
        alignItems: "center",
        justifyContent: "center",
    },
    skipText: {
        color: "white",
        fontSize: 10,
        marginTop: 4,
    },
    playPauseButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    bottomBar: {
        paddingBottom: 20,
        gap: 10,
    },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    timeText: {
        color: "white",
        fontSize: 12,
        fontVariant: ["tabular-nums"],
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    actionText: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
    },
    iconButton: {
        padding: 8,
    },
});
