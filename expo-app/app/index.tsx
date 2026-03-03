import { Link, Stack } from "expo-router";
import { View, Pressable, Text } from "react-native";
import { UserList } from "../src/modules/users/components/user-list";
import { Plus } from "lucide-react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Usuarios",
          headerRight: () => (
            <Link href="/user/create" asChild>
              <Pressable className="mr-2 active:opacity-50">
                <Plus size={24} color="#000" />
              </Pressable>
            </Link>
          ),
        }}
      />
      <UserList />
    </View>
  );
}
