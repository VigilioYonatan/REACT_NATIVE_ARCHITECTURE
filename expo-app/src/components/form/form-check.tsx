import Helper from "@components/extras/helper";
import { cn } from "@infrastructure/utils/client";
import Checkbox from "expo-checkbox";
import { useContext } from "react";
import {
  type FieldValues,
  type Path,
  type RegisterOptions,
  type UseFormReturn,
  useController,
} from "react-hook-form";
import { Text, View } from "react-native";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./form-component";

export interface FormCheckProps<T extends object> {
  title: string;
  name: Path<T>;
  question?: string;
  options?: RegisterOptions<T, Path<T>>;
  className?: string;
}

export function FormCheck<T extends object>({
  name,
  title,
  question,
  options,
  className,
}: FormCheckProps<T>) {
  const {
    control,
    formState: { errors },
  } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
  const { field } = useController({ control, name, rules: options });

  const err = anidarPropiedades(errors, (name as string).split("."));
  const hasError = !!Object.keys(err).length;

  return (
    <View className={cn("w-full mb-4 flex-row items-center gap-3", className)}>
      <Checkbox
        value={field.value}
        onValueChange={field.onChange}
        color={field.value ? "#3b82f6" : undefined}
        className="w-5 h-5 rounded border border-input"
      />
      <View>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-medium text-foreground">{title}</Text>
          {question && <Helper>{question}</Helper>}
        </View>
        {hasError && (
          <Text className="text-xs text-destructive mt-1">{err?.message as string}</Text>
        )}
      </View>
    </View>
  );
}
export default FormCheck;
