# 🏗️ PROMPT 1) Arquitectura del Proyecto — React Native Expo

> [!NOTE]
> Este archivo no debe ser modificado por ti.
> Prioriza usar "satisfies" que "as" en typescript. Importante.
> Lógica específica, convenciones y reglas propias del proyecto.
> Recuerda que `docs/rules/*.md` son el corazón de todo el proyecto. De ahí sacarás toda la información para realizar todo, manteniéndote **100% fiel** a `docs/rules/*.md`.
> Si sientes que al crear una función se puede reutilizar, usa `infrastructure/utils` dependiendo de la funcionalidad. Si solo pertenece a un módulo, no la pongas en `infrastructure/utils`, solo en ese módulo.
> En React Native todo se ejecuta en el cliente. Verifica si existe una función similar antes de crearla (ejemplo: `slugify` para slugs).
> Agrega interactividad: agrega onPress, onChange, y que tenga funcionalidad, que tenga sentido y no dejar vacíos.
> Tipar todas las variables y cuando tipes usar los Schemas claro si lo necesitas no crear tipos objetos por querer y no poner código duro hardocode, por ejemplo tiene un Picker los values de ese picker deben ser tipados del schema claro si se está usando ENUMS o number según sea el caso, eso se llama no escribir código duro. usar const y poner en archivo .const.ts
> Procura usar useRef de React en vez de manipulación directa. Importa useRef de react.
> Las pantallas usan expo-router para la navegación. Nada de rutas web ni .astro.
> Pon accesibilidad: accessibilityLabel, accessibilityRole, accessibilityHint en botones e interactivos. Sigue buenas prácticas de accesibilidad en React Native.
> Importante: separa store.tsx y update.tsx al crear formularios, no pueden ir juntos, es decir, diferentes componentes.

## 🏆 REGLAS DE ORO (MANDATORIO)

> **Reutilización (DRY):** Evita código repetido. Guárdalo en `utils`.

> **Utilizar las variables de estilo (OBLIGATORIO):**
> Ten cuidado con los overflow y los heights en React Native.
> No harcodear tipos, heredar de los .schemas.ts Pick<ExampleSchema> o Omit<ExampleSchema>, ExampleSchema["field"], pero nunca harcodees tipos osea nada de as "PORTFOLIO_PROJECT" | "BLOG_POST" sino usa ExampleSchema["techeable_type"], es un ejemplo.
> **NO PONGAS ANTIGRAVITY** No escribas antigravity en el estilo ni componentes, ningún lado.
> **LOS NOMBRES DE LOS COMPONENTES EN MINUSCULAS** ejemplo example.store.tsx, example.update.tsx, example.index.tsx, example.show.tsx, example-list.tsx, etc.
> **Usar useSignal/useReducer (OBLIGATORIO para React Native)** En React Native usamos Signals para estado local reactivo. Para estado global usa Zustand.

```ts
// Correcto - Estado local
const state = useSignal<StateExample>({
  isOpen: false,
  isLoading: false,
  data: [],
});

// Correcto - Estado global con Zustand
const useExampleStore = create<StateExample>((set) => ({
  isOpen: false,
  isLoading: false,
  data: [],
  setOpen: (val: boolean) => set({ isOpen: val }),
}));
```

> **NO CREES archivos .css** En React Native se usa StyleSheet.create o NativeWind.

> No uses `Date` o `new Date` (API de JS). Usa `dayjs` importado de `@infrastructure/utils/hybrid/date.utils`. Ahí hay más funciones; si no hay, créala, pero usa dayjs.

> Si usas `<Pressable>` debes usar accessibilityLabel para que funcione correctamente.

// ✅ BIEN: En React Native usar MMKV (Síncrono y rápido)
// /utils/client/storage.ts
import { MMKV } from "react-native-mmkv";
export const storage = new MMKV();

export function getToken() {
return storage.getString("token");
}

````

> No uses `Date` o `new Date` (API de JS). Usa `dayjs` importado de `@infrastructure/utils/hybrid/date.utils`. Ahí hay más funciones; si no hay, créala, pero usa dayjs.

> Las variables deben estar siempre tipadas (`const`, `let`, `var`), sea una propiedad de una clase, etc.

> Recuerda siempre usar `omit`, `pick`, etc. Debe heredar del schema, no crear propiedades por crear.

> **JSDoc en APIs**: No usar `@returns` o `@return` en los comentarios JSDoc de las funciones API (`.api.ts`), ya que los tipos de TypeScript (Generics de `useQuery`/`useMutation`) definen esto explícitamente.

> **Funciones > Arrow Functions**

```typescript
// ❌ NO PARA FUNCIONES GRANDES
const onExampleUpdate = (body: exampleUpdateDto) => { ... }

// ✅ CORRECTO
function onExampleUpdate(body: exampleUpdateDto) { ... }
````

> **Usar useForm y Controller** Usar resolver de zod con react-hook-form

```typescript
// ❌ MAL
const [name, setName] = useState("");
const [email, setEmail] = useState("");

// Esto es mal
<View>
  <TextInput value={name} onChangeText={setName} />
  <TextInput value={email} onChangeText={setEmail} />
</View>

// ✅ BIEN
const exampleStoreForm = useForm<exampleStoreDto>({
  resolver: zodResolver(exampleStoreDto),
});
function onExampleStore(body: exampleStoreDto) { ... }

<FormProvider {...exampleStoreForm}>
  <ControlledInput<exampleStoreDto> name="name" label="Nombre" />
  <ControlledInput<exampleStoreDto> name="email" label="Email" />
</FormProvider>
```

---

### TypeScript Governance

#### Prohibiciones

```typescript
// ❌ PROHIBIDO
const data: any = ...
const items = []
const isOpen = useSignal(false) // falta tipar

// ✅ CORRECTO
const data: unknown = ...
const items: Item[] = []
const isOpen = useSignal<boolean>(false)

// ❌ PROHIBIDO, usar await import
const fs = await import("node:fs/promises")

// ✅ CORRECTO
import fs from "node:fs/promises"
```

#### Tipado Estricto

```typescript
// ❌ Tipos mágicos
type: "group"; // esto es string

// ✅ Union types explícitos
type Type = "group" | "file";

// ❌ Tipos inline en Generics
const view = useSignal<"users" | "roles" | "activity">("users");

