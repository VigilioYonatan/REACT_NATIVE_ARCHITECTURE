import Helper from "@components/extras/helper";
import { cn } from "@infrastructure/utils/client";
import { type ReactNode, useContext, useState } from "react";
import {
  type FieldValues,
  type Path,
  type RegisterOptions,
  type UseFormReturn,
  useController,
} from "react-hook-form";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { anidarPropiedades } from "../..";
import { FormControlContext } from "../../form-component";

export interface FormSelectInputProps<T extends object> {
  title: string;
  name: Path<T>;
  question?: string;
  ico?: ReactNode;
  options?: RegisterOptions<T, Path<T>>;
  array: { value: string; key: string | number }[];
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FormSelectInput<T extends object>({
  name,
  title,
  question,
  ico,
  array,
  options,
  isLoading = false,
  className,
  required,
  disabled,
  placeholder,
}: FormSelectInputProps<T>) {
  const {
    control,
    formState: { errors },
    setValue,
  } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
  const { field } = useController({ control, name, rules: options });

  const [modalVisible, setModalVisible] = useState(false);
  const [_inputValue, _setInputValue] = useState(
    field.value ? array.find((i) => i.key === field.value)?.value : "",
  );

  const err = anidarPropiedades(errors, (name as string).split("."));
  const hasError = !!Object.keys(err).length;

  const _filteredArray = array; // Usually we filter based on input, but for Select Input, it might be a combo.
  // Simplifying to Modal Selection for now as true Combobox on mobile is complex.
  // If input is needed, we can add a TextInput inside Modal.

  const displayValue = array.find((item) => item.key === field.value)?.value || field.value || "";

  return (
    <View className={cn("w-full mb-4 space-y-2", className)}>
      <View className="flex-row items-center gap-2">
        <Text className="text-sm font-light text-foreground capitalize">
          {title}
          {required ? <Text className="text-primary">*</Text> : ""}
        </Text>
        {question && <Helper>{question}</Helper>}
      </View>

      <Pressable
        onPress={() => !disabled && !isLoading && setModalVisible(true)}
        className={cn(
          "w-full flex-row items-center border rounded-lg bg-background px-3 py-3",
          hasError ? "border-destructive" : "border-input",
          disabled ? "opacity-50" : "",
        )}
      >
        {ico && <View className="mr-2">{ico}</View>}
        <Text
          className={cn(
            "flex-1 text-base",
            !displayValue ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {displayValue || placeholder || "Seleccionar..."}
        </Text>
      </Pressable>

      {hasError && <Text className="text-xs text-destructive mt-1">{err?.message as string}</Text>}

      {/* Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-background rounded-t-xl max-h-[70%]">
            <View className="p-4 border-b border-border flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-foreground">{title}</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text className="text-primary font-medium">Cerrar</Text>
              </Pressable>
            </View>

            <FlatList
              data={array}
              keyExtractor={(item) => String(item.key)}
              renderItem={({ item }) => (
                <Pressable
                  className="p-4 border-b border-border bg-background active:bg-accent"
                  onPress={() => {
                    // biome-ignore lint/suspicious/noExplicitAny: react-hook-form setValue requires type coercion
                    setValue(name, item.key as any);
                    field.onChange(item.key);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    className={cn(
                      "text-base",
                      field.value === item.key ? "text-primary font-semibold" : "text-foreground",
                    )}
                  >
                    {item.value}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
