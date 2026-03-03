import { cn } from "@infrastructure/utils/cn";
import { Pressable, type PressableProps, Text, View, type ViewProps } from "react-native";

interface TabsProps extends ViewProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

function Tabs({ className, children, ...props }: TabsProps) {
  return (
    <View className={cn("w-full", className)} {...props}>
      {children}
    </View>
  );
}

interface TabsListProps extends ViewProps {
  children: React.ReactNode;
}
function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <View
      className={cn("flex-row h-10 items-center justify-center rounded-md bg-muted p-1", className)}
      {...props}
    >
      {children}
    </View>
  );
}

interface TabsTriggerProps extends PressableProps {
  value?: string; // Optional if controlled visually only, but typically needed
  isActive?: boolean;
  children: React.ReactNode;
  className?: string;
}
function TabsTrigger({ className, isActive, children, ...props }: TabsTriggerProps) {
  return (
    <Pressable
      className={cn(
        "items-center justify-center rounded-sm px-3 py-1.5",
        isActive ? "bg-background shadow-sm" : "opacity-70",
        className,
      )}
      {...props}
    >
      <Text
        className={cn("text-sm font-medium text-foreground", !isActive && "text-muted-foreground")}
      >
        {children}
      </Text>
    </Pressable>
  );
}

interface TabsContentProps extends ViewProps {
  value?: string;
  show?: boolean;
  children: React.ReactNode;
}
function TabsContent({ className, show, children, ...props }: TabsContentProps) {
  if (!show) return null;
  return (
    <View className={cn("mt-2", className)} {...props}>
      {children}
    </View>
  );
}

// Attach subcomponents
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export { Tabs, TabsList, TabsTrigger, TabsContent };
export default Tabs;
