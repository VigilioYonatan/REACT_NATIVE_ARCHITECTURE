import { cn } from "@infrastructure/utils/client";
import { FileCode, Palette, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { storage } from "@src/infrastructure/utils/storage";

export default function TechThemeSwitcher({
  className,
  initialColor,
}: {
  className?: string;
  initialColor?: string;
}) {
  const themes = [
    { name: "Python", color: "#306998" },
    { name: "PHP", color: "#777BB4" },
    { name: "TypeScript", color: "#3178C6" },
    { name: "JavaScript", color: "#F7DF1E" },
    { name: "Docker", color: "#2496ED" },
    { name: "NestJS", color: "#E0234E" },
    { name: "React", color: "#61DAFB" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  // Initialize with prop if available, otherwise default
  const [activeTheme, setActiveTheme] = useState(
    initialColor ? themes.find((t) => t.color === initialColor) || themes[0] : themes[0],
  );

  const changeTheme = (theme: (typeof themes)[0]) => {
    // Save to MMKV
    storage.set("theme-color", theme.color);
    storage.set("theme-name", theme.name);

    setActiveTheme(theme);
    setIsOpen(false);

    // Note: React Native global theme changes usually require a Context/Provider or reload.
    // For now, we just persist the preference.
  };

  useEffect(() => {
    const savedColor = storage.getString("theme-color");
    const savedName = storage.getString("theme-name");

    if (savedColor) {
      const found =
        themes.find((t) => t.name === savedName) || themes.find((t) => t.color === savedColor);
      if (found) setActiveTheme(found);
    }
  }, []);

  return (
    <View className={cn("relative", className)}>
      <View className="flex-row items-center gap-2 mb-1 opacity-50">
        <Palette size={12} color="currentColor" className="text-foreground" />
        <Text className="text-[9px] font-mono tracking-widest uppercase text-foreground">
          Tech Theme
        </Text>
      </View>

      {/* Trigger Button */}
      <Pressable
        onPress={() => setIsOpen(true)}
        className={cn(
          "w-full flex-row items-center justify-between gap-2 px-2 py-1.5 bg-zinc-900/50 border border-white/5 rounded-xl transition-all shadow-sm",
          isOpen && "border-primary/50",
        )}
      >
        <View className="flex-row items-center gap-1.5">
          <View className="p-1.5 bg-white/5 rounded-md">
            <FileCode size={12} color={activeTheme.color} />
          </View>
          <Text className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {activeTheme.name}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View
            className="w-1.5 h-1.5 rounded-full shadow-sm"
            style={{
              backgroundColor: activeTheme.color,
            }}
          />
        </View>
      </Pressable>

      {/* Modal Selection */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="w-full max-w-[280px] bg-zinc-950 p-4 border border-white/10 rounded-2xl shadow-2xl">
            <View className="flex-row items-center justify-between mb-4 pb-3 border-b border-white/5">
              <View className="flex-col gap-0.5">
                <Text className="text-[9px] font-bold tracking-[0.2em] text-white uppercase">
                  Stack_Protocol
                </Text>
                <Text className="text-[8px] font-mono text-muted-foreground">
                  SELECT_PRIMARY_NODE
                </Text>
              </View>
              <Pressable onPress={() => setIsOpen(false)} className="p-1 rounded-md">
                <X size={16} color="#ffffff" />
              </Pressable>
            </View>

            <View className="flex-row flex-wrap gap-3 justify-center">
              {themes.map((theme) => {
                const isActive = activeTheme.name === theme.name;
                return (
                  <Pressable
                    key={theme.name}
                    onPress={() => changeTheme(theme)}
                    className={cn(
                      "w-[60px] h-[60px] rounded-xl border items-center justify-center gap-1 relative",
                      isActive ? "bg-primary/10 border-primary/50" : "bg-black/40 border-white/5",
                    )}
                  >
                    <FileCode size={18} color={isActive ? theme.color : "#a1a1aa"} />
                    <Text
                      className={cn(
                        "text-[8px] font-bold uppercase",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {theme.name.substring(0, 3)}
                    </Text>
                    {isActive && (
                      <View className="absolute inset-0 rounded-xl border border-primary/20 pointer-events-none" />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
