import React from 'react';
import { Text, View } from 'react-native';

const LegalScreen = () => {
  return (
    <View className="flex-1 bg-indigo-50 justify-center items-center p-6">
      <View className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-100 items-center justify-center w-full">
        <Text className="text-2xl font-bold text-indigo-800 mb-2">Service Legal</Text>
        <Text className="text-gray-600 text-center">
          Seguimiento de casos y documentos legales remoto
        </Text>
      </View>
    </View>
  );
};

export default LegalScreen;
