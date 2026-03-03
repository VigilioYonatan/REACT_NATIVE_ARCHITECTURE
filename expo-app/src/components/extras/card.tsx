import { cn } from "@infrastructure/utils/cn";
import { Text, type TextProps, View, type ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children?: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      {...props}
      className={cn(
        "bg-zinc-950/40 border border-white/5 rounded-sm shadow-xl overflow-hidden",
        className,
      )}
    >
      {children}
    </View>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <View {...props} className={cn("flex flex-col space-y-1.5 p-6", className)}>
      {children}
    </View>
  );
}

export function CardTitle({ children, className, ...props }: TextProps) {
  return (
    <Text
      {...props}
      className={cn("text-[10px] font-black tracking-[0.3em] uppercase text-white", className)}
    >
      {children}
    </Text>
  );
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <View {...props} className={cn("p-6 pt-0", className)}>
      {children}
    </View>
  );
}

export function CardFooter({ children, className, ...props }: CardProps) {
  return (
    <View {...props} className={cn("flex-row items-center p-6 pt-0", className)}>
      {children}
    </View>
  );
}

// Assign subcomponents directly to Card function
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
