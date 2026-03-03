import Badge from "@components/extras/badge";
import Card from "@components/extras/card";
import { Calendar, HardDrive, Info } from "lucide-react-native";
import { Image, ScrollView, Text, View } from "react-native";
import { formatDate, formatFileSize } from "../libs";

// import type { ImageMetadata } from "../types";

interface FileObject {
  uri?: string;
  key?: string;
  name?: string;
  type?: string;
  mimeType?: string;
  size?: number;
  lastModified?: number;
}

export interface FileInfoProps {
  file: FileObject;
  title?: string;
}

export function FileInfo({ file, title }: FileInfoProps) {
  // Basic file info display for RN
  const uri = file.uri || file.key;
  const isImage = file.type?.startsWith("image") || file.mimeType?.startsWith("image");

  return (
    <ScrollView className="space-y-4">
      {title && <Text className="text-xl font-bold text-foreground mb-4">{title}</Text>}
      <Card className="w-full">
        <View className="p-4 space-y-6">
          {/* File Preview */}
          <View className="flex-row items-center gap-4">
            <View className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden items-center justify-center">
              {isImage ? (
                <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <Info size={32} className="text-muted-foreground" color="currentColor" />
              )}
            </View>
            <View className="flex-1">
              <Text className="font-medium text-lg text-foreground" numberOfLines={1}>
                {file.name}
              </Text>
              <Badge>
                <Text className="text-xs text-foreground">{file.type || "FILE"}</Text>
              </Badge>
            </View>
          </View>

          {/* Basic Info */}
          <View className="space-y-4">
            <View className="space-y-1">
              <View className="flex-row items-center gap-2">
                <HardDrive size={14} className="text-primary" color="currentColor" />
                <Text className="text-sm text-gray-600">Tamaño</Text>
              </View>
              <Text className="font-medium text-foreground">{formatFileSize(file.size || 0)}</Text>
            </View>

            {/* Date might not be available in all RN file assets immediately */}
            {file.lastModified && (
              <View className="space-y-1">
                <View className="flex-row items-center gap-2">
                  <Calendar size={14} className="text-primary" color="currentColor" />
                  <Text className="text-sm text-gray-600">Modificado</Text>
                </View>
                <Text className="font-medium text-foreground">{formatDate(file.lastModified)}</Text>
              </View>
            )}

            <View className="space-y-1">
              <View className="flex-row items-center gap-2">
                <Info size={14} className="text-primary" color="currentColor" />
                <Text className="text-sm text-gray-600">Tipo MIME</Text>
              </View>
              <Text className="font-medium text-foreground">
                {file.type || file.mimeType || "Desconocido"}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}
