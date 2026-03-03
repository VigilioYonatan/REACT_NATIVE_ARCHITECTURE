import { useState } from "react";
import {
    LayoutAnimation,
    Pressable,
    Text,
    StyleSheet,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronDown, ChevronUp } from "lucide-react-native";

interface ExpandableTextProps {
    text: string;
    maxLines?: number;
}

export function ExpandableText({ text, maxLines = 3 }: ExpandableTextProps) {
    const [expanded, setExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const handleTextLayout = (e: any) => {
        if (e.nativeEvent.lines.length > maxLines) {
            setIsTruncated(true);
        }
    };

    return (
        <View>
            <Pressable onPress={toggleExpand} disabled={!isTruncated}>
                <View>
                    <Text
                        style={[styles.text, expanded ? null : { maxHeight: undefined }]}
                        numberOfLines={expanded ? undefined : maxLines}
                        onTextLayout={handleTextLayout}
                        className="text-gray-300 text-base leading-6"
                    >
                        {text}
                    </Text>
                    {!expanded && isTruncated && (
                        <LinearGradient
                            colors={["transparent", "rgba(0,0,0,0.9)"]}
                            style={styles.gradient}
                        />
                    )}
                </View>
                {isTruncated && (
                    <View style={styles.iconContainer}>
                        {expanded ? (
                            <ChevronUp color="#fff" size={20} />
                        ) : (
                            <ChevronDown color="#fff" size={20} />
                        )}
                    </View>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        color: "#d1d5db",
        fontSize: 16,
        lineHeight: 24,
    },
    gradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 40,
    },
    iconContainer: {
        alignItems: "center",
        marginTop: 4,
    },
});
