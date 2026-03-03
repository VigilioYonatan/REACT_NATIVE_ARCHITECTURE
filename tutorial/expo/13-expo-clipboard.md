# Expo Clipboard

> Leer y escribir en el **portapapeles** del dispositivo — copiar texto, links, y datos.

## 📦 Instalación

```bash
npx expo install expo-clipboard
```

---

## 💻 Ejemplos

### 1. Copiar y Pegar Texto

```tsx
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";

export default function ClipboardDemo() {
  const [text, setText] = useState("");
  const [pasted, setPasted] = useState("");

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(text);
    Alert.alert("✅ Copiado");
  };

  const pasteFromClipboard = async () => {
    const content = await Clipboard.getStringAsync();
    setPasted(content);
  };

  return (
    <View className="flex-1 bg-background p-6 pt-16">
      <Text className="text-2xl font-bold text-white mb-6">📋 Clipboard</Text>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Escribe algo para copiar..."
        placeholderTextColor="#475569"
        className="bg-surface p-4 rounded-xl text-white border border-slate-700 mb-3"
      />

      <Pressable
        onPress={copyToClipboard}
        className="bg-primary p-4 rounded-xl mb-3"
      >
        <Text className="text-white text-center font-semibold">📋 Copiar</Text>
      </Pressable>

      <Pressable
        onPress={pasteFromClipboard}
        className="bg-surface p-4 rounded-xl border border-primary mb-3"
      >
        <Text className="text-primary text-center font-semibold">📥 Pegar</Text>
      </Pressable>

      {pasted ? (
        <View className="bg-surface/50 p-4 rounded-xl">
          <Text className="text-slate-400 text-sm mb-1">Pegado:</Text>
          <Text className="text-white">{pasted}</Text>
        </View>
      ) : null}
    </View>
  );
}
```

### 2. Botón "Copiar" Reutilizable

```tsx
import { Pressable, Text } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useState } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = "Copiar" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Pressable
      onPress={handleCopy}
      className={`px-4 py-2 rounded-lg ${copied ? "bg-green-500" : "bg-primary"}`}
    >
      <Text className="text-white font-medium text-sm">
        {copied ? "✅ Copiado!" : `📋 ${label}`}
      </Text>
    </Pressable>
  );
}
```

### 3. Hook useClipboard

```tsx
import { useState, useCallback } from "react";
import * as Clipboard from "expo-clipboard";

export function useClipboard() {
  const [copiedText, setCopiedText] = useState("");

  const copy = useCallback(async (text: string) => {
    await Clipboard.setStringAsync(text);
    setCopiedText(text);
  }, []);

  const paste = useCallback(async () => {
    const text = await Clipboard.getStringAsync();
    setCopiedText(text);
    return text;
  }, []);

  const hasContent = useCallback(async () => {
    return await Clipboard.hasStringAsync();
  }, []);

  return { copy, paste, hasContent, copiedText };
}
```

---

## 🏆 Buenas Prácticas

- **Feedback visual**: Siempre muestra confirmación al copiar (toast, cambio de botón, haptics)
- **Haptics**: Combina con `expo-haptics` para feedback táctil al copiar
- **Privacidad**: No leas el clipboard sin acción explícita del usuario — iOS 14+ muestra banner de privacidad
- **Timeout**: Resetea el estado `copied` después de 2-3 segundos

---

## 🔗 Links

- [Documentación oficial](https://docs.expo.dev/versions/latest/sdk/clipboard/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica   | ❌ Malo                     | ✅ Bueno                                            |
| ---------- | --------------------------- | --------------------------------------------------- |
| Feedback   | Copiar sin indicar al user  | Toast/snackbar "Copiado ✅"                         |
| Privacidad | Leer clipboard sin permiso  | Solo leer cuando el user explícitamente lo solicita |
| iOS 14+    | No manejar paste permission | UX clara de por qué necesitas leer el clipboard     |
| Datos      | Copiar objetos complejos    | Copiar solo texto formateado, URLs, códigos         |

---

## ✅ Checklist

- [ ] Sé copiar y pegar texto con `setStringAsync` / `getStringAsync`
- [ ] Puedo crear un botón "Copiar" reutilizable con feedback
- [ ] Entiendo las implicaciones de privacidad del clipboard
