import React from "react";
import { Tabs } from "expo-router";
import { View, Platform } from "react-native";
import { Home, Search, Heart, User } from "lucide-react-native";
import { BlurView } from "expo-blur";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          height: 60,
        },
        tabBarBackground: () => (
          <View style={{ borderRadius: 30, overflow: "hidden", ...Platform.select({ android: { elevation: 8 } }) }}>
            <BlurView intensity={80} tint="dark" style={{ height: 60, width: "100%" }} />
          </View>
        ),
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#E50914",
        tabBarInactiveTintColor: "#9ca3af",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Buscar",
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
