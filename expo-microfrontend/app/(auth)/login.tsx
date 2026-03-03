import { LoginScreen } from '../../src/features/auth/LoginScreen';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LoginScreen />
    </>
  );
}
