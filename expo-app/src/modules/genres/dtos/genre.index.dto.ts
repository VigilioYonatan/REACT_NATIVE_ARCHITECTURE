import { z } from "zod";
import { genreSchema } from "../schemas/genre.schema";

export const genreIndexDto = z.object({
    offset: z.number().nonnegative().optional(),
    limit: z.number().positive().optional(),
    search: z.string().optional(),
});
export type GenreIndexDto = z.infer<typeof genreIndexDto>;

export const genreIndexResponseDto = z.object({
    success: z.boolean(),
    results: z.array(genreSchema),
    count: z.number().nonnegative(),
});
export type GenreIndexResponseDto = z.infer<typeof genreIndexResponseDto>;
