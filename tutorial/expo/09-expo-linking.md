# Expo Linking — Deep Links y Universal Links

> Abrir URLs, **deep links**, universal links, y manejar esquemas de URL personalizados.

## 📦 Instalación

```bash
npx expo install expo-linking
```

---

## 💻 Ejemplos

### 1. Abrir URLs Externas

```tsx
import { View, Text, Pressable, Linking } from "react-native";
import * as ExpoLinking from "expo-linking";

export default function LinkingDemo() {
  return (
    <View className="flex-1 bg-background p-6 pt-16 gap-4">
      <Text className="text-2xl font-bold text-white mb-4">Linking 🔗</Text>

      <Pressable
        onPress={() => Linking.openURL("https://expo.dev")}
        className="bg-surface p-4 rounded-xl border border-slate-700"
      >
        <Text className="text-white">🌐 Abrir Web</Text>
      </Pressable>

      <Pressable
        onPress={() => Linking.openURL("tel:+5215512345678")}
        className="bg-surface p-4 rounded-xl border border-slate-700"
      >
        <Text className="text-white">📞 Llamar</Text>
      </Pressable>

      <Pressable
        onPress={() => Linking.openURL("mailto:hola@ejemplo.com?subject=Hola")}
        className="bg-surface p-4 rounded-xl border border-slate-700"
      >
        <Text className="text-white">📧 Email</Text>
      </Pressable>

      <Pressable
        onPress={() => Linking.openURL("sms:+5215512345678")}
        className="bg-surface p-4 rounded-xl border border-slate-700"
      >
        <Text className="text-white">💬 SMS</Text>
      </Pressable>

      <Pressable
        onPress={() => Linking.openSettings()}
        className="bg-surface p-4 rounded-xl border border-slate-700"
      >
        <Text className="text-white">⚙️ Abrir Settings</Text>
      </Pressable>
    </View>
  );
}
```

### 2. Configurar Deep Links

```json
// app.json
{
  "expo": {
    "scheme": "miapp",
    "ios": {
      "associatedDomains": ["applinks:miapp.com"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            { "scheme": "https", "host": "miapp.com", "pathPrefix": "/" }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

```tsx
// Generar URL de deep link
const url = ExpoLinking.createURL("user/42");
// En desarrollo: exp://192.168.1.5:8081/--/user/42
// En producción: miapp://user/42

// Leer URL que abrió la app
const handleDeepLink = async () => {
  const url = await ExpoLinking.getInitialURL();
  if (url) console.log("App abierta con:", url);
};

// Escuchar deep links mientras la app está abierta
ExpoLinking.addEventListener("url", ({ url }) => {
  console.log("Deep link recibido:", url);
});
```

### 3. Deep Links con Expo Router

```tsx
// Expo Router maneja deep links automáticamente!
// miapp://user/42 → app/user/[id].tsx con id="42"
// miapp://settings → app/settings/index.tsx

// Para universal links (https://miapp.com/user/42):
// Configura associatedDomains (iOS) e intentFilters (Android) en app.json
// Expo Router resuelve la ruta automáticamente
```

---

## 🔗 Links

- [Documentación oficial](https://docs.expo.dev/versions/latest/sdk/linking/)
- [Deep Linking guide](https://docs.expo.dev/guides/deep-linking/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica        | ❌ Malo                            | ✅ Bueno                                         |
| --------------- | ---------------------------------- | ------------------------------------------------ |
| Scheme          | No configurar scheme               | `scheme` en `app.json` desde el inicio           |
| Universal links | Solo deep links con scheme         | Universal links (HTTPS) para producción          |
| Fallback        | App crash si URL no se puede abrir | `canOpenURL` antes de `openURL`                  |
| Testing         | No testear deep links              | `npx uri-scheme open myapp://` para testing      |
| Handler         | No manejar URLs entrantes          | `Linking.addEventListener('url')` en layout raíz |

---

## ✅ Checklist

- [ ] Sé abrir URLs, teléfono, email, SMS y settings
- [ ] Puedo configurar scheme personalizado en `app.json`
- [ ] Entiendo Deep Links vs Universal Links
- [ ] Sé que Expo Router maneja deep links automáticamente
