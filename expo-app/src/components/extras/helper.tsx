import { useSignal } from "@preact/signals-react";
import { CircleHelp } from "lucide-react-native";
import { Modal, Pressable, Text, View } from "react-native";

interface HelperProps {
  children: React.ReactNode;
}

function Helper({ children }: HelperProps) {
  const isVisible = useSignal(false);

  return (
    <View>
      <Pressable
        className="items-center justify-center p-1"
        onPress={() => {
          isVisible.value = true;
        }}
        hitSlop={8}
      >
        <CircleHelp size={18} className="text-muted-foreground" color="currentColor" />
      </Pressable>

      <Modal
        transparent
        visible={isVisible.value}
        animationType="fade"
        onRequestClose={() => {
          isVisible.value = false;
        }}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-6"
          onPress={() => {
            isVisible.value = false;
          }}
        >
          <Pressable
            className="bg-popover p-4 rounded-xl shadow-lg border border-border w-full max-w-xs"
            onPress={(e) => e.stopPropagation()} // Prevent close when tapping inside
          >
            <View className="mb-2 flex-row justify-between items-center">
              <Text className="font-semibold text-foreground">Ayuda</Text>
              <Pressable
                onPress={() => {
                  isVisible.value = false;
                }}
              >
                <Text className="text-muted-foreground">✕</Text>
              </Pressable>
            </View>
            <View>
              {/* Render children/text properly inside Text if strict */}
              {typeof children === "string" ? (
                <Text className="text-foreground text-sm leading-5">{children}</Text>
              ) : (
                <View>{children}</View>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default Helper;
