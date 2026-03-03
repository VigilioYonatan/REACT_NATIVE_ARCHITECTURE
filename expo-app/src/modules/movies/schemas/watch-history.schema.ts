import { z } from "zod";

export const watchHistorySchema = z.object({
    id: z.number(),
    user_id: z.number(),
    movie_id: z.number(),
    progress_seconds: z.number().min(0),
    duration_seconds: z.number().min(0),
    last_watched_at: z.date(),
    is_finished: z.boolean().default(false),
});

export type WatchHistorySchema = z.infer<typeof watchHistorySchema>;
