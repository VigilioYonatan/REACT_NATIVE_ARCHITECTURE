import { z } from "zod";

export const movieSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string(),
  poster_url: z.string().url(),
  backdrop_url: z.string().url().nullable().optional(),
  video_url: z.string().url(),
  trailer_url: z.string().url().nullable().optional(),
  year: z.number().int().min(1900).max(2100),
  duration_minutes: z.number().int().positive(),
  rating: z.number().min(0).max(10).nullable().optional(),
  views_count: z.number().int().nonnegative().default(0),
  is_featured: z.boolean().default(false),
  is_original: z.boolean().default(false),
  release_date: z.string(), // Date string YYYY-MM-DD
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  genre_id: z.number().int(),
  director_id: z.number().int(),
});

export type MovieSchema = z.infer<typeof movieSchema>;
