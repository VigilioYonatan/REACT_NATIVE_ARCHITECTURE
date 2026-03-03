# 01 — New Architecture (Fabric, TurboModules, JSI)

## 🎯 Objetivo

Entender a fondo la **New Architecture** de React Native 0.83 — obligatoria desde 2026 — y cómo cambia el rendimiento, la comunicación JS↔Native y el renderizado.

---

## 📚 Teoría

### Old Architecture vs New Architecture

```
🔴 OLD ARCHITECTURE (Pre-2024)
┌─────────┐    async JSON     ┌──────────┐
│   JS    │ ◄──── Bridge ────►│  Native  │
│ Thread  │   (serialización)  │  Thread  │
└─────────┘                    └──────────┘
Problema: Bridge es un cuello de botella

🟢 NEW ARCHITECTURE (2026 - Obligatoria)
┌─────────┐   JSI (síncrono)  ┌──────────┐
│   JS    │ ◄─── Directo ────►│  Native  │
│ Thread  │   (sin Bridge)     │  Thread  │
└─────────┘                    └──────────┘
+ Fabric Renderer + TurboModules + Codegen
```

### Los 3 Pilares

| Pilar            | Reemplaza          | Beneficio                            |
| ---------------- | ------------------ | ------------------------------------ |
| **JSI**          | Bridge JSON        | Comunicación **síncrona** JS↔C++     |
| **Fabric**       | Old Renderer       | Renderizado **síncrono**, concurrent |
| **TurboModules** | Old Native Modules | Carga **lazy**, tipado con Codegen   |

### JSI — JavaScript Interface

```
Bridge (old):  JS → JSON.stringify → Bridge → JSON.parse → Native  ❌
JSI (new):     JS → C++ Host Object → Native                       ✅
```

Síncrono, sin serialización, memoria compartida.

### Fabric — Nuevo Renderer

```
OLD: JS Thread → Bridge → Shadow Thread → Bridge → UI Thread (async)
NEW: JS Thread → Fabric → UI Thread (síncrono cuando es necesario)
```

Soporta React 19 Concurrent Rendering (Suspense, Transitions).

### TurboModules

```tsx
// OLD: Todo se carga al inicio
const { MyModule } = NativeModules;

// NEW: Lazy loading — se carga al primer uso
import MyModule from "./specs/MyModule";
```

---

## 💻 Verificar New Architecture

```tsx
import { View, Text, Platform } from "react-native";

export default function ArchitectureCheck() {
  const isFabric = !!(global as any).__turboModuleProxy;

  return (
    <View className="flex-1 bg-background p-5 pt-16">
      <Text className="text-3xl font-bold text-white mb-8">
        🏗️ Architecture Check
      </Text>

      <InfoRow label="React Native" value="0.83.1" />
      <InfoRow
        label="Hermes"
        value={typeof HermesInternal !== "undefined" ? "✅ Activo" : "❌ No"}
      />
      <InfoRow
        label="New Architecture"
        value={isFabric ? "✅ Fabric" : "❌ Legacy"}
      />
      <InfoRow label="Platform" value={Platform.OS} />
      <InfoRow label="Version" value={String(Platform.Version)} />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-3.5 border-b border-slate-800">
      <Text className="text-slate-400 text-base">{label}</Text>
      <Text className="text-primary text-base font-semibold">{value}</Text>
    </View>
  );
}
```

---

## 🔑 Impacto en tu Código Diario

```
✅ Componentes React siguen siendo los mismos
✅ useState, useEffect, etc. funcionan igual
✅ Expo maneja la configuración por ti
⚠️ Algunas librerías antiguas pueden no ser compatibles
🔧 Si escribes Native Modules → TurboModules + Codegen
```

---

## 📝 Ejercicios

### Ejercicio 1: Benchmark

Renderiza 1000 elementos y mide tiempo. Compara con valores históricos.

### Ejercicio 2: Architecture Dashboard

Dashboard con info de Hermes, Fabric, JSI, Platform, API Level.

### Ejercicio 3: Research Report

Documento de 1 página: cuándo crear TurboModules custom vs usar Expo.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica  | ❌ Malo                        | ✅ Bueno                                                            |
| --------- | ------------------------------ | ------------------------------------------------------------------- |
| Migración | Migrar todo de golpe           | Migrar módulo por módulo, testear cada uno                          |
| Librerías | Asumir que todo es compatible  | Verificar en [reactnative.directory](https://reactnative.directory) |
| Bridge    | Seguir usando Bridge para todo | JSI para operaciones críticas de performance                        |
| Fabric    | Componentes nativos legacy     | Migrar a Fabric components con `codegenNativeComponent`             |
| Testing   | No testear después de migrar   | Test suite completo post-migración                                  |

---

## ✅ Checklist

- [ ] Entiendo las limitaciones del Bridge (Old Architecture)
- [ ] Sé qué es JSI y la comunicación síncrona
- [ ] Entiendo Fabric vs Old Renderer
- [ ] Sé qué son TurboModules y lazy loading
- [ ] Entiendo Codegen y su papel
- [ ] Sé verificar si estoy usando New Architecture
