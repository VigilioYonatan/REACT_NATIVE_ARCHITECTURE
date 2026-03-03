import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { apiClient } from '../../api/client';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { useRouter } from 'expo-router';

interface ExternalUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function UsersScreen() {
  const [users, setUsers] = useState<ExternalUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Fetching from json-server API endpoint
      const response = await apiClient.get('/users');
      setUsers(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: ExternalUser }) => (
    <Card className="mb-3 px-4 py-3 border border-slate-200">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-semibold text-slate-800">{item.name}</Text>
          <Text className="text-sm text-slate-500">{item.email}</Text>
        </View>
        <View className="bg-blue-100 rounded-full px-3 py-1">
          <Text className="text-xs font-bold text-blue-700 capitalize">{item.role}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View className="flex-1 bg-slate-50 px-4 py-6">
      <Text className="text-2xl font-bold text-slate-900 mb-6">Users Management</Text>
      
      {isLoading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="text-slate-500 mt-4">Loading users...</Text>
        </View>
      )}

      {error && !isLoading && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 mb-4">{error}</Text>
          <Button label="Retry" onPress={fetchUsers} />
        </View>
      )}

      {!isLoading && !error && (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="text-center text-slate-500 mt-10">No users found</Text>
          }
        />
      )}
      
      <Button 
        label="Back to Dashboard" 
        variant="secondary" 
        onPress={() => router.back()} 
        className="mt-6"
      />
    </View>
  );
}
