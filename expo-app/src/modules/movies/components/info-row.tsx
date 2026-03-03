import { View, Text, StyleSheet } from "react-native";

interface InfoRowProps {
    year: string;
    duration: string;
    rating: number;
    matchPercentage: number;
}

export function InfoRow({ year, duration, rating, matchPercentage }: InfoRowProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.match}>{matchPercentage}% Match</Text>
            <Text style={styles.text}>{year}</Text>
            <Text style={styles.text}>{duration}</Text>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>4K</Text>
            </View>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>HDR</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginVertical: 12,
    },
    match: {
        color: "#4ade80", // green-400
        fontWeight: "bold",
        fontSize: 14,
    },
    text: {
        color: "#9ca3af", // gray-400
        fontSize: 14,
    },
    badge: {
        borderColor: "#6b7280", // gray-500
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    badgeText: {
        color: "#9ca3af",
        fontSize: 10,
        fontWeight: "bold",
    },
});
