import Avatar from "@components/extras/avatar";
import { Card } from "@components/extras/card";
import Loader from "@components/extras/loader";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useUserIndex } from "../apis/user-index.api";
import type { User } from "../dtos/user.dto";

export function UserList() {
  const query = useUserIndex();

  if (query.isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Loader />
      </View>
    );
  }

  if (query.isError) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-destructive text-center mb-2 font-medium">
          Error cargando usuarios
        </Text>
        <Text className="text-muted-foreground text-center">Intenta nuevamente más tarde.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 w-full h-full bg-background">
      {/* Floating Action Button for Create */}
      <Link href="/user/create" asChild>
        <Pressable className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg z-50 active:scale-95 transition-transform">
          <Plus size={24} color="white" />
        </Pressable>
      </Link>

      <FlashList<User>
        data={query.data || []}
        // @ts-ignore: definitions are wrong
        estimatedItemSize={80}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }: { item: User }) => (
          <Card className="mb-3 p-4 flex-row items-center gap-4 bg-card border-border shadow-sm">
            <Avatar
              user={{ username: item.name, avatar: null }}
              size="md"
              className="border border-border"
            />
            <View className="flex-1">
              <Text className="text-base font-bold text-foreground">{item.name}</Text>
              <Text className="text-sm text-muted-foreground">{item.email}</Text>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center p-8">
            <Text className="text-muted-foreground">No hay usuarios registrados</Text>
          </View>
        }
      />
    </View>
  );
}
