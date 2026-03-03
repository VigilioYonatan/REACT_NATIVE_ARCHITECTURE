import { cn } from "@infrastructure/utils/cn";
import { ActivityIndicator, View } from "react-native";

interface LoaderProps {
  className?: string;
  size?: "small" | "large";
  color?: string;
}

export default function Loader({ className, size = "small", color }: LoaderProps) {
  return (
    <View className={cn("flex items-center justify-center", className)}>
      <ActivityIndicator size={size} color={color || "#22d3ee"} />
    </View>
  );
}
