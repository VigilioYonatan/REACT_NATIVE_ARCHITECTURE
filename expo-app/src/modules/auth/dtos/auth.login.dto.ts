import type { z } from "zod";
import { authLoginSchema } from "../schemas/auth.schema";

export const authLoginDto = authLoginSchema;
export type AuthLoginDto = z.infer<typeof authLoginDto>;

export interface AuthLoginResponseDto {
  success: boolean;
  user: {
    id: number;
    email: string;
    name: string;
    role: "admin" | "user";
    photo: string | null;
  };
  token: string;
}
