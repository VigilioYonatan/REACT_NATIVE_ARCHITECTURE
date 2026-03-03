# Expo Notifications

> **Push** y **local notifications** — programar, permisos, categorías, y manejo de respuestas.

## 📦 Instalación

```bash
npx expo install expo-notifications expo-device expo-constants
```

---

## 💻 Ejemplos

### 1. Setup + Permisos

```tsx
// hooks/useNotifications.ts
import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    registerForPush().then((token) => token && setExpoPushToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("📩 Recibida:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("👆 Abierta:", data);
        // Navegar según data.screen, etc.
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return { expoPushToken };
}

async function registerForPush(): Promise<string | undefined> {
  if (!Device.isDevice) {
    console.log("Push solo funciona en dispositivo real");
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  return token;
}
```

### 2. Notificación Local

```tsx
import * as Notifications from "expo-notifications";
import { View, Text, Pressable } from "react-native";

export default function LocalNotifDemo() {
  const sendNow = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Hola! 👋",
        body: "Esta es una notificación local",
        data: { screen: "home" },
        sound: "default",
      },
      trigger: null, // Inmediata
    });
  };

  const sendDelayed = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Recordatorio",
        body: "Han pasado 10 segundos",
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
      },
    });
  };

  const sendDaily = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "☀️ Buenos días",
        body: "No olvides revisar tus tareas",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
      },
    });
  };

  const cancelAll = () => Notifications.cancelAllScheduledNotificationsAsync();

  return (
    <View className="flex-1 bg-background p-6 pt-16 gap-4">
      <Pressable onPress={sendNow} className="bg-primary p-4 rounded-xl">
        <Text className="text-white font-semibold text-center">
          🔔 Enviar Ahora
        </Text>
      </Pressable>
      <Pressable onPress={sendDelayed} className="bg-blue-500 p-4 rounded-xl">
        <Text className="text-white font-semibold text-center">
          ⏰ En 10 segundos
        </Text>
      </Pressable>
      <Pressable onPress={sendDaily} className="bg-green-500 p-4 rounded-xl">
        <Text className="text-white font-semibold text-center">
          📅 Diaria 9:00AM
        </Text>
      </Pressable>
      <Pressable onPress={cancelAll} className="bg-red-500/20 p-4 rounded-xl">
        <Text className="text-red-400 font-semibold text-center">
          ❌ Cancelar todas
        </Text>
      </Pressable>
    </View>
  );
}
```

---

## 🔗 Links

- [Documentación oficial](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Push Notifications guide](https://docs.expo.dev/push-notifications/overview/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica   | ❌ Malo                          | ✅ Bueno                                            |
| ---------- | -------------------------------- | --------------------------------------------------- |
| Permisos   | Pedir al abrir la app            | Pedir en contexto (después de onboarding)           |
| Token      | Token hardcodeado o ignorado     | Sincronizar con backend en cada app start           |
| Foreground | No manejar notificaciones in-app | `setNotificationHandler` para control total         |
| Categorías | Un solo canal para todo          | Canales separados: chat, marketing, sistema         |
| Data       | Solo mostrar texto               | Usar `data` para deep linking a pantalla específica |

---

## ✅ Checklist

- [ ] Sé registrar para push notifications y obtener token
- [ ] Puedo enviar notificaciones locales inmediatas y programadas
- [ ] Sé manejar respuestas cuando el usuario toca la notificación
- [ ] Entiendo canales de Android y permisos
