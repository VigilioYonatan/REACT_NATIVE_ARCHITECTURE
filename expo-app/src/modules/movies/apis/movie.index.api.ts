import { useQuery } from "@vigilio/react-native-fetching";
import axios from "axios";
import { type MovieIndexDto, type MovieIndexResponseDto } from "../dtos/movie.index.dto";
import { API_URL } from "@src/const/env.const";

export function movieIndexApi(filters?: MovieIndexDto) {
  return useQuery<MovieIndexResponseDto, unknown>(
    "/movies",
    async (url) => {
        const params = new URLSearchParams();
        if (filters?.limit) params.append("_limit", String(filters.limit));
        if (filters?.offset) params.append("_page", String(filters.offset)); // JSON server uses _page
        if (filters?.search) params.append("q", filters.search);
        if (filters?.is_featured) params.append("is_featured", String(filters.is_featured));
        if (filters?._sort) params.append("_sort", filters._sort);
        if (filters?._order) params.append("_order", filters._order);
        if (filters?.genre_id) params.append("genre_id", String(filters.genre_id));
        if (filters?.year) params.append("year", String(filters.year));
        if (filters?.rating) params.append("rating_gte", String(filters.rating)); // JSON Server operator

        const queryString = params.toString();
        const { data, headers } = await axios.get(`${API_URL}${url}?${queryString}`);
        
        // JSON Server returns array directly, not { success: true, results: [] }
        // We adapt it to matches our DTO expecting { success, results, count }
        const count = Number(headers["x-total-count"] || data.length);
        
        return {
            success: true,
            results: data,
            count
        };
    }
  );
}
