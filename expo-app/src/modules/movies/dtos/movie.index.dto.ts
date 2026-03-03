import { z } from "zod";
import { movieSchema } from "../schemas/movie.schema";

export const movieIndexDto = z.object({
    offset: z.number().nonnegative().optional(),
    limit: z.number().positive().optional(),
    search: z.string().optional(),
    is_featured: z.boolean().optional(),
    // JSON Server sort params
    _sort: z.string().optional(),
    _order: z.enum(["asc", "desc"]).optional(),
    genre_id: z.number().optional(),
    year: z.number().optional(),
    rating: z.number().optional(),
});
export type MovieIndexDto = z.infer<typeof movieIndexDto>;

export const movieIndexResponseDto = z.object({
    success: z.boolean(),
    results: z.array(movieSchema),
    count: z.number().nonnegative(),
});
export type MovieIndexResponseDto = z.infer<typeof movieIndexResponseDto>;
