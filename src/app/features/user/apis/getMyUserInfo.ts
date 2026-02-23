import { api } from "../../../shared/apis/http";
import type { UserResponse } from "../types/member";

export const getMyUserInfo = async () => {
  const response = await api.get<UserResponse>("/api/users/me");
  return response.data;
}
