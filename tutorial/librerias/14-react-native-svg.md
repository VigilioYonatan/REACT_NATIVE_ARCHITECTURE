# React Native SVG

> Renderizar **gráficos vectoriales SVG** en React Native — íconos, charts, shapes, ilustraciones.

## 📦 Instalación

```bash
npx expo install react-native-svg
```

---

## 🔑 Componentes SVG

| Componente                    | Descripción                   |
| ----------------------------- | ----------------------------- |
| `<Svg>`                       | Contenedor raíz (viewBox)     |
| `<Circle>`                    | Círculo                       |
| `<Rect>`                      | Rectángulo                    |
| `<Line>`                      | Línea                         |
| `<Path>`                      | Camino libre (curvas, formas) |
| `<Text>`                      | Texto SVG                     |
| `<G>`                         | Grupo                         |
| `<Defs>` + `<LinearGradient>` | Gradientes                    |
| `<ClipPath>`                  | Recorte                       |

---

## 💻 Ejemplos

### 1. Íconos Custom SVG

```tsx
import Svg, { Path } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
}

export function HeartIcon({ size = 24, color = "#ef4444" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
        2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09
        3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0
        3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </Svg>
  );
}

export function StarIcon({ size = 24, color = "#f59e0b" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87
        1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2
        9.27l6.91-1.01L12 2z"
      />
    </Svg>
  );
}
```

### 2. Circular Progress

```tsx
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface CircularProgressProps {
  progress: number; // 0–1
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 10,
  color = "#7c3aed",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Background */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text className="absolute text-white text-2xl font-bold">
        {Math.round(progress * 100)}%
      </Text>
    </View>
  );
}
```

### 3. Donut Chart

```tsx
import Svg, { Circle, G } from "react-native-svg";
import { View, Text } from "react-native";

const DATA = [
  { label: "React Native", value: 45, color: "#7c3aed" },
  { label: "Flutter", value: 30, color: "#06b6d4" },
  { label: "Swift", value: 25, color: "#f59e0b" },
];

export function DonutChart({ size = 200, strokeWidth = 30 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = DATA.reduce((s, d) => s + d.value, 0);
  let offset = 0;

  return (
    <View className="items-center">
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {DATA.map((d) => {
            const dash = (d.value / total) * circumference;
            const gap = circumference - dash;
            const currentOffset = offset;
            offset += dash;
            return (
              <Circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={d.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-currentOffset}
              />
            );
          })}
        </G>
      </Svg>
      <View className="mt-4 gap-2">
        {DATA.map((d) => (
          <View key={d.label} className="flex-row items-center gap-2">
            <View
              style={{ backgroundColor: d.color }}
              className="w-4 h-4 rounded-full"
            />
            <Text className="text-white">
              {d.label}: {d.value}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
```

---

## 🔗 Links

- [GitHub](https://github.com/software-mansion/react-native-svg)
- [SVG Path Editor](https://yqnn.github.io/svg-path-editor/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica      | ❌ Malo                     | ✅ Bueno                                                            |
| ------------- | --------------------------- | ------------------------------------------------------------------- |
| Iconos        | SVG inline repetido         | Librería de iconos con componentes                                  |
| Tamaño        | SVGs gigantes sin optimizar | SVGO para optimizar antes de importar                               |
| Rendering     | 100+ SVGs en pantalla       | Menos SVGs + cache, o usar Skia para gráficos complejos             |
| Transformer   | Sin transformer configurado | `react-native-svg-transformer` para importar `.svg` como componente |
| Accesibilidad | SVGs sin labels             | `accessibilityLabel` en SVGs interactivos                           |

---

## ✅ Checklist

- [ ] Sé renderizar SVGs con componentes (`Circle`, `Rect`, `Path`)
- [ ] Puedo crear íconos custom con `<Path d="...">`
- [ ] Sé construir progress circles y donut charts
- [ ] Puedo usar gradientes con `<Defs>` + `<LinearGradient>`
