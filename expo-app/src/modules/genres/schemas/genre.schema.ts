import { z } from "zod";

export const genreSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
  icon_url: z.string().url().nullable().optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type GenreSchema = z.infer<typeof genreSchema>;
