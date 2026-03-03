import { LANGUAGES } from "@infrastructure/types/i18n";
import { cn } from "@infrastructure/utils/client";
import { Globe } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

interface LanguageSwitcherProps {
  className?: string;
  translations?: Record<string, string>;
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  // Simple mock languages if import fails (resilience)
  const availableLanguages = LANGUAGES || ["es", "en"];
  const languages = availableLanguages.map((lang) => ({
    code: lang,
    label: lang.toUpperCase(),
  }));

  const [currentLang, setCurrentLang] = useState<string>("es");

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
  };

  return (
    <View className={cn("gap-2", className)}>
      <View className="flex-row items-center gap-2 mb-1 opacity-50">
        <Globe size={12} color="currentColor" className="text-foreground" />
        <Text className="text-[9px] font-mono tracking-widest uppercase text-foreground">
          Locales
        </Text>
      </View>
      <View className="flex-row gap-2">
        {languages.map((l) => (
          <Pressable
            key={l.code}
            onPress={() => changeLanguage(l.code)}
            accessibilityLabel={`Switch to ${l.label}`}
            className={cn(
              "px-2 py-1 rounded-sm border",
              currentLang === l.code
                ? "bg-primary border-primary shadow-sm"
                : "bg-card border-border active:bg-accent",
            )}
          >
            <Text
              className={cn(
                "text-[10px] font-bold uppercase",
                currentLang === l.code ? "text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {l.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
