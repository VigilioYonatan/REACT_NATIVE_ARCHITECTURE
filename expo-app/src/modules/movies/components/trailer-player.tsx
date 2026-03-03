import { useRef, useCallback, useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

interface TrailerPlayerProps {
    videoId: string;
}

export function TrailerPlayer({ videoId }: TrailerPlayerProps) {
    const [playing, setPlaying] = useState(false);
    const { width } = Dimensions.get("window");

    const onStateChange = useCallback((state: string) => {
        if (state === "ended") {
            setPlaying(false);
        }
    }, []);

    if (!videoId) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Trailer</Text>
            <View style={styles.videoParams}>
                <YoutubePlayer
                    height={220}
                    width={width - 32} // padding horizontal
                    play={playing}
                    videoId={videoId}
                    onChangeState={onStateChange}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        marginBottom: 32,
    },
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    videoParams: {
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#000",
    },
});
