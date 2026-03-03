import { View, Text, ScrollView } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { useRouter } from 'expo-router';

export function DashboardScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 px-4 py-6">
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-2xl font-bold text-slate-900">Dashboard</Text>
          <Text className="text-slate-500 text-sm">Welcome back, {user?.name}</Text>
        </View>
        <Button 
          label="Logout" 
          variant="outline" 
          onPress={handleLogout} 
          className="py-2 px-3 bg-white" 
        />
      </View>

      <Text className="text-lg font-semibold text-slate-800 mb-4 px-1">
        Active Microfrontends
      </Text>

      <View className="gap-y-4">
        <Card title="User Management" subtitle="Manage external user accounts">
          <Text className="text-slate-600 mb-4">
            Connects to the JSON server to retrieve, edit, and manage user mock data.
          </Text>
          <Button 
            label="Go to Users Module" 
            onPress={() => router.push('/(app)/users')} 
            className="w-full"
          />
        </Card>

        <Card title="Analytics" subtitle="Coming soon">
          <Text className="text-slate-600">
            A planned microfrontend for displaying charts and robust analytics using simulated data points.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}
