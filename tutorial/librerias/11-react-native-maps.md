# React Native Maps

> **Mapas nativos** (Google Maps / Apple Maps) con marcadores, polilíneas, callouts y geolocalización.

## 📦 Instalación

```bash
npx expo install react-native-maps expo-location
```

### Configurar API Key (Google Maps)

```json
// app.json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": { "apiKey": "AIza..." }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "AIza..."
      }
    }
  }
}
```

---

## 💻 Ejemplos

### 1. Mapa con Ubicación Actual

```tsx
import { View, Text, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

export default function MapaBasico() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  if (!location)
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }}
      initialRegion={{ ...location, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
      showsUserLocation
      showsMyLocationButton
    >
      <Marker coordinate={location} title="Mi ubicación" pinColor="#7c3aed" />
    </MapView>
  );
}
```

### 2. Marcadores Custom + Callouts

```tsx
import MapView, { Marker, Callout } from "react-native-maps";
import { View, Text } from "react-native";

const PLACES = [
  {
    id: 1,
    name: "Café ☕",
    lat: 19.4326,
    lng: -99.1332,
    desc: "El mejor café",
  },
  { id: 2, name: "Parque 🌳", lat: 19.435, lng: -99.138, desc: "Naturaleza" },
  { id: 3, name: "Museo 🎨", lat: 19.429, lng: -99.13, desc: "Arte moderno" },
];

export default function CustomMarkers() {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 19.4326,
        longitude: -99.1332,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >
      {PLACES.map((p) => (
        <Marker key={p.id} coordinate={{ latitude: p.lat, longitude: p.lng }}>
          <View className="bg-primary rounded-full p-2 border-2 border-white">
            <Text className="text-lg">{p.name.split(" ")[1]}</Text>
          </View>
          <Callout>
            <View className="w-[180px] p-2">
              <Text className="font-bold text-base">{p.name}</Text>
              <Text className="text-slate-500 text-sm">{p.desc}</Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
}
```

### 3. Ruta con Polyline

```tsx
import MapView, { Polyline, Marker } from "react-native-maps";

const ROUTE = [
  { latitude: 19.4326, longitude: -99.1332 },
  { latitude: 19.434, longitude: -99.135 },
  { latitude: 19.436, longitude: -99.134 },
  { latitude: 19.438, longitude: -99.136 },
];

export default function RouteMap() {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{ ...ROUTE[0], latitudeDelta: 0.02, longitudeDelta: 0.02 }}
    >
      <Polyline coordinates={ROUTE} strokeColor="#7c3aed" strokeWidth={4} />
      <Marker coordinate={ROUTE[0]} pinColor="green" title="Inicio" />
      <Marker coordinate={ROUTE[ROUTE.length - 1]} pinColor="red" title="Fin" />
    </MapView>
  );
}
```

---

## 🔗 Links

- [GitHub](https://github.com/react-native-maps/react-native-maps)
- [Expo docs](https://docs.expo.dev/versions/latest/sdk/map-view/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica       | ❌ Malo                               | ✅ Bueno                                                 |
| -------------- | ------------------------------------- | -------------------------------------------------------- |
| API Key        | Key expuesta en código                | Restringir por package/bundle ID en Google Cloud Console |
| Markers        | Renderizar 500+ markers               | Clustering o mostrar solo los visibles en la región      |
| Performance    | `region` como state que cambia        | `initialRegion` fijo + `animateToRegion()`               |
| Custom markers | Markers complejos con muchos children | Pre-renderizar markers como imágenes                     |
| Permisos       | No verificar `canAskAgain`            | UX de permisos completa con fallback a Settings          |

---

## ✅ Checklist

- [ ] Sé configurar API keys para Google Maps
- [ ] Puedo mostrar mapa con ubicación actual
- [ ] Sé crear marcadores custom y callouts
- [ ] Puedo dibujar rutas con `Polyline`
- [ ] Entiendo `Region` y cómo centrar el mapa
