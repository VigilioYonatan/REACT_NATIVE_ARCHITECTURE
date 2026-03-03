import { cn } from "@infrastructure/utils/cn";
import { Text, View, type ViewProps } from "react-native";

interface ProgressBarProps extends ViewProps {
  value: number;
  max: number;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger";
  label?: string;
  showValue?: boolean;
}

export default function ProgressBar({
  value,
  max,
  className,
  variant = "default",
  label,
  showValue,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colorClass = {
    default: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
  }[variant];

  return (
    <View className={cn("w-full space-y-2", className)} {...props}>
      {(label || showValue) && (
        <View className="flex-row justify-between mb-1">
          {label && <Text className="text-xs font-medium text-muted-foreground">{label}</Text>}
          {showValue && (
            <Text className="text-xs font-medium text-muted-foreground">
              {Math.round(percentage)}%
            </Text>
          )}
        </View>
      )}
      <View className="h-2 w-full bg-secondary/30 rounded-full overflow-hidden">
        <View
          className={cn("h-full rounded-full", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}
