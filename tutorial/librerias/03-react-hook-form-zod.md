# React Hook Form 7.71 + Zod 4.3

> **Formularios** de alto rendimiento con validación tipada. RHF minimiza re-renders, Zod valida con **inferencia TypeScript automática**.

## 📦 Instalación

```bash
npm install react-hook-form@7.71.1 zod@4.3.6 @hookform/resolvers
```

---

## 🔑 Conceptos Clave

### React Hook Form

| API                      | Descripción                                 |
| ------------------------ | ------------------------------------------- |
| `useForm()`              | Hook principal — control, registro, errores |
| `register`               | Registra un campo (web)                     |
| `Controller`             | Registra un campo nativo (React Native)     |
| `handleSubmit`           | Valida antes de enviar                      |
| `watch`                  | Observa valor de campo en tiempo real       |
| `reset`                  | Resetea el formulario                       |
| `formState.errors`       | Errores de validación                       |
| `formState.isSubmitting` | Si se está enviando                         |

### Zod 4

| API                      | Descripción                             |
| ------------------------ | --------------------------------------- |
| `z.string()`             | String — `.min()`, `.max()`, `.email()` |
| `z.number()`             | Número — `.min()`, `.max()`, `.int()`   |
| `z.boolean()`            | Boolean                                 |
| `z.enum(['a', 'b'])`     | Enum                                    |
| `z.object({})`           | Objeto con shape                        |
| `z.array()`              | Array                                   |
| `z.infer<typeof schema>` | **Tipo TS automático**                  |

---

## 💻 Ejemplos

### 1. Login Form con Validación

```tsx
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 1. Schema — Zod genera el tipo automáticamente
const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Requerido"),
  password: z.string().min(6, "Mínimo 6 caracteres").max(100),
});

type LoginForm = z.infer<typeof loginSchema>;
// LoginForm = { email: string; password: string }

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    await new Promise((r) => setTimeout(r, 1500)); // Simular API
    console.log("✅ Login:", data);
  };

  return (
    <View className="flex-1 bg-background p-6 justify-center">
      <Text className="text-3xl font-bold text-white text-center mb-8">
        Iniciar Sesión
      </Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-4">
            <Text className="text-slate-400 text-sm mb-1.5 ml-1">Email</Text>
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="tu@email.com"
              placeholderTextColor="#475569"
              keyboardType="email-address"
              autoCapitalize="none"
              className={`bg-surface rounded-xl p-4 text-white border ${errors.email ? "border-red-500" : "border-slate-700"}`}
            />
            {errors.email && (
              <Text className="text-red-400 text-sm mt-1 ml-1">
                {errors.email.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="mb-6">
            <Text className="text-slate-400 text-sm mb-1.5 ml-1">
              Contraseña
            </Text>
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="••••••"
              placeholderTextColor="#475569"
              secureTextEntry
              className={`bg-surface rounded-xl p-4 text-white border ${errors.password ? "border-red-500" : "border-slate-700"}`}
            />
            {errors.password && (
              <Text className="text-red-400 text-sm mt-1 ml-1">
                {errors.password.message}
              </Text>
            )}
          </View>
        )}
      />

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className={`py-4 rounded-xl items-center ${isSubmitting ? "bg-primary/50" : "bg-primary active:opacity-80"}`}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-base">Entrar</Text>
        )}
      </Pressable>
    </View>
  );
}
```

### 2. Registro con Campos Complejos

```tsx
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(2, "Mínimo 2 caracteres").max(50),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Necesita una mayúscula")
      .regex(/[0-9]/, "Necesita un número")
      .regex(/[^A-Za-z0-9]/, "Necesita un carácter especial"),
    confirmPassword: z.string(),
    age: z.coerce.number().min(18, "Debes ser mayor de edad").max(120),
    terms: z.boolean().refine((v) => v === true, "Debes aceptar los términos"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;
```

### 3. Custom Input Component

```tsx
import { View, Text, TextInput } from "react-native";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  error?: string;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry,
  keyboardType,
  error,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View className="mb-4">
          <Text className="text-slate-400 text-sm mb-1.5 ml-1">{label}</Text>
          <TextInput
            value={String(value ?? "")}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor="#475569"
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            className={`bg-surface rounded-xl p-4 text-white border ${error ? "border-red-500" : "border-slate-700"}`}
          />
          {error && (
            <Text className="text-red-400 text-sm mt-1 ml-1">{error}</Text>
          )}
        </View>
      )}
    />
  );
}

// Uso:
// <FormField control={control} name="email" label="Email" error={errors.email?.message} />
```

---

## 🔗 Links

- [React Hook Form docs](https://react-hook-form.com/)
- [Zod docs](https://zod.dev/)
- [Resolvers](https://github.com/react-hook-form/resolvers)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica   | ❌ Malo                           | ✅ Bueno                                                 |
| ---------- | --------------------------------- | -------------------------------------------------------- |
| Validación | Validar en submit                 | `mode: 'onChange'` o `'onBlur'` para feedback inmediato  |
| Schemas    | Schemas inline repetidos          | Schemas en archivos separados (`schemas/`) reutilizables |
| Controller | `register` (no funciona en RN)    | `Controller` siempre en React Native                     |
| Errores    | Mostrar error genérico            | Mensaje específico por campo con Zod `.refine()`         |
| Types      | Definir types e interfaces aparte | `z.infer<typeof schema>` para derivar types del schema   |
| Reset      | No resetear tras submit exitoso   | `reset()` o `reset(defaultValues)`                       |

---

## ✅ Checklist

- [ ] Sé usar `useForm` + `Controller` en React Native
- [ ] Puedo definir schemas con Zod y extraer tipos con `z.infer`
- [ ] Sé conectar Zod a RHF con `zodResolver`
- [ ] Puedo manejar errores de validación visualmente
- [ ] Sé crear un componente `FormField` reutilizable
