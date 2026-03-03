import { useMutation } from "@vigilio/react-native-fetching";
import axios from "axios";
import { type AuthLoginSchema } from "../schemas/auth.schema";
import { type User } from "@src/modules/users/dtos/user.dto";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.13:3000";

export interface AuthLoginResponseDto {
    success: boolean;
    user: User;
}

export interface AuthLoginErrorDto {
    success: false;
    message: string;
}

export function authLoginApi() {
    return useMutation<AuthLoginResponseDto, AuthLoginSchema, AuthLoginErrorDto>(
        "/users",
        async (url, body) => {
            const { data } = await axios.get(`${API_URL}${url}?email=${body.email}&password=${body.password}`);
            
            if (data.length > 0) {
                return { success: true, user: data[0] };
            }
            throw { success: false, message: "Credenciales inválidas" };
        }
    );
}
