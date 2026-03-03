import { cssInterop } from "nativewind";
import { Path, Svg } from "react-native-svg";

// Enable NativeWind for Svg
cssInterop(Svg, {
  className: {
    target: "style",
  },
});

interface SimpleIconProps {
  icon: {
    path: string;
    hex: string;
    slug: string;
    title: string;
  };
  color?: string;
  size?: number;
  className?: string;
}

export function SimpleIcon({ icon, color, size = 24, className }: SimpleIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color || "currentColor"}
      className={className}
    >
      <Path d={icon.path} />
    </Svg>
  );
}
