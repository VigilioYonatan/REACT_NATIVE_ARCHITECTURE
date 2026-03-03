import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ComponentProps<typeof TouchableOpacity> {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  isLoading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'flex-row items-center justify-center rounded-xl px-4 py-3 active:opacity-80';
  
  const variantClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-slate-200',
    outline: 'bg-transparent border-2 border-slate-300',
    danger: 'bg-red-500',
  };

  const textClasses = {
    primary: 'text-white font-semibold text-base',
    secondary: 'text-slate-900 font-semibold text-base',
    outline: 'text-slate-700 font-semibold text-base',
    danger: 'text-white font-semibold text-base',
  };

  return (
    <TouchableOpacity
      className={cn(
        baseClasses,
        variantClasses[variant],
        (disabled || isLoading) && 'opacity-50',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'secondary' ? '#0f172a' : '#ffffff'} />
      ) : (
        <Text className={cn(textClasses[variant])}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
