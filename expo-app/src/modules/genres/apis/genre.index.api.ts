import { useQuery } from "@vigilio/react-native-fetching";
import axios from "axios";
import { type GenreIndexDto, type GenreIndexResponseDto } from "../dtos/genre.index.dto";
import { API_URL } from "@src/const/env.const";

export function genreIndexApi(filters?: GenreIndexDto) {
  return useQuery<GenreIndexResponseDto, unknown>(
    "/genres",
    async (url) => {
        const { data } = await axios.get(`${API_URL}${url}`);
        return {
            success: true,
            results: data,
            count: data.length
        };
    }
  );
}
