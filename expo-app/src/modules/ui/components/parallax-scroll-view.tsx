import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from "react-native-reanimated";

interface ParallaxScrollViewProps extends PropsWithChildren {
    headerImage: ReactElement;
    headerBackgroundColor: { dark: string; light: string };
    headerHeight?: number;
    contentContainerStyle?: ViewStyle;
}

const HEADER_HEIGHT = 450;

export default function ParallaxScrollView({
    children,
    headerImage,
    headerBackgroundColor,
    headerHeight = HEADER_HEIGHT,
    contentContainerStyle,
}: ParallaxScrollViewProps) {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-headerHeight, 0, headerHeight],
                        [-headerHeight / 2, 0, headerHeight * 0.75],
                    ),
                },
                {
                    scale: interpolate(
                        scrollOffset.value,
                        [-headerHeight, 0, headerHeight],
                        [2, 1, 1],
                    ),
                },
            ],
        };
    });

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                ref={scrollRef}
                scrollEventThrottle={16}
                contentContainerStyle={[
                    { paddingBottom: 100 },
                    contentContainerStyle,
                ]}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={[
                        styles.header,
                        { height: headerHeight, backgroundColor: headerBackgroundColor.dark },
                        headerAnimatedStyle,
                    ]}
                >
                    {headerImage}
                </Animated.View>
                <View style={styles.content}>{children}</View>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000", // Dark theme by default
    },
    header: {
        overflow: "hidden",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    content: {
        flex: 1,
        marginTop: HEADER_HEIGHT - 60, // Overlap slightly
        zIndex: 2,
    },
});
