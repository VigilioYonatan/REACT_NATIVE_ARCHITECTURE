# Bottom Sheet 5.2 (@gorhom)

> **Bottom sheets** nativos con gestos fluidos — snap points, backdrop, teclado inteligente, scroll interno.

## 📦 Instalación

```bash
npm install @gorhom/bottom-sheet@5
npx expo install react-native-reanimated react-native-gesture-handler
```

### Setup

```tsx
// app/_layout.tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
```

---

## 💻 Ejemplos

### 1. Bottom Sheet Básico

```tsx
import { View, Text, Pressable } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef, useMemo, useCallback } from "react";

export default function BasicSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const handleOpen = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Pressable
        onPress={handleOpen}
        className="bg-primary px-8 py-4 rounded-2xl"
      >
        <Text className="text-white font-semibold text-lg">Abrir Sheet</Text>
      </Pressable>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: "#1e1e2e" }}
        handleIndicatorStyle={{ backgroundColor: "#475569" }}
      >
        <View className="p-6">
          <Text className="text-white text-xl font-bold mb-4">
            Bottom Sheet
          </Text>
          <Text className="text-slate-400">
            Arrastra hacia arriba/abajo para cambiar snap points
          </Text>
        </View>
      </BottomSheet>
    </View>
  );
}
```

### 2. Modal Bottom Sheet

```tsx
import { View, Text, Pressable } from "react-native";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useRef, useMemo, useCallback } from "react";

export default function ModalSheet() {
  const modalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["40%", "70%"], []);

  const openModal = useCallback(() => modalRef.current?.present(), []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    [],
  );

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Pressable
        onPress={openModal}
        className="bg-primary px-8 py-4 rounded-2xl"
      >
        <Text className="text-white font-semibold">Abrir Modal</Text>
      </Pressable>

      <BottomSheetModal
        ref={modalRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: "#1e1e2e" }}
        handleIndicatorStyle={{ backgroundColor: "#475569" }}
      >
        <View className="p-6">
          <Text className="text-white text-xl font-bold mb-4">Modal Sheet</Text>

          {["Opción 1", "Opción 2", "Opción 3"].map((opt) => (
            <Pressable
              key={opt}
              className="bg-slate-800 p-4 rounded-xl mb-3 active:opacity-80"
            >
              <Text className="text-white text-base">{opt}</Text>
            </Pressable>
          ))}

          <Pressable
            onPress={() => modalRef.current?.dismiss()}
            className="bg-red-500/20 p-4 rounded-xl items-center mt-2"
          >
            <Text className="text-red-400 font-semibold">Cerrar</Text>
          </Pressable>
        </View>
      </BottomSheetModal>
    </View>
  );
}
```

### 3. Sheet con ScrollView / FlatList

```tsx
import { Text, View } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useRef, useMemo } from "react";

const DATA = Array.from({ length: 50 }, (_, i) => ({
  id: String(i),
  title: `Item ${i + 1}`,
}));

export default function ScrollableSheet() {
  const ref = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%", "60%", "90%"], []);

  return (
    <View className="flex-1 bg-background">
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: "#1e1e2e" }}
      >
        <BottomSheetFlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <View className="py-3 border-b border-slate-800">
              <Text className="text-white text-base">{item.title}</Text>
            </View>
          )}
        />
      </BottomSheet>
    </View>
  );
}
```

---

## 🔗 Links

- [Documentación oficial](https://gorhom.dev/react-native-bottom-sheet/)
- [GitHub](https://github.com/gorhom/react-native-bottom-sheet)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica    | ❌ Malo                              | ✅ Bueno                                                            |
| ----------- | ------------------------------------ | ------------------------------------------------------------------- |
| Snap points | Porcentajes hardcodeados             | `useDynamicSnapPoints` para contenido dinámico                      |
| Teclado     | Input tapado por teclado             | `keyboardBehavior="interactive"` + `keyboardBlurBehavior="restore"` |
| Performance | Re-render de contenido en cada gesto | `BottomSheetView` memo + `enableDynamicSizing`                      |
| Backdrop    | Sin overlay                          | `BottomSheetBackdrop` con `disappearsOnIndex={-1}`                  |
| Portal      | Sheet cortado por parent             | `@gorhom/portal` para renderizar sobre todo                         |

---

## ✅ Checklist

- [ ] Sé configurar Bottom Sheet con Reanimated y Gesture Handler
- [ ] Puedo usar snap points y `enablePanDownToClose`
- [ ] Sé crear modal sheets con backdrop
- [ ] Puedo usar `BottomSheetFlatList` para scroll interno
- [ ] Entiendo `index`, `expand()`, `close()`, `snapToIndex()`
