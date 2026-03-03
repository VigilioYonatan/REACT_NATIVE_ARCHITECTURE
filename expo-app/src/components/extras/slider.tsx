import { cn } from "@infrastructure/utils/cn";
import SliderRN from "@react-native-community/slider";
import { Text, View, type ViewProps } from "react-native";

interface SliderProps extends ViewProps {
  label?: string;
  value?: number;
  onValueChange?: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
}

export function Slider({ className, label, value, onValueChange, ...props }: SliderProps) {
  return (
    <View className={cn("gap-2", className)}>
      {label && <Text className="text-sm font-medium leading-none opacity-70">{label}</Text>}
      <SliderRN
        style={{ width: "100%", height: 40 }}
        minimumValue={props.minimumValue || 0}
        maximumValue={props.maximumValue || 100}
        step={props.step || 1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#3b82f6" // Primary color approximation
        maximumTrackTintColor="#000000"
        thumbTintColor="#3b82f6"
      />
    </View>
  );
}

export default Slider;
