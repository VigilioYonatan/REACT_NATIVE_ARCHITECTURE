# 05 — Maps & Geolocalización

## 🎯 Objetivo

Integrar **mapas interactivos** con `react-native-maps` y obtener la **ubicación del dispositivo** con `expo-location`.

---

## 📚 Teoría

### Instalación

```bash
npx expo install react-native-maps expo-location
```

### Permisos

| Tipo           | Método                                |
| -------------- | ------------------------------------- |
| **Foreground** | `requestForegroundPermissionsAsync()` |
| **Background** | `requestBackgroundPermissionsAsync()` |

---

## 💻 Código Práctico

### Ejemplo 1: Mapa con Ubicación Actual

```tsx
import { View, Text, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function MapaUbicacion() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permiso denegado");
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text className="text-slate-400 mt-3">Obteniendo ubicación...</Text>
      </View>
    );

  if (error)
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-red-400 text-lg">❌ {error}</Text>
      </View>
    );

  return (
    <View className="flex-1">
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location!.latitude,
          longitude: location!.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker
          coordinate={location!}
          title="Mi Ubicación"
          description="📍 Estás aquí"
          pinColor="#7c3aed"
        />
      </MapView>
      <View className="absolute bottom-10 left-5 right-5 bg-black/90 p-4 rounded-xl">
        <Text className="text-white text-center font-mono text-sm">
          📍 {location!.latitude.toFixed(6)}, {location!.longitude.toFixed(6)}
        </Text>
      </View>
    </View>
  );
}
```

### Ejemplo 2: Múltiples Marcadores + Callouts

```tsx
import MapView, { Marker, Callout } from "react-native-maps";
import { View, Text } from "react-native";

const PLACES = [
  {
    id: 1,
    name: "Café Central",
    emoji: "☕",
    lat: 40.4168,
    lng: -3.7038,
    desc: "Mejor café",
  },
  {
    id: 2,
    name: "Parque Tech",
    emoji: "🌳",
    lat: 40.42,
    lng: -3.706,
    desc: "Coworking",
  },
  {
    id: 3,
    name: "Museo Digital",
    emoji: "🎨",
    lat: 40.414,
    lng: -3.701,
    desc: "Arte + tech",
  },
];

export default function PlacesMap() {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 40.4168,
        longitude: -3.7038,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >
      {PLACES.map((place) => (
        <Marker
          key={place.id}
          coordinate={{ latitude: place.lat, longitude: place.lng }}
        >
          <View className="bg-surface rounded-full p-2 border-2 border-primary">
            <Text className="text-2xl">{place.emoji}</Text>
          </View>
          <Callout>
            <View className="w-[200px] p-2">
              <Text className="font-bold text-base">{place.name}</Text>
              <Text className="text-slate-500 text-sm">{place.desc}</Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}
```

### Ejemplo 3: Tracking en Tiempo Real

```tsx
import { useEffect, useState } from "react";
import * as Location from "expo-location";

function useLocationTracking() {
  const [positions, setPositions] = useState<Location.LocationObjectCoords[]>(
    [],
  );
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;
    if (isTracking) {
      (async () => {
        sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (loc) => setPositions((prev) => [...prev, loc.coords]),
        );
      })();
    }
    return () => {
      sub?.remove();
    };
  }, [isTracking]);

  return {
    positions,
    isTracking,
    start: () => setIsTracking(true),
    stop: () => setIsTracking(false),
  };
}
```

---

## 📝 Ejercicios

### Ejercicio 1: Buscador de Lugares

Input + geocoding para buscar dirección y mostrar marcador.

### Ejercicio 2: App de Running

Tracking GPS + ruta con `Polyline` + distancia y velocidad.

### Ejercicio 3: Geofencing

Zonas circulares en el mapa. Notificar al entrar/salir.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica   | ❌ Malo                     | ✅ Bueno                                                        |
| ---------- | --------------------------- | --------------------------------------------------------------- |
| API Key    | API key en el código        | Variables de entorno + restricciones en Google Cloud            |
| Markers    | 100+ markers individuales   | Clustering con `react-native-map-clustering`                    |
| Re-renders | `initialRegion` cambiando   | `initialRegion` solo una vez, `animateToRegion` para movimiento |
| Permisos   | Pedir location sin contexto | Explicar para qué usas la ubicación                             |
| Background | Location siempre activo     | Solo activar cuando es necesario, respetar batería              |
| Geocoding  | Geocodificar en cada render | Cache de resultados de geocoding                                |

### Rendimiento del Mapa

```tsx
// ✅ Clustering para muchos markers
import MapView from "react-native-map-clustering";

<MapView
  clusterColor="#7c3aed"
  radius={50} // Radio de clustering en pixels
  minZoomLevel={3}
  maxZoomLevel={20}
>
  {markers.map((m) => (
    <Marker key={m.id} coordinate={m} />
  ))}
</MapView>;

// ✅ Animar movimiento en vez de cambiar region
mapRef.current?.animateToRegion(newRegion, 500);

// ❌ Nunca re-renderizar todo el mapa
// <MapView region={stateQueCalbia} />  ← Re-render constante
```

---

## ✅ Checklist

- [ ] Sé solicitar permisos de ubicación
- [ ] Puedo mostrar un mapa con ubicación actual
- [ ] Sé agregar marcadores y callouts personalizados
- [ ] Entiendo `watchPositionAsync` para tracking
- [ ] Puedo dibujar rutas con `Polyline`
