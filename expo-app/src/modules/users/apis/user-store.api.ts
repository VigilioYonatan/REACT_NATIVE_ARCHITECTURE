import { useMutation } from "@vigilio/react-native-fetching";
import { api } from "src/infrastructure/utils/api";
import type { User, UserStoreDto } from "../dtos/user.dto";

export function useUserStore() {
  return useMutation<User, UserStoreDto, unknown>("/users", async (url, body) => {
    const { data } = await api.post(url, body);
    return data;
  });
}
