# 04 — CI/CD con EAS Build

## 🎯 Objetivo

Configurar pipelines de **CI/CD** con **EAS** para builds en la nube, submissions a stores y OTA updates.

---

## 📚 Teoría

### EAS — 3 Servicios

| Servicio       | Qué hace                         | Comando      |
| -------------- | -------------------------------- | ------------ |
| **EAS Build**  | Compila en la nube (iOS/Android) | `eas build`  |
| **EAS Submit** | Sube a App Store / Google Play   | `eas submit` |
| **EAS Update** | OTA updates sin re-publicar      | `eas update` |

### Setup

```bash
npm install -g eas-cli
eas login
eas build:configure
```

---

## 💻 Código Práctico

### Build Profiles

```json
// eas.json
{
  "cli": { "version": ">= 14.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "simulator": true }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production",
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": { "appleId": "tu@email.com", "ascAppId": "1234567890" },
      "android": {
        "serviceAccountKeyPath": "./google-play-key.json",
        "track": "production"
      }
    }
  }
}
```

### Workflow Completo

```bash
# 1. Development build
eas build --profile development --platform all

# 2. Preview (QA)
eas build --profile preview --platform all

# 3. Production
eas build --profile production --platform all

# 4. Submit a stores
eas submit --platform ios --latest
eas submit --platform android --latest
```

### OTA Updates

```tsx
import * as Updates from "expo-updates";
import { View, Text, Pressable, Alert } from "react-native";

export default function UpdateChecker() {
  const checkForUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        Alert.alert("Actualización disponible", "¿Reiniciar?", [
          { text: "Después", style: "cancel" },
          { text: "Reiniciar", onPress: () => Updates.reloadAsync() },
        ]);
      } else {
        Alert.alert("Sin actualizaciones", "Ya tienes la última versión");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Pressable
      onPress={checkForUpdate}
      className="bg-primary py-4 px-6 rounded-xl items-center active:opacity-80"
    >
      <Text className="text-white font-semibold">
        🔄 Buscar Actualizaciones
      </Text>
    </Pressable>
  );
}
```

### GitHub Actions Pipeline

```yaml
# .github/workflows/eas-build.yml
name: EAS Build & Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - uses: expo/expo-github-action@v8
        with: { eas-version: latest, token: "${{ secrets.EXPO_TOKEN }}" }
      - run: npm ci

      - name: Build Preview (PRs)
        if: github.event_name == 'pull_request'
        run: eas build --profile preview --platform all --non-interactive

      - name: Build Production (main)
        if: github.ref == 'refs/heads/main'
        run: |
          eas build --profile production --platform all --non-interactive
          eas update --branch production --message "Deploy $(git rev-parse --short HEAD)"
```

---

## 📝 Ejercicios

### Ejercicio 1: Setup Completo

Configura `eas.json` con 3 profiles y haz tu primer build en la nube.

### Ejercicio 2: GitHub Actions

Crea workflow: preview en PRs, production en merges a main.

### Ejercicio 3: OTA con Rollback

Publica un OTA update, luego haz rollback con `eas update:rollback`.

---

## 🏆 Buenas Prácticas y Optimización

| Práctica | ❌ Malo                     | ✅ Bueno                                                  |
| -------- | --------------------------- | --------------------------------------------------------- |
| Builds   | Build production en cada PR | Profile `preview` para QA, `production` solo para release |
| Secrets  | API keys en código          | EAS Secrets (`eas secret:create`)                         |
| Cache    | Builds desde cero cada vez  | Usar caché de EAS (automático)                            |
| Versión  | Cambiar versión manualmente | `eas build --auto-submit` + autoincrement                 |
| OTA      | Update sin testear          | Canal staging → testear → promover a production           |
| Rollback | Sin plan de rollback        | `eas update:republish` para volver a versión anterior     |

### Estrategia de Branches

```
main       → auto-build → production channel
staging    → auto-build → staging channel (QA)
PR         → EAS Update → preview channel (revisión)
```

---

## ✅ Checklist

- [ ] Sé configurar `eas.json` con múltiples profiles
- [ ] Puedo hacer builds en la nube con `eas build`
- [ ] Entiendo EAS Submit para publicar en stores
- [ ] Sé implementar OTA updates con `eas update`
- [ ] Puedo configurar CI/CD con GitHub Actions
