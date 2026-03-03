# 02 — Native Modules con JSI

## 🎯 Objetivo

Crear **módulos nativos** que se comunican vía **JSI** sin el Bridge. Entender Expo Modules API, TurboModules y cuándo usar C++.

---

## 📚 Teoría

### ¿Cuándo Crear un Native Module?

| Escenario                             | Solución              |
| ------------------------------------- | --------------------- |
| API nativa no disponible en Expo      | Expo Module API       |
| Rendimiento extremo (crypto, parsing) | JSI/C++ module        |
| Comunicación síncrona JS↔Native       | TurboModule con JSI   |
| SDK nativo existente                  | Native Module wrapper |

---

## 💻 Código Práctico

### Ejemplo 1: Expo Module (Swift + Kotlin)

```bash
npx create-expo-module my-calculator
```

```tsx
// modules/my-calculator/index.ts
import MyCalculatorModule from "./src/MyCalculatorModule";

export function add(a: number, b: number): number {
  return MyCalculatorModule.add(a, b);
}
```

```swift
// ios/MyCalculatorModule.swift
import ExpoModulesCore

public class MyCalculatorModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyCalculator")

    Function("add") { (a: Double, b: Double) -> Double in
      return a + b
    }

    AsyncFunction("fetchAndParse") { (url: String) -> [String: Any] in
      let data = try await URLSession.shared.data(from: URL(string: url)!)
      return try JSONSerialization.jsonObject(with: data.0) as! [String: Any]
    }
  }
}
```

```kotlin
// android/MyCalculatorModule.kt
package expo.modules.mycalculator
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MyCalculatorModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyCalculator")
    Function("add") { a: Double, b: Double -> a + b }
  }
}
```

### Ejemplo 2: TurboModule Spec

```tsx
// specs/NativeDeviceInfo.ts
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  getDeviceModel(): string; // síncrono
  getBatteryLevel(): number; // síncrono
  getStorageInfo(): Promise<{ total: number; available: number }>; // async
}

export default TurboModuleRegistry.getEnforcing<Spec>("DeviceInfo");
```

### Ejemplo 3: Componente que usa el módulo

```tsx
import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import { add } from "@/modules/my-calculator";

export default function CalculatorDemo() {
  const [result, setResult] = useState<number | null>(null);

  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      <Text className="text-3xl font-bold text-white mb-8">
        🧮 Native Calculator
      </Text>

      <Pressable
        onPress={() => setResult(add(42, 58))}
        className="bg-primary px-8 py-4 rounded-2xl active:opacity-80 mb-6"
      >
        <Text className="text-white font-semibold text-lg">42 + 58 = ?</Text>
      </Pressable>

      {result !== null && (
        <View className="bg-surface rounded-2xl p-6 items-center">
          <Text className="text-slate-400 text-sm mb-2">
            Resultado (nativo):
          </Text>
          <Text className="text-primary text-5xl font-bold">{result}</Text>
        </View>
      )}
    </View>
  );
}
```

---

## 🔑 Comparación

| Característica | Expo Module API   | TurboModule         | JSI (C++)             |
| -------------- | ----------------- | ------------------- | --------------------- |
| Dificultad     | 🟢 Fácil          | 🟡 Media            | 🔴 Difícil            |
| Lenguaje       | Swift/Kotlin + TS | ObjC/Java + Codegen | C++                   |
| Performance    | Muy buena         | Excelente           | Máxima                |
| Cuándo usar    | 95% de los casos  | Librerías complejas | Procesamiento extremo |

---

## 📝 Ejercicios

### Ejercicio 1: Módulo de Dispositivo

Expo Module que exponga: modelo, batería, almacenamiento.

### Ejercicio 2: Módulo de Crypto

`sha256(input: string): string` usando APIs nativas de crypto.

### Ejercicio 3: Benchmark JS vs Native

Fibonacci en JS puro vs Native Module. Compara tiempos para n=40.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica | ❌ Malo                 | ✅ Bueno                                         |
| -------- | ----------------------- | ------------------------------------------------ |
| JSI      | Usar JSI para todo      | Solo para operaciones performance-critical       |
| Memoria  | No liberar objetos JSI  | Implementar destructor en C++                    |
| Errores  | Crash silencioso        | Try/catch en JS + excepciones en nativo          |
| Tipado   | Módulos sin types       | Codegen con TypeScript specs                     |
| Debug    | `console.log` en nativo | Native debugger (Xcode/Android Studio) + Flipper |

---

## ✅ Checklist

- [ ] Sé cuándo crear un módulo nativo
- [ ] Puedo crear módulos con Expo Module API
- [ ] Entiendo funciones síncronas vs asíncronas en módulos
- [ ] Sé qué es un TurboModule Spec y Codegen
- [ ] Puedo elegir entre Expo Module, TurboModule y JSI
