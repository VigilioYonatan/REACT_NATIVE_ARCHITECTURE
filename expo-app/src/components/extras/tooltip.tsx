import { cn } from "@infrastructure/utils/cn";
import { useSignal } from "@preact/signals-react"; // Updated to signals-react
import { Pressable, Text, View, type ViewProps } from "react-native";

type TooltipPosition = "top" | "bottom" | "left" | "right";
interface TooltipProps extends ViewProps {
  content: string;
  position?: TooltipPosition;
  children: React.ReactNode;
  className?: string;
}

function Tooltip({ content, position = "top", children, className, ...props }: TooltipProps) {
  const isVisible = useSignal<boolean>(false);

  const positions = {
    top: "bottom-full mb-2 self-center",
    bottom: "top-full mt-2 self-center",
    left: "right-full mr-2 self-center",
    right: "left-full ml-2 self-center",
  };

  return (
    <View className={cn("relative z-50 items-center justify-center", className)} {...props}>
      <Pressable
        onPressIn={() => {
          isVisible.value = true;
        }}
        onPressOut={() => {
          isVisible.value = false;
        }}
        // Alternative: Toggle on press
        // onPress={() => { isVisible.value = !isVisible.value; }}
      >
        {children}
      </Pressable>

      {isVisible.value && (
        <View
          className={cn(
            "absolute z-50 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg",
            positions[position],
          )}
        >
          <Text className="text-sm text-popover-foreground">{content}</Text>
        </View>
      )}
    </View>
  );
}
export default Tooltip;
