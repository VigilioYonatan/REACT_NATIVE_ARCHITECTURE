import { useMutation } from "@vigilio/react-native-fetching";
import type {
  AuthLoginDto,
  AuthLoginResponseDto,
} from "../dtos/auth.login.dto";
import axios from "axios";

// Using env variable if available, otherwise defaulting to localhost for json-server
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export function authLoginApi() {
  return useMutation<AuthLoginResponseDto, AuthLoginDto, { message: string }>(
    "/auth/login",
    async (_url, body) => {
      // MOCK IMPLEMENTATION: Fetch users and find match
      // In a real app, this would be a POST to /auth/login
      try {
        const { data: users } = await axios.get(`${API_URL}/users`);
        
        const user = users.find(
          (u: any) => u.email === body.email && u.password === body.password
        );

        if (!user) {
          throw { message: "Credenciales inválidas" };
        }

        // Return success response with mock token
        return {
            success: true,
            user,
            token: "mock-jwt-token-" + user.id
        };
      } catch (error: any) {
          if (error.message) throw error;
          throw { message: "Error al conectar con el servidor" };
      }
    }
  );
}
