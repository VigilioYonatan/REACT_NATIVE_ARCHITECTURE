import Helper from "@components/extras/helper";
import { cn } from "@infrastructure/utils/client"; // Ensure utils exist
import { useSignal } from "@preact/signals-react";
import { useContext } from "react";
import { type FieldValues, type Path, type UseFormReturn, useController } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./form-component";

interface FormEditorLabelProps<T extends object> {
  title: string;
  name: Path<T>;
  showIndice?: boolean;
  max_height?: number; // Kept for prop compat, but might just control rows
  onBlur?: (content: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function FormEditor<T extends object>({
  name,
  title,
  showIndice = false,
  max_height = 200, // Default to sensible mobile height
  onBlur,
  required = false,
  disabled,
  placeholder,
}: FormEditorLabelProps<T>) {
  const {
    control,
    formState: { errors },
  } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
  const { field } = useController({ control, name });

  const isFocused = useSignal(false);

  const err = anidarPropiedades(errors, (name as string).split("."));
  const hasError = !!Object.keys(err).length;

  return (
    <View className="w-full mb-4">
      <View className="flex-row items-center gap-2 mb-2">
        <Text className="text-sm text-foreground font-light">
          {title}
          {required ? <Text className="text-primary">*</Text> : ""}
        </Text>
        {showIndice ? <Helper>Para agregar Indice: ---INDICE---</Helper> : null}
      </View>

      <View
        className={cn(
          "w-full rounded-lg border bg-background overflow-hidden",
          hasError ? "border-destructive" : "border-input",
          isFocused.value ? "border-primary bg-primary/5" : "",
          disabled ? "opacity-50 bg-muted" : "",
        )}
      >
        {/* Simple Toolbar Placeholder */}
        <View className="bg-muted px-2 py-1 border-b border-border flex-row gap-2">
          <Text className="text-xs text-muted-foreground">Rich Text Editor (Simplified)</Text>
          {/* Add basic format buttons if we implement logic later */}
        </View>

        <TextInput
          className="p-3 text-base text-foreground min-h-[150px]"
          multiline
          textAlignVertical="top"
          value={field.value}
          onChangeText={field.onChange}
          onBlur={() => {
            field.onBlur();
            isFocused.value = false;
            onBlur?.(field.value);
          }}
          onFocus={() => {
            isFocused.value = true;
          }}
          editable={!disabled}
          placeholder={placeholder || "Escribe el contenido aquí..."}
          placeholderTextColor="#9ca3af"
          style={{ height: max_height }}
        />
      </View>

      {hasError && <Text className="text-xs text-destructive mt-1">{err?.message as string}</Text>}
    </View>
  );
}

export default FormEditor;
