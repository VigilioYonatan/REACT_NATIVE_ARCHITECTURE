import { cn } from "@infrastructure/utils/cn";
import { Text, View, type ViewProps } from "react-native";

interface SeparatorProps extends ViewProps {
  orientation?: "horizontal" | "vertical";
  text?: string;
  className?: string;
}

export function Separator({
  className,
  orientation = "horizontal",
  text,
  ...props
}: SeparatorProps) {
  if (text) {
    return (
      <View className={cn("flex-row items-center py-4", className)} {...props}>
        <View className="flex-1 h-[1px] bg-border" />
        <Text className="mx-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">
          {text}
        </Text>
        <View className="flex-1 h-[1px] bg-border" />
      </View>
    );
  }

  return (
    <View
      className={cn(
        "bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      )}
      {...props}
    />
  );
}
// Alias for compatibility if imported as 'hr'
export { Separator as Hr };
export default Separator;
