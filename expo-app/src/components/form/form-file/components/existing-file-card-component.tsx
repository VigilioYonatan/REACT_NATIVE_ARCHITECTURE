import Badge from "@components/extras/badge";
import type { FilesSchema } from "@modules/uploads/schemas/upload.schema";
import { X } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";
import { formatFileSize } from "../libs";

// import { isImageFile } from "../libs/file-url"; // Assume this exists or simple check

interface ExistingFileCardProps {
  file: FilesSchema;
  onRemove: (key: string) => void;
  disableRemove?: boolean;
}

export function ExistingFileCard({ file, onRemove, disableRemove = false }: ExistingFileCardProps) {
  const isImage = file.mimetype.startsWith("image/");
  // In RN, we can't easily generate thumbnails from URLs like web CDN resizers unless the URL supports it.
  // We'll use the file URL directly.

  return (
    <View className="flex-row items-start gap-3 p-3 rounded-lg border border-border bg-card shadow-sm mb-2 relative">
      {/* Preview Thumbnail */}
      <View className="w-16 h-16 rounded-lg bg-muted overflow-hidden items-center justify-center border border-border">
        {isImage ? (
          <Image
            source={{ uri: file.url || file.key }} // key might be url in some systems, or construct it
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          // Placeholder icon because dynamic icon import is tricky without mapping
          <View className="w-8 h-8 rounded-full bg-primary/20" />
        )}
      </View>

      {/* Info */}
      <View className="flex-1 justify-center h-16">
        <Text className="text-sm font-medium text-foreground pr-6" numberOfLines={1}>
          {file.name}
        </Text>

        <View className="flex-row items-center gap-2 mt-1">
          <Badge variant="outline" className="px-1 h-5">
            <Text className="text-[10px] text-foreground">
              {file.mimetype.split("/")[1]?.toUpperCase() || "FILE"}
            </Text>
          </Badge>
          <Text className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</Text>
          {file.dimension && (
            <Badge variant="secondary" className="px-1 h-5">
              <Text className="text-[10px] text-foreground">{file.dimension}px</Text>
            </Badge>
          )}
        </View>

        {/* Status: Guardado */}
        <View className="mt-1.5 flex-row items-center gap-1">
          <View className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <Text className="text-[10px] font-medium text-blue-600 dark:text-blue-400">Guardado</Text>
        </View>
      </View>

      {/* Remove Button */}
      {!disableRemove && (
        <Pressable
          onPress={() => onRemove(file.key)}
          className="absolute top-1 right-1 h-7 w-7 rounded-full items-center justify-center"
        >
          <X size={16} className="text-muted-foreground" color="currentColor" />
        </Pressable>
      )}
    </View>
  );
}
