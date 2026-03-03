import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "El nombre es requerido"),
  email: z.email("Email inválido"),
});

export type User = z.infer<typeof userSchema>;

export const userStoreDto = userSchema.omit({ id: true });
export type UserStoreDto = z.infer<typeof userStoreDto>;