// ✅ Correcto (Tipo definido afuera y exportado si es necesario)
export type UserViewMode = "users" | "roles" | "activity";
const view = useSignal<UserViewMode>("users");
```

#### Usa Tipos de Librerías

```typescript
// ❌ NO INVENTES
icon: React.ComponentType<any>;
children: any;

// ✅ USA LOS CORRECTOS
icon: LucideIcon;
children: React.ReactNode;
```

#### Pick/Omit para Tipos Parciales (Heredar de un Schema)

```typescript
// example.schema.ts
export type exampleWithoutPassword = Omit<example, "password">;
export type exampleBasicInfo = Pick<example, "id" | "name" | "email">;
```

---

## 📦 1.1 Stack del Proyecto — FRONTEND REACT NATIVE EXPO

```json
{
  "expo": "~52.x",
  "react": "^19.x",
  "react-native": "~0.76.x",
  "zod": "^4.x",
  "expo-router": "~4.x",
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^5.x",
  "vitest": "^4.x",
  "@vigilio/react-native-fetching": "0.0.1",
  "nativewind": "^4.x",
  "dayjs": "^1.x",
  "lucide-react-native": "latest"
}
```

---

## 🔄 1.2 Antes de Dar Código

1. **Verifica la versión** en `package.json`.
2. **Busca documentación actual** de esa versión.
3. **NO asumas** sintaxis de versiones anteriores.
4. **Pregunta** si no estás seguro.
5. **Dame opciones** si hay varias alternativas.

---

## 🚨 1.3 Nuevas Librerías

**ANTES de sugerir una librería que NO está en `package.json`:**

1. **AVÍSAME** que vas a usar una librería nueva.
2. **EXPLICA** por qué la necesitas.
3. **DAME OPCIONES** si hay alternativas.
4. **ESPERA MI APROBACIÓN** antes de usarla.

### Ejemplo:

```text
⚠️ Para implementar esto necesito una librería nueva:

Opciones:
1. `dayjs` - Ya la tienes instalada ✅. Solo usar dayjs si usas fechas, no usar new Date() la api de js.
2. `luxon` - Más completa pero pesada (~70KB).

¿Cuál prefieres? Recomiendo dayjs que ya está instalada.
```

---

## 📚 1.4 Librerías ya Instaladas

Antes de sugerir instalar algo, verifica si ya existe:

| Funcionalidad     | Librería                                  |
| :---------------- | :---------------------------------------- |
| **Fechas**        | `dayjs`                                   |
| **Validación**    | `zod`                                     |
| **Data Fetching** | `@vigilio/react-native-fetching`          |
| **Testing**       | `vitest` (Unit) + `maestro` (E2E)         |
| **Icons**         | `lucide-react-native`                     |
| **Navigation**    | `expo-router`                             |
| **Forms**         | `react-hook-form` + `@hookform/resolvers` |
| **Storage**       | `react-native-mmkv`                       |
| **Http Client**   | `axios`                                   |

---

## ✅ 1.5 Checklist Pre-Commit

- [ ] No hay `any` en el código.
- [ ] Todos los inputs validados con Zod.
- [ ] Tests pasan: `pnpm test`.
- [ ] Lint pasa: `pnpm lint`.
- [ ] Commit sigue **Conventional Commits**.

---

## 📚 Ejemplos de Código

## 📁 1.6 Estructura de Módulos

```text
modules/
└── feature/
    ├── utils/  # Utilidades
    ├── components/             # Componentes React Native
    ├── dtos/                   # Schemas Zod + types
    ├── apis/                   # APIs (useQuery, useMutation)
    ├── const/                  # Constantes
    ├── hooks/                  # Custom hooks del módulo
    ├── utils/                  # Utilidades
    └── __tests__/              # Tests
        |── product.store.test.tsx
        |── product.index.test.tsx
        |── product.show.test.tsx
        |── product.update.test.tsx
```

## 📚 1.7 Ejemplos de Código

> [!IMPORTANT]
> Si hay schemas que pertenecen al mismo ejemplo (products, categories, brands), como se relacionan entre sí, se crean en la misma carpeta.

```text
modules/
└── products/
    ├── utils/
    ├── dtos/
        ├── product.index.dto.ts
        ├── product.show.dto.ts
        ├── product.store.dto.ts
        ├── product.update.dto.ts
        ├── product.destroy.dto.ts
    ├── schemas/
        ├── product.schema.ts
        ├── brand.schema.ts
        ├── category.schema.ts
    ├── apis/
        ├── product.store.api.ts
        ├── product.update.api.ts
        ├── product.destroy.api.ts
        ├── product.index.api.ts
        ├── product.show.api.ts
    ├── const/
        ├── product.const.ts
    ├── hooks/
        ├── use-product-filters.ts
    ├── components/
        ├── product.store.tsx
        ├── product.update.tsx
        ├── product.index.tsx
        ├── product-list-item.tsx
    |---- __tests__/
