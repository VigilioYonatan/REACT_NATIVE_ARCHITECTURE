import { cn } from "@infrastructure/utils/cn";
import { useSignal } from "@preact/signals-react";
import { MoreVertical } from "lucide-react-native";
import { ActivityIndicator, Modal, Pressable, View, type ViewProps } from "react-native";

interface EllipsisMenuProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  position?: "left" | "right";
  isLoading?: boolean;
}

export function EllipsisMenu({
  children,
  className,
  triggerClassName,
  position = "right",
  isLoading = false,
  ...props
}: EllipsisMenuProps) {
  const isOpen = useSignal<boolean>(false);

  function toggle() {
    if (isLoading) return;
    isOpen.value = !isOpen.value;
  }

  function close() {
    isOpen.value = false;
  }

  return (
    <View className={cn("relative", className)} {...props}>
      <Pressable
        onPress={toggle}
        className={cn(
          "p-2 rounded-full active:bg-muted items-center justify-center",
          isLoading && "opacity-50",
          triggerClassName,
        )}
        disabled={isLoading}
        accessibilityLabel="Options"
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="currentColor" />
        ) : (
          <MoreVertical size={20} className="text-muted-foreground" color="currentColor" />
        )}
      </Pressable>

      <Modal transparent visible={isOpen.value} animationType="fade" onRequestClose={close}>
        <Pressable className="flex-1" onPress={close}>
          {/* Backdrop */}
          <View className="flex-1 bg-transparent" />
        </Pressable>

        {/* Menu Content - Centered for simplicity in RN, or use absolute if needed but simple modal is better for UX on mobile */}
        <View
          className="absolute bg-popover border border-border rounded-lg shadow-lg p-1 min-w-[150px]"
          style={{
            top: 100, // Approximation, replacing exact positioning. In real app, use `measure`
            right: position === "right" ? 20 : undefined,
            left: position === "left" ? 20 : undefined,
            // For a real generic menu, a library like react-native-popup-menu is recommended
          }}
        >
          <View onStartShouldSetResponder={() => true}>{children}</View>
        </View>
      </Modal>
    </View>
  );
}

export default EllipsisMenu;
