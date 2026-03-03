export * from "./cn";
export const normalizarText = (text: string) => text.toLowerCase().trim();
// Add other client utils here if needed
export const sizeIcon = {
  small: { width: 16, height: 16 },
  medium: { width: 20, height: 20 },
  large: { width: 24, height: 24 },
  xlarge: { width: 32, height: 32 },
};
