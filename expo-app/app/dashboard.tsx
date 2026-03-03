import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Dashboard() {
  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Text className="text-white text-2xl font-bold mb-4">Dashboard</Text>
      <Text className="text-slate-400">Welcome to MovieApp</Text>
      <Link href="/(auth)/login" className="mt-4 text-primary-500">
        Go back to Login
      </Link>
    </View>
  );
}
