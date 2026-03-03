import { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { Card } from '../../shared/components/Card';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = { id: '1', name: 'Admin User', email };
      const mockToken = 'mock-jwt-token-12345';
      
      login(mockUser, mockToken);
      router.replace('/(app)');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6">
      <View className="items-center mb-10">
        <Text className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</Text>
        <Text className="text-slate-500 text-base text-center">
          Sign in to access your microfrontends dashboard
        </Text>
      </View>

      <Card className="px-5 py-6 shadow-md border-slate-200">
        <Input
          label="Email Address"
          placeholder="admin@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button 
          label="Sign In" 
          onPress={handleLogin} 
          isLoading={isLoading} 
          className="mt-4 shadow-sm shadow-blue-500/50"
        />
      </Card>
      
      <Text className="text-center text-slate-400 mt-8 text-sm">
        React Native Expo Microfrontend Architecture 2026
      </Text>
    </View>
  );
}
