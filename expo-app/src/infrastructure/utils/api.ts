import axios from "axios";

// Para Android emulator localhost es 10.0.2.2
// Para iOS simulator es localhost
import { Platform } from "react-native";

const API_URL = Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
});
