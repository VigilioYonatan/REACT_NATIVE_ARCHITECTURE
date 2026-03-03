import React from "react";
import { View, Text, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthForm } from "@modules/auth/components/auth-form";

export default function LoginScreen() {
  return (
    <ImageBackground
      source={{ uri: "https://image.tmdb.org/t/p/original/9yBVqNruk6Ykr9ztvE99PptfVPo.jpg" }}
      className="flex-1 justify-center"
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]}
        className="absolute inset-0"
      />
      
      <SafeAreaView className="flex-1 justify-center px-6">
        <View className="items-center mb-10">
          <Text className="text-white text-5xl font-extrabold tracking-tighter text-center">
            Movie<Text className="text-red-600">App</Text>
          </Text>
          <Text className="text-slate-300 text-base mt-2 font-medium tracking-wide">
            Disfruta de tus películas favoritas
          </Text>
        </View>

        <View className="overflow-hidden rounded-3xl border border-white/10 relative">
            <BlurView intensity={30} tint="dark" className="absolute inset-0" />
            <View className="p-8 bg-black/20">
                <AuthForm />
            </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
