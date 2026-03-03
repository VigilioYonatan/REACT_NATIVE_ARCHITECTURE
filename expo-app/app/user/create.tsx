import { Stack } from "expo-router";
import { View } from "react-native";
import { UserForm } from "../../src/modules/users/components/user-form";

export default function CreateUserScreen() {
  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: "Nuevo Usuario", presentation: "modal" }} />
      <UserForm />
    </View>
  );
}
