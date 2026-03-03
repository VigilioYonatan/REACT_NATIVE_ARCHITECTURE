import Helper from "@components/extras/helper";
import { cn } from "@infrastructure/utils/client"; // Ensure utils exist
import { useSignal } from "@preact/signals-react";
import { ChevronDown, Search, X } from "lucide-react-native";
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

export interface FormSelectProps<T extends object> {
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

export function FormSelect<T extends object>({
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
}: FormSelectProps<T>) {
  const {
    control,
    formState: { errors },
  } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
  const { field } = useController({ control, name, rules: options });

  const isOpen = useSignal(false);
  const searchQuery = useSignal("");

  const err = anidarPropiedades(errors, (name as string).split("."));
  const hasError = !!Object.keys(err).length;

  const selectedOption = array.find((item) => item.key === field.value);

  const filteredArray = array.filter((item) =>
    item.value.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );

  return (
    <View className="w-full mb-4">
      {title ? (
        <Text className="text-sm font-semibold text-foreground mb-1.5 capitalize">
          {title}
          {required ? <Text className="text-primary">*</Text> : ""}
        </Text>
      ) : null}

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

        <Text className={cn("flex-1 text-base", !selectedOption && "text-muted-foreground")}>
          {selectedOption ? selectedOption.value : placeholder}
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

      {/* Modal for Selection */}
      <Modal
        visible={isOpen.value}
        transparent
        animationType="fade"
        onRequestClose={() => {
          isOpen.value = false;
        }}
      >
        <View className="flex-1 bg-black/50 justify-center px-4">
          <View className="bg-background rounded-xl max-h-[80%] overflow-hidden w-full max-w-sm self-center shadow-lg border border-border">
            {/* Header with Search */}
            <View className="p-3 border-b border-border flex-row items-center gap-2">
              <Search size={18} className="text-muted-foreground" color="currentColor" />
              <TextInput
                className="flex-1 text-foreground h-10"
                placeholder="Search..."
                placeholderTextColor="#9ca3af"
                value={searchQuery.value}
                onChangeText={(text) => {
                  searchQuery.value = text;
                }}
                autoFocus
              />
              <Pressable
                onPress={() => {
                  isOpen.value = false;
                  searchQuery.value = "";
                }}
              >
                <X size={20} className="text-muted-foreground" color="currentColor" />
              </Pressable>
            </View>

            <FlatList
              data={filteredArray}
              keyExtractor={(item) => String(item.key)}
              renderItem={({ item }) => (
                <Pressable
                  className={cn(
                    "p-4 border-b border-border/50 active:bg-accent/50",
                    field.value === item.key && "bg-primary/10",
                  )}
                  onPress={() => {
                    field.onChange(item.key);
                    isOpen.value = false;
                    searchQuery.value = "";
                  }}
                >
                  <Text
                    className={cn(
                      "text-foreground",
                      field.value === item.key && "font-bold text-primary",
                    )}
                  >
                    {item.value}
                  </Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <View className="p-4 items-center">
                  <Text className="text-muted-foreground">No results found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function formSelectNumber(value: string) {
  return Number(value) > 0 ? Number(value) : null;
}
export default FormSelect;
