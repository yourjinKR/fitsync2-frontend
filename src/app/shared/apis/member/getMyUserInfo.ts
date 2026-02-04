import { api } from "../http"
import type { UserResponse } from "./type";

export const getMyUserInfo = async () => {
  const response = await api.get<UserResponse>("/api/user/me");
  return response.data;
}