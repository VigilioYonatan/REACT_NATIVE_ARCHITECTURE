import { z } from "zod";

export const movieActorSchema = z.object({
    id: z.number(),
    movie_id: z.number(),
    actor_id: z.number(),
    character: z.string(),
    order: z.number().int(),
});

export type MovieActorSchema = z.infer<typeof movieActorSchema>;

export const actorSchema = z.object({
    id: z.number(),
    name: z.string(),
    profile_path: z.string().nullable(),
});

export type ActorSchema = z.infer<typeof actorSchema>;

export const movieActorEmbeddedSchema = movieActorSchema.extend({
    actor: actorSchema.optional(), // JSON Server embed/expand
});

export type MovieActorEmbeddedSchema = z.infer<typeof movieActorEmbeddedSchema>;
