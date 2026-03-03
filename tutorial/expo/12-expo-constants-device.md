# Expo Constants & Device

> Información del **dispositivo**, la **app**, y el **entorno** de ejecución — versión, plataforma, nombre del device, etc.

## 📦 Instalación

```bash
npx expo install expo-constants expo-device
```

---

## 💻 Ejemplos

### 1. Info de la App y Dispositivo

```tsx
import { View, Text, ScrollView, Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";

export default function DeviceInfo() {
  const info = [
    { label: "App Name", value: Constants.expoConfig?.name },
    { label: "App Version", value: Constants.expoConfig?.version },
    { label: "SDK Version", value: Constants.expoConfig?.sdkVersion },
    { label: "Platform", value: Platform.OS },
    { label: "OS Version", value: Platform.Version },
    { label: "Device Name", value: Device.deviceName },
    { label: "Brand", value: Device.brand },
    { label: "Model", value: Device.modelName },
    { label: "Is Device", value: String(Device.isDevice) },
    { label: "Device Year", value: String(Device.deviceYearClass) },
    {
      label: "Total Memory",
      value: `${((Device.totalMemory ?? 0) / 1e9).toFixed(1)} GB`,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background p-5 pt-16">
      <Text className="text-2xl font-bold text-white mb-6">📱 Device Info</Text>
      {info.map(({ label, value }) => (
        <View
          key={label}
          className="flex-row justify-between py-3 border-b border-slate-800"
        >
          <Text className="text-slate-400">{label}</Text>
          <Text className="text-white font-medium">{value ?? "N/A"}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
```

### 2. Detectar Entorno

```tsx
import Constants, { ExecutionEnvironment } from "expo-constants";

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
const isDevBuild =
  Constants.executionEnvironment === ExecutionEnvironment.Standalone;
const isDev = __DEV__;

// Usar para mostrar/ocultar features que requieren dev client
if (isExpoGo) {
  console.log("Corriendo en Expo Go — algunas APIs nativas no disponibles");
}
```

### 3. Variables de Entorno con Constants

```json
// app.json
{
  "expo": {
    "extra": {
      "apiUrl": "https://api.miapp.com",
      "sentryDsn": "https://...",
      "eas": { "projectId": "..." }
    }
  }
}
```

```tsx
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const SENTRY_DSN = Constants.expoConfig?.extra?.sentryDsn;
```

---

## 🏆 Buenas Prácticas

| Práctica             | ❌ Malo                                         | ✅ Bueno                                                    |
| -------------------- | ----------------------------------------------- | ----------------------------------------------------------- |
| Variables de entorno | Hardcodear URLs en el código                    | Usar `Constants.expoConfig.extra`                           |
| Platform check       | `if (Platform.OS === 'ios')` por todo el código | Abstraer en helpers o hooks                                 |
| Device info          | Llamar `Device.*` en cada render                | Leer una vez y cachear en state                             |
| Expo Go detection    | Asumir que todo funciona                        | Verificar `executionEnvironment` antes de usar APIs nativas |

---

## 🔗 Links

- [Constants docs](https://docs.expo.dev/versions/latest/sdk/constants/)
- [Device docs](https://docs.expo.dev/versions/latest/sdk/device/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica | ❌ Malo                          | ✅ Bueno                                         |
| -------- | -------------------------------- | ------------------------------------------------ |
| API URL  | Hardcodear URL en cada archivo   | `Constants.expirationDate` + env vars            |
| Platform | `Platform.OS === 'ios'` repetido | Helper `isIOS()` centralizado                    |
| Device   | No detectar emulador             | `Device.isDevice` para features que lo requieren |
| Debug    | `__DEV__` en producción          | `Constants.appOwnership` + `__DEV__` flag        |

---

## ✅ Checklist

- [ ] Sé leer info de la app y el dispositivo
- [ ] Puedo detectar si corro en Expo Go o dev client
- [ ] Sé usar `Constants.expoConfig.extra` para variables de entorno
- [ ] Entiendo las diferencias de platform detection
