# 04 — TextInput & Formularios Básicos

## 🎯 Objetivo

Aprender a capturar texto del usuario con `TextInput`, manejar formularios básicos, validaciones simples y `KeyboardAvoidingView`.

---

## 📚 Teoría

### TextInput — Props Esenciales

| Prop                   | Tipo                                                             | Descripción                 |
| ---------------------- | ---------------------------------------------------------------- | --------------------------- |
| `value`                | `string`                                                         | Valor controlado            |
| `onChangeText`         | `(text: string) => void`                                         | Se ejecuta al escribir      |
| `placeholder`          | `string`                                                         | Texto de guía               |
| `placeholderTextColor` | `string`                                                         | Color del placeholder       |
| `secureTextEntry`      | `boolean`                                                        | Ocultar texto (contraseñas) |
| `keyboardType`         | `'default'` \| `'email-address'` \| `'numeric'` \| `'phone-pad'` | Tipo de teclado             |
| `autoCapitalize`       | `'none'` \| `'sentences'` \| `'words'` \| `'characters'`         | Capitalización automática   |
| `autoCorrect`          | `boolean`                                                        | Autocorrección              |
| `multiline`            | `boolean`                                                        | Múltiples líneas            |
| `returnKeyType`        | `'done'` \| `'go'` \| `'next'` \| `'search'` \| `'send'`         | Botón del teclado           |
| `onSubmitEditing`      | `() => void`                                                     | Al presionar enter/done     |

### Componente Controlado vs No Controlado

```tsx
// ✅ Controlado (recomendado) — React maneja el valor
const [text, setText] = useState('');
<TextInput value={text} onChangeText={setText} />

// ❌ No controlado — el input maneja su propio valor
<TextInput />  // No se recomienda en React Native
```

---

## 💻 Código Práctico

### Ejemplo 1: Formulario de Login

```tsx
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.includes("@")) newErrors.email = "Email inválido";
    if (password.length < 6) newErrors.password = "Mínimo 6 caracteres";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      console.log("Login:", { email, password });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Iniciar Sesión</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={email}
          onChangeText={setEmail}
          placeholder="tu@email.com"
          placeholderTextColor="#475569"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[
              styles.input,
              styles.passwordInput,
              errors.password && styles.inputError,
            ]}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#475569"
            secureTextEntry={!showPassword}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
          <Pressable
            onPress={() => setShowPassword((p) => !p)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeEmoji}>{showPassword ? "🙈" : "👁️"}</Text>
          </Pressable>
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      <Pressable
        onPress={handleLogin}
        style={({ pressed }) => [
          styles.submitButton,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={styles.submitText}>Entrar</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
  },
  inputGroup: { marginBottom: 20 },
  label: { color: "#94a3b8", fontSize: 14, marginBottom: 8, fontWeight: "600" },
  input: {
    backgroundColor: "#1e1e2e",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  inputError: { borderColor: "#ef4444" },
  passwordRow: { position: "relative" },
  passwordInput: { paddingRight: 50 },
  eyeButton: { position: "absolute", right: 16, top: 14 },
  eyeEmoji: { fontSize: 20 },
  errorText: { color: "#ef4444", fontSize: 12, marginTop: 4 },
  submitButton: {
    backgroundColor: "#7c3aed",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
```

### Ejemplo 2: Búsqueda con Filtro en Tiempo Real

```tsx
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useState } from "react";

const FRAMEWORKS = [
  { name: "React Native", emoji: "⚛️", category: "Mobile" },
  { name: "Flutter", emoji: "🐦", category: "Mobile" },
  { name: "SwiftUI", emoji: "🍎", category: "iOS" },
  { name: "Kotlin Multiplatform", emoji: "🟣", category: "Mobile" },
  { name: "Next.js", emoji: "▲", category: "Web" },
  { name: "Expo", emoji: "📱", category: "Mobile" },
];

export default function SearchFilter() {
  const [query, setQuery] = useState("");

  const filtered = FRAMEWORKS.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
        placeholder="🔍 Buscar framework..."
        placeholderTextColor="#475569"
      />
      <Text style={styles.results}>{filtered.length} resultados</Text>
      {filtered.map((fw, i) => (
        <View key={i} style={styles.item}>
          <Text style={styles.emoji}>{fw.emoji}</Text>
          <View>
            <Text style={styles.name}>{fw.name}</Text>
            <Text style={styles.category}>{fw.category}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    padding: 20,
    paddingTop: 60,
  },
  searchInput: {
    backgroundColor: "#1e1e2e",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 16,
  },
  results: { color: "#94a3b8", fontSize: 13, marginBottom: 12 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#111827",
    borderRadius: 12,
    marginBottom: 8,
    gap: 14,
  },
  emoji: { fontSize: 28 },
  name: { color: "#fff", fontSize: 16, fontWeight: "600" },
  category: { color: "#7c3aed", fontSize: 13, marginTop: 2 },
});
```

---

## 📝 Ejercicios

### Ejercicio 1: Formulario de Registro

Crea un formulario con: nombre, email, contraseña, confirmar contraseña. Valida que las contraseñas coincidan.

### Ejercicio 2: Calculadora de Propina

Input numérico para el total, slider/botones para el porcentaje (10%, 15%, 20%). Muestra la propina y el total.

### Ejercicio 3: Generador de Contraseñas

Input para longitud + switches para: mayúsculas, números, símbolos. Botón para generar y mostrar la contraseña.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica           | ❌ Malo                  | ✅ Bueno                                                 |
| ------------------ | ------------------------ | -------------------------------------------------------- |
| Teclado            | El teclado tapa inputs   | `KeyboardAvoidingView` + `behavior="padding"`            |
| Validación         | Validar solo al enviar   | Validar en tiempo real con feedback visual               |
| Inputs controlados | `onChangeText` sin value | Siempre `value={state}` + `onChangeText={setState}`      |
| Tipos de teclado   | Siempre `default`        | `keyboardType="email-address"` / `"numeric"` según campo |
| Seguridad          | Password visible         | `secureTextEntry` en campos de contraseña                |
| Accesibilidad      | Sin labels               | `accessibilityLabel` en cada input                       |

### Manejo del Teclado

```tsx
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

// ✅ Evitar que el teclado tape los inputs
<KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  style={{ flex: 1 }}
>
  <ScrollView keyboardShouldPersistTaps="handled">
    {/* inputs aquí */}
  </ScrollView>
</KeyboardAvoidingView>;
```

### Librería Recomendada para Formularios Complejos

```
Formularios simples (2-3 campos) → useState
Formularios complejos (5+ campos, validación) → React Hook Form + Zod
```

---

## ✅ Checklist

- [ ] Sé usar `TextInput` controlado con `value` y `onChangeText`
- [ ] Conozco las props: `keyboardType`, `secureTextEntry`, `returnKeyType`
- [ ] Puedo implementar validación de formularios
- [ ] Sé usar `KeyboardAvoidingView` para evitar que el teclado tape inputs
- [ ] Puedo crear filtros en tiempo real
