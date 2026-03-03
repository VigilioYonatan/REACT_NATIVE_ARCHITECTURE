# 04 — Push Notifications

## 🎯 Objetivo

Implementar **notificaciones push** con `expo-notifications`: permisos, tokens, y manejo de notificaciones en foreground/background.

---

## 📚 Teoría

### Instalación

```bash
npx expo install expo-notifications expo-device expo-constants
```

### Tipos de Notificaciones

| Tipo           | Descripción                        |
| -------------- | ---------------------------------- |
| **Local**      | Programadas desde la propia app    |
| **Push**       | Enviadas desde un servidor externo |
| **Foreground** | Recibida con la app abierta        |
| **Background** | Recibida con la app cerrada        |

---

## 💻 Código Práctico

### Ejemplo 1: Setup Completo

```tsx
import { View, Text, Pressable, Platform } from "react-native";
import { useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotifications() {
  if (!Device.isDevice) {
    alert("Requiere dispositivo físico");
    return null;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Permiso denegado");
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }
  return token;
}

export default function NotificationsDemo() {
  const [token, setToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const notifListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    registerForPushNotifications().then(setToken);

    notifListener.current =
      Notifications.addNotificationReceivedListener(setNotification);
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((r) => {
        console.log("🔔 Tocó notificación:", r.notification.request.content);
      });

    return () => {
      notifListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const sendLocal = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Hola! 👋",
        body: "Notificación local",
        data: { screen: "home" },
      },
      trigger: {
        seconds: 2,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      },
    });
  };

  return (
    <View className="flex-1 bg-background p-5 pt-16">
      <Text className="text-3xl font-bold text-white mb-6">
        🔔 Notificaciones
      </Text>
      <Text className="text-slate-500 text-xs mb-1">Token:</Text>
      <Text className="text-primary text-xs font-mono mb-6" numberOfLines={2}>
        {token ?? "Obteniendo..."}
      </Text>

      {notification && (
        <View className="bg-surface p-4 rounded-xl mb-6 border-l-4 border-green-500">
          <Text className="text-white font-semibold">
            {notification.request.content.title}
          </Text>
          <Text className="text-slate-400 text-sm mt-1">
            {notification.request.content.body}
          </Text>
        </View>
      )}

      <Pressable
        onPress={sendLocal}
        className="bg-primary py-4 rounded-xl items-center active:opacity-80"
      >
        <Text className="text-white font-semibold text-base">
          Enviar Notificación Local (2s)
        </Text>
      </Pressable>
    </View>
  );
}
```

### Ejemplo 2: Notificación Programada

```tsx
const scheduleReminder = async (
  title: string,
  body: string,
  minutesFromNow: number,
) => {
  return await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: "default" },
    trigger: {
      seconds: minutesFromNow * 60,
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    },
  });
};

const cancelAll = () => Notifications.cancelAllScheduledNotificationsAsync();
```

---

## 📝 Ejercicios

### Ejercicio 1: Recordatorio de Hidratación

Notificaciones cada 30 min: "💧 Hora de beber agua". Toggle on/off.

### Ejercicio 2: Chat con Notificaciones

Al recibir "mensaje" simulado, notificación con nombre de remitente. Al tocar → pantalla de chat.

### Ejercicio 3: Categorías

Diferentes canales Android: urgente, social, promo. Cada tipo con sonido diferente.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica   | ❌ Malo                          | ✅ Bueno                                               |
| ---------- | -------------------------------- | ------------------------------------------------------ |
| Token      | Guardar token solo local         | Sincronizar token con backend en cada login            |
| Refresh    | Asumir token nunca cambia        | Re-registrar en cada apertura de app                   |
| Foreground | No manejar notificaciones in-app | `setNotificationHandler` para control total            |
| Categorías | Todas igual                      | Canales Android por tipo (chat, marketing, sistema)    |
| Permisos   | Pedir permiso al abrir la app    | Pedir en contexto (ej: después de completar un pedido) |
| Deep link  | Abrir siempre al home            | Usar `data` para navegar a la pantalla correcta        |

### Gestión de Tokens

```tsx
// ✅ Patrón completo de gestión de token
// 1. Obtener token al iniciar
// 2. Enviar al backend con userId
// 3. Actualizar si cambia
// 4. Limpiar al cerrar sesión

useEffect(() => {
  const sub = Notifications.addPushTokenListener(({ data }) => {
    // Token cambió — actualizar en backend
    api.put("/users/me/push-token", { token: data });
  });
  return () => sub.remove();
}, []);
```

---

## ✅ Checklist

- [ ] Sé configurar `expo-notifications` y solicitar permisos
- [ ] Puedo obtener el Expo Push Token
- [ ] Sé enviar notificaciones locales programadas
- [ ] Puedo manejar notificaciones en foreground y background
- [ ] Sé configurar canales de Android
