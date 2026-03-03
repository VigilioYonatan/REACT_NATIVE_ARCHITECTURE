# Expo AV — Audio y Video

> Reproducir **audio** y **video** — streaming, controles, background audio, y grabación.

## 📦 Instalación

```bash
npx expo install expo-av
```

---

## 💻 Ejemplos

### 1. Reproductor de Audio

```tsx
import { View, Text, Pressable } from "react-native";
import { Audio } from "expo-av";
import { useState, useEffect } from "react";

export default function AudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
      return;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
      { shouldPlay: true },
    );
    setSound(newSound);
    setIsPlaying(true);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        setIsPlaying(false);
      }
    });
  };

  useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  return (
    <View className="flex-1 bg-background justify-center items-center">
      <Pressable
        onPress={playSound}
        className={`w-24 h-24 rounded-full items-center justify-center ${isPlaying ? "bg-red-500" : "bg-primary"}`}
      >
        <Text className="text-4xl">{isPlaying ? "⏸" : "▶️"}</Text>
      </Pressable>
      <Text className="text-slate-400 mt-4">
        {isPlaying ? "Reproduciendo..." : "Toca para reproducir"}
      </Text>
    </View>
  );
}
```

### 2. Reproductor de Video

```tsx
import { View, Pressable, Text } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useState } from "react";

const VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function VideoPlayerDemo() {
  const player = useVideoPlayer(VIDEO_URL, (player) => {
    player.loop = false;
  });

  return (
    <View className="flex-1 bg-black justify-center">
      <VideoView
        player={player}
        style={{ width: "100%", height: 250 }}
        allowsFullscreen
        allowsPictureInPicture
      />

      <View className="flex-row justify-center gap-4 mt-6">
        <Pressable
          onPress={() => player.play()}
          className="bg-green-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">▶ Play</Text>
        </Pressable>
        <Pressable
          onPress={() => player.pause()}
          className="bg-yellow-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">⏸ Pause</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

### 3. Grabación de Audio

```tsx
import { Audio } from "expo-av";
import { View, Text, Pressable } from "react-native";
import { useState } from "react";

export default function RecorderDemo() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [uri, setUri] = useState<string | null>(null);

  const startRecording = async () => {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );
    setRecording(recording);
  };

  const stopRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const recordingUri = recording.getURI();
    setUri(recordingUri);
    setRecording(null);
    console.log("📁 Grabación:", recordingUri);
  };

  return (
    <View className="flex-1 bg-background justify-center items-center gap-4">
      <Pressable
        onPress={recording ? stopRecording : startRecording}
        className={`w-24 h-24 rounded-full items-center justify-center ${recording ? "bg-red-500" : "bg-primary"}`}
      >
        <Text className="text-4xl">{recording ? "⏹" : "🎙"}</Text>
      </Pressable>
      <Text className="text-slate-400">
        {recording ? "🔴 Grabando..." : uri ? "✅ Grabado" : "Toca para grabar"}
      </Text>
    </View>
  );
}
```

---

## 🔗 Links

- [Expo AV docs](https://docs.expo.dev/versions/latest/sdk/av/)
- [Expo Video docs](https://docs.expo.dev/versions/latest/sdk/video/)

---

## 🏆 Buenas Prácticas y Optimización

| Práctica   | ❌ Malo                                  | ✅ Bueno                                                     |
| ---------- | ---------------------------------------- | ------------------------------------------------------------ |
| Cleanup    | No descargar audio al navegar            | `sound.unloadAsync()` en cleanup de useEffect                |
| Background | Audio se pausa al cambiar app            | `Audio.setAudioModeAsync({ staysActiveInBackground: true })` |
| Streaming  | Cargar todo el video antes de reproducir | `shouldPlay` + `progressUpdateIntervalMillis` para streaming |
| Múltiples  | 5+ instancias de Audio simultáneas       | Reutilizar una instancia, cargar nuevo source                |
| Errores    | Ignorar errores de playback              | `onPlaybackStatusUpdate` con manejo de errors                |

---

## ✅ Checklist

- [ ] Sé reproducir audio desde URL y archivos locales
- [ ] Puedo controlar play/pause y estado de reproducción
- [ ] Sé usar VideoView para reproducir video
- [ ] Puedo grabar audio con el micrófono
