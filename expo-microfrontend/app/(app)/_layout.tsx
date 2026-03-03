import { Tabs } from 'expo-router';
import { Home, Users } from 'lucide-react-native';

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: true,
      tabBarActiveTintColor: '#2563eb',
      tabBarInactiveTintColor: '#64748b',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          href: '/',
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          href: '/users',
          title: 'Users',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
