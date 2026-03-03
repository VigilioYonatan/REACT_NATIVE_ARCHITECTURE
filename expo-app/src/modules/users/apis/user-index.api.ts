import { useQuery } from "@vigilio/react-native-fetching";
import { api } from "src/infrastructure/utils/api";
import type { User } from "../dtos/user.dto";

export function useUserIndex() {
  return useQuery<User[], unknown>("/users", async (url) => {
    const { data } = await api.get(url);
    return data;
  });
}
