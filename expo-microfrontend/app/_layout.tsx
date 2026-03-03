import { Slot, Stack } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

// Imports the global CSS file required by NativeWind v4
import '../global.css';

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Basic route protection
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if unauthenticated and trying to access inner pages
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect away from login if authenticated
      router.replace('/(app)');
    }
  }, [isAuthenticated, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}
