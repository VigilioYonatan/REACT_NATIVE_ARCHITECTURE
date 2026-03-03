import { z } from "zod";

export const reviewSchema = z.object({
    id: z.number(),
    movie_id: z.number(),
    user_id: z.number(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(1),
    created_at: z.coerce.date(),
});

export type ReviewSchema = z.infer<typeof reviewSchema>;
