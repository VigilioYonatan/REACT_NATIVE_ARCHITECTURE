import { z } from "zod";
import { watchHistorySchema } from "../schemas/watch-history.schema";

export const watchHistoryIndexDto = z.object({
    user_id: z.number().optional(), // In real app, derived from auth token
    _expand: z.string().optional(), // 'movie'
    _sort: z.string().optional(),
    _order: z.string().optional(),
    limit: z.number().optional(),
});
export type WatchHistoryIndexDto = z.infer<typeof watchHistoryIndexDto>;

export const watchHistoryIndexResponseDto = z.object({
    success: z.boolean(),
    results: z.array(watchHistorySchema),
});
export type WatchHistoryIndexResponseDto = z.infer<typeof watchHistoryIndexResponseDto>;
