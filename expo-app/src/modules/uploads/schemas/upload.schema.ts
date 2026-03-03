import { z } from "zod";

export const filesSchema = z.object({
  key: z.string(),
  url: z.string(),
  name: z.string(),
  mimetype: z.string(),
  size: z.number(),
  dimension: z.string().optional(),
  type: z.string().optional(), // RN asset props
  uri: z.string().optional(), // RN asset props
});

export type FilesSchema = z.infer<typeof filesSchema>;
