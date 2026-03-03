import { View, Text, Pressable, StyleSheet } from "react-native";
import { Plus, ThumbsUp, Share2, Check } from "lucide-react-native";
import { useState } from "react";

interface ActionButtonsProps {
    onMyListPress?: () => void;
    onRatePress?: () => void;
    onSharePress?: () => void;
    isInMyList?: boolean;
}

export function ActionButtons({
    onMyListPress,
    onRatePress,
    onSharePress,
    isInMyList = false,
}: ActionButtonsProps) {
    const [added, setAdded] = useState(isInMyList);

    const handleListPress = () => {
        setAdded(!added);
        onMyListPress?.();
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.action} onPress={handleListPress}>
                {added ? (
                    <Check color="#4ade80" size={24} />
                ) : (
                    <Plus color="#fff" size={24} />
                )}
                <Text style={styles.text}>My List</Text>
            </Pressable>

            <Pressable style={styles.action} onPress={onRatePress}>
                <ThumbsUp color="#fff" size={24} />
                <Text style={styles.text}>Rate</Text>
            </Pressable>

            <Pressable style={styles.action} onPress={onSharePress}>
                <Share2 color="#fff" size={24} />
                <Text style={styles.text}>Share</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 40,
        marginVertical: 16,
    },
    action: {
        alignItems: "center",
        gap: 8,
    },
    text: {
        color: "#9ca3af", // gray-400
        fontSize: 12,
    },
});
