import { useSignal } from "@preact/signals-react";
import * as DocumentPicker from "expo-document-picker";
import { useContext } from "react";
import type { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { FormControlContext } from "../..";
import type { FormFileProps } from "../types";

interface FileItem {
  uri: string;
  name: string;
  type: string | undefined;
  size: number | undefined;
  key: string;
  status: string;
}

// Simplified Hook for Native
export function useFormFile<T extends object>({
  multiple = false,
  entity: _entity,
  property: _property,
  name,
}: Pick<FormFileProps<T>, "multiple" | "name" | "entity" | "property">) {
  const form = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);

  const isUploading = useSignal(false);
  // We use a simplified file state for now. SmartUpload hook logic is complex and API dependent.
  // For this refactor, we focus on the UI/Selection part.
  // In a real app, you'd wire up the Upload API here via axios/fetch.

  // Using local state to mimic uploading for demo purposes if SmartUpload isn't fully native-ready.
  // Assuming we just store the file object or URI for now.

  const fileList = useSignal<FileItem[]>([]);

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Or filter based on entity/property
        multiple: multiple,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        // In a real app: Upload result.assets to server here.
        // For now, we simulate success and set the value.

        const newFiles = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType,
          size: asset.size,
          key: asset.uri, // Use URI as temporary key
          status: "COMPLETED", // Simulated
        }));

        const currentVal = form.getValues(name as unknown as Path<T>);
        let finalVal: FileItem[];

        if (multiple) {
          const prev = Array.isArray(currentVal) ? currentVal : [];
          finalVal = [...prev, ...newFiles];
        } else {
          finalVal = newFiles; // schema usually expects array even for single? or maybe single object.
          // The original code said "if NO multiple, REPLACE but keep as array".
        }

        form.setValue(name as unknown as Path<T>, finalVal as PathValue<T, Path<T>>, {
          shouldValidate: true,
          shouldDirty: true,
        });

        // Update local visual list
        fileList.value = finalVal;
      }
    } catch (_err) {}
  };

  const clearFiles = () => {
    // biome-ignore lint/suspicious/noExplicitAny: react-hook-form setValue requires flexible type coercion
    form.setValue(name as unknown as Path<T>, [] as any);
    fileList.value = [];
  };

  const handleRemove = (fileKey: string) => {
    const current = form.getValues(name as unknown as Path<T>) as FileItem[];
    if (Array.isArray(current)) {
      const newVal = current.filter((f) => f.key !== fileKey && f.uri !== fileKey);
      // biome-ignore lint/suspicious/noExplicitAny: react-hook-form setValue requires flexible type coercion
      form.setValue(name as unknown as Path<T>, newVal as any);
      fileList.value = newVal;
    }
  };

  return {
    form,
    isUploading,
    fileList,
    clearFiles,
    handleFileSelect,
    handleRemove,
  };
}
