import { useQuery } from "@vigilio/react-native-fetching";
import axios from "axios";
import { type MovieIndexResponseDto } from "../dtos/movie.index.dto";
import { API_URL } from "@src/const/env.const";

export function movieGetMoreLikeThisApi(genre_id: number) {
    return useQuery<MovieIndexResponseDto, unknown>(
        `/movies/genre/${genre_id}`, // Cache key
        async () => {
             // JSON Server: /movies?genre_id=X&_limit=10
            const { data, headers } = await axios.get(`${API_URL}/movies?genre_id=${genre_id}&_limit=10`);
            
            const count = Number(headers["x-total-count"] || data.length);
            
            return {
                success: true,
                results: data,
                count
            };
        }
    );
}
