export interface EntityFile {
    file: File | Blob;
}
export type EntityFileProperty = "image" | "file" | "video";
export const DIMENSION_IMAGE = {
    xs: 32,
    sm: 64,
    md: 100,
    lg: 150,
    xl: 200
};
