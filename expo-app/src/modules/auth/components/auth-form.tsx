import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { authLoginSchema, type AuthLoginSchema } from "../schemas/auth.schema";
import { authLoginApi } from "../apis/auth-login.api";
import { useAuthStore } from "../stores/auth.store";
import Button from "@components/extras/button";
import { ControlledInput } from "@components/form/controlled-input";

export function AuthForm() {
    const router = useRouter();
    const { login } = useAuthStore();
    const authLoginMutation = authLoginApi();

    const { control, handleSubmit, formState: { errors } } = useForm<AuthLoginSchema>({
        resolver: zodResolver(authLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onLogin(data: AuthLoginSchema) {
        authLoginMutation.mutate(data, {
            onSuccess(response) {
                if (response.success) {
                    login(response.user);
                    router.replace("/dashboard");
                }
            },
            onError(error) {
                Alert.alert("Error", error.message);
            },
        });
    }

    return (
        <View className="w-full">
            <ControlledInput
                control={control}
                name="email"
                label="Correo Electrónico"
                placeholder="ejemplo@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className="mb-4"
                labelClassName="text-white"
                inputClassName="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />

            <ControlledInput
                control={control}
                name="password"
                label="Contraseña"
                placeholder="••••••"
                secureTextEntry
                className="mb-6"
                labelClassName="text-white"
                inputClassName="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />

            <Button
                title="Ingresar"
                onPress={handleSubmit(onLogin)}
                isLoading={authLoginMutation.isLoading||false}
                variant="primary"
                className="w-full bg-red-600 active:bg-red-700"
            />

            <View className="flex-row justify-center mt-6">
                <Text className="text-slate-400">¿No tienes cuenta? </Text>
                <Link  href="/register" asChild>
                    <TouchableOpacity>
                        <Text className="text-white font-bold ml-1">Regístrate</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            <View className="flex-row justify-center mt-4">
                <Link href="/forgot-password" asChild>
                    <TouchableOpacity>
                        <Text className="text-slate-400 text-sm">¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}
