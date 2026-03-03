import Helper from "@components/extras/helper";
import { cn } from "@infrastructure/utils/client";
import { useSignal } from "@preact/signals-react";
import Checkbox from "expo-checkbox";
import { Check, ChevronDown } from "lucide-react-native";
import { useContext } from "react";
import {
  type FieldValues,
  type Path,
  type RegisterOptions,
  type UseFormReturn,
  useController,
} from "react-hook-form";
import { ActivityIndicator, FlatList, Modal, Pressable, Text, TextInput, View } from "react-native";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./form-component";

export interface FormMultiSelectProps<T extends object> {
  title: string;
  name: Path<T>;
  question?: string;
  options?: RegisterOptions<T, Path<T>>;
  placeholder: string;
  ico?: React.ReactNode;
  isLoading?: boolean;
  array: { value: string; key: unknown }[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function FormMultiSelect<T extends object>({
  name,
  title,
  question,
  options = {},
  array,
  placeholder,
  isLoading = false,
  ico,
  className,
  disabled,
  required,
}: FormMultiSelectProps<T>) {
  const {
    control,
    formState: { errors },
  } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
  const { field } = useController({ control, name, rules: options });

  // Ensure value is array
  const currentValues: unknown[] = Array.isArray(field.value) ? field.value : [];

  const isOpen = useSignal(false);
  const searchQuery = useSignal("");

  const err = anidarPropiedades(errors, (name as string).split("."));
  const hasError = !!Object.keys(err).length;

  const filteredArray = array.filter((item) =>
    item.value.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );

  const toggleSelection = (key: unknown) => {
    if (currentValues.includes(key)) {
      field.onChange(currentValues.filter((k) => k !== key));
    } else {
      field.onChange([...currentValues, key]);
    }
  };

  return (
    <View className="w-full mb-4">
      {title && (
        <Text className="text-sm font-semibold text-foreground mb-1.5 capitalize">
          {title}
          {required ? <Text className="text-primary">*</Text> : ""}
        </Text>
      )}

      <Pressable
        onPress={() => {
          if (!disabled && !isLoading) isOpen.value = true;
        }}
        className={cn(
          "w-full flex-row items-center border border-input rounded-lg bg-background p-3",
          hasError && "border-destructive",
          disabled && "opacity-50 bg-muted",
          className,
        )}
      >
        {ico && <View className="mr-2">{ico}</View>}

        <Text
          className={cn("flex-1 text-base", currentValues.length === 0 && "text-muted-foreground")}
          numberOfLines={1}
        >
          {currentValues.length > 0
            ? `${currentValues.length} selected` // Simplified display
            : placeholder}
        </Text>

        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <ChevronDown size={20} className="text-muted-foreground" color="currentColor" />
        )}
      </Pressable>

      {question && (
        <View className="absolute right-0 top-0 -mt-1 mr-1">
          <Helper>{question}</Helper>
        </View>
      )}

      {hasError && <Text className="text-xs text-destructive mt-1">{err?.message as string}</Text>}

      {/* Modal */}
      <Modal
        visible={isOpen.value}
        transparent
        animationType="slide"
        onRequestClose={() => {
          isOpen.value = false;
        }}
      >
        <View className="flex-1 bg-black/50 justify-end sm:justify-center sm:px-4">
          <View className="bg-background rounded-t-xl sm:rounded-xl max-h-[80%] w-full sm:max-w-md self-center flex-1 shadow-lg border border-border">
            <View className="p-3 border-b border-border flex-row items-center justify-between">
              <Text className="font-bold text-lg">Select {title}</Text>
              <Pressable
                onPress={() => {
                  isOpen.value = false;
                }}
              >
                <Text className="text-primary font-medium">Done</Text>
              </Pressable>
            </View>

            <View className="p-2 border-b border-border bg-muted/20">
              <TextInput
                className="bg-background border border-input rounded-md px-3 py-2 text-foreground"
                placeholder="Search..."
                value={searchQuery.value}
                onChangeText={(text) => {
                  searchQuery.value = text;
                }}
              />
            </View>

            <FlatList
              data={filteredArray}
              keyExtractor={(item) => String(item.key)}
              renderItem={({ item }) => {
                const isSelected = currentValues.includes(item.key);
                return (
                  <Pressable
                    className={cn(
                      "flex-row items-center p-4 border-b border-border/50 active:bg-accent/50",
                      isSelected && "bg-primary/5",
                    )}
                    onPress={() => toggleSelection(item.key)}
                  >
                    <Checkbox
                      value={isSelected}
                      onValueChange={() => toggleSelection(item.key)}
                      color={isSelected ? "#3b82f6" : undefined}
                    />
                    <Text
                      className={cn(
                        "ml-3 flex-1 text-base text-foreground",
                        isSelected && "font-medium text-primary",
                      )}
                    >
                      {item.value}
                    </Text>
                    {isSelected && (
                      <Check size={16} className="text-primary" color="currentColor" />
                    )}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
export default FormMultiSelect;
