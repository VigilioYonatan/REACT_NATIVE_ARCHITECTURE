import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

// Lazy loading remote microfrontends
const CobranzasScreen = React.lazy(() => import('service_cobranzas/App'));
const LegalScreen = React.lazy(() => import('service_legal/App'));

// Fallback loader for suspense
const Fallback = () => (
  <View className="flex-1 items-center justify-center bg-white">
    <Text className="text-gray-500 font-bold">Loading Microfrontend...</Text>
  </View>
);

const HomeScreen = ({ navigation }: any) => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-8">Host App Dashboard</Text>

      <TouchableOpacity
        className="w-full bg-blue-500 p-4 rounded-lg mb-4 items-center"
        onPress={() => navigation.navigate('Cobranzas')}
      >
        <Text className="text-white font-bold text-lg">Ir a Cobranzas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full bg-indigo-500 p-4 rounded-lg items-center"
        onPress={() => navigation.navigate('Legal')}
      >
        <Text className="text-white font-bold text-lg">Ir a Legal</Text>
      </TouchableOpacity>
    </View>
  );
};

const CobranzasHost = () => (
  <React.Suspense fallback={<Fallback />}>
    <CobranzasScreen />
  </React.Suspense>
);

const LegalHost = () => (
  <React.Suspense fallback={<Fallback />}>
    <LegalScreen />
  </React.Suspense>
);

// Error boundary wrapper might be needed in real prod config, but keeping it simple
const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerTitleAlign: 'center' }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'IBR Microfrontend' }}
          />
          <Stack.Screen name="Cobranzas" component={CobranzasHost} />
          <Stack.Screen name="Legal" component={LegalHost} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
