import { z } from "zod";
import { movieSchema } from "@src/modules/movies/schemas/movie.schema";

export const watchHistorySchema = z.object({
  id: z.number(),
  user_id: z.number(),
  movie_id: z.number(),
  progress_seconds: z.number().int().nonnegative(),
  is_completed: z.boolean(),
  last_watched_at: z.coerce.date(),
  movie: movieSchema.optional(), // Expanded relation
});

export type WatchHistorySchema = z.infer<typeof watchHistorySchema>;
