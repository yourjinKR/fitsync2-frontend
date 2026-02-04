import { api } from "../http"
import type { UserResponse } from "../../../types/member";

export const getMyUserInfo = async () => {
  const response = await api.get<UserResponse>("/api/user/me");
  return response.data;
}