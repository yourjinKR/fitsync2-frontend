import { api } from "../../../shared/apis/http";
import type { UserWithProfileResponse } from "../types/profile";

export const getUserMyProfile = async (userId: number) => {
  const response = await api.get<UserWithProfileResponse>(`/api/user/profile/${userId}`);
  return response.data;
};