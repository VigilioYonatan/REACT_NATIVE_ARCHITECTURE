import React from "react";
import { Text, Pressable, ActivityIndicator } from "react-native";
import { cn } from "../../utils/cn";

interface ButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  textClassName?: string;
}

export function Button({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  variant = "primary",
  className = "",
  textClassName = "",
}: ButtonProps) {
  const baseStyle = "h-[50px] rounded-xl flex-row items-center justify-center active:opacity-90";
  
  const variants = {
    primary: "bg-primary-600",
    secondary: "bg-secondary-600",
    outline: "border border-slate-600 bg-transparent",
    ghost: "bg-transparent",
  };

  const textVariants = {
    primary: "text-white font-bold text-base",
    secondary: "text-white font-bold text-base",
    outline: "text-white font-semibold text-base",
    ghost: "text-slate-400 font-medium text-sm",
  };

  const disabledStyle = "opacity-50";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={cn(baseStyle, variants[variant], (disabled || isLoading) && disabledStyle, className)}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === "outline" ? "white" : "white"} />
      ) : (
        <Text className={cn(textVariants[variant], textClassName)}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
