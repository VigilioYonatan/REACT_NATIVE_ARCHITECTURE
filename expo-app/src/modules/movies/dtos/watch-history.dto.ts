import { z } from "zod";
import { watchHistorySchema } from "../schemas/watch-history.schema";

export const watchHistoryStoreDto = watchHistorySchema.pick({
    movie_id: true,
    progress_seconds: true,
    duration_seconds: true,
    is_finished: true,
});

export type WatchHistoryStoreDto = z.infer<typeof watchHistoryStoreDto>;

export interface WatchHistoryResponseDto {
    success: boolean;
    data: z.infer<typeof watchHistorySchema>;
}
