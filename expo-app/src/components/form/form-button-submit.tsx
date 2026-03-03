import Loader from "@components/extras/loader";
import { cn } from "@infrastructure/utils/cn";
import { Pressable, Text } from "react-native";

interface FormButtonSubmitProps {
  isLoading: boolean;
  loading_title?: string;
  title: string;
  className?: string;
  ico?: React.ReactNode;
  disabled?: boolean;
  onPress?: () => void; // Explicit onPress if needed, but usually handled by form context submit
}

export function FormButtonSubmit({
  isLoading,
  title,
  className,
  loading_title = "Cargando...",
  disabled = false,
  ico,
  onPress,
}: FormButtonSubmitProps) {
  return (
    <Pressable
      // Note: In RN, this doesn't automatically submit a form.
      // The parent must pass an onPress handler that calls handleSubmit
      onPress={disabled || isLoading ? undefined : onPress}
      className={cn(
        "bg-primary py-3 px-8 rounded-lg items-center justify-center flex-row gap-2 mt-4 active:opacity-80",
        (disabled || isLoading) && "opacity-50",
        className,
      )}
      disabled={disabled || isLoading}
      accessibilityRole="button"
    >
      {isLoading ? (
        <>
          <Loader size="small" color="currentColor" className="text-primary-foreground" />
          <Text className="text-primary-foreground font-bold uppercase tracking-wider text-xs">
            {loading_title}
          </Text>
        </>
      ) : (
        <>
          {ico}
          <Text className="text-primary-foreground font-bold uppercase tracking-wider text-xs">
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
export default FormButtonSubmit;
