import { cn } from "@infrastructure/utils/cn";
import { ActivityIndicator, Pressable, type PressableProps, Text, View } from "react-native";

// Inline variants object since cva isn't strictly requested but cleaner
const variants = {
  primary: "bg-primary border-primary/50 shdow-sm",
  secondary: "bg-secondary",
  danger: "bg-destructive",
  outline: "border border-input bg-background",
  ghost: "bg-transparent",
  glitch: "bg-cyan-500", // Simplified glitch effect for RN
};

const textVariants = {
  primary: "text-primary-foreground",
  secondary: "text-secondary-foreground",
  danger: "text-destructive-foreground",
  outline: "text-foreground",
  ghost: "text-foreground",
  glitch: "text-white",
};

const sizes = {
  sm: "h-9 px-3 rounded-md",
  md: "h-10 px-4 py-2 rounded-md",
  lg: "h-11 px-8 rounded-md",
  icon: "h-10 w-10 p-2 rounded-md items-center justify-center",
};

const textSizes = {
  sm: "text-xs",
  md: "text-base",
  lg: "text-lg",
  icon: "text-base",
};

interface ButtonProps extends PressableProps {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
  loading_title?: string;
  className?: string; // Explicit for NativeWind
  children?: React.ReactNode;
}

export default function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  loading_title,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        "flex-row items-center justify-center rounded-md active:opacity-80 transition-opacity",
        variants[variant],
        sizes[size],
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator size="small" color="currentColor" className="text-current" />
          {loading_title && (
            <Text className={cn("font-medium", textVariants[variant], textSizes[size])}>
              {loading_title}
            </Text>
          )}
        </View>
      ) : // Check if children is string to wrap in Text, else render as is
      typeof children === "string" ? (
        <Text
          className={cn(
            "font-medium font-mono uppercase tracking-wider",
            textVariants[variant],
            textSizes[size],
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
