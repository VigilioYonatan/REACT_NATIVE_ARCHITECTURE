import Helper from "@components/extras/helper"; // Using Helper
import { cn } from "@infrastructure/utils/client";
import { useSignal } from "@preact/signals-react";
import { useContext } from "react";
import {
  type FieldValues,
  type Path,
  type RegisterOptions,
  type UseFormReturn,
  useController,
} from "react-hook-form";
import { Text, TextInput, type TextInputProps, View } from "react-native";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./form-component";

export interface FormControlProps<T extends object> {
  title: string;
  name: Path<T>;
  type?: "text" | "password" | "email" | "number"; // Simplified types for RN
  question?: string;
  options?: RegisterOptions<T, Path<T>>;
  ico?: React.ReactNode;
  placeholder?: string;
  keyboardType?: TextInputProps["keyboardType"];
  required?: boolean;
  disabled?: boolean;
  className?: string; // Explicit
}

export function FormControl<T extends object>({
  name,
  title,
  type = "text",
  question,
  options = {},
  ico,
  className,
  keyboardType,
  ...rest
}: FormControlProps<T>) {
  const {
    control,
    formState: { errors },
  } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
  const { field } = useController({ control, name, rules: options });

  const isFocused = useSignal<boolean>(false);
  // For password visibility, we can implement a toggle if needed, or use separate component. Input here respects `secureTextEntry` if type=password.
  const isPassword = type === "password";

  const err = anidarPropiedades(errors, (name as string).split("."));
  const hasError = !!Object.keys(err).length;

  return (
    <View className="w-full mb-4">
      {title && (
        <Text className="block text-sm font-semibold text-foreground mb-1.5">
          {title}
          {rest.required ? <Text className="text-primary">*</Text> : ""}
        </Text>
      )}

      <View className="relative flex-row">
        {ico && (
          <View className="absolute left-0 top-0 bottom-0 w-12 items-center justify-center z-10">
            {ico}
          </View>
        )}
        <TextInput
          className={cn(
            "w-full py-3 bg-background border border-input rounded-lg text-foreground",
            "text-base", // Readable size
            isFocused.value && "border-primary bg-accent/5",
            hasError && "border-destructive",
            rest.disabled && "opacity-50 bg-muted",
            ico && "pl-12",
            ico ? "pr-10" : "px-4", // space for question help
            className,
          )}
          value={field.value !== undefined ? String(field.value) : ""}
          onChangeText={(val) => field.onChange(type === "number" ? Number(val) : val)}
          onBlur={() => {
            field.onBlur();
            isFocused.value = false;
          }}
          onFocus={() => {
            isFocused.value = true;
          }}
          secureTextEntry={isPassword} // You might want a toggle button here
          placeholder={rest.placeholder}
          placeholderTextColor="#9ca3af"
          keyboardType={
            keyboardType ||
            (type === "number" ? "numeric" : type === "email" ? "email-address" : "default")
          }
          editable={!rest.disabled}
        />
        {question && (
          <View className="absolute right-2 top-0 bottom-0 justify-center">
            <Helper>{typeof question === "string" ? <Text>{question}</Text> : question}</Helper>
          </View>
        )}
      </View>

      {hasError && <Text className="text-xs text-destructive mt-1">{err?.message as string}</Text>}
    </View>
  );
}
export default FormControl;
