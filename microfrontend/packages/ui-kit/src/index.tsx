import { Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ label, variant = 'primary', ...props }: ButtonProps) => {
  const bgClass = variant === 'primary' ? 'bg-blue-600' : 'bg-gray-200';
  const textClass = variant === 'primary' ? 'text-white' : 'text-gray-800';

  return (
    <TouchableOpacity
      className={`px-6 py-3 rounded-xl items-center justify-center ${bgClass}`}
      {...props}
    >
      <Text className={`font-semibold text-lg ${textClass}`}>{label}</Text>
    </TouchableOpacity>
  );
};
