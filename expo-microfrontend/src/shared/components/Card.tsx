import { View, Text, ViewProps } from 'react-native';
import { cn } from './Button';

interface CardProps extends ViewProps {
  title?: string;
  subtitle?: string;
}

export function Card({ title, subtitle, className, children, ...props }: CardProps) {
  return (
    <View 
      className={cn(
        'bg-white rounded-2xl p-5 shadow-sm border border-slate-100',
        className
      )}
      {...props}
    >
      {(title || subtitle) && (
        <View className="mb-4">
          {title && <Text className="text-lg font-bold text-slate-900">{title}</Text>}
          {subtitle && <Text className="text-sm text-slate-500 mt-0.5">{subtitle}</Text>}
        </View>
      )}
      {children}
    </View>
  );
}
