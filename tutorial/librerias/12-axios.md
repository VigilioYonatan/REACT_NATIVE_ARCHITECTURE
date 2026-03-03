# Axios

> Cliente HTTP basado en **promesas** — interceptors, cancelación, timeout, y transformación automática de JSON.

## 📦 Instalación

```bash
npm install axios
```

---

## 🔑 Axios vs Fetch

| Característica  | fetch               | Axios                 |
| --------------- | ------------------- | --------------------- |
| JSON automático | ❌ (`.json()`)      | ✅                    |
| Interceptors    | ❌                  | ✅                    |
| Timeout         | Manual              | `timeout: 5000`       |
| Errores HTTP    | Solo errores de red | ✅ Status ≥ 400       |
| Cancelación     | `AbortController`   | `AbortController`     |
| Progreso upload | ❌                  | ✅ `onUploadProgress` |

---

## 💻 Ejemplos

### 1. Instancia Configurada

```tsx
// lib/api.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://api.ejemplo.com/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — agregar token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado — redirigir a login
      AsyncStorage.removeItem("auth_token");
    }
    return Promise.reject(error);
  },
);

export default api;
```

### 2. CRUD Completo

```tsx
import api from "@/lib/api";

// GET
const getUsers = () => api.get("/users");
const getUser = (id: number) => api.get(`/users/${id}`);

// POST
const createUser = (data: { name: string; email: string }) =>
  api.post("/users", data);

// PUT
const updateUser = (
  id: number,
  data: Partial<{ name: string; email: string }>,
) => api.put(`/users/${id}`, data);

// DELETE
const deleteUser = (id: number) => api.delete(`/users/${id}`);

// Query params
const searchUsers = (query: string, page: number) =>
  api.get("/users", { params: { q: query, page, limit: 20 } });
```

### 3. Upload con Progreso

```tsx
import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import api from "@/lib/api";

export default function UploadDemo() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const upload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (result.canceled) return;

    const formData = new FormData();
    formData.append("file", {
      uri: result.assets[0].uri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);

    setUploading(true);
    try {
      await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / (e.total ?? 1)));
        },
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      <Pressable
        onPress={upload}
        className="bg-primary px-8 py-4 rounded-2xl mb-6"
      >
        <Text className="text-white font-semibold">📤 Subir Imagen</Text>
      </Pressable>
      {uploading && (
        <View className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
          <View
            className="bg-primary h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
      )}
      {uploading && <Text className="text-primary mt-2">{progress}%</Text>}
    </View>
  );
}
```

### 4. Cancelación

```tsx
import axios from "axios";

const controller = new AbortController();

const fetchData = async () => {
  try {
    const { data } = await api.get("/search", {
      params: { q: "react" },
      signal: controller.signal,
    });
    return data;
  } catch (err) {
    if (axios.isCancel(err)) console.log("Cancelled");
  }
};

// Cancelar:
controller.abort();
```

---

## 🔗 Links

- [Documentación oficial](https://axios-http.com/)
- [GitHub](https://github.com/axios/axios)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica     | ❌ Malo                      | ✅ Bueno                                    |
| ------------ | ---------------------------- | ------------------------------------------- |
| Instancia    | `axios.get()` directo        | Instancia centralizada con `axios.create()` |
| Interceptors | Token manual en cada request | Interceptor de request que inyecta token    |
| Errores      | `catch(() => {})` silencioso | Interceptor de response con manejo global   |
| Cancel       | No cancelar requests         | `AbortController` en useEffect cleanup      |
| Retry        | Sin retry                    | `axios-retry` con exponential backoff       |
| Timeout      | Timeout infinito             | `timeout: 10000` (10s) como default         |

---

## ✅ Checklist

- [ ] Sé crear una instancia configurada de Axios
- [ ] Puedo usar interceptors para auth y errores
- [ ] Sé hacer CRUD (GET/POST/PUT/DELETE)
- [ ] Puedo subir archivos con progreso
- [ ] Sé cancelar peticiones con AbortController
