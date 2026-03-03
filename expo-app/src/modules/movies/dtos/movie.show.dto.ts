import { z } from "zod";
import { movieSchema } from "../schemas/movie.schema";
import { reviewSchema } from "../schemas/review.schema";
import { movieActorEmbeddedSchema } from "../schemas/movie-actor.schema";

export const movieShowResponseDto = z.object({
    success: z.boolean(),
    movie: movieSchema.extend({
        reviews: z.array(reviewSchema).optional(),
        movie_actors: z.array(movieActorEmbeddedSchema).optional(),
    }),
});

export type MovieShowResponseDto = z.infer<typeof movieShowResponseDto>;
