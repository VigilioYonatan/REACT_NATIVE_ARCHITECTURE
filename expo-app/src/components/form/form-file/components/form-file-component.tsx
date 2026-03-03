import { cn } from "@infrastructure/utils/client";
import { CloudUpload, File as FileIcon, Trash2 } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";
import { anidarPropiedades } from "../..";
import { useFormFile } from "../hooks/use-form-file.hook";
import type { FormFileProps } from "../types";

export function FormFile<T extends object>(props: FormFileProps<T>) {
  const { multiple = false, title, required = false, placeholder, ico, name } = props;

  const { form, fileList, handleFileSelect, handleRemove, clearFiles } = useFormFile(props);

  // biome-ignore lint/suspicious/noExplicitAny: react-hook-form watch requires flexible path type
  const formValue = form.watch(name as any);
  const displayFiles = Array.isArray(formValue) ? formValue : fileList.value;

  const error = anidarPropiedades(form.formState.errors, (props.name as string).split("."));
  const hasError = !!error && !!Object.keys(error).length;

  return (
    <View className="w-full mb-4">
      <View className="flex-row items-center gap-2 mb-2">
        {ico && <View>{ico}</View>}
        <Text className="text-sm font-semibold text-foreground">
          {title}
          {required ? <Text className="text-primary">*</Text> : ""}
        </Text>
      </View>

      <Pressable
        onPress={handleFileSelect}
        className={cn(
          "w-full border-2 border-dashed rounded-lg p-6 items-center justify-center bg-card",
          hasError ? "border-destructive bg-destructive/5" : "border-muted-foreground/25",
          "active:opacity-70",
        )}
      >
        {displayFiles && displayFiles.length > 0 ? (
          <View className="w-full gap-2">
            {displayFiles.map(
              (
                file: { key?: string; uri?: string; type?: string; name?: string; size?: number },
                index: number,
              ) => (
                <View
                  key={file.key || file.uri || index}
                  className="flex-row items-center bg-background rounded-md p-2 border border-border"
                >
                  {/* Thumbnail if image */}
                  {file.type?.startsWith("image") ||
                  file.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <Image
                      source={{ uri: file.uri || file.key }} // Assuming key might be URL if from server
                      className="w-10 h-10 rounded-md mr-3"
                      resizeMode="cover"
                    />
                  ) : (
                    <FileIcon
                      className="text-muted-foreground mr-3"
                      size={24}
                      color="currentColor"
                    />
                  )}

                  <View className="flex-1">
                    <Text className="text-sm font-medium text-foreground line-clamp-1">
                      {file.name || "Unnamed File"}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {file.size ? `${(file.size / 1024).toFixed(1)} KB` : ""}
                    </Text>
                  </View>

                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      handleRemove(file.key || file.uri || "");
                    }}
                    className="p-2"
                  >
                    <Trash2 size={18} className="text-destructive" color="currentColor" />
                  </Pressable>
                </View>
              ),
            )}

            {multiple && (
              <Text className="text-center text-xs text-primary mt-2 font-medium">
                Capture more...
              </Text>
            )}
          </View>
        ) : (
          <View className="items-center">
            <CloudUpload size={32} className="text-muted-foreground mb-2" color="currentColor" />
            <Text className="text-sm font-medium text-foreground mb-1">
              {placeholder || "Tap to upload file"}
            </Text>
            <Text className="text-xs text-muted-foreground">
              {multiple ? "Supports multiple files" : "Single file"}
            </Text>
          </View>
        )}
      </Pressable>

      {hasError && (
        <Text className="text-xs text-destructive mt-1">{error?.message as string}</Text>
      )}

      {displayFiles.length > 0 && (
        <Pressable onPress={clearFiles} className="self-end mt-1">
          <Text className="text-xs text-destructive font-medium">Clear All</Text>
        </Pressable>
      )}
    </View>
  );
}

export default FormFile;
