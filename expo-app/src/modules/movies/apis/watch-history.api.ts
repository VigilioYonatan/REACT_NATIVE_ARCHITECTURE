import { useMutation } from "@vigilio/react-native-fetching";
import axios from "axios";
import { API_URL } from "../../../const/env.const";
import type { WatchHistoryStoreDto, WatchHistoryResponseDto } from "../dtos/watch-history.dto";

export interface WatchHistoryApiError {
    success: false;
    message: string;
    body?: keyof WatchHistoryStoreDto;
}

/**
 * watchHistoryStore - /watch_history
 * @method POST
 * @body WatchHistoryStoreDto
 */
export function watchHistoryStoreApi() {
    return useMutation<
        WatchHistoryResponseDto,
        WatchHistoryStoreDto,
        WatchHistoryApiError
    >("/watch_history", async (url, body) => {
        const { data } = await axios.post(`${API_URL}${url}`, body);
        return data;
    });
}
