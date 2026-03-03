import Button from "@components/extras/button";
import { cn } from "@infrastructure/utils/client";
import { CircleHelp } from "lucide-react-native";
import { useContext, useState } from "react";
import { type FieldValues, type Path, type UseFormReturn, useController } from "react-hook-form";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Markdown from "react-native-markdown-display";
import { anidarPropiedades } from ".";
import { FormControlContext } from "./form-component";

interface FormMKDEditorProps<T extends object> {
  title: string;
  name: Path<T>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormMKDEditor<T extends object>({
  name,
  title,
  placeholder = "Escribe tu contenido en Markdown...",
  required = false,
  disabled = false,
  className,
}: FormMKDEditorProps<T>) {
  const {
    control,
    formState: { errors },
  } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
  const { field } = useController({ control, name });

  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [showHelp, setShowHelp] = useState(false);

  const err = anidarPropiedades(errors, (name as string).split("."));
  const hasError = !!Object.keys(err).length;

  return (
    <View className={cn("w-full mb-4", className)}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-light text-foreground">
          {title}
          {required ? <Text className="text-primary">*</Text> : ""}
        </Text>
        <Pressable onPress={() => setShowHelp(true)}>
          <CircleHelp size={16} className="text-primary" color="currentColor" />
        </Pressable>
      </View>

      {/* Toolbar / Tabs */}
      <View className="flex-row gap-1 bg-muted rounded-t-lg p-1 border-x border-t border-input">
        <Pressable
          onPress={() => setViewMode("edit")}
          className={cn(
            "px-3 py-1 rounded text-xs font-medium",
            viewMode === "edit" ? "bg-background shadow text-foreground" : "text-muted-foreground",
          )}
        >
          <Text
            className={cn(
              viewMode === "edit" ? "text-foreground" : "text-muted-foreground",
              "text-xs",
            )}
          >
            Editar
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setViewMode("preview")}
          className={cn(
            "px-3 py-1 rounded text-xs font-medium",
            viewMode === "preview"
              ? "bg-background shadow text-foreground"
              : "text-muted-foreground",
          )}
        >
          <Text
            className={cn(
              viewMode === "preview" ? "text-foreground" : "text-muted-foreground",
              "text-xs",
            )}
          >
            Vista Previa
          </Text>
        </Pressable>
      </View>

      <View
        className={cn(
          "w-full rounded-b-lg border bg-background min-h-[200px]",
          hasError ? "border-destructive" : "border-input",
          disabled ? "opacity-50" : "",
        )}
      >
        {viewMode === "edit" ? (
          <TextInput
            className="flex-1 p-3 text-base text-foreground"
            multiline
            textAlignVertical="top"
            value={field.value}
            onChangeText={field.onChange}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            editable={!disabled}
          />
        ) : (
          <ScrollView className="flex-1 p-3 bg-muted/10">
            <Markdown
              style={{
                body: { color: "#000000" }, // Dark mode? Need theme context
              }}
            >
              {field.value || "*Nada para mostrar*"}
            </Markdown>
          </ScrollView>
        )}
      </View>

      {hasError && <Text className="text-xs text-destructive mt-1">{err?.message as string}</Text>}

      {/* Help Modal */}
      <Modal
        visible={showHelp}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHelp(false)}
      >
        <View className="flex-1 bg-black/50 justify-center px-4">
          <View className="bg-background rounded-xl p-4 max-h-[80%] shadow-lg border border-border">
            <Text className="text-lg font-bold mb-4">Guía Rápida de Markdown</Text>
            <ScrollView>
              <Text className="text-foreground mb-2">
                {"**Negrita** -> "}
                <Text className="font-bold">Negrita</Text>
              </Text>
              <Text className="text-foreground mb-2">
                {"*Cursiva* -> "}
                <Text className="italic">Cursiva</Text>
              </Text>
              <Text className="text-foreground mb-2"># Título 1</Text>
              <Text className="text-foreground mb-2">- Lista</Text>
            </ScrollView>
            <Button className="mt-4" onPress={() => setShowHelp(false)}>
              <Text className="text-primary-foreground">Cerrar</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
export default FormMKDEditor;
