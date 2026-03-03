import React from 'react';
import { Text, View } from 'react-native';

const CobranzasScreen = () => {
  return (
    <View className="flex-1 bg-blue-50 justify-center items-center p-6">
      <View className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 items-center justify-center w-full">
        <Text className="text-2xl font-bold text-blue-800 mb-2">Service Cobranzas</Text>
        <Text className="text-gray-600 text-center">
          Vistas de deudas y promesas de pago cargadas remotamente
        </Text>
      </View>
    </View>
  );
};

export default CobranzasScreen;
