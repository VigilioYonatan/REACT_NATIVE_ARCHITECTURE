import { cn } from "@infrastructure/utils/cn";
import { Text, View, type ViewProps } from "react-native";

interface BadgeProps extends ViewProps {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "matrix"
    | "success"
    | "warning"
    | "primary";
  className?: string;
  children?: React.ReactNode;
}

export default function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-primary",
    secondary: "border-transparent bg-secondary",
    destructive: "border-transparent bg-destructive",
    outline: "border-input bg-transparent border",
    matrix: "border-primary/50 bg-primary/10",
    success: "border-transparent bg-emerald-500",
    warning: "border-transparent bg-amber-500",
    primary: "border-transparent bg-primary",
  };

  const textStyles = {
    default: "text-primary-foreground",
    secondary: "text-secondary-foreground",
    destructive: "text-destructive-foreground",
    outline: "text-foreground",
    matrix: "text-primary",
    success: "text-white",
    warning: "text-white",
    primary: "text-primary-foreground",
  };

  return (
    <View
      className={cn(
        "flex-row items-center rounded-sm px-2.5 py-0.5 border",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      <Text className={cn("text-xs font-semibold font-mono", textStyles[variant])}>{children}</Text>
    </View>
  );
}
