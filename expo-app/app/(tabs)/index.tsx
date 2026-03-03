import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { HeroCarousel } from "@src/modules/dashboard/components/HeroCarousel";
import { AnimatedHeader } from "@src/modules/dashboard/components/AnimatedHeader";
import { CategoryPills } from "@src/modules/dashboard/components/CategoryPills";
import { ContinueWatchingList } from "@src/modules/dashboard/components/ContinueWatchingList";
import { TrendingList } from "@src/modules/dashboard/components/TrendingList";
import { NewReleasesList } from "@src/modules/dashboard/components/NewReleasesList";

export default function Dashboard() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      {/* Header */}
      <AnimatedHeader scrollY={scrollY} />

      {/* Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <HeroCarousel />
        
        <CategoryPills />
        
        <ContinueWatchingList />
        
        <TrendingList />
        
        <NewReleasesList />
        
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