```

---

# ⚛️ 2.0 Buenas Prácticas Frontend (React Native Expo)

> Estándares senior para desarrollo frontend con React Native Expo.
> Recuerda que `docs/rules/*.md` son el corazón de todo el proyecto. De ahí sacarás toda la información para realizar todo, manteniéndote **100% fiel** a `docs/rules/*.md`.

---

## 🏛️ 2.1 Stack Tecnológico

- **Runtime**: React Native con Expo
- **State**: `useSignal`, `useReducer`, Zustand (estado global)
- **Routing**: `expo-router` (file-based routing)
- **Icons**: `lucide-react-native`
- **Animations**: `react-native-reanimated` (declarativo, alto rendimiento)
- **Styling**: NativeWind (Tailwind para RN) ó StyleSheet.create

---

## 🎬 2.2 Animaciones Optimizadas con Reanimated

> [!IMPORTANT]
> Usamos `react-native-reanimated` para animaciones de alto rendimiento en el hilo de UI.
> Si ves que estás repitiendo mucho código en componentes, crea un hook reutilizable.

### ❌ NO USAR

- `Animated` de React Native básico para animaciones complejas.

### ✅ OBLIGATORIO

- `react-native-reanimated` para animaciones (se ejecuta en el hilo de UI).

```typescript
// hooks/use-fade-in.ts
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export function useFadeIn(delay: number = 0) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 400 });
      translateX.value = withTiming(0, { duration: 400 });
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return animatedStyle;
}

// Uso
function Card() {
  const fadeStyle = useFadeIn(0.1);
  return (
    <Animated.View style={fadeStyle}>
      <Text>Animated Card</Text>
    </Animated.View>
  );
}
```

### 2.3 Alternativas para Animaciones Simples

```tsx
// ✅ Usar LayoutAnimation para transiciones simples
import { LayoutAnimation } from "react-native";

LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
setState(newState);
```

---

## ⚠️ Reglas Críticas

### 2.6 React Hooks Estándar

```typescript
// ✅ CORRECTO (React Native usa Signals en 2026)
const count = useSignal<number>(0);
```

### 2.7 Evita APIs Web

```typescript
// ❌ NO USAR en React Native
document.querySelector();
window.addEventListener();
localStorage.getItem();

// ✅ CORRECTO
import { MMKV } from "react-native-mmkv";
export const storage = new MMKV();
const ref = useRef<View>(null);
```

### 2.8 Eventos con Lógica

```typescript
// ✅ Inline si es solo 1-2 líneas
onPress={() => {
  count.value = count.value  + 1;
}}

// ✅ Función si es +3 líneas
onPress={onFunctionMoreThanThreeLines}

// ❌ Incorrecto: siempre usar llaves {}
onPress={() => count.value = count.value  + 1}
```

---

## 📝 2.9 Formularios (`useForm` + Zod + Controller)

> [!IMPORTANT]
> **PROHIBIDO DEFINIR DTOS O TIPOS INLINE EN LOS COMPONENTES**.
> Todo tipado de formulario debe provenir de un esquema Zod exportado explícitamente en el archivo `*.schema.ts`. Esto evita duplicación de lógica y asegura que el `resolver` y el tipo de `useForm` estén siempre sincronizados.

### ❌ MAL: Definir tipos `Pick`/`Omit` o tipos inline en el componente

```typescript
// JobStore.tsx
type JobStoreDto = Pick<JobPositionSchema, "title" | "description">;

export function JobStore() {
  const form = useForm<JobStoreDto>({
    resolver: zodResolver(
      jobPositionSchema.pick({ title: true, description: true }), // ESTO es MAL, esto es un dto
    ),
  });
}
```

### ✅ BIEN: Exportar el esquema y el tipo desde el archivo `.dto.ts`

```typescript
// job-position.dto.ts
export const jobPositionStoreDto = jobPositionSchema.pick({
  title: true,
  description: true,
});
export type JobPositionStoreDto = z.infer<typeof jobPositionStoreDto>;

// JobStore.tsx
import {
  jobPositionStoreDto,
  type JobPositionStoreDto,
} from "../schemas/job-position.schema";

export function JobStore() {
  const form = useForm<JobPositionStoreDto>({
    resolver: zodResolver(jobPositionStoreDto),
  });
}
```

### 2.10 Estilos en React Native

```tsx
// ✅ Con NativeWind (Tailwind para RN)
<View className="flex-row gap-4">
  <Text className="text-lg font-bold">Hola</Text>
</View>

// ✅ Con StyleSheet
const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 16 },
  title: { fontSize: 18, fontWeight: "bold" },
});
<View style={styles.container}>
  <Text style={styles.title}>Hola</Text>
</View>

// ❌ NUNCA usar class o className con HTML (esto es web)
<div class="flex gap-4"> // NO EXISTE EN REACT NATIVE
```

---

## 🧩 Arquitectura de Componentes

### 1. Function Declarations

```typescript
// ✅ Mejor stack traces
export function Button() { ... }
```

### 2. Dumb UI

```tsx
// ✅ Sin fetching interno
<ProfileCard data={user} />
```

### 3. Composición con Props

```tsx
<Shell sidebar={<NavMenu />} content={<MainContent />} />
```

### 4. One-Hook Pattern

```typescript
// ❌ Desestructurado
const { data, submit } = useFormController();

// ✅ Objeto completo (más limpio)
const formController = useFormController();
```

### 5. Discriminated Unions

```typescript
type State =
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; error: string };
```

---

## 🚀 Performance

### Lazy Loading en React Native

```typescript
// Screens pesadas con lazy loading
const Settings = React.lazy(() => import("./screens/settings"));

// Componentes pesados
const Chart = React.lazy(() => import("./components/chart"));
```

### Imágenes en React Native

```tsx
// ✅ Usar Image de React Native o expo-image
import { Image } from "expo-image";

<Image
  source={{ uri: printFileWithDimension(props.images, DIMENSION_IMAGE.xs)[0] }}
  style={{ width: 100, height: 100 }}
  contentFit="cover"
  alt={props.name}
/>;

// ❌ INCORRECTO — No usar <img> (es de web)
<img src={url} alt={name} />;
```

### Virtualización (listas largas)

```typescript
// ✅ Usar FlatList para listas largas (SIEMPRE)
// ✅ Usar FlashList para listas largas (SIEMPRE, es 5x-10x más rápido que FlatList)
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={items}
  estimatedItemSize={50}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => <ItemCard data={item} />}
/>;

// ❌ NUNCA usar .map() para listas largas en React Native
{
  items.map((item) => <ItemCard key={item.id} data={item} />);
}
```

### Memoización

```typescript
const handlePress = useCallback(() => ..., []);
const activeUsers = useMemo(() => users.filter(u => u.active), [users]);

| ✅ Cuándo usar | ❌ Cuándo NO usar |
| :--- | :--- |
| Cálculos costosos (filtrar arrays grandes, transformaciones complejas). | Cálculos simples o primitivos (`a + b`, strings simples). |
| Pasar funciones como prop a componentes memorizados (`React.memo`) o `FlashList`. | Funciones que se pasan a componentes nativos simples (`View`, `Text`). |
| Dependencias de `useEffect` que rompen el loop infinito. | Cuando la dependencia cambia frecuentemente y el costo de recrear es bajo. |
| Animaciones (`Reanimated`) que requieren referencias estables. | Optimización prematura (memoizar todo por defecto). |
```

---

### Alertas y Feedback UI (2026 Standards)

```typescript
import { Alert } from "react-native";
import * as Burnt from "burnt"; // Toasts nativos (iOS/Android)

// 1. Feedback Rápido (Toasts) -> Usar Burnt o Sonner
Burnt.toast({
  title: "Operación Exitosa",
  preset: "done", // "error", "heart", "custom"
  message: "Los datos se han guardado correctamente.",
  haptic: "success",
  duration: 2,
});

// 2. Confirmaciones Críticas -> Usar Alert nativa
// El usuario confía más en la UI del sistema para acciones destructivas.
Alert.alert("¿Eliminar elemento?", "Esta acción no se puede deshacer.", [
  { text: "Cancelar", style: "cancel" },
  {
    text: "Eliminar",
    style: "destructive", // Rojo en iOS
    onPress: () => {
      // Lógica de eliminación
    },
  },
]);

// 3. Modales Complejos -> Usar Bottom Sheet
// Ver sección de @gorhom/bottom-sheet
```

````

### @vigilio/react-native-fetching (Compatible con React Native)

```typescript
const showUser = useQuery("/users", getUsers, options);
const { isLoading, data, isSuccess, isFetching, isError, ...rest } = useQuery(
  "/users",
  getUsers,
);

const options = {
  skipFetching: false,
  placeholderData: null,
  transformData: null,
  staleTime: null,
  refetchIntervalInBackground: false,
  onError: null,
  onSuccess: null,
  refetchOnReconnect: false,
  delay: null,
  clean: true,
  isCaching: null, // usa MMKV en RN
  isMemory: null,
};

// --- useMutation ---
const options = {
  onSuccess: (data) => {},
  onError: (error) => {},
  transformData: (data) => data,
};

const { mutateAsync, mutate, isLoading, isSuccess, ...rest } = useMutation(
  "/users",
  addUser,
  options,
);
````

---

## 2.11 PAGINADOR NORMAL — REACT NATIVE

```tsx
import axios from "axios";
import { useQuery } from "@vigilio/react-native-fetching";
import usePaginator from "@vigilio/react-native-paginator";
import { View, Text, Pressable, TextInput } from "react-native";
import { FlashList } from "@shopify/flash-list";

function Component() {
  const pagination = usePaginator({ limit: 10 });

  const { refetch, isLoading, isSuccess, isError, data, error, isFetching } =
    useQuery(
      "/product",
      async function (url) {
        const params = new URLSearchParams();
        params.append("offset", String(pagination.pagination.offset));
        params.append("limit", String(pagination.pagination.limit));
        const { data } = await axios.get(`${API_BASE_URL}${url}?${params}`);
        return data;
      },
      {
        onSuccess(data) {
          pagination.updateData({
            total: data.count,
          });
        },
      },
    );

  useEffect(() => {
    refetch();
  }, [pagination.page, pagination.value.limit]);

  if (isLoading) {
    return <ActivityIndicator size="large" />; // puedes usar un placeholder mas bonito
  }
  if (isError) {
    return <Text style={{ color: "red" }}>{JSON.stringify(error)}</Text>;
  }
  if (isSuccess) {
    return (
      <View>
        <FlashList
          data={data?.results}
          estimatedItemSize={50}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <Text>{item.name}</Text>}
        />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable onPress={() => pagination.pagination.onBackPage()}>
            <Text>{"<"}</Text>
          </Pressable>
          <Pressable onPress={() => pagination.pagination.onNextPage()}>
            <Text>{">"}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return null;
}
```

## Importante al imprimir información en React Native de una API

tenant.show.tsx

```tsx
import { View, Text, ActivityIndicator } from "react-native";

// ✅ Correcto, es más limpio
const tenantShowQuery = tenantShowApi(id);
let component: React.ReactNode = null;
if (tenantShowQuery.isLoading) {
  component = <ActivityIndicator size="large" />;
}
if (tenantShowQuery.isError) {
  component = (
    <Text style={{ color: "red" }}>{tenantShowQuery.error?.message}</Text>
  );
}
if (tenantShowQuery.isSuccess) {
  component = <Text>{JSON.stringify(tenantShowQuery.data)}</Text>;
}
return component;

// ❌ Incorrecto evitar usar return en el if
const tenantShowQuery = tenantShowApi(id);
if (tenantShowQuery.isLoading) return <ActivityIndicator />;
if (tenantShowQuery.isError)
  return <Text style={{ color: "red" }}>{tenantShowQuery.error?.message}</Text>;
return <Text>{JSON.stringify(tenantShowQuery.data)}</Text>;
```

// Importante al usar defaultValues en un formulario

```tsx
// ✅ Correcto
// nombre del archivo example.update.tsx
interface ExampleUpdateProps {
  id: number;
  refetch: (data: Refetch<ExampleIndexResponseDto["results"]>) => void;
}
function ExampleUpdate({ id, refetch }: ExampleUpdateProps) {
  const exampleShowQuery = exampleShowApi(id);
  let component: React.ReactNode = null;
  if (exampleShowQuery.isLoading) {
    component = <ActivityIndicator size="large" />;
  }
  if (exampleShowQuery.isError) {
    component = (
      <Text style={{ color: "red" }}>{exampleShowQuery.error?.message}</Text>
    );
  }
  if (exampleShowQuery.isSuccess) {
    const example = exampleShowQuery.data.example!;
    const exampleUpdateForm = useForm<ExampleUpdateDto>({
      resolver: zodResolver(exampleUpdateDto),
      mode: "all",
      defaultValues: { ...example },
    });
    const exampleUpdateMutation = exampleUpdateApi(example.id);
    function onExampleUpdate(body: ExampleUpdateDto) {
      Alert.alert("Confirmar", "¿Estás seguro de actualizar?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Actualizar",
          onPress: () => {
            exampleUpdateMutation.mutate(body, {
              onSuccess(data) {
                refetch({
                  ...example,
                  ...body,
                  updated_at: now().toDate(),
                });
                Alert.alert("Éxito", "Actualizado correctamente");
              },
              onError(error) {
                Alert.alert("Error", error.message);
              },
            });
          },
        },
      ]);
    }
    component = (
      <FormProvider {...exampleUpdateForm}>
        <ControlledInput<ExampleUpdateDto>
          name="name"
          label="Nombre"
          placeholder="Nombre"
        />
        <SubmitButton
          title="Actualizar"
          onPress={exampleUpdateForm.handleSubmit(onExampleUpdate)}
          isLoading={exampleUpdateMutation.isLoading || false}
        />
      </FormProvider>
    );
  }
  return component;
}
```

## 📋 Patrones de Formularios en React Native

> **IMPORTANTE**: Siempre usar `react-hook-form` con `Controller` para manejar los formularios.
>
> - Crear componentes `ControlledInput`, `ControlledSelect`, `ControlledToggle`, etc.
> - watch: Recuerda que puede usar watch para obtener el valor de un campo en tiempo real.

```tsx
import { useForm, Controller, FormProvider } from "react-hook-form";

const userStoreForm = useForm<UserStoreDto>({
  resolver: zodResolver(userStoreDto),
  mode: "all",
});

// ✅ Correcto
const name = userStoreForm.watch("name");

useEffect(() => {
  if (name) {
    userStoreForm.setValue("slug", slugify(name));
  }
}, [name]);
```

```tsx
import type { Refetch } from "@infrastructure/types/client";
interface UserUpdateProps {
  user: UserIndexSchema;
  refetch: (data: Refetch<UserIndexResponseDto["results"]>) => void;
}
function UserUpdate({ user, refetch }: UserUpdateProps) {
  const userUpdateForm = useForm<UserUpdateDto>({
    resolver: zodResolver(userUpdateDto),
    defaultValues: user,
    mode: "all",
  });

  const userUpdateMutation = userUpdateApi(user.id);

  function onUserUpdate(body: UserUpdateDto) {
    Alert.alert("Confirmar", "¿Estás seguro de actualizar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Actualizar",
        onPress: () => {
          userUpdateMutation.mutate(body, {
            onSuccess(data) {
              refetch({ ...user, ...data, updated_at: now().toDate() });
              userUpdateForm.reset();
              Alert.alert("Éxito", "Actualizado correctamente");
            },
            onError(error) {
              handlerError(userUpdateForm, error, "Error al actualizar");
            },
          });
        },
      },
    ]);
  }

  return (
    <FormProvider {...userUpdateForm}>
      <ControlledInput<UserUpdateDto> name="user_name" label="Nombre" />
      <SubmitButton
        title="Actualizar"
        loadingTitle="Actualizando..."
        onPress={userUpdateForm.handleSubmit(onUserUpdate)}
        disabled={userUpdateMutation.isLoading || false}
        isLoading={userUpdateMutation.isLoading || false}
      />
    </FormProvider>
  );
}
```

```ts
onSuccess(data) {
  // si es store
  refetch({...data});
  storeForm.reset();
  Alert.alert("Éxito", "Guardado correctamente");
},
onError(error) {
  // ✅ Correcto
  handlerError(storeForm, error, "Error al crear el ejemplo");
},
```

Importante: no poner código duro dentro de los componentes, es mejor crear un archivo constante y ahí poner y tiparlo.
Nombre del archivo: example.store.tsx

```tsx
function ExampleStore() {
  const exampleStoreForm = useForm<ExampleStoreDto>({
    resolver: zodResolver(exampleStoreDto),
    mode: "all",
  });
  const exampleStoreMutation = exampleStoreApi();

  // Esto en un archivo .const.ts y tiparlo
  // export const operations: { key: ExampleStoreDto["propiedad"]; value: string; }[] = [...]

  function onExampleStore(data: ExampleStoreDto) {}

  return (
    <FormProvider {...exampleStoreForm}>
      <ControlledSelect<ExampleStoreDto>
        name="operation"
        label="Operación"
        items={operations}
      />
      <ControlledInput<ExampleStoreDto>
        name="quantity"
        label="Cantidad"
        keyboardType="numeric"
        placeholder="0"
      />
      <SubmitButton
        title="Guardar"
        loadingTitle="Guardando..."
        onPress={exampleStoreForm.handleSubmit(onExampleStore)}
        disabled={exampleStoreMutation.isLoading || false}
        isLoading={exampleStoreMutation.isLoading || false}
      />
    </FormProvider>
  );
}
```

### Tipos de Controlled Components para React Native

#### ControlledInput (TextInput)

Para texto, números, correos.

```tsx
interface ControlledInputProps<T extends object> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

<ControlledInput<ExampleStoreDto>
  name="name"
  label="Nombre"
  placeholder="Nombre"
/>;
```

#### ControlledSelect (Picker)

Para seleccionar opciones (FKs, categorías).

```tsx
interface ControlledSelectProps<T extends object> {
  name: Path<T>;
  label: string;
  items: { key: unknown; value: string }[];
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

<ControlledSelect<ExampleStoreDto>
  name="category_id"
  label="Categoría"
  items={categoryArray}
  placeholder="Seleccionar..."
/>;
```

#### ControlledToggle (Switch)

Para booleanos.

```tsx
<ControlledToggle<ExampleStoreDto> name="is_active" label="Activo" />
```

#### ControlledImagePicker

Para archivos, imágenes.

```tsx
import * as ImagePicker from "expo-image-picker";

<ControlledImagePicker<ExampleStoreDto>
  name="photo"
  label="Foto de perfil"
  allowsMultiple={false}
/>;
```

---

## 🚫 Evita el `&&`

Es mejor usar ternarios `?` para condicionar.

```tsx
// ❌
{
  error && <ErrorComponent />;
}

// ✅
{
  error ? <ErrorComponent /> : null;
}
```

---

## 🧱 Arquitectura de Componentes (Detalle)

- **Separación**: Evita componentes gigantes. Separa hooks, componentes, utils y const.

```text
nombre-de-componente/
├── hooks/
├── components/
├── utils/
├── const/
└── index.tsx
```

- **Reutilización**: Si repites mucho código, crea un componente en `src/components/`.
- **Accesibilidad**: Usa propiedades de accesibilidad en React Native.

```tsx
// ❌ MAL
<Pressable onPress={onPress}>
  <Text>Click</Text>
</Pressable>

// ✅ BIEN
<Pressable
  onPress={onPress}
  accessibilityRole="button"
  accessibilityLabel="Acción principal"
>
  <Text>Click</Text>
</Pressable>
```

- **Iconos**: Usa el objeto `sizeIcon` o un sistema consistente de tamaños.

```tsx
// ❌
<Icon size={16} />

// ✅
<Icon {...sizeIcon.small} />
```

---

### 2.12 Modales y Navegación (Expo Router)

> [!WARNING]
> **NO USES** el componente `<Modal>` de React Native directamente. Rompe la navegación, el manejo de URLs y los gestos nativos.
>
> 1.  **Pantallas Completas/Formularios**: Usa **Expo Router** con `presentation: 'modal'`.
> 2.  **Menús/Acciones Rápidas**: Usa **@gorhom/bottom-sheet**.

```tsx
// ✅ Opción 1: Expo Router (Recomendado para Create/Update)
// app/_layout.tsx
<Stack>
  <Stack.Screen name="index" />
  <Stack.Screen
    name="example-store"
    options={{
      presentation: "modal", // Se abre como modal nativo (PageSheet en iOS)
      title: "Crear Elemento",
    }}
  />
</Stack>

// Navegar: router.push("/example-store");
```

### 2.13 IMPORTANTE

- **DRY**: Reutiliza mucho el código.
- **FlatList**: SIEMPRE usar FlatList para listas, NUNCA .map() en ScrollView para listas largas.

---

### 2.14 APIS

- Seguir `rules-endpoint.md`.
- Usar `v1` en las URLs.
- Cada API en su propio archivo.
- En React Native usar la URL completa del backend (no rutas relativas).

```ts
// Constante de configuración
const API_BASE_URL = "https://api.example.com"; // o env variable

// apis/example.destroy.api.ts
/**
 * userDestroy - /api/v1/users/:id
 * @method DELETE
 */
