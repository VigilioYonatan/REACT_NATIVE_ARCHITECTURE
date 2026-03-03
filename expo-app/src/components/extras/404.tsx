import Button from "@components/extras/button";

import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

function View404() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-4">
      <StatusBar style="light" />

      {/* Glitch/Scanline effect omitted for simplicity, can use Reanimated if needed */}
      <View className="items-center gap-6 max-w-sm">
        <View className="items-center justify-center">
          <Text className="text-9xl font-black text-primary tracking-tighter">404</Text>
          {/* Shadow/Glitch simulation via absolute text */}
          <Text className="absolute text-9xl font-black text-destructive/20 top-1 left-1 -z-10">
            404
          </Text>
        </View>

        <View className="gap-2 items-center">
          <Text className="text-2xl font-bold text-foreground tracking-tight text-center">
            ERROR_PAGE_NOT_FOUND
          </Text>
          <Text className="text-muted-foreground font-mono text-center">
            &gt; The requested resource could not be found.{"\n"}
            &gt; Check the URL or contact the administrator.
          </Text>
        </View>

        <View className="mt-8">
          <Button variant="primary" size="lg" onPress={() => router.replace("/")}>
            &lt; Return_Home /&gt;
          </Button>
        </View>
      </View>
    </View>
  );
}

export default View404;
