# Expo Updates — OTA

> Actualizar tu app **sin pasar por las stores** — hot fixes, content updates, y rollbacks instantáneos.

## 📦 Instalación

```bash
npx expo install expo-updates
```

---

## 🔑 ¿Cómo funciona?

```
Publicar update → Expo CDN → App detecta update → Descarga JS bundle → Siguiente apertura usa el nuevo código
```

> El OTA update **NO puede** cambiar código nativo (módulos nativos, permisos, etc). Solo JavaScript/TypeScript.

---

## 💻 Ejemplos

### 1. Publicar un Update

```bash
# Con EAS
eas update --branch production --message "Fix typo en login"

# Ver updates publicados
eas update:list
```

### 2. Verificar Updates en la App

```tsx
import { View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import * as Updates from "expo-updates";
import { useState } from "react";

export default function UpdateChecker() {
  const [checking, setChecking] = useState(false);

  const checkUpdate = async () => {
    setChecking(true);
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        Alert.alert("🆕 Actualización disponible", "¿Descargar e instalar?", [
          { text: "Después", style: "cancel" },
          {
            text: "Actualizar",
            onPress: async () => {
              await Updates.fetchUpdateAsync();
              Alert.alert("✅ Descargado", "Reiniciando...", [
                { text: "OK", onPress: () => Updates.reloadAsync() },
              ]);
            },
          },
        ]);
      } else {
        Alert.alert("✅ Todo al día", "Tienes la última versión");
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo verificar actualizaciones");
    } finally {
      setChecking(false);
    }
  };

  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      <Text className="text-slate-400 text-sm mb-2">
        Canal: {Updates.channel ?? "N/A"}
      </Text>
      <Text className="text-slate-400 text-sm mb-6">
        ID: {Updates.updateId ?? "Embedded"}
      </Text>
      <Pressable
        onPress={checkUpdate}
        disabled={checking}
        className={`px-8 py-4 rounded-2xl ${checking ? "bg-primary/50" : "bg-primary"}`}
      >
        {checking ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold">
            🔄 Buscar Actualizaciones
          </Text>
        )}
      </Pressable>
    </View>
  );
}
```

### 3. Auto-Update al Abrir

```tsx
// app/_layout.tsx
import * as Updates from "expo-updates";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    if (!__DEV__) {
      checkForUpdates();
    }
  }, []);

  return <Stack />;
}

async function checkForUpdates() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync(); // Reinicia con el nuevo código
    }
  } catch (e) {
    // Silenciar en producción
  }
}
```

---

## 🔗 Links

- [Documentación oficial](https://docs.expo.dev/versions/latest/sdk/updates/)
- [EAS Update guide](https://docs.expo.dev/eas-update/introduction/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica | ❌ Malo                             | ✅ Bueno                                     |
| -------- | ----------------------------------- | -------------------------------------------- |
| UX       | Forzar update con restart inmediato | Mostrar banner/modal y dejar al user decidir |
| Channels | Todo en production                  | `preview` → `staging` → `production`         |
| Rollback | Sin plan de rollback                | `eas update:republish` para revertir         |
| Testing  | Deploy directo a production         | Testear en staging channel primero           |
| Size     | OTA update de 50MB                  | Solo JS bundle (sin assets nativos pesados)  |

---

## ✅ Checklist

- [ ] Entiendo qué puedo actualizar vía OTA (solo JS, no nativo)
- [ ] Sé publicar updates con `eas update`
- [ ] Puedo verificar updates desde la app
- [ ] Sé implementar auto-update al abrir la app
