import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Search, User } from "lucide-react-native";
import { Image } from "expo-image";
import Animated, { interpolate, useAnimatedStyle, SharedValue } from "react-native-reanimated";

interface AnimatedHeaderProps {
    scrollY: SharedValue<number>;
}

export function AnimatedHeader({ scrollY }: AnimatedHeaderProps) {
    const insets = useSafeAreaInsets();

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [0, 100], [0, 1], "clamp");
        return {
            opacity,
        };
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Background Blur that fades in */}
            <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" }} />
            </Animated.View>

            {/* Content */}
            <View style={styles.content}>
                 {/* Logo (Text for now or Image) */}
                 <Text style={styles.logo}>N</Text>

                 {/* Right Actions */}
                 <View style={styles.actions}>
                    <Search color="white" size={24} />
                    <User color="white" size={24} />
                 </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    content: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 12,
        paddingTop: 8,
    },
    logo: {
        fontSize: 32,
        fontWeight: "900",
        color: "#E50914", // Netflix Red
    },
    actions: {
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
    }
});
