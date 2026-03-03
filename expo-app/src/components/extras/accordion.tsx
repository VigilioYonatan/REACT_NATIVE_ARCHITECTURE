import { cn } from "@infrastructure/utils/client";
import { useSignal } from "@preact/signals-react";
import { ChevronDown } from "lucide-react-native";
import { LayoutAnimation, Platform, Pressable, Text, UIManager, View } from "react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionItem {
  id: string;
  title: string;
  content: string | React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const openItems = useSignal<Set<string>>(new Set());

  function toggleItem(itemId: string) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newSet = new Set(openItems.value);
    if (newSet.has(itemId)) {
      newSet.delete(itemId);
    } else {
      if (!allowMultiple) newSet.clear();
      newSet.add(itemId);
    }
    openItems.value = newSet;
  }

  return (
    <View className={cn("bg-card border border-border rounded-lg overflow-hidden", className)}>
      {items.map((item) => {
        const isOpen = openItems.value.has(item.id);
        return (
          <View key={item.id} className="border-b border-border last:border-b-0">
            <Pressable
              onPress={() => toggleItem(item.id)}
              className="w-full px-4 py-3 flex-row items-center justify-between active:bg-muted/50"
            >
              <View className="flex-1 mr-2">
                <Text className="text-sm font-medium text-foreground">{item.title}</Text>
              </View>
              <ChevronDown
                size={16}
                className={cn("text-muted-foreground", isOpen ? "rotate-180" : "")}
                color="currentColor"
              />
            </Pressable>

            {isOpen && (
              <View className="px-4 pb-3 pt-0 bg-background">
                <View className="pt-3 border-t border-border/50">
                  {typeof item.content === "string" ? (
                    <Text className="text-sm text-muted-foreground leading-5">{item.content}</Text>
                  ) : (
                    item.content
                  )}
                </View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

export default Accordion;
