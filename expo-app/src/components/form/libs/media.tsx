import { Archive, FileCode, FileText, Image as ImageIcon, Music, Video } from "lucide-react-native";

export function getIcon(mimeType: string) {
  const props = { size: 24, className: "text-muted-foreground", color: "currentColor" };

  if (mimeType.startsWith("image/")) return <ImageIcon {...props} />;
  if (mimeType.startsWith("video/")) return <Video {...props} />;
  if (mimeType.startsWith("audio/")) return <Music {...props} />;
  if (mimeType.includes("pdf")) return <FileText {...props} />;
  if (mimeType.includes("zip") || mimeType.includes("rar")) return <Archive {...props} />;
  if (mimeType.includes("javascript") || mimeType.includes("html") || mimeType.includes("css"))
    return <FileCode {...props} />;

  return <FileText {...props} />;
}

export function getFileTypeColor(mimeType: string) {
  if (mimeType.startsWith("image/")) return "bg-blue-100 text-blue-800 border-blue-200";
  if (mimeType.startsWith("video/")) return "bg-purple-100 text-purple-800 border-purple-200";
  if (mimeType.startsWith("audio/")) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (mimeType.includes("pdf")) return "bg-red-100 text-red-800 border-red-200";

  return "bg-gray-100 text-gray-800 border-gray-200";
}

export function getFileTypeInfo(mimeType: string) {
  const color = getFileTypeColor(mimeType);
  let category = "FILE";
  const icon = getIcon(mimeType);

  if (mimeType.startsWith("image/")) category = "IMAGE";
  if (mimeType.startsWith("video/")) category = "VIDEO";
  if (mimeType.startsWith("audio/")) category = "AUDIO";
  if (mimeType.includes("pdf")) category = "PDF";

  return { color, category, icon };
}
