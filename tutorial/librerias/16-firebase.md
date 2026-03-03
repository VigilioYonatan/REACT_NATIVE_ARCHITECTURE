# React Native Firebase

> SDKs nativos de **Firebase** — Auth, Firestore, Storage, Cloud Messaging, Analytics, Crashlytics.

## 📦 Instalación

```bash
npx expo install @react-native-firebase/app
npx expo install @react-native-firebase/auth
npx expo install @react-native-firebase/firestore
npx expo install @react-native-firebase/storage
npx expo install @react-native-firebase/messaging
```

> ⚠️ Requiere **custom dev client** (no funciona en Expo Go).

### Configurar en Expo

```json
// app.json
{
  "expo": {
    "plugins": ["@react-native-firebase/app", "@react-native-firebase/auth"],
    "ios": { "googleServicesFile": "./GoogleService-Info.plist" },
    "android": { "googleServicesFile": "./google-services.json" }
  }
}
```

---

## 💻 Ejemplos

### 1. Authentication (Email/Password)

```tsx
import auth from "@react-native-firebase/auth";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert("✅ Cuenta creada");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      Alert.alert("✅ Sesión iniciada");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => auth().signOut();

  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <Text className="text-3xl font-bold text-white text-center mb-8">
        🔥 Firebase Auth
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#475569"
        keyboardType="email-address"
        autoCapitalize="none"
        className="bg-surface p-4 rounded-xl text-white mb-3 border border-slate-700"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        placeholderTextColor="#475569"
        secureTextEntry
        className="bg-surface p-4 rounded-xl text-white mb-6 border border-slate-700"
      />

      <Pressable
        onPress={signIn}
        disabled={loading}
        className={`py-4 rounded-xl items-center mb-3 ${loading ? "bg-primary/50" : "bg-primary"}`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold">Iniciar Sesión</Text>
        )}
      </Pressable>
      <Pressable
        onPress={signUp}
        className="py-4 rounded-xl items-center bg-surface border border-primary"
      >
        <Text className="text-primary font-semibold">Crear Cuenta</Text>
      </Pressable>
    </View>
  );
}
```

### 2. Auth State Listener

```tsx
import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export function useFirebaseAuth() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
```

### 3. Firestore CRUD

```tsx
import firestore from "@react-native-firebase/firestore";

interface Todo {
  id?: string;
  title: string;
  done: boolean;
  createdAt: Date;
}

// CREATE
const addTodo = (title: string) =>
  firestore().collection("todos").add({
    title,
    done: false,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

// READ (real-time)
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("todos")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        setTodos(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Todo),
        );
      });
    return unsubscribe;
  }, []);

  return todos;
}

// UPDATE
const toggleTodo = (id: string, done: boolean) =>
  firestore().doc(`todos/${id}`).update({ done: !done });

// DELETE
const deleteTodo = (id: string) => firestore().doc(`todos/${id}`).delete();
```

### 4. Storage — Upload Image

```tsx
import storage from "@react-native-firebase/storage";
import * as ImagePicker from "expo-image-picker";

async function uploadImage(): Promise<string> {
  const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
  if (result.canceled) throw new Error("Cancelado");

  const uri = result.assets[0].uri;
  const filename = `images/${Date.now()}.jpg`;
  const ref = storage().ref(filename);

  await ref.putFile(uri);
  const downloadURL = await ref.getDownloadURL();
  return downloadURL;
}
```

### 5. Push Notifications (FCM)

```tsx
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";

export function useFirebasePush() {
  useEffect(() => {
    const setup = async () => {
      // Pedir permisos
      if (Platform.OS === "android" && Platform.Version >= 33) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }
      const authStatus = await messaging().requestPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED;

      if (enabled) {
        const token = await messaging().getToken();
        console.log("FCM Token:", token);
        // Enviar token al backend
      }
    };
    setup();

    // Foreground messages
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        remoteMessage.notification?.title ?? "Notificación",
        remoteMessage.notification?.body ?? "",
      );
    });

    return unsubscribe;
  }, []);
}
```

---

## 🔗 Links

- [React Native Firebase docs](https://rnfirebase.io/)
- [GitHub](https://github.com/invertase/react-native-firebase)
- [Firebase Console](https://console.firebase.google.com/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica  | ❌ Malo                            | ✅ Bueno                                                         |
| --------- | ---------------------------------- | ---------------------------------------------------------------- |
| Reads     | Leer colección completa cada vez   | Queries con `where` + `limit` + paginación                       |
| Listeners | `onSnapshot` sin cleanup           | Siempre guardar `unsubscribe` y llamar en cleanup                |
| Security  | Rules `allow read, write: if true` | Rules estrictas con auth + validación                            |
| Config    | API keys en código                 | `google-services.json` / `GoogleService-Info.plist`              |
| Offline   | Sin offline support                | `enablePersistence()` en Firestore                               |
| Bundle    | Importar todo Firebase             | Solo importar módulos necesarios (`@react-native-firebase/auth`) |

---

## ✅ Checklist

- [ ] Sé configurar Firebase con Expo (custom dev client)
- [ ] Puedo autenticar con email/password y Google
- [ ] Sé hacer CRUD en Firestore con real-time listeners
- [ ] Puedo subir archivos a Firebase Storage
- [ ] Sé configurar push notifications con FCM
