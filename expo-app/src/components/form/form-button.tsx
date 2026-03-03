import { cn, normalizarText } from "@infrastructure/utils/client"; // Ensure normalizarText exists
import { useSignal } from "@preact/signals-react";
import { Search } from "lucide-react-native";
import { useContext } from "react";
import { type FieldValues, type Path, type UseFormReturn, useController } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./form-component";

export interface FormButtonProps<T extends object> {
  title: string;
  name: Path<T>;
  required?: boolean;
  values: { key: unknown; name?: string }[];
  showButtonSearch?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: Icon props are intentionally generic for flexible button value shapes
  icon: (props: { props: any; isSelected: boolean }) => React.ReactNode;
  containerClassName?: string;
}

export function FormButton<T extends object>({
  name,
  title,
  required,
  values,
  showButtonSearch,
  icon: Icon,
  containerClassName,
}: FormButtonProps<T>) {
  const {
    control,
    formState: { errors },
  } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
  const { field } = useController({ control, name });

  const isOpenIconStore = useSignal<boolean>(false);
  const _arrayButtons = useSignal(values);
  const searchQuery = useSignal("");

  const err = anidarPropiedades(errors, (name as string).split("."));
  const hasError = !!Object.keys(err).length;

  // Filter effect
  const filteredValues = values.filter((item) =>
    normalizarText(item.name || "").includes(normalizarText(searchQuery.value)),
  );

  return (
    <View className="mb-4 w-full">
      {title && (
        <Text className="block text-sm font-bold text-foreground mb-2">
          {title}
          {required ? <Text className="text-primary">*</Text> : ""}
        </Text>
      )}

      <View
        className={cn("relative p-2 bg-card rounded-lg border border-border", containerClassName)}
      >
        {showButtonSearch && (
          <View className="flex-row items-center justify-end mb-2 gap-2">
            {isOpenIconStore.value ? (
              <TextInput
                className="border border-input rounded px-2 py-1 text-xs w-32 text-foreground"
                placeholder="Buscar..."
                value={searchQuery.value}
                onChangeText={(text) => {
                  searchQuery.value = text;
                }}
                autoFocus
                onBlur={() => {
                  if (!searchQuery.value) isOpenIconStore.value = false;
                }}
              />
            ) : (
              <Pressable
                onPress={() => {
                  isOpenIconStore.value = true;
                }}
              >
                <Search size={16} className="text-muted-foreground" color="currentColor" />
              </Pressable>
            )}
          </View>
        )}

        <View className="flex-row flex-wrap gap-2">
          {filteredValues.map((icon) => {
            const isSelected = field.value === icon.key;
            return (
              <Pressable
                key={String(icon.key)}
                onPress={() => field.onChange(icon.key)}
                className={cn(
                  "items-center justify-center w-16 h-16 rounded-lg border p-2",
                  isSelected ? "border-primary bg-primary/10" : "border-transparent bg-muted/30",
                )}
              >
                <Icon props={icon} isSelected={isSelected} />
              </Pressable>
            );
          })}
        </View>
      </View>

      {hasError && <Text className="text-xs text-destructive mt-1">{err?.message as string}</Text>}
    </View>
  );
}
export default FormButton;
