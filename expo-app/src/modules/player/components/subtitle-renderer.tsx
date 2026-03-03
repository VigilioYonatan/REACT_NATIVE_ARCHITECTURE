import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

// Mock subtitle data structure
export interface Subtitle {
    startTime: number; // seconds
    endTime: number;   // seconds
    text: string;
}

interface SubtitleRendererProps {
    currentTime: number; // seconds
    subtitles?: Subtitle[];
    enabled?: boolean;
}

export function SubtitleRenderer({
    currentTime,
    subtitles = [],
    enabled = true,
}: SubtitleRendererProps) {
    if (!enabled) return null;

    const currentSubtitle = useMemo(() => {
        return subtitles.find(
            (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime
        );
    }, [currentTime, subtitles]);

    if (!currentSubtitle) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            <Text style={styles.text}>{currentSubtitle.text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 50,
        left: 20,
        right: 20,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    text: {
        color: "white",
        fontSize: 20,
        textAlign: "center",
        fontWeight: "600",
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        backgroundColor: "rgba(0,0,0,0.3)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
});
