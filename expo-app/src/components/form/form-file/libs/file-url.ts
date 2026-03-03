/**
 * Verifica si un archivo es una imagen basándose en su mimetype
 */
export function isImageFile(mimetype: string): boolean {
  return mimetype.startsWith("image/");
}
