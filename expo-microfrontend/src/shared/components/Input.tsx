import { TextInput, View, Text } from 'react-native';
import { cn } from './Button';

interface InputProps extends React.ComponentProps<typeof TextInput> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="mb-4 w-full">
      {label && (
        <Text className="text-sm font-medium text-slate-700 mb-1.5 ml-1">
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor="#94a3b8"
        className={cn(
          'w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-base text-slate-900',
          'focus:border-blue-500 focus:bg-slate-50',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <Text className="text-sm text-red-500 mt-1.5 ml-1">{error}</Text>
      )}
    </View>
  );
}
