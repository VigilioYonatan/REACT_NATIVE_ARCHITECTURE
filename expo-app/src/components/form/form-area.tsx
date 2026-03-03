import Helper from "@components/extras/helper"; // Using our Helper refactor
import { cn } from "@infrastructure/utils/client"; // Check sizeIcon compatibility
import { useSignal } from "@preact/signals-react";

import { useContext } from "react";
import {
  type FieldValues,
  type Path,
  type RegisterOptions,
  type UseFormReturn,
  useController,
} from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { anidarPropiedades } from "."; // Ensure this util exists or refactor
import { FormControlContext } from "./form-component";

export interface FormAreaProps<T extends object> {
  title: string;
  name: Path<T>;
  question?: string; // String for simpler RN tooltip
  options?: RegisterOptions<T, Path<T>>; // Changed from RegisterOptions to any if strictly typed issues arise
  contentMaxLength?: number;
  isFloating?: boolean;
  ico?: React.ReactNode;
  placeholder?: string;
  rows?: number; // Approximation for height
  required?: boolean;
  className?: string; // Explicit
}

export function FormArea<T extends object>({
  name,
  title,
  question,
  options = {},
  isFloating = false,
  contentMaxLength,
  ico,
  className,
  ...rest
}: FormAreaProps<T>) {
  const isFocused = useSignal<boolean>(false);
  const {
    control,
    formState: { errors },
  } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);

  const { field } = useController({
    control,
    name,
    rules: options,
  });

  const err = anidarPropiedades(errors, (name as string).split("."));
  const hasError = !!Object.keys(err).length;

  return (
    <View className="mb-4 w-full">
      {title && (
        <Text
          className={cn(
            "text-sm font-semibold text-foreground mb-2",
            isFloating && "absolute -top-3 left-3 bg-background z-10 px-1 text-xs",
          )}
        >
          {title}
          {rest.required ? <Text className="text-primary">*</Text> : ""}
        </Text>
      )}

      <View className="relative flex-row">
        {ico && (
          <View className="absolute left-0 top-0 bottom-0 w-12 items-center justify-center z-10">
            {ico} {/* Ensure icon is passed as RN element (Icon) */}
          </View>
        )}
        <TextInput
          className={cn(
            "w-full bg-background border border-input rounded-lg text-foreground p-3 min-h-[100px]",
            "text-base", // Ensure legible size
            isFocused.value && "border-primary bg-accent/10",
            hasError && "border-destructive",
            ico && "pl-12",
            className,
          )}
          multiline
          numberOfLines={rest.rows || 4}
          textAlignVertical="top"
          value={field.value}
          onChangeText={field.onChange}
          onBlur={() => {
            field.onBlur();
            isFocused.value = false;
          }}
          onFocus={() => {
            isFocused.value = true;
          }}
          placeholder={rest.placeholder}
          placeholderTextColor="#9ca3af" // muted-foreground approx
        />

        {question && (
          <View className="absolute right-2 top-2">
            <Helper>{typeof question === "string" ? <Text>{question}</Text> : question}</Helper>
          </View>
        )}
      </View>

      <View className="flex-row justify-between mt-1">
        {hasError ? (
          <Text className="text-xs text-destructive">{err?.message as string}</Text>
        ) : (
          <View />
        )}
        {contentMaxLength && (
          <Text className="text-xs text-muted-foreground">
            {(field.value as string)?.length || 0}/{contentMaxLength}
          </Text>
        )}
      </View>
    </View>
  );
}
export default FormArea;
