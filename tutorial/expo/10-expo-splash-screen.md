# Expo SplashScreen

> Controla la **pantalla de inicio** — mantenla visible hasta que tu app esté lista (fonts, data, auth).

## 📦 Instalación

```bash
npx expo install expo-splash-screen
```

---

## 💻 Ejemplos

### 1. Mantener Splash Mientras Carga

```tsx
// app/_layout.tsx
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

// Evitar que el splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("@/assets/fonts/Inter-Regular.ttf"),
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Cargar datos iniciales, verificar auth, etc.
        await loadInitialData();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (appReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [appReady, fontsLoaded]);

  if (!appReady || !fontsLoaded) return null;

  return <Stack />;
}

async function loadInitialData() {
  // Simular carga
  await new Promise((r) => setTimeout(r, 1000));
}
```

### 2. Configurar Splash Screen

```json
// app.json
{
  "expo": {
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#0f0d23"
    },
    "ios": {
      "splash": {
        "image": "./assets/splash-icon.png",
        "resizeMode": "contain",
        "backgroundColor": "#0f0d23",
        "dark": {
          "image": "./assets/splash-icon-dark.png",
          "backgroundColor": "#000000"
        }
      }
    },
    "android": {
      "splash": {
        "image": "./assets/splash-icon.png",
        "resizeMode": "contain",
        "backgroundColor": "#0f0d23"
      }
    }
  }
}
```

---

## 🔑 API

| Método                   | Descripción                         |
| ------------------------ | ----------------------------------- |
| `preventAutoHideAsync()` | Evita que se oculte automáticamente |
| `hideAsync()`            | Oculta el splash manualmente        |
| `setOptions({})`         | Configura fade, duration, etc.      |

---

## 🔗 Links

- [Documentación oficial](https://docs.expo.dev/versions/latest/sdk/splash-screen/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica  | ❌ Malo                    | ✅ Bueno                                                |
| --------- | -------------------------- | ------------------------------------------------------- |
| Duración  | Splash visible 5+ segundos | Mínimo necesario para cargar fonts + auth check         |
| Fonts     | Cargar fonts sin splash    | `preventAutoHideAsync()` + cargar fonts → `hideAsync()` |
| Animación | Ocultar de golpe           | `SplashScreen.hideAsync()` con animación de transición  |
| Imagen    | PNG pesado de 5MB          | PNG optimizado < 200KB con dimensiones correctas        |

---

## ✅ Checklist

- [ ] Sé usar `preventAutoHideAsync` y `hideAsync`
- [ ] Puedo esperar a que fonts y data estén listos antes de ocultar
- [ ] Sé configurar splash image y backgroundColor en `app.json`
