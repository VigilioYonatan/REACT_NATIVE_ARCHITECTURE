import { useQuery } from "@vigilio/react-native-fetching";
import axios from "axios";
import { type WatchHistoryIndexDto, type WatchHistoryIndexResponseDto } from "../dtos/watch-history.index.dto";
import { API_URL } from "@src/const/env.const";

export function watchHistoryIndexApi(filters?: WatchHistoryIndexDto) {
  return useQuery<WatchHistoryIndexResponseDto, unknown>(
    "/watch_history",
    async (url) => {
        const params = new URLSearchParams();
        // Mock USER ID 1 for now
        params.append("user_id", "1");
        
        if (filters?._expand) params.append("_expand", filters._expand);
        if (filters?._sort) params.append("_sort", filters._sort);
        if (filters?._order) params.append("_order", filters._order);
        if (filters?.limit) params.append("_limit", String(filters.limit));

        const queryString = params.toString();
        const { data } = await axios.get(`${API_URL}${url}?${queryString}`);
        
        return {
            success: true,
            results: data
        };
    }
  );
}
