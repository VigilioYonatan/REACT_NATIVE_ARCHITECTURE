import { useEffect, useRef } from "react";
import { watchHistoryStoreApi } from "../../movies/apis/watch-history.api";
import { useSignal } from "@preact/signals-react";

interface UseSaveProgressProps {
    movieId: number;
    positionMillis: number;
    durationMillis: number;
    isPlaying: boolean;
}

export function useSaveProgress({
    movieId,
    positionMillis,
    durationMillis,
    isPlaying,
}: UseSaveProgressProps) {
    const mutation = watchHistoryStoreApi();
    const lastSavedPosition = useRef(0);

    // Save every 10 seconds or when paused
    useEffect(() => {
        if (!isPlaying && positionMillis > 0 && positionMillis !== lastSavedPosition.current) {
            saveProgress();
        }
        
        const interval = setInterval(() => {
            if (isPlaying && positionMillis > 0 && Math.abs(positionMillis - lastSavedPosition.current) > 5000) {
                 saveProgress();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [isPlaying, positionMillis, durationMillis, movieId]);

    // Also save on unmount (cleanup) - though unreliable in some RN envs, good to have
    useEffect(() => {
        return () => {
             if (positionMillis > 0) saveProgress();
        }
    }, []);

    const saveProgress = () => {
        const progressSeconds = Math.floor(positionMillis / 1000);
        const durationSeconds = Math.floor(durationMillis / 1000);
        
        if (durationSeconds === 0) return;

        mutation.mutate({
            movie_id: movieId,
            progress_seconds: progressSeconds,
            duration_seconds: durationSeconds,
            is_finished: progressSeconds >= durationSeconds * 0.95, // 95% watched = finished
        }, {
            onSuccess: () => {
                lastSavedPosition.current = positionMillis;
            }
        });
    };

    return {
        isSaving: mutation.isLoading,
    };
}
