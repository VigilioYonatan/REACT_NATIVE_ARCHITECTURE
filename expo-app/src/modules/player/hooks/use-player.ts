import { useRef, useState, useEffect, useCallback } from "react";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";
import { useSignal } from "@preact/signals-react";

export interface PlayerState {
    isPlaying: boolean;
    positionMillis: number;
    durationMillis: number;
    isBuffering: boolean;
    isMuted: boolean;
    rate: number;
    shouldPlay: boolean;
}

export function usePlayer() {
    const videoRef = useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
    
    // Using signals for high-frequency updates if needed, 
    // but AVPlaybackStatus is usually enough for UI binding via state.
    // For performance, we might want to limit re-renders on position verification.
    const positionSignal = useSignal(0);

    const togglePlay = useCallback(async () => {
        if (!videoRef.current) return;
        if (status?.isLoaded && status.isPlaying) {
            await videoRef.current.pauseAsync();
        } else {
            await videoRef.current.playAsync();
        }
    }, [status]);

    const seekTo = useCallback(async (millis: number) => {
        if (!videoRef.current) return;
        await videoRef.current.setPositionAsync(millis);
    }, []);

    const onPlaybackStatusUpdate = useCallback((newStatus: AVPlaybackStatus) => {
        setStatus(newStatus);
        if (newStatus.isLoaded) {
            positionSignal.value = newStatus.positionMillis;
        }
    }, []);

    return {
        videoRef,
        status,
        togglePlay,
        seekTo,
        onPlaybackStatusUpdate,
        positionSignal,
    };
}
