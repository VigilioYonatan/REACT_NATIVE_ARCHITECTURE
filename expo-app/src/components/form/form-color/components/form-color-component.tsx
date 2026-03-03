import Helper from "@components/extras/helper";
import { cn } from "@infrastructure/utils/cn";
import { useSignal } from "@preact/signals-react";
import { ChevronDown } from "lucide-react-native";
import { useContext } from "react";
import { type FieldValues, type Path, type UseFormReturn, useController } from "react-hook-form";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { anidarPropiedades } from "../..";
import { FormControlContext } from "../../form-component";

import type { FormColorProps } from "../types";

const DEFAULT_COLORS = [
  "#FF5252",
  "#FF4081",
  "#E040FB",
  "#7C4DFF",
  "#536DFE",
  "#448AFF",
  "#40C4FF",
  "#18FFFF",
  "#64FFDA",
  "#69F0AE",
  "#B2FF59",
  "#EEFF41",
  "#FFFF00",
  "#FFD740",
  "#FFAB40",
  "#FF6E40",
  "#000000",
  "#525252",
  "#969696",
  "#FFFFFF",
];

export function FormColor<T extends object>({
  title,
  question,
  presetColors = DEFAULT_COLORS,
  placeholder = "Elige un color",
  required = false,
  name,
  options,
  className: _className,
}: FormColorProps<T>) {
  const {
    control,
    formState: { errors },
  } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
  const { field } = useController({ control, name, rules: options });

  const isOpen = useSignal(false);
  const mode = useSignal<"palette" | "picker">("palette");
  const customColor = useSignal(field.value || "#000000");

  const err = anidarPropiedades(errors, (name as string).split("."));
  const hasError = !!Object.keys(err).length;

  const handleColorChange = (color: string) => {
    customColor.value = color;
    field.onChange(color);
    isOpen.value = false;
  };

  return (
    <View className="w-full mb-4">
      <View className="flex-row items-center gap-2 mb-2">
        <Text className="text-sm font-semibold text-foreground">
          {title}
          {required ? <Text className="text-primary">*</Text> : ""}
        </Text>
        {question && <Helper>{question}</Helper>}
      </View>

      <Pressable
        onPress={() => {
          isOpen.value = true;
        }}
        className="flex-row items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2"
      >
        <View className="flex-row items-center gap-2">
          <View
            className="w-6 h-6 rounded-lg border border-border"
            style={{ backgroundColor: field.value || customColor.value }}
          />
          <Text className="text-sm text-foreground">{field.value || placeholder}</Text>
        </View>
        <ChevronDown size={16} className="text-foreground" color="currentColor" />
      </Pressable>

      {hasError && <Text className="text-xs text-destructive mt-1">{err?.message as string}</Text>}

      {/* Color Picker Modal */}
      <Modal
        visible={isOpen.value}
        transparent
        animationType="fade"
        onRequestClose={() => {
          isOpen.value = false;
        }}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-4"
          onPress={() => {
            isOpen.value = false;
          }}
        >
          <Pressable
            className="bg-background rounded-xl p-4 w-full max-w-xs shadow-lg border border-border"
            onPress={(e) => e.stopPropagation()} // Stop closing when clicking modal content
          >
            <Text className="text-lg font-bold mb-4 text-foreground">Elige un color</Text>

            <View className="flex-row gap-2 mb-4 bg-muted p-1 rounded-lg">
              <Pressable
                onPress={() => {
                  mode.value = "palette";
                }}
                className={cn(
                  "flex-1 py-1 rounded-md items-center",
                  mode.value === "palette" ? "bg-background shadow-sm" : "",
                )}
              >
                <Text
                  className={cn(
                    "text-xs font-medium",
                    mode.value === "palette" ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  Palette
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  mode.value = "picker";
                }}
                className={cn(
                  "flex-1 py-1 rounded-md items-center",
                  mode.value === "picker" ? "bg-background shadow-sm" : "",
                )}
              >
                <Text
                  className={cn(
                    "text-xs font-medium",
                    mode.value === "picker" ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  Hex
                </Text>
              </Pressable>
            </View>

            {mode.value === "palette" ? (
              <View className="flex-row flex-wrap gap-2 justify-center">
                {presetColors.map((color) => (
                  <Pressable
                    key={color}
                    onPress={() => handleColorChange(color)}
                    className={cn(
                      "w-8 h-8 rounded-full border border-border",
                      field.value === color && "border-primary border-2",
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </View>
            ) : (
              <View>
                <Text className="text-xs mb-1 text-muted-foreground">Hex Color</Text>
                <TextInput
                  className="border border-input rounded-lg p-2 text-foreground mb-4"
                  value={customColor.value}
                  onChangeText={(text) => {
                    customColor.value = text;
                  }}
                  placeholder="#000000"
                />
                <Pressable
                  className="bg-primary rounded-lg p-3 items-center"
                  onPress={() => handleColorChange(customColor.value)}
                >
                  <Text className="text-primary-foreground font-bold">Apply</Text>
                </Pressable>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
// export default FormColor;