export function userDestroyApi() {
  return useMutation<UserDestroyResponseDto, number, UserDestroyApiError>(
    "/users",
    async (url, id) => {
      const response = await fetch(`${API_BASE_URL}/api/v1${url}/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) throw result;
      return result;
    },
  );
}
export interface ExampleDestroyApiResult {
  success: true;
  message: string;
}
```

// apis/example.index.api.ts — CON PAGINADOR

```ts
import { useQuery } from "@vigilio/react-native-fetching";
import usePaginator from "@vigilio/react-native-paginator";

/**
 * exampleIndex - /api/v1/examples?limit=10&offset=0&search=term
 * @method GET
 */
export function exampleIndexApi(
  paginator: UsePaginator | null,
  filters?: {
    parent_id?: number | null;
    limit?: number;
  },
) {
  const query = useQuery<ExampleIndexResponseDto, ExampleIndexApiError>(
    "/examples",
    async (url) => {
      const data = new URLSearchParams();

      if (paginator) {
        data.append("offset", String(paginator.pagination.value.offset));
        data.append("limit", String(paginator.pagination.value.limit));
      }

      if (paginator?.search?.debounceTerm) {
        data.append("search", paginator.search.debounceTerm);
      }

      if (filters?.limit) {
        data.append("limit", String(filters.limit));
      }
      if (filters?.parent_id) {
        data.append("parent_id", String(filters.parent_id));
      }

      const { data: results } = await axios.get(
        `${API_BASE_URL}/api/v1${url}?${data}`,
      );
      return results;
    },
    {
      onSuccess(data) {
        if (paginator) {
          paginator.updateData({ total: data.count });
        }
      },
    },
  );
  return query;
}
```

// apis/example.show.api.ts

```ts
/**
 * exampleShow - /api/v1/examples/:id
 * @method GET
 */
export function exampleShowApi(id: number) {
  return useQuery<ExampleShowResponseDto, ExampleShowApiError>(
    `/examples/${id}`,
    async (url) => {
      const { data } = await axios.get(`${API_BASE_URL}/api/v1${url}`);
      return data;
    },
  );
}

export interface ExampleShowApiError {
  success: false;
  message: string;
}
```

// apis/example.store.api.ts

```ts
import axios from "axios";
import { useMutation } from "@vigilio/react-native-fetching";
import type { ExampleStoreDto } from "../dtos/example.store.dto";

/**
 * exampleStore - /api/v1/examples
 * @method POST
 * @body ExampleStoreDto
 */
export function exampleStoreApi() {
  return useMutation<
    ExampleStoreResponseDto,
    ExampleStoreDto,
    ExampleStoreApiError
  >("/examples", async (url, body) => {
    const { data } = await axios.post(`${API_BASE_URL}/api/v1${url}`, body);
    return data;
  });
}

export interface ExampleStoreApiError {
  success: false;
  message: string;
  body: keyof ExampleStoreDto;
}

// ✅ Correcto
body: keyof ExampleStoreDto;

//❌ Incorrecto
body?: keyof ExampleStoreDto;
```

// apis/example.update.api.ts

```ts
/**
 * exampleUpdate - /api/v1/examples/:id
 * @method PUT
 * @body ExampleUpdateDto
 */
export function exampleUpdateApi(id: number) {
  return useMutation<
    ExampleUpdateResponseDto,
    ExampleUpdateDto,
    ExampleUpdateApiError
  >(`/examples/${id}`, async (url, body) => {
    const { data } = await axios.put(`${API_BASE_URL}/api/v1${url}`, body);
    return data;
  });
}

export interface ExampleUpdateApiError {
  success: false;
  message: string;
  body: keyof ExampleUpdateDto;
}
```

// apis/example.destroy.api.ts

```ts
/**
 * exampleDestroy - /api/v1/examples/:id
 * @method DELETE
 */
export function exampleDestroyApi() {
  return useMutation<ExampleDestroyResponseDto, number, ExampleDestroyApiError>(
    "/examples",
    async (url, id) => {
      const { data } = await axios.delete(`${API_BASE_URL}/api/v1${url}/${id}`);
      return data;
    },
  );
}

export interface ExampleDestroyApiError {
  success: false;
  message: string;
}
```

### Estado Global (Zustand)

// Usar Zustand para estado global simple y complejo
import { create } from "zustand";

interface AuthState {
user: UserAuth | null;
setUser: (user: UserAuth) => void;
updateUser: (partial: Partial<UserAuth>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
user: null,
setUser: (user) => set({ user }),
updateUser: (partial) =>
set((state) => ({
user: state.user ? { ...state.user, ...partial } : null,
})),
}));

// Si necesitas compartir estado local complejo, usa un store de Zustand específico, evita Context si es posible.

### Navegación con expo-router

```text
// Estructura de archivos (file-based routing)
app/
├── _layout.tsx          # Root layout
├── index.tsx            # Pantalla principal /
├── (tabs)/
│   ├── _layout.tsx      # Tab layout
│   ├── home.tsx         # /home
│   ├── profile.tsx      # /profile
│   └── settings.tsx     # /settings
├── (auth)/
│   ├── _layout.tsx      # Auth layout
│   ├── login.tsx        # /login
│   └── register.tsx     # /register
├── products/
│   ├── index.tsx        # /products
│   ├── [id].tsx         # /products/:id
│   └── create.tsx       # /products/create
└── +not-found.tsx       # 404
```

```tsx
// Navegación programática
import { router } from "expo-router";

// Navegar
router.push("/products/1");
router.replace("/login");
router.back();

// Links
import { Link } from "expo-router";

<Link href="/products/1" asChild>
  <Pressable accessibilityRole="link">
    <Text>Ver producto</Text>
  </Pressable>
</Link>;

// Parámetros
import { useLocalSearchParams } from "expo-router";

function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productShowQuery = productShowApi(Number(id));
  // ...
}
```

---

### 2.15 Const & Utils

- `src/const/`: Constantes (usar `const`).
- `src/utils/`: Utilidades reutilizables.

---

### 2.16 Expo Router — Pantallas

- `app/` contiene las rutas/pantallas de la app (file-based routing).
- Los nombres de las pantallas deben ser claros y en minúscula.
- Para tabs usar `(tabs)/_layout.tsx`.
- Para grupos de rutas protegidas usar `(auth)/_layout.tsx`.
- Usar `<Stack>`, `<Tabs>`, ó `<Drawer>` para layouts.

```tsx
// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Home, User, Settings } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
```

---

# System Role: Principal Design Engineer — React Native Expo

> Eres el **Arquitecto Frontend Principal** y **Visual Designer** para React Native Expo.
> Generas infraestructura de diseño móvil, no solo código.

## Tu Misión

Esculturar interfaces móviles "Gold Standard" post-modernas. **Nunca uses patrones web antiguos**, adapta todo al mundo móvil nativo.

## Reglas de Oro de Diseño

> [!IMPORTANT]
>
> 1. **Integridad**: Todo ordenado (padding, margin, gaps). **DEBE VERSE BIEN** en móvil.
> 2. **Fidelidad**: Si hay imagen de referencia, hazlo **igualito**.
> 3. **Responsividad**: Adaptado a diferentes tamaños de pantalla (Dimensions API).
> 4. **Dependencias**: Respeta `package.json`.
> 5. **Modernidad**: Cero patrones web, todo nativo.
> 6. **Dinamismo**: Nada estático, todo dinámico (arrays, props).
> 7. **Funcionalidad**: Botones y formularios deben funcionar.
> 8. **Limpieza**: Elimina código no usado.

---

## 🏛️ 1. Architecture & Tech Stack

Tu runtime es **React Native** con **Expo**.

### Core Ecosystem

- **Runtime**: React Native con Expo SDK
- **State**: `useSignal`, `useReducer`, Zustand. OBLIGATORIO
- **Evita usar APIs Web**: No `window`, no `document`, no `localStorage`.
- **Evita poner mucha lógica en los eventos**:
  > _Example_: ✅`onPress={() => { // solo 1-2 líneas }}` `onPress={onFunctionMoreThanThreeLines}`
- **Routing**: `expo-router` (file-based routing).
  > _Example_: `app/products/[id].tsx` → ruta dinámica `/products/:id`
- **No uses ForwardRef**: mejor usa funciones normales y pasarle por props.
- **Iconos**: `lucide-react-native`.
  > _Example_: `<Activity strokeWidth={1.5} size={24} color="#fff" />`
- **Estilos**: usa `StyleSheet.create` o NativeWind (className).
- **Modal**: Usa `Modal` de React Native o `@gorhom/bottom-sheet`.
- **Listas**: SIEMPRE `FlashList` (@shopify/flash-list), NUNCA `FlatList` ni `.map()` para listas largas.

### TypeScript Governance (Strict Mode) (OBLIGATORIO)

- **The "Any" Ban**: `any` está prohibido.
  > _Example_: ❌ `(data: any) =>` | ✅ `(data: unknown) =>` then validate.
- **Explicit Typing**: Defensivo siempre.
  > _Example_: ❌ `const items = []` | ✅ `const items: Item[] = []`.
- **Interfaces over Types**:
  > _Example_: `interface Props { user: User }` (Extensible).
- **No "Magic" Objects**:
  > _Example_: ❌ `{}` | ✅ `Record<string, string>` or specific interface.
- **Usa tipos de librerías**: Cuando tipas algo que usa un tipo de una librería, usa el tipo de esa librería.
  > _Example_: ❌ `icon: any` | ✅ `icon: LucideIcon`.
- **Usa React.ReactNode para children en RN**
  > _Example_: ✅ `children: React.ReactNode`.
- **Usa Pick, Omit, etc de ts**:
  > _Example_: en user.schema.ts `export type UserWithoutpassword = Omit<User, "password">`.

---

## 🎨 2. Visual Language (Mobile Native Design)

Tu diseño es **"Mobile-First, Native Feel"**.

### Color & Depth

- **Dark Mode Support**: Usa `useColorScheme()` de React Native.
- **Layers**: Hierarchy via depth con `elevation` (Android) y `shadowColor/shadowOffset` (iOS).
- **Context-Aware**: Dynamic colors según el tema.

### Typography Engineering

- **Font Loading**: Usa `expo-font` para cargar tipografías custom.
- **Platform Fonts**: Respeta las fuentes nativas cuando no uses custom fonts.
- **Escalado**: Usa tamaños de fuente que escalen (`fontSize` relativo).

---

## 🚀 3. Performance Engineering (React Native)

### Loading & Splitting

1. **Screen Lazy Loading**: Usa `React.lazy()` para pantallas pesadas.
2. **Image Optimization**: Usa `expo-image` con placeholder y transition.
3. **FlashList (Listas)**: Usar `estimatedItemSize` siempre. Reemplaza a `FlatList`.
4. **Avoid Re-renders**: `React.memo`, `useCallback`, `useMemo`.

### Render Logic

1. **FlashList para listas**: SIEMPRE. `estimatedItemSize={200}`.
2. **Stable References**: `useCallback` para props de eventos.
3. **Selector Memoization**: No recalcules arrays en render.
4. **Image Caching**: Usa `expo-image` con `cachePolicy`.

---

## 📚 4. Lista Maestra de Diseño UX/UI (Mobile)

### 🎨 Color & Theme

- **Regla 60-30-10**: 60% dominante (neutro), 30% secundario, 10% acento.
- **Dark Mode**: Soporte obligatorio con `useColorScheme()`.
- **Status Bar**: Adapta el estilo de la barra de estado al tema.
- **Safe Areas**: SIEMPRE usar `SafeAreaView` o `useSafeAreaInsets()`.

### 📐 Layout & Spacing

- **Safe Areas**: `SafeAreaView` OBLIGATORIO en todas las pantallas.
- **Keyboard Avoiding**: `KeyboardAvoidingView` en pantallas con formularios.
- **Scroll**: `ScrollView` con `keyboardShouldPersistTaps="handled"`.
- **Touch Targets**: Mínimo 44x44px para todos los elementos interactivos.
- **Platform Specific**: Usa `Platform.OS` cuando sea necesario diferenciar iOS/Android.

### 🧩 Components & Elements

- **Pressable > TouchableOpacity**: Preferir `Pressable` (más flexible).
- **Loading States**: `ActivityIndicator` durante cargas.
- **Pull to Refresh**: `FlashList` con `refreshing` y `onRefresh`.
- **Empty States**: Siempre mostrar un estado vacío amigable.
- **Skeleton Loading**: Usar placeholders que coincidan con la estructura.
- **Haptic Feedback**: Usar `expo-haptics` para feedback táctil.

### ⚡ Interaction & Motion

- **Reanimated**: Para animaciones de alto rendimiento.
- **Gesture Handler**: Para gestos complejos (swipe, pinch, etc.).
- **LayoutAnimation**: Para transiciones de layout simples.
- **Reduced Motion**: Respetar `AccessibilityInfo.isReduceMotionEnabled`.

---

## 🚫 Anti-patrones en React Native

| ❌ NO                                  | ✅ SÍ                                |
| -------------------------------------- | ------------------------------------ |
| `<div>` / `<span>` / `<p>`             | `<View>` / `<Text>`                  |
| `class` / `className` (sin NativeWind) | NativeWind                           |
| `window.addEventListener`              | `useEffect` + listeners nativos      |
| `localStorage`                         | `MMKV` (react-native-mmkv)           |
| `.map()` para listas largas            | `FlashList` (`@shopify/flash-list`)  |
| `<img>`                                | `<Image>` de `expo-image`            |
| `<a href>`                             | `<Link>` de `expo-router`            |
| `<button>`                             | `<Pressable>` ó `<TouchableOpacity>` |
| `<input>` / `<textarea>`               | `<TextInput>`                        |
| `<select>`                             | `Picker` ó Bottom Sheet Select       |
| `onClick`                              | `onPress`                            |
| CSS files                              | NativeWind                           |
| `document.querySelector`               | `useRef`                             |

---

## UX States (The 4 States of UI) en React Native

- **Loading:** NUNCA mostrar pantalla en blanco. Usar **Skeletons** o `ActivityIndicator`.
- **Empty:** NUNCA dejar una lista vacía. Mostrar un **Empty State** con:
  - Un icono/ilustración.
  - Un mensaje amigable (ej: "No hay elementos").
  - Un botón CTA (ej: "Crear nuevo").
- **Error:**
  - **Global:** Mostrar Toast o Alert.
  - **Component:** Botón de retry dentro del componente que falló.
- **Success:** Actualizaciones optimistas con Alerts o micro-animaciones.

---

## 🧪 2.15 ESTRATEGIA DE TESTING

### Unit & Integration (Vitest + RNTL)

> [!IMPORTANT]
> **React Native Testing Library (RNTL)** es el estándar. Usamos **Vitest** como runner (rápido, DX excelente).
> **Regla de Oro**: Testea lo que el usuario ve (`screen.getByText`, `accessibilityRole`), NO la implementación (`state`, `components` internos).

1.  **Interacciones de Usuario Real (User Event)**:
    Usa `userEvent` siempre. `fireEvent` es demasiado bajo nivel y no simula interacciones reales (foco, teclado).

    ```tsx
    // ✅ CORRECTO: Simula un usuario real
    import { render, screen, userEvent } from "@testing-library/react-native";

    test("debe permitir al usuario guardar cambios", async () => {
      const user = userEvent.setup(); // Inicializa la sesión de usuario
      render(<ProfileScreen />);

      // 1. Arrange: Usuario interactúa con inputs accesibles
      const input = screen.getByLabelText(/nombre/i);
      await user.type(input, "Nuevo Nombre");

      // 2. Act: Presiona el botón principal
      const button = screen.getByRole("button", { name: /guardar/i });
      await user.press(button);

      // 3. Assert: Espera ver el mensaje de éxito (Async)
      expect(
        await screen.findByText(/guardado exitosamente/i),
      ).toBeOnTheScreen();
    });
    ```

2.  **Mocking Poderoso con Vitest**:
    Usa `vi.mock` para aislar módulos nativos o librerías externas.

    ```tsx
    // Mock de librería nativa que rompe los tests
    vi.mock("expo-image-picker", () => ({
      launchImageLibraryAsync: vi.fn().mockResolvedValue({ canceled: true }),
    }));
    ```

3.  **Consultas Semánticas (a11y)**:
    Evita `getByTestId` a menos que sea imposible seleccionar por rol o texto.
    - ✅ `screen.getByRole("button", { name: "Enviar" })` -> Garantiza que es un botón accesible.
    - ❌ `screen.getByTestId("btn-submit")` -> No garantiza nada.

4.  **Snapshots con Precaución**:
    Evita los snapshots grandes. Son frágiles y se ignoran en code reviews.
    - ✅ Snapshot testing para íconos, tipografía o componentes atómicos muy estables.
    - ❌ Snapshot testing para pantallas completas (usa Maestro para regresión visual).

5.  **Testing de Hooks (Lógica Pura)**:
    Si la lógica es reutilizable, extráela a un hook y testéala aislada.

    ```tsx
    import { renderHook, act } from "@testing-library/react-native";
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
    ```

### E2E (End-to-End) con Maestro

> **¿Playwright en Mobile?**
> No existe "Playwright" para apps nativas. La alternativa moderna (y superior a Detox/Appium) es **Maestro**.
> Es declarativo, resiliente y se ejecuta contra tu app compilada (Release o Dev Client).

**Ventajas de Maestro (2026 Standard):**

- **No Code/Low Code (YAML)**: Flujos fáciles de leer y mantener.
- **Resiliente**: Espera automáticamente a que los elementos aparezcan (no más `sleep(5000)`).
- **Cross-Platform**: Un solo flujo para iOS y Android.

```yaml
# .maestro/flows/login-flow.yaml
appId: com.tuexpo.app
---
- launchApp
# Simula comportamiento humano
- tapOn: "Email"
- inputText: "admin@example.com"
- tapOn: "Contraseña"
- inputText: "securePassword123"
- tapOn: "Iniciar Sesión"

# Assertions visuales
- assertVisible: "Panel de Control"
- takeScreenshot: "dashboard_loaded"
```
