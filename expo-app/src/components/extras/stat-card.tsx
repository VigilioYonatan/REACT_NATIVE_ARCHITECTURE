import { cn } from "@infrastructure/utils/cn";
import type { LucideIcon } from "lucide-react-native";
import { TrendingDown, TrendingUp } from "lucide-react-native";
import { Text, View, type ViewProps } from "react-native";

interface StatCardProps extends ViewProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface StorageStatCardProps extends ViewProps {
  title: string;
  used: number;
  total: number;
  unit: string;
  icon: LucideIcon;
  iconBgColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconBgColor = "bg-primary/10",
  className,
  trend,
  ...props
}: StatCardProps) {
  return (
    <View
      className={cn("bg-card rounded-xl border border-border p-6 shadow-sm", className)}
      {...props}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 gap-3">
          <Text className="text-sm font-medium text-muted-foreground">{title}</Text>
          <Text className="text-4xl font-bold tracking-tight text-foreground">{value}</Text>
          {(description || trend) && (
            <View className="flex-row items-center gap-2">
              {trend && (
                <View className={cn("flex-row items-center gap-1")}>
                  <Text
                    className={cn(
                      "text-xs font-medium",
                      trend.isPositive ? "text-green-600" : "text-red-500",
                    )}
                  >
                    {trend.isPositive ? "+" : ""}
                    {trend.value}%
                  </Text>
                  {trend.isPositive ? (
                    <TrendingUp size={14} className="text-green-600" color="currentColor" />
                  ) : (
                    <TrendingDown size={14} className="text-red-500" color="currentColor" />
                  )}
                </View>
              )}
              {description && <Text className="text-xs text-muted-foreground">{description}</Text>}
            </View>
          )}
        </View>
        <View className={cn("p-3 rounded-lg", iconBgColor)}>
          <Icon size={20} className="text-primary" color="currentColor" />
        </View>
      </View>
    </View>
  );
}

export function StorageStatCard({
  title,
  used,
  total,
  unit,
  icon: Icon,
  iconBgColor = "bg-amber-100",
  className,
  ...props
}: StorageStatCardProps) {
  const percentage = Math.round((used / total) * 100);
  const remaining = total - used;

  return (
    <View className={cn("bg-card rounded-xl border border-border p-6", className)} {...props}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 gap-3">
          <Text className="text-sm font-medium text-muted-foreground">{title}</Text>
          <Text className="text-4xl font-bold tracking-tight text-foreground">
            {used} {unit}
            <Text className="text-xl text-muted-foreground font-normal">
              {" "}
              / {total} {unit}
            </Text>
          </Text>

          {/* Progress Bar */}
          <View className="gap-2">
            <View className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <View
                className={cn(
                  "h-full rounded-full",
                  percentage >= 90
                    ? "bg-red-500"
                    : percentage >= 70
                      ? "bg-amber-500"
                      : "bg-emerald-500",
                )}
                style={{ width: `${percentage}%` }}
              />
            </View>

            {/* Labels */}
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {percentage}% Capacity
              </Text>
              <Text className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {remaining} {unit} Left
              </Text>
            </View>
          </View>
        </View>
        <View className={cn("p-3 rounded-lg ml-4", iconBgColor)}>
          <Icon size={20} className="text-amber-600" color="currentColor" />
        </View>
      </View>
    </View>
  );
}
