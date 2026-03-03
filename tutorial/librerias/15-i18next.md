# i18next — Internacionalización

> **Multilenguaje** para tu app — traducciones, pluralización, interpolación, cambio de idioma en tiempo real.

## 📦 Instalación

```bash
npm install i18next react-i18next expo-localization
```

---

## 💻 Ejemplos

### 1. Configuración

```tsx
// i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import es from "./es.json";
import en from "./en.json";
import pt from "./pt.json";

const deviceLang = getLocales()[0]?.languageCode ?? "es";

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
    pt: { translation: pt },
  },
  lng: deviceLang,
  fallbackLng: "es",
  interpolation: { escapeValue: false },
});

export default i18n;
```

### 2. Archivos de Traducción

```json
// i18n/es.json
{
  "greeting": "¡Hola, {{name}}!",
  "home": {
    "title": "Inicio",
    "subtitle": "Bienvenido a la app"
  },
  "items": {
    "count_one": "{{count}} item",
    "count_other": "{{count}} items"
  },
  "settings": {
    "title": "Configuración",
    "language": "Idioma",
    "theme": "Tema"
  },
  "auth": {
    "login": "Iniciar Sesión",
    "logout": "Cerrar Sesión",
    "register": "Registrarse"
  }
}
```

```json
// i18n/en.json
{
  "greeting": "Hello, {{name}}!",
  "home": {
    "title": "Home",
    "subtitle": "Welcome to the app"
  },
  "items": {
    "count_one": "{{count}} item",
    "count_other": "{{count}} items"
  },
  "settings": {
    "title": "Settings",
    "language": "Language",
    "theme": "Theme"
  },
  "auth": {
    "login": "Login",
    "logout": "Logout",
    "register": "Register"
  }
}
```

### 3. Uso en Componentes

```tsx
// app/_layout.tsx
import "@/i18n"; // ¡Importar al inicio!
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
```

```tsx
import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const { t, i18n } = useTranslation();

  return (
    <View className="flex-1 bg-background p-6 pt-16">
      <Text className="text-3xl font-bold text-white">{t("home.title")}</Text>
      <Text className="text-slate-400 mt-2">{t("home.subtitle")}</Text>
      <Text className="text-primary text-xl mt-6">
        {t("greeting", { name: "Elena" })}
      </Text>
      <Text className="text-white mt-4">{t("items.count", { count: 5 })}</Text>

      <View className="mt-8 gap-3">
        <Text className="text-slate-400 font-semibold">
          {t("settings.language")}
        </Text>
        {["es", "en", "pt"].map((lang) => (
          <Pressable
            key={lang}
            onPress={() => i18n.changeLanguage(lang)}
            className={`p-4 rounded-xl ${i18n.language === lang ? "bg-primary" : "bg-surface"}`}
          >
            <Text className="text-white font-semibold text-center uppercase">
              {lang}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
```

### 4. Hook Personalizado

```tsx
// hooks/useLocale.ts
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

const LANGUAGES = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
];

export function useLocale() {
  const { i18n, t } = useTranslation();

  const currentLanguage =
    LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const changeLanguage = useCallback(
    (code: string) => {
      i18n.changeLanguage(code);
    },
    [i18n],
  );

  return { t, currentLanguage, languages: LANGUAGES, changeLanguage };
}
```

---

## 🔗 Links

- [i18next docs](https://www.i18next.com/)
- [react-i18next docs](https://react.i18next.com/)
- [Expo Localization](https://docs.expo.dev/versions/latest/sdk/localization/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica | ❌ Malo                                 | ✅ Bueno                                               |
| -------- | --------------------------------------- | ------------------------------------------------------ |
| Keys     | `t('hello')` sin namespace              | `t('auth:loginButton')` con namespace por pantalla     |
| Archivos | Un solo archivo gigante                 | Archivos separados por feature/pantalla                |
| Plurales | `{count} item(s)` hardcodeado           | `t('items', { count })` con reglas plurales de i18next |
| Fallback | Sin fallback                            | `fallbackLng: 'es'` siempre configurado                |
| Lazy     | Cargar todas las traducciones al inicio | Lazy loading por namespace al navegar                  |
| RTL      | Ignorar idiomas RTL                     | `I18nManager.forceRTL()` para árabe/hebreo             |

---

## ✅ Checklist

- [ ] Sé configurar i18next con idioma del dispositivo
- [ ] Puedo crear archivos de traducción JSON
- [ ] Sé usar `t()` con interpolación (`{{name}}`)
- [ ] Entiendo pluralización (`_one`, `_other`)
- [ ] Puedo cambiar idioma en tiempo real con `i18n.changeLanguage()`
