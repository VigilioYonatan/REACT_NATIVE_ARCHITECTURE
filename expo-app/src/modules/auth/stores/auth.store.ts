import { create } from "zustand";
import { type User } from "@src/modules/users/dtos/user.dto";
import { storage } from "@src/infrastructure/utils/storage";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: (user) => {
        set({ user, isAuthenticated: true });
        storage.set("user", JSON.stringify(user));
    },
    logout: () => {
        set({ user: null, isAuthenticated: false });
        storage.remove("user");
    },
}));
