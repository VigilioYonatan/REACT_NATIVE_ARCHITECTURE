import { View, Text, Image, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";

interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

interface CastListProps {
    cast: CastMember[];
}

export function CastList({ cast }: CastListProps) {
    if (!cast || cast.length === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cast & Crew</Text>
            <View style={{ height: 140, width: "100%" }}>
                <FlashList
                    data={cast}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    estimatedItemSize={100}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={{ paddingHorizontal: 0 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image
                                source={{
                                    uri: item.profile_path
                                        ? item.profile_path
                                        : "https://via.placeholder.com/100x100.png?text=User",
                                }}
                                style={styles.image}
                            />
                            <Text style={styles.name} numberOfLines={1}>
                                {item.name}
                            </Text>
                            <Text style={styles.character} numberOfLines={1}>
                                {item.character}
                            </Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        marginBottom: 16,
    },
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    card: {
        width: 100,
        marginRight: 12,
        alignItems: "center",
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#374151",
        marginBottom: 8,
    },
    name: {
        color: "#e5e7eb",
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center",
    },
    character: {
        color: "#9ca3af",
        fontSize: 10,
        textAlign: "center",
    },
});
