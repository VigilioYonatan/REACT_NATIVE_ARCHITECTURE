import { create } from "zustand";
import type { AuthLoginResponseDto } from "../modules/auth/dtos/auth.login.dto";
import { storage } from "@src/infrastructure/utils/storage";


interface AuthState {
  user: AuthLoginResponseDto["user"] | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: AuthLoginResponseDto) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
    // Hydrate state from storage
    const storedUser = storage.getString("auth.user");
    const storedToken = storage.getString("auth.token");

    const initialState = {
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken || null,
        isAuthenticated: !!storedToken,
    };

    return {
        ...initialState,
        login: (data) => {
            storage.set("auth.user", JSON.stringify(data.user));
            storage.set("auth.token", data.token);
            set({ user: data.user, token: data.token, isAuthenticated: true });
        },
        logout: () => {
            storage.remove("auth.user");
            storage.remove("auth.token");
            set({ user: null, token: null, isAuthenticated: false });
        },
    };
});
