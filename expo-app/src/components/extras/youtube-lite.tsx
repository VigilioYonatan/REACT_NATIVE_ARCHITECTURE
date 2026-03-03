import { useWindowDimensions, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

interface YoutubeLiteProps {
  id: string; // YouTube video ID
  title: string;
  poster?: "maxresdefault" | "sddefault" | "hqdefault" | "mqdefault"; // Mapped loosely
}

export default function YoutubeLite(props: YoutubeLiteProps) {
  const { width } = useWindowDimensions();

  return (
    <View className="rounded-lg overflow-hidden my-4">
      <YoutubePlayer
        height={200}
        width={width - 32} // Adjust for padding
        videoId={props.id}
        // webViewProps={{}}
      />
    </View>
  );
}
