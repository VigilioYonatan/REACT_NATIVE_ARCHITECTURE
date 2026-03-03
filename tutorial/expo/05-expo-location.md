# Expo Location

> **GPS**, geocoding, geofencing, y tracking en segundo plano.

## 📦 Instalación

```bash
npx expo install expo-location expo-task-manager
```

---

## 💻 Ejemplos

### 1. Ubicación Actual

```tsx
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { useState } from "react";

export default function LocationDemo() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLoading(false);
      return;
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setLocation(loc);
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      <Pressable
        onPress={getLocation}
        className="bg-primary px-8 py-4 rounded-2xl mb-6"
      >
        <Text className="text-white font-semibold">
          {loading ? "Obteniendo..." : "📍 Obtener Ubicación"}
        </Text>
      </Pressable>
      {loading && <ActivityIndicator color="#7c3aed" size="large" />}
      {location && (
        <View className="bg-surface p-6 rounded-2xl w-full">
          <Text className="text-white text-lg font-bold mb-3">
            📍 Ubicación
          </Text>
          <Text className="text-slate-300">
            Lat: {location.coords.latitude.toFixed(6)}
          </Text>
          <Text className="text-slate-300">
            Lng: {location.coords.longitude.toFixed(6)}
          </Text>
          <Text className="text-slate-300">
            Altitud: {location.coords.altitude?.toFixed(1)}m
          </Text>
          <Text className="text-slate-300">
            Precisión: ±{location.coords.accuracy?.toFixed(0)}m
          </Text>
        </View>
      )}
    </View>
  );
}
```

### 2. Geocoding (Dirección ↔ Coordenadas)

```tsx
import * as Location from "expo-location";

// Dirección → Coordenadas
const geocode = async (address: string) => {
  const results = await Location.geocodeAsync(address);
  if (results.length > 0) {
    console.log("Lat:", results[0].latitude, "Lng:", results[0].longitude);
  }
};

// Coordenadas → Dirección
const reverseGeocode = async (lat: number, lng: number) => {
  const results = await Location.reverseGeocodeAsync({
    latitude: lat,
    longitude: lng,
  });
  if (results.length > 0) {
    const { street, city, region, country, postalCode } = results[0];
    console.log(`${street}, ${city}, ${region} ${postalCode}, ${country}`);
  }
};
```

### 3. Watching en Tiempo Real

```tsx
import * as Location from "expo-location";
import { useEffect, useState } from "react";

export function useWatchLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 5, // Cada 5 metros
          timeInterval: 1000, // Cada segundo
        },
        (loc) => setLocation(loc),
      );
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  return location;
}
```

### 4. Background Location

```tsx
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const TASK_NAME = "background-location";

// Definir task (fuera de componente)
TaskManager.defineTask(TASK_NAME, ({ data, error }) => {
  if (error) return;
  const { locations } = data as { locations: Location.LocationObject[] };
  console.log("📍 Background:", locations[0].coords);
  // Enviar al servidor
});

// Iniciar tracking
const startBackground = async () => {
  const { status: fg } = await Location.requestForegroundPermissionsAsync();
  const { status: bg } = await Location.requestBackgroundPermissionsAsync();
  if (fg !== "granted" || bg !== "granted") return;

  await Location.startLocationUpdatesAsync(TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
    distanceInterval: 50,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "Tracking activo",
      notificationBody: "La app está rastreando tu ubicación",
    },
  });
};

// Detener
const stopBackground = () => Location.stopLocationUpdatesAsync(TASK_NAME);
```

---

## 🔗 Links

- [Documentación oficial](https://docs.expo.dev/versions/latest/sdk/location/)
- [Task Manager](https://docs.expo.dev/versions/latest/sdk/task-manager/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica   | ❌ Malo                              | ✅ Bueno                                                     |
| ---------- | ------------------------------------ | ------------------------------------------------------------ |
| Accuracy   | `Accuracy.Highest` siempre           | `Accuracy.Balanced` para la mayoría de casos (menos batería) |
| Background | Location siempre activo              | Solo activar background cuando es necesario                  |
| Permisos   | No diferenciar foreground/background | Pedir foreground primero, background solo si es crítico      |
| Batería    | Polling con `setInterval`            | `watchPositionAsync` con `distanceInterval`                  |
| Geocoding  | Geocodificar en cada render          | Cache de resultados, debounce de queries                     |

---

## ✅ Checklist

- [ ] Sé pedir permisos foreground y background
- [ ] Puedo obtener ubicación actual con `getCurrentPositionAsync`
- [ ] Sé hacer geocoding y reverse geocoding
- [ ] Puedo watchear posición en tiempo real
- [ ] Sé configurar background location con TaskManager
