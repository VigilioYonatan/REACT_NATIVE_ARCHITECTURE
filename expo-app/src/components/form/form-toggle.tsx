import Helper from "@components/extras/helper";
import type { Signal } from "@preact/signals-react";
import { Eye, EyeOff } from "lucide-react-native";
import { useContext } from "react";
import { type FieldValues, type Path, type UseFormReturn, useController } from "react-hook-form";
import { Pressable, Switch, Text, View } from "react-native";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./form-component";

export interface FormToggleProps<T extends object> {
  title: string;
  name: Path<T>;
  question?: string;
  ico?: React.ReactNode;
  isEye?: boolean;
  required?: boolean;
}

export function FormToggle<T extends object>({
  name,
  title,
  question,
  isEye = false,
  required = false,
}: FormToggleProps<T>) {
  const {
    control,
    formState: { errors },
  } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
  const { field } = useController({ control, name });

  const err = anidarPropiedades(errors, (name as string).split("."));
  const hasError = !!Object.keys(err).length;

  return (
    <View className="w-full mb-4">
      {title ? (
        <Text className="text-sm font-semibold text-foreground mb-2">
          {title}
          {required ? <Text className="text-primary">*</Text> : ""}
        </Text>
      ) : null}

      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center bg-card border border-input rounded-lg p-2 min-w-[80px] justify-between">
          {isEye ? (
            <Pressable onPress={() => field.onChange(!field.value)}>
              {field.value ? (
                <Eye size={20} className="text-primary" color="currentColor" />
              ) : (
                <EyeOff size={20} className="text-muted-foreground" color="currentColor" />
              )}
            </Pressable>
          ) : (
            <Switch
              value={!!field.value}
              onValueChange={field.onChange}
              trackColor={{ false: "#767577", true: "#3b82f6" }}
              thumbColor={field.value ? "#ffffff" : "#f4f3f4"}
            />
          )}
        </View>

        {question ? <Helper>{question}</Helper> : null}
      </View>

      {hasError ? (
        <Text className="text-xs text-destructive mt-1">{err?.message as string}</Text>
      ) : null}
    </View>
  );
}

// Custom Toggle (State based)
interface FormToggleCustomProps {
  title: string;
  value: Signal<boolean>;
  index?: number;
  onChange?: (value: boolean) => void;
  isEye?: boolean;
}
export function FormToggleCustom({ title, value, onChange, isEye = false }: FormToggleCustomProps) {
  const toggleValue = () => {
    const newValue = !value.value;
    value.value = newValue;
    onChange?.(newValue);
  };

  return (
    <View className="mb-2">
      <Text className="text-sm text-foreground capitalize font-bold mb-1">{title}</Text>
      <View className="flex-row items-center gap-2">
        <View className="bg-muted rounded-lg p-2">
          {isEye ? (
            <Pressable onPress={toggleValue}>
              {value.value ? (
                <Eye size={20} className="text-primary" color="currentColor" />
              ) : (
                <EyeOff size={20} className="text-muted-foreground" color="currentColor" />
              )}
            </Pressable>
          ) : (
            <Switch
              value={value.value}
              onValueChange={(val) => {
                value.value = val;
                onChange?.(val);
              }}
              trackColor={{ false: "#767577", true: "#3b82f6" }}
            />
          )}
        </View>
      </View>
    </View>
  );
}

export default FormToggle;
